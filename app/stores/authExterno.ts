// Login dos usuários externos (clientes e transportadoras), no mesmo modelo do
// EMB-FRONT-Sistema: o token fica só na memória, então um F5 limpa a store e o
// middleware expulsa o usuário. Em desenvolvimento a store é salva no
// localStorage para o F5 não deslogar.

export type ModoAcessoExterno = 'cliente' | 'transportadora'

// Enum FuncaoUsurioExterno da API
export enum FuncaoExterno {
  Administrador = 1,
  Entregador = 2,
  ConsultaEstoque = 3,
  CriaTramite = 4
}

// Usuário interno (SIS_USUARIOS) vinculado ao externo da função CriaTramite.
// É ele que fica como responsável/conferente dos trâmites criados pelo site.
export interface UsuarioInternoVinculado {
  id: number
  nome: string | null
  nomeAbreviado: string | null
  sigla: string | null
  email: string | null
  idUnidade: number | null
}

export interface LoginExternoResponse {
  status: number
  token: string
  idUsuario: number
  idCarteira: number | null
  idTransportadora?: number | null
  idFuncao: FuncaoExterno
  bAcessoSLA: boolean
  usuarioInterno?: UsuarioInternoVinculado | null
}

interface SessaoExternoResponse {
  idUsuario: number
  idFuncao: FuncaoExterno
  bAcessoSLA: boolean
  idUsuarioInterno: number | null
}

const ROTA_TRAMITE = '/sla/tramite'

// De quanto em quanto tempo a sessão é conferida na API ao navegar pelo /sla
const INTERVALO_VALIDACAO_MS = 5 * 60 * 1000

export const useAuthExternoStore = defineStore('authExterno', {
  state: () => ({
    token: null as string | null,
    tokenExpiration: null as number | null,
    idUsuario: null as number | null,
    idCarteira: null as number | null,
    idTransportadora: null as number | null,
    idFuncao: null as FuncaoExterno | null,
    bAcessoSLA: false,
    usuarioInterno: null as UsuarioInternoVinculado | null,
    modo: null as ModoAcessoExterno | null,
    validadoEm: null as number | null
  }),

  getters: {
    logado: state => !!state.token && (!state.tokenExpiration || state.tokenExpiration > Date.now()),
    // Página inicial de cada função (mesma regra do site antigo, mais a função 4)
    paginaInicial: (state) => {
      if (state.idFuncao === FuncaoExterno.CriaTramite) return ROTA_TRAMITE
      if (state.idFuncao === FuncaoExterno.Entregador) return '/sla/informar-entrega'
      if (state.idFuncao === FuncaoExterno.ConsultaEstoque && !state.bAcessoSLA) return '/sla/consulta-estoque'
      return '/sla'
    }
  },

  actions: {
    setAuth(response: LoginExternoResponse, modo: ModoAcessoExterno) {
      this.token = response.token
      this.tokenExpiration = expiracaoDoToken(response.token)
      this.idUsuario = response.idUsuario
      this.idCarteira = response.idCarteira ?? null
      this.idTransportadora = response.idTransportadora ?? null
      this.idFuncao = response.idFuncao
      this.bAcessoSLA = !!response.bAcessoSLA
      this.usuarioInterno = response.usuarioInterno ?? null
      this.modo = modo
      this.validadoEm = Date.now() // acabou de logar, não precisa conferir de novo
    },

    // A tela de trâmite é exclusiva da função 4, e a função 4 só acessa ela
    podeAcessar(path: string) {
      const ehTramite = path === ROTA_TRAMITE || path.startsWith(`${ROTA_TRAMITE}/`)
      return (this.idFuncao === FuncaoExterno.CriaTramite) === ehTramite
    },

    // Confere na API se o token ainda vale e se a função/vínculo não mudaram.
    // Só derruba a sessão quando a API responde que ela é inválida; se a API
    // estiver fora do ar o usuário continua (as telas mostram o erro).
    async validarSessao(apiUrl: string) {
      if (!this.logado) return false
      if (this.validadoEm && Date.now() - this.validadoEm < INTERVALO_VALIDACAO_MS) return true

      try {
        const sessao = await $fetch<SessaoExternoResponse>('/usuario-externo/sessao', {
          baseURL: apiUrl,
          headers: { Authorization: `Bearer ${this.token}` }
        })

        const mudou = sessao.idUsuario !== this.idUsuario
          || sessao.idFuncao !== this.idFuncao
          || (this.idFuncao === FuncaoExterno.CriaTramite && sessao.idUsuarioInterno !== this.usuarioInterno?.id)
        if (mudou) return false

        this.bAcessoSLA = !!sessao.bAcessoSLA
      } catch (e: unknown) {
        const status = (e as { response?: { status?: number } })?.response?.status
        if (status === 401 || status === 403) return false
      }

      this.validadoEm = Date.now()
      return true
    },

    logout() {
      this.$reset()
    }
  },

  persist: import.meta.dev // só persiste em desenvolvimento
})

function expiracaoDoToken(token: string) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]!.replace(/-/g, '+').replace(/_/g, '/')))
    return payload.exp ? payload.exp * 1000 : null
  } catch {
    return null
  }
}
