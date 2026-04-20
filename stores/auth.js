import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    idUsuario: null,
    idCarteira: null,
    idFuncao: null
  }),

  actions: {
    setAuth(response) {
      if (!response || !response.usuario) return

      this.token = response.token
      this.idUsuario = response.usuario.iD_Usuario
      this.idCarteira = response.usuario.iD_Carteira ?? null
      this.idFuncao = response.usuario.idFuncao

      // persistência manual
      sessionStorage.setItem('tokenProd', this.token)
      sessionStorage.setItem('idUsuario', String(this.idUsuario))
      sessionStorage.setItem('idFuncao', String(this.idFuncao))

      if (this.idCarteira != null) {
        sessionStorage.setItem('idCarteira', String(this.idCarteira))
      }
    },

    hydrate() {
      this.token = sessionStorage.getItem('tokenProd')
      this.idUsuario = Number(sessionStorage.getItem('idUsuario')) || null
      this.idCarteira = Number(sessionStorage.getItem('idCarteira')) || null
      this.idFuncao = Number(sessionStorage.getItem('idFuncao')) || null
    },

    logout() {
      this.token = null
      this.idUsuario = null
      this.idCarteira = null
      this.idFuncao = null

      sessionStorage.clear()
    }
  }
})