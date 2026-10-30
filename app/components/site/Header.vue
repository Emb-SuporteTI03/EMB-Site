<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import { empresa } from '~/data/empresa'
import { servicos } from '~/data/servicos'

const { abrir: abrirContato } = useContato()
const { abrir: abrirAcessoExterno, sair } = useAcessoExterno()
const auth = useAuthExternoStore()

const items: NavigationMenuItem[] = [
  {
    label: 'Sobre nós',
    children: [
      { label: 'História', icon: 'i-lucide-history', to: '/nossa-historia' },
      { label: 'Cultura', icon: 'i-lucide-target', to: '/nossa-cultura' },
      { label: 'Valores', icon: 'i-lucide-heart-handshake', to: '/nossos-valores' },
      { label: 'Governança', icon: 'i-lucide-landmark', to: '/governanca' },
      { label: 'Privacidade', icon: 'i-lucide-shield-check', to: '/politica-de-privacidade' }
    ]
  },
  {
    label: 'Nossos serviços',
    children: [
      { label: 'Visão geral', icon: 'i-lucide-layout-grid', to: '/nossos-servicos' },
      ...servicos.map(s => ({ label: s.titulo, to: `/nossos-servicos#${s.id}` })),
      { label: 'Soluções em tecnologia', icon: 'i-lucide-cpu', to: '/tecnologias' }
    ]
  },
  {
    label: 'Acessos',
    children: [
      ...empresa.acessos,
      { label: 'Cliente', description: 'Acesso externo de clientes', icon: 'i-lucide-building-2', onSelect: () => abrirAcessoExterno('cliente') },
      { label: 'Transportadora', description: 'Acesso externo de transportadoras', icon: 'i-lucide-truck', onSelect: () => abrirAcessoExterno('transportadora') }
    ]
  },
  {
    label: 'Contato',
    onSelect: abrirContato
  }
]
</script>

<template>
  <UHeader to="/">
    <template #title>
      <img
        src="/images/logo-embalarte.jpg"
        alt="Grupo Embalarte"
        class="h-9 w-auto"
      >
    </template>

    <UNavigationMenu
      :items="items"
      :ui="{ childList: 'max-h-[70vh] overflow-y-auto' }"
    />

    <template #right>
      <!-- Em dev a sessão vem do localStorage, então só renderiza no navegador -->
      <ClientOnly>
        <template v-if="auth.logado">
          <UButton
            :to="auth.paginaInicial"
            label="Minha área"
            icon="i-lucide-layout-dashboard"
            variant="soft"
            class="hidden sm:inline-flex"
          />
          <UButton
            icon="i-lucide-log-out"
            aria-label="Sair"
            color="neutral"
            variant="ghost"
            @click="sair"
          />
        </template>
      </ClientOnly>

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

    <template #body>
      <UNavigationMenu
        :items="items"
        orientation="vertical"
        class="-mx-2.5"
      />
    </template>
  </UHeader>
</template>
