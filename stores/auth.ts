import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null as string | null,
    user: null as { nome: string; email: string } | null,
  }),

  actions: {
    login(token: string, user: { nome: string; email: string }) {
      this.token = token
      this.user = user
    },

    logout() {
      this.token = null
      this.user = null
    },
  },

  getters: {
    isAuthenticated: (state) => !!state.token,
  },
})
