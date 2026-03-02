import axios from 'axios'
import { useAuthStore } from '~/stores/auth'
import { LimpaLocalStor } from '#imports'

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()

  const urlBase = useUrlProdProducao().value
  
  // protege apenas rotas /sla
  if (!to.path.startsWith('/sla')) {
    return
  }

  // 🔴 sem token → volta pro início
  if (!authStore.token) {
    return navigateTo('/')
  }

  const urlValidacao = `${urlBase}/controladoria/destino`

  try {
    await axios.get(urlValidacao, {
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    })
  } catch (error: any) {
    if (error.response?.status === 401) {
      authStore.logout()
      LimpaLocalStor()
      return navigateTo('/')
    }

    console.error('Erro de validação:', error)
  }
})