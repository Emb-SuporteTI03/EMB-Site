// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt'
  ],

  // Páginas do SLA copiadas do site antigo (EMB-Site): componentes e composables
  // ficam separados em app/legado, com os mesmos nomes que tinham lá
  components: [
    '~/components',
    '~/legado/components'
  ],

  imports: {
    dirs: ['legado/composables', 'legado/composables/*/index.{ts,js}']
  },

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  // O site é só em tema claro (o logo tem fundo branco)
  ui: {
    colorMode: false
  },

  // API do sistema (EMB-API-Sistema). Pode ser trocada sem mexer no código
  // com a variável de ambiente NUXT_PUBLIC_API_URL (ex.: https://localhost:7116/api)
  runtimeConfig: {
    public: {
      apiUrl: 'https://erp-api.grupoembalarte.com.br/api'
      // apiUrl: "https://localhost:7116/api"
    }
  },

  routeRules: {
    '/': { prerender: true },
    // Página antiga sem link no menu; o conteúdo dela está na home
    '/quemSomos': { redirect: '/' },
    // Área do acesso externo: só no navegador, igual ao EMB-FRONT-Sistema
    '/sla': { ssr: false },
    '/sla/**': { ssr: false }
  },

  compatibilityDate: '2026-06-30',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  // Só é usado em desenvolvimento (a store de login só persiste com import.meta.dev)
  piniaPluginPersistedstate: {
    storage: 'localStorage'
  }
})
