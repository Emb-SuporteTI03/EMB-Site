import axios from 'axios'
import { useAuthStore } from '~/stores/auth'
import { LimpaLocalStor } from '#imports'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const nuxtApp = useNuxtApp()
  const pinia = nuxtApp.$pinia
  if (!pinia) return

  const authStore = useAuthStore(pinia)
  const urlBase = useUrlProdProducao()._object.$surlProdProducao

  // Checa se a rota não começa com urlBase/sla — se não, ignora o middleware
  if (!to.path.startsWith(`${urlBase}/sla`)) {
    return
  }

  // Se não tiver token, redireciona para "/"
  if (!authStore.token) {
    if (to.path !== '/') {
      return navigateTo('/')
    }
    return
  }

  const urlValidacao = `${urlBase}/controladoria/destino`

  try { 
    await axios.get(urlValidacao, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
  } catch (error) {
    if (error.response?.status === 401) {
      authStore.logout()
      LimpaLocalStor()
      if (to.path !== '/') {
        return navigateTo('/')
      }
    } else {
      console.error('⚠️ Erro sem response (rede ou servidor offline)')
    }
  }
})