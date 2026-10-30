<script setup lang="ts">
// Guarda a escolha num cookie (antes era localStorage), assim o servidor
// já sabe se deve renderizar o aviso e ele não "pisca" ao carregar a página
const escolha = useCookie<'true' | 'false' | null>('cookiesAceitos', {
  maxAge: 60 * 60 * 24 * 365,
  default: () => null
})
</script>

<template>
  <div
    v-if="escolha === null"
    class="fixed inset-x-0 bottom-0 z-50 border-t border-default bg-inverted text-inverted shadow-lg"
  >
    <div class="mx-auto flex max-w-(--ui-container) flex-col items-start gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
      <p class="text-sm">
        Utilizamos cookies e tecnologias de armazenamento local para melhorar sua experiência.
        Ao continuar navegando, você concorda com nossa
        <ULink
          to="/politica-de-privacidade"
          class="font-medium text-primary-300 underline"
        >
          Política de Privacidade
        </ULink>.
      </p>

      <div class="flex shrink-0 gap-2">
        <UButton
          label="Recusar"
          color="neutral"
          variant="subtle"
          size="sm"
          @click="escolha = 'false'"
        />
        <UButton
          label="Aceitar"
          size="sm"
          @click="escolha = 'true'"
        />
      </div>
    </div>
  </div>
</template>
