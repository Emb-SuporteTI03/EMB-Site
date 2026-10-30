<script setup lang="ts">
import { eventos } from '~/data/historia'

useSeoMeta({
  title: 'Nossa história',
  description: 'A trajetória do Grupo Embalarte desde 1999.'
})
</script>

<template>
  <div>
    <UPageHero
      title="Nossa trajetória"
      description="De 1999 até hoje: os marcos que construíram o Grupo Embalarte."
    />

    <UContainer>
      <!-- Linha do tempo: uma coluna no celular, alternando lados a partir do md -->
      <ol class="relative mx-auto max-w-5xl pb-16 before:absolute before:inset-y-0 before:left-4 before:w-1 before:rounded-full before:bg-primary-900 md:before:left-1/2 md:before:-translate-x-1/2">
        <li
          v-for="(evento, index) in eventos"
          :key="evento.ano"
          class="relative mb-10 pl-12 md:w-1/2 md:pl-0"
          :class="index % 2 === 0 ? 'md:pr-12' : 'md:ml-auto md:pl-12'"
        >
          <span
            class="absolute top-6 left-2.5 size-4 rounded-full border-2 border-primary-900 md:left-auto"
            :class="[
              index % 2 === 0 ? 'bg-primary-900 md:-right-2' : 'bg-default md:-left-2'
            ]"
          />

          <div
            v-reveal
            class="rounded-lg border border-primary-900 p-6 text-center shadow-lg"
            :class="index % 2 === 0 ? 'bg-primary-900 text-white' : 'bg-default text-primary-900'"
          >
            <span class="text-2xl font-bold">{{ evento.ano }}</span>
            <h2 class="mt-2 text-lg font-bold">
              {{ evento.titulo }}
            </h2>
            <p class="mt-2">
              {{ evento.descricao }}
            </p>
          </div>
        </li>
      </ol>
    </UContainer>

    <SectionContato />
  </div>
</template>
