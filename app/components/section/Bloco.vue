<script setup lang="ts">
// Bloco título + conteúdo com ilustração ao lado (Cultura, Valores, Governança)
defineProps<{
  titulo?: string
  imagem?: string
  invertido?: boolean
}>()
</script>

<template>
  <div class="grid items-center gap-8 py-10 md:grid-cols-[2fr_1fr] md:gap-16">
    <div
      v-reveal
      :class="invertido && 'md:order-2'"
    >
      <h2
        v-if="titulo"
        class="mb-4 text-2xl font-bold text-primary-900 sm:text-3xl"
      >
        {{ titulo }}
      </h2>
      <div class="space-y-3 text-lg text-toned [&_strong]:text-highlighted">
        <slot />
      </div>
    </div>

    <img
      v-if="imagem"
      :src="imagem"
      alt=""
      loading="lazy"
      draggable="false"
      class="mx-auto w-40 sm:w-48"
    >
  </div>
</template>
