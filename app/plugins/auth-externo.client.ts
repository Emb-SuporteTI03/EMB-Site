import axios from 'axios'

// Encerra a sessão do acesso externo sem esperar a próxima navegação:
// - quando o token expira com a tela aberta;
// - quando uma chamada das telas do /sla (axios, como no site antigo) recebe 401.
export default defineNuxtPlugin(() => {
  const auth = useAuthExternoStore()
  const route = useRoute()
  let timerExpiracao: ReturnType<typeof setTimeout> | undefined

  async function encerrarSessao(mensagem: string) {
    if (!auth.token) return
    auth.logout()
    if (route.path === '/sla' || route.path.startsWith('/sla/')) {
      useToast().add({ title: 'Sessão encerrada', description: mensagem, color: 'warning', icon: 'i-lucide-log-out' })
      await navigateTo('/')
    }
  }

  watch(() => auth.tokenExpiration, (expiracao) => {
    clearTimeout(timerExpiracao)
    if (!expiracao) return
    timerExpiracao = setTimeout(() => encerrarSessao('Seu acesso expirou. Entre novamente.'), Math.max(0, expiracao - Date.now()))
  }, { immediate: true })

  axios.interceptors.response.use(undefined, (error) => {
    const enviouTokenExterno = auth.token && String(error?.config?.headers?.Authorization ?? '') === `Bearer ${auth.token}`
    if (error?.response?.status === 401 && enviouTokenExterno) {
      encerrarSessao('Seu acesso não é mais válido. Entre novamente.')
    }
    return Promise.reject(error)
  })
})
