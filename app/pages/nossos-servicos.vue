<script setup lang="ts">
import { servicos } from '~/data/servicos'

useSeoMeta({
  title: 'Nossos serviços',
  description: 'Armazenagem, picking e packing, e-commerce, manuseios, logística promocional, envase, encadernação, etiquetagem, gravação inkjet e distribuição nacional.'
})
</script>

<template>
  <div>
    <UPageHero
      title="Nossos serviços"
      description="Bem-vindo à Embalarte, uma empresa inovadora e versátil no setor de embalagens. Com um portfólio diversificado de produtos, nos dedicamos a fornecer soluções de embalagem de alta qualidade que atendem às necessidades específicas de cada cliente."
      orientation="horizontal"
    >
      <img
        src="/images/servicos/deposito.png"
        alt="Depósito do Grupo Embalarte"
        class="w-full"
      >
    </UPageHero>

    <UContainer class="divide-y divide-default">
      <SectionDestaque
        v-for="(servico, index) in servicos"
        :key="servico.id"
        :item="servico"
        :invertido="index % 2 === 1"
      />
    </UContainer>

    <UPageSection>
      <UPageCTA
        title="Conheça também nossas soluções em tecnologia"
        description="Tablets, aplicativos mobile, APIs e aplicativo próprio para dar visibilidade total à sua operação."
        orientation="horizontal"
        :links="[{ label: 'Ver tecnologias', to: '/tecnologias', trailingIcon: 'i-lucide-arrow-right' }]"
      />
    </UPageSection>

    <SectionContato />
  </div>
</template>
