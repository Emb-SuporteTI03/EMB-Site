<script setup lang="ts">
useSeoMeta({
  title: 'Nossa cultura',
  description: 'Missão, visão e valores do Grupo Embalarte.'
})
</script>

<template>
  <div>
    <UPageHero title="Nossa cultura" />

    <UContainer class="max-w-5xl pb-12">
      <SectionBloco
        titulo="Nossa missão"
        imagem="/images/cultura/missao.png"
      >
        <p>
          <strong>Oferecer inovação</strong> em processos e soluções logísticas respeitando a
          necessidade e individualidade de <strong>cada cliente</strong>, visando o equilíbrio
          sustentável em todos os seus quatro alicerces: <strong>Ambiental, Social,
            Governança e Econômico/Financeiro.</strong>
        </p>
      </SectionBloco>

      <SectionBloco
        titulo="Nossa visão"
        imagem="/images/cultura/visao.png"
      >
        <p>
          Ser um grupo <strong>competitivo</strong> que atue nos diversos segmentos de mercado
          oferecendo soluções que <strong>superem as expectativas</strong> de nossos clientes.
        </p>
      </SectionBloco>

      <SectionBloco
        titulo="Nossos valores"
        imagem="/images/cultura/valores.png"
      >
        <p>
          O relacionamento no <strong>GRUPO EMBALARTE</strong> é baseado na <strong>valorização</strong>
          do ser humano, na <strong>confiança</strong>, no <strong>respeito mútuo</strong>, no
          <strong>senso de justiça</strong>, na <strong>transparência</strong> e no
          <strong>compartilhamento de responsabilidades.</strong>
        </p>
      </SectionBloco>
    </UContainer>

    <SectionContato />
  </div>
</template>
