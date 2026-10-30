<script setup lang="ts">
useSeoMeta({
  title: 'Governança e agenda ESG',
  description: 'Governança corporativa, respeito e sustentabilidade no Grupo Embalarte.'
})
</script>

<template>
  <div>
    <UPageHero title="Governança e agenda ESG" />

    <UContainer class="max-w-5xl pb-12">
      <SectionBloco
        imagem="/images/governanca/esg.png"
        invertido
      >
        <p class="text-xl">
          Em 2022 reforçamos nosso compromisso com os <strong>padrões de Governança Corporativa</strong>,
          tomamos diversas medidas que impactaram positivamente a empresa para a conformidade da Agenda ESG.
        </p>
      </SectionBloco>

      <SectionBloco imagem="/images/governanca/esg-2.png">
        <ul class="list-disc space-y-3 pl-5">
          <li>
            Criamos o conselho de Administração, cujas principais funções são: fixar a orientação geral dos
            negócios, decidir sobre temas de relevância estratégica, entre outras competências.
          </li>
          <li>Desde 2020 contamos com um serviço personalizado de consultoria, realizado pela MS Rezende.</li>
          <li>Promovemos reuniões periódicas de conselho para analisar resultados, impactos e estratégias.</li>
        </ul>
      </SectionBloco>
    </UContainer>

    <UPageSection
      title="Respeito"
      class="bg-elevated"
    >
      <div
        v-reveal
        class="mx-auto max-w-4xl space-y-8 text-lg text-toned [&_strong]:text-highlighted"
      >
        <p class="text-center">
          O <strong>GRUPO EMBALARTE</strong> respeita a individualidade de cada pessoa, não discrimina
          identidade de gênero e orientação sexual, religião, raça, etnia, deficiência, cultura,
          nacionalidade, classe social, idade, características físicas, opinião ou qualquer outra forma
          de discriminação, assédio, hostilidade, abuso ou injustiça.
        </p>

        <div class="grid gap-8 md:grid-cols-2">
          <p>
            <strong>Repudiamos toda e qualquer</strong> forma degradante de trabalho: infantil, forçado,
            escravo, bem como <strong>qualquer</strong> tipo de assédio ou a prática de abusos físicos e
            psicológicos, independentemente de seu nível hierárquico. Nesse sentido, respeitamos:
          </p>
          <ul class="list-disc space-y-1 pl-5">
            <li>O direito à dignidade e à privacidade;</li>
            <li>O direito à vida e à liberdade;</li>
            <li>Liberdade de opinião e de expressão;</li>
            <li>Liberdade de associação; e</li>
            <li>O direito ao trabalho e à educação.</li>
          </ul>
        </div>
      </div>
    </UPageSection>

    <UPageSection
      title="Sustentabilidade"
      icon="i-lucide-sun"
    >
      <p
        v-reveal
        class="mx-auto max-w-4xl text-center text-lg text-toned [&_strong]:text-highlighted"
      >
        <strong>O sol</strong> é a grande aposta para nossas futuras gerações. Desde junho de 2022
        <strong>toda a energia utilizada em nossa matriz é proveniente de placas solares</strong>. Além disso,
        sua produção não emite qualquer tipo de poluição ou gases de efeito estufa, garantindo o compromisso
        do país na diminuição de CO2. Também pensando na sustentabilidade, os poucos resíduos gerados de nosso
        processo produtivo (papel e plástico) são coletados por empresa especializada em reciclagem.
      </p>
    </UPageSection>

    <SectionContato />
  </div>
</template>
