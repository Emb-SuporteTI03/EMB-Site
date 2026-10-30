<script setup lang="ts">
import { empresa } from '~/data/empresa'
</script>

<template>
  <UPageSection
    title="Localização"
    orientation="horizontal"
    reverse
    class="bg-linear-to-b from-elevated to-default"
  >
    <template #description>
      <p class="flex items-center gap-2 text-lg font-semibold text-primary">
        <UIcon
          name="i-lucide-map-pin"
          class="size-6"
        />
        {{ empresa.cidade }} - SP
      </p>
      <p class="mt-2">
        Sede própria próxima às rodovias Anhanguera e Bandeirantes, com fácil acesso ao Rodoanel.
      </p>
    </template>

    <div class="rounded-xl bg-primary p-3">
      <iframe
        :src="empresa.mapaEmbedUrl"
        title="Mapa: Grupo Embalarte em Santana de Parnaíba"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        allowfullscreen
        class="aspect-square w-full rounded-lg border-0 bg-default"
      />
    </div>
  </UPageSection>
</template>
