<script setup lang="ts">
const { abrir } = useContato()
</script>

<template>
  <UPageSection>
    <UPageCTA
      v-reveal
      title="Entre em contato conosco"
      description="Fale com a gente para as melhores soluções em logística, tecnologia e embalagens."
      variant="subtle"
      :links="[{
        label: 'Entre em contato',
        icon: 'i-lucide-message-circle',
        size: 'xl',
        onClick: abrir
      }]"
    />
  </UPageSection>
</template>
