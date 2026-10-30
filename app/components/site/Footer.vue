<script setup lang="ts">
import { empresa } from '~/data/empresa'
</script>

<template>
  <USeparator />

  <UFooter>
    <template #left>
      <p class="text-sm text-muted">
        © {{ new Date().getFullYear() }} {{ empresa.nome }} · CNPJ {{ empresa.cnpj }}
      </p>
    </template>

    <SiteTermoModal />

    <template #right>
      <UButton
        v-for="rede in empresa.redes"
        :key="rede.label"
        :to="rede.to"
        target="_blank"
        :icon="rede.icon"
        :aria-label="rede.label"
        color="neutral"
        variant="ghost"
      />
    </template>
  </UFooter>
</template>
