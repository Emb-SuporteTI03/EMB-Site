<script setup lang="ts">
import { albuns } from '~/data/albuns'

// Uma página só para todos os álbuns: /albuns/encadernacao, /albuns/manuseio, /albuns/shrink
const route = useRoute()
const album = albuns[String(route.params.slug)]

if (!album) {
  throw createError({ statusCode: 404, statusMessage: 'Álbum não encontrado', fatal: true })
}

useSeoMeta({
  title: album.titulo,
  description: album.descricao
})
</script>

<template>
  <div v-if="album">
    <UPageHero
      :title="album.titulo"
      :description="album.descricao"
    />

    <UContainer class="pb-16">
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <img
          v-for="(foto, i) in album.fotos"
          :key="i"
          :src="foto.src"
          :alt="foto.alt"
          loading="lazy"
          class="aspect-4/3 w-full rounded-lg object-cover shadow"
        >
      </div>
    </UContainer>
  </div>
</template>
