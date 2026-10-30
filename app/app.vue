<script setup lang="ts">
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', type: 'image/png', href: '/favicon.png' }
  ],
  htmlAttrs: {
    lang: 'pt-BR'
  },
  titleTemplate: title => title ? `${title} · Grupo Embalarte` : 'Grupo Embalarte'
})

useSeoMeta({
  description: 'Soluções em logística, tecnologia e embalagens. Armazenagem, picking e packing, e-commerce, manuseios, montagem de kits e distribuição nacional.',
  ogSiteName: 'Grupo Embalarte',
  ogImage: '/images/home/hero-galpao.jpg'
})
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
