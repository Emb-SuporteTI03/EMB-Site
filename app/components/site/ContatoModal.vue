<script setup lang="ts">
import { empresa, mailtoContato } from '~/data/empresa'

const { aberto } = useContato()
</script>

<template>
  <UModal
    v-model:open="aberto"
    title="Entre em contato"
    description="Fale com a gente para as melhores soluções em logística, tecnologia e embalagens."
  >
    <template #body>
      <UButton
        :to="mailtoContato"
        icon="i-lucide-mail"
        size="lg"
        variant="soft"
        block
      >
        {{ empresa.email }}
      </UButton>
    </template>
  </UModal>
</template>
