<script setup lang="ts">
import type { FormError } from '@nuxt/ui'
import type { LoginExternoResponse } from '~/stores/authExterno'

const { aberto, modo } = useAcessoExterno()
const auth = useAuthExternoStore()
const { public: { apiUrl } } = useRuntimeConfig()

// Antes de logar o usuário precisa aceitar a Política de Privacidade (uma vez só)
const politicaAceita = useCookie<'true' | null>('politicaPrivacidadeAceita', {
  maxAge: 60 * 60 * 24 * 365,
  default: () => null
})
const cookiesAceitos = useCookie<'true' | 'false' | null>('cookiesAceitos', { maxAge: 60 * 60 * 24 * 365 })
const marcouPolitica = ref(false)

const titulo = computed(() => modo.value === 'cliente' ? 'Acesso Cliente' : 'Acesso Transportadoras')

const form = reactive({ usuario: '', senha: '' })
const mostrarSenha = ref(false)
const entrando = ref(false)
const erro = ref('')

function validar(state: typeof form): FormError[] {
  const erros: FormError[] = []
  if (!state.usuario.trim()) erros.push({ name: 'usuario', message: 'Informe o usuário' })
  if (!state.senha) erros.push({ name: 'senha', message: 'Informe a senha' })
  return erros
}

function aceitarPolitica() {
  politicaAceita.value = 'true'
  cookiesAceitos.value = 'true'
}

async function entrar() {
  entrando.value = true
  erro.value = ''
  try {
    const response = await $fetch<LoginExternoResponse>(`/usuario-externo/login-${modo.value}`, {
      baseURL: apiUrl,
      method: 'POST',
      body: { usuario: form.usuario.trim(), senha: form.senha }
    })
    if (!response?.token || !response.idUsuario) throw new Error()

    auth.setAuth(response, modo.value)
    aberto.value = false
    await navigateTo(auth.paginaInicial)
  } catch (e: unknown) {
    // A API responde 400 com a mensagem em texto puro
    const data = (e as { data?: unknown })?.data
    erro.value = typeof data === 'string' && data ? data : 'Usuário ou senha inválidos. Tente novamente.'
  } finally {
    entrando.value = false
  }
}

// Ao fechar, limpa os dados digitados
watch(aberto, (valor) => {
  if (valor) return
  form.usuario = ''
  form.senha = ''
  erro.value = ''
  mostrarSenha.value = false
  marcouPolitica.value = false
})
</script>

<template>
  <UModal
    v-model:open="aberto"
    :title="politicaAceita ? titulo : 'Confirmação de Privacidade'"
    :description="politicaAceita ? 'Entre com o usuário e a senha fornecidos pelo Grupo Embalarte.' : 'Antes de prosseguir, confirme que você leu e concorda com nossa Política de Privacidade.'"
    :ui="{ content: 'max-w-md' }"
  >
    <template #body>
      <div
        v-if="!politicaAceita"
        class="space-y-4"
      >
        <div class="flex justify-center">
          <UIcon
            name="i-lucide-shield-check"
            class="size-12 text-primary"
          />
        </div>

        <p class="text-sm text-toned">
          Você pode ler a política completa
          <ULink
            to="/politica-de-privacidade"
            target="_blank"
            class="font-medium text-primary underline"
          >
            clicando aqui
          </ULink>.
        </p>

        <UCheckbox
          v-model="marcouPolitica"
          label="Li e concordo com a Política de Privacidade"
        />

        <UButton
          label="Prosseguir"
          :disabled="!marcouPolitica"
          block
          @click="aceitarPolitica"
        />
      </div>

      <UForm
        v-else
        :state="form"
        :validate="validar"
        :validate-on="['blur']"
        class="space-y-4"
        @submit="entrar"
      >
        <UAlert
          v-if="erro"
          color="error"
          variant="subtle"
          icon="i-lucide-circle-alert"
          :description="erro"
        />

        <UFormField
          label="Usuário"
          name="usuario"
        >
          <UInput
            v-model="form.usuario"
            placeholder="Digite seu usuário"
            icon="i-lucide-user"
            autocomplete="username"
            autofocus
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Senha"
          name="senha"
        >
          <UInput
            v-model="form.senha"
            :type="mostrarSenha ? 'text' : 'password'"
            placeholder="Digite sua senha"
            icon="i-lucide-lock"
            autocomplete="current-password"
            class="w-full"
            :ui="{ trailing: 'pe-1' }"
          >
            <template #trailing>
              <UButton
                color="neutral"
                variant="link"
                size="sm"
                :icon="mostrarSenha ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                :aria-label="mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'"
                @click="mostrarSenha = !mostrarSenha"
              />
            </template>
          </UInput>
        </UFormField>

        <UButton
          type="submit"
          label="Entrar"
          icon="i-lucide-log-in"
          :loading="entrando"
          block
        />
      </UForm>
    </template>
  </UModal>
</template>
