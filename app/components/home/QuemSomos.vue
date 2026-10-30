<template>
  <UPageSection
    id="quem-somos"
    title="Quem somos"
    orientation="horizontal"
    class="bg-linear-to-b from-default to-elevated"
  >
    <template #description>
      <p v-reveal>
        O GRUPO EMBALARTE foi fundado em 1999 pelo sonho de Fernando Alves Vieira, um exímio
        empresário que criou essa empresa para oferecer ao mercado soluções completas e
        personalizadas. Com mais de 25 anos de experiência, vem conquistando seu espaço como uma
        das melhores empresas no segmento. Situada na cidade de Santana de Parnaíba, no Estado de
        São Paulo, dispõe em sua planta própria de 4.000m². Localizada próximo às rodovias
        Anhanguera e Bandeirantes, de fácil acesso ao Rodoanel, possibilitando agilidade no
        processo de distribuição e transporte dos materiais. Equipamentos de ponta, atendimento
        personalizado, funcionários treinados e qualificados, gestão e tecnologia completam a
        estrutura voltada para atingir excelência em todas as operações realizadas.
      </p>
    </template>

    <!-- Começa mudo para o navegador permitir o autoplay; o visitante liga o som pelos controles -->
    <video
      src="/videos/institucional.mp4"
      autoplay
      muted
      loop
      playsinline
      controls
      preload="metadata"
      class="w-full rounded-lg shadow-lg"
    />
  </UPageSection>
</template>
