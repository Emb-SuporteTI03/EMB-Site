// $fetch já com a URL da API e o token do usuário externo.
// Se a API responder 401 (token inválido/expirado), desloga e volta para a home.
export function useApiExterno() {
  const { public: { apiUrl } } = useRuntimeConfig()
  const auth = useAuthExternoStore()

  return $fetch.create({
    baseURL: apiUrl,
    onRequest({ options }) {
      if (auth.token) options.headers.set('Authorization', `Bearer ${auth.token}`)
    },
    async onResponseError({ response }) {
      if (response.status === 401) {
        auth.logout()
        await navigateTo('/')
      }
    }
  })
}
