<script setup lang="ts">
import { tecnologias } from '~/data/tecnologias'

useSeoMeta({
  title: 'Nossas tecnologias',
  description: 'Tablets, soluções mobile, APIs e aplicativo próprio do Grupo Embalarte.'
})
</script>

<template>
  <div>
    <UPageHero
      title="Nossas tecnologias"
      description="Bem-vindo à Embalarte, uma empresa inovadora e versátil no setor de embalagens, logística e tecnologia. Com um portfólio diversificado de produtos, nos dedicamos a fornecer soluções que atendem às necessidades específicas de cada cliente."
      orientation="horizontal"
    >
      <div class="flex items-end justify-center gap-6">
        <img
          src="/images/tecnologias/celular.png"
          alt="Celular"
          class="h-40 w-auto"
        >
        <img
          src="/images/tecnologias/notebook.png"
          alt="Notebook"
          class="w-1/2 -scale-x-100"
        >
      </div>
    </UPageHero>

    <UContainer class="divide-y divide-default">
      <SectionDestaque
        v-for="(tecnologia, index) in tecnologias"
        :key="tecnologia.id"
        :item="tecnologia"
        :invertido="index % 2 === 1"
      />
    </UContainer>

    <SectionContato />
  </div>
</template>
