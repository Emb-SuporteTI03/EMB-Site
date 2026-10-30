import type { ModoAcessoExterno } from '~/stores/authExterno'

export function useAcessoExterno() {
  const aberto = useState('acesso-externo-aberto', () => false)
  const modo = useState<ModoAcessoExterno>('acesso-externo-modo', () => 'cliente')

  function abrir(novoModo: ModoAcessoExterno) {
    modo.value = novoModo
    aberto.value = true
  }

  async function sair() {
    useAuthExternoStore().logout()
    await navigateTo('/')
  }

  return { aberto, modo, abrir, sair }
}
