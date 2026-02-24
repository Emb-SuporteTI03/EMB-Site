import { createPinia } from 'pinia'

export default defineNuxtPlugin((nuxtApp) => {
  const pinia = createPinia()
  nuxtApp.vueApp.use(pinia)
  nuxtApp.$pinia = pinia // opcional, mas bom para acesso via useNuxtApp()
})