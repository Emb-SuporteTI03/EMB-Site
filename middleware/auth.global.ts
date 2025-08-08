export default defineNuxtRouteMiddleware((to) => {
  if (process.server) return

  // Aplica o middleware somente se a URL for exatamente /sla
  if (to.path !== '/sla') return

  const token = sessionStorage.getItem('tokenProd')
  if (!token) {
    return navigateTo('/')
  }
})
