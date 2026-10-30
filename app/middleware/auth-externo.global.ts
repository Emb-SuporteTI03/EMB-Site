// Protege a área do acesso externo (/sla). Em produção a store só existe na
// memória: depois de um F5 não há token e o usuário é mandado para a home.
// A sessão é conferida na API (no máximo a cada 5 min) e cada função só entra
// nas telas dela.
export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path !== '/sla' && !to.path.startsWith('/sla/')) return

  const auth = useAuthExternoStore()
  const { public: { apiUrl } } = useRuntimeConfig()

  if (!auth.logado || !(await auth.validarSessao(apiUrl))) {
    auth.logout()
    return navigateTo('/')
  }

  if (!auth.podeAcessar(to.path)) return navigateTo(auth.paginaInicial)
})
