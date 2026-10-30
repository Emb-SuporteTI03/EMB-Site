<script setup lang="ts">
// Rota pai da área do acesso externo (/sla/**). As páginas filhas foram copiadas
// do site antigo (EMB-Site) e usam Bootstrap; o CSS/JS dele só é carregado aqui,
// então sai da página ao voltar para o site e não interfere no visual novo.
import * as bootstrap from 'bootstrap'

definePageMeta({ layout: false })

// As páginas usam o global `bootstrap` (bootstrap.Modal), como no site antigo
if (import.meta.client) (window as unknown as { bootstrap: typeof bootstrap }).bootstrap = bootstrap

useHead({
  link: [
    {
      rel: 'stylesheet',
      href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
      integrity: 'sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH',
      crossorigin: 'anonymous'
    },
    { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.8.3/font/bootstrap-icons.min.css' },
    { rel: 'stylesheet', href: '/legado/main.css' }
  ],
  // O Nuxt UI põe `isolate` no #__nuxt, o que prende os modais do Bootstrap
  // (que ficam dentro da página) abaixo do backdrop (criado no <body>): o modal
  // fica coberto pela camada cinza e nada recebe clique. Aqui no /sla desliga isso.
  style: [{ key: 'sla-sem-isolate', innerHTML: '#__nuxt { isolation: auto; }' }]
})

useSeoMeta({ robots: 'noindex, nofollow' })
</script>

<template>
  <NuxtPage />
</template>
