<script setup lang="ts">
const slides = [
  { src: '/images/home/hero-galpao.jpg', alt: 'Galpão do Grupo Embalarte' },
  { src: '/images/home/hero-container.jpg', alt: 'Containers' },
  { src: '/images/home/hero-caminhao.jpg', alt: 'Caminhão de distribuição' },
  { src: '/images/home/hero-tecnologia.jpg', alt: 'Tecnologia' }
]
</script>

<template>
  <section class="relative">
    <UCarousel
      v-slot="{ item, index }"
      :items="slides"
      fade
      loop
      :autoplay="{ delay: 10000, stopOnInteraction: false }"
      :ui="{ item: 'basis-full' }"
    >
      <img
        :src="item.src"
        :alt="item.alt"
        :loading="index === 0 ? 'eager' : 'lazy'"
        class="h-[60vh] w-full object-cover sm:h-[75vh]"
      >
    </UCarousel>

    <div class="pointer-events-none absolute inset-0 flex items-center justify-center p-4">
      <div class="pointer-events-auto max-w-2xl rounded-xl bg-default/85 p-6 text-center shadow-lg backdrop-blur-sm sm:p-10">
        <h1 class="sr-only">
          Grupo Embalarte
        </h1>
        <img
          src="/images/logo-embalarte.jpg"
          alt=""
          class="mx-auto mb-6 w-3/5 mix-blend-multiply"
        >
        <p class="text-pretty text-base text-toned sm:text-xl">
          O <strong class="text-primary">Grupo EMBALARTE</strong> oferece soluções logísticas
          adaptadas às necessidades específicas de cada cliente. Nosso atendimento
          personalizado, suporte dedicado e gestão eficiente são os principais
          diferenciais que garantem a qualidade e a excelência de nossos serviços.
          Solicite um orçamento sem compromisso para o seu projeto.
        </p>
      </div>
    </div>
  </section>
</template>
