<script setup lang="ts">
import type { Servico } from '~/data/servicos'

// Bloco imagem + texto usado em serviços e tecnologias.
// `invertido` troca a imagem de lado para alternar ao longo da página.
defineProps<{
  item: Servico
  invertido?: boolean
}>()
</script>

<template>
  <article
    :id="item.id"
    class="grid scroll-mt-(--ui-header-height) items-center gap-8 py-12 md:grid-cols-2 md:gap-16"
  >
    <div
      v-reveal
      :class="invertido && 'md:order-2'"
    >
      <h2 class="text-2xl font-bold text-highlighted sm:text-3xl">
        {{ item.titulo }}
      </h2>
      <p
        v-for="(paragrafo, i) in item.paragrafos"
        :key="i"
        class="mt-4 text-pretty text-muted"
      >
        {{ paragrafo }}
      </p>
    </div>

    <img
      :src="item.imagem"
      :alt="item.titulo"
      loading="lazy"
      draggable="false"
      class="mx-auto max-h-80 w-full rounded-lg object-contain"
    >
  </article>
</template>
