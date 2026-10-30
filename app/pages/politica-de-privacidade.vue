<script setup lang="ts">
import { empresa, mailtoContato } from '~/data/empresa'

useSeoMeta({
  title: 'Política de Privacidade',
  description: 'Como o Grupo Embalarte coleta, utiliza, armazena e protege seus dados pessoais.'
})

interface Secao {
  titulo: string
  paragrafos?: string[]
  listas?: { titulo?: string, itens: string[] }[]
}

const secoes: Secao[] = [
  {
    titulo: '1. Introdução',
    paragrafos: [
      'Esta Política de Privacidade descreve como coletamos, utilizamos, armazenamos e protegemos as informações fornecidas por meio do nosso site e serviços.',
      'Ao utilizar nosso site, você concorda com os termos descritos nesta Política de Privacidade.'
    ]
  },
  {
    titulo: '2. Dados coletados',
    listas: [
      { titulo: 'Dados fornecidos pelo usuário', itens: ['Nome', 'E-mail', 'Telefone', 'Empresa', 'Informações enviadas através de formulários'] },
      { titulo: 'Dados coletados automaticamente', itens: ['Endereço IP', 'Dados de navegação', 'Cookies', 'Informações do navegador e dispositivo', 'Páginas acessadas no site'] }
    ]
  },
  {
    titulo: '3. Finalidade da coleta de dados',
    listas: [{ itens: ['Responder solicitações do usuário', 'Fornecer informações sobre produtos ou serviços', 'Melhorar a experiência de navegação', 'Realizar análises estatísticas', 'Cumprir obrigações legais'] }]
  },
  {
    titulo: '4. Compartilhamento de dados',
    paragrafos: ['O GRUPO EMBALARTE não comercializa dados pessoais.'],
    listas: [{ itens: ['Prestadores de serviço necessários para o site', 'Cumprimento de obrigação legal', 'Ordem judicial ou autoridade competente'] }]
  },
  {
    titulo: '5. Armazenamento e segurança',
    paragrafos: ['O GRUPO EMBALARTE adota medidas técnicas e organizacionais para proteger os dados pessoais contra acessos não autorizados, perda ou divulgação.']
  },
  {
    titulo: '6. Uso de cookies',
    paragrafos: ['Nosso site pode utilizar cookies para melhorar a experiência de navegação e coletar informações estatísticas.']
  },
  {
    titulo: '7. Direitos do titular',
    listas: [{ itens: ['Confirmação da existência de tratamento', 'Acesso aos dados pessoais', 'Correção de dados', 'Anonimização ou eliminação', 'Portabilidade dos dados', 'Revogação do consentimento'] }]
  },
  {
    titulo: '8. Canal LGPD',
    paragrafos: [`E-mail para solicitações: ${empresa.email}`]
  },
  {
    titulo: '9. Alterações nesta política',
    paragrafos: ['Esta política pode ser atualizada periodicamente para refletir mudanças em práticas ou requisitos legais.']
  }
]
</script>

<template>
  <div class="bg-elevated/50">
    <UPageHero
      title="Política de Privacidade"
      description="O GRUPO EMBALARTE valoriza a privacidade e a proteção dos dados pessoais de seus usuários, clientes e visitantes."
      :links="[{
        label: 'Download da Política de Privacidade',
        icon: 'i-lucide-file-down',
        to: '/docs/politica-de-privacidade.pdf',
        download: 'Politica de Privacidade Grupo Embalarte.pdf',
        external: true
      }]"
    />

    <UContainer class="max-w-4xl space-y-5 pb-16">
      <UCard
        v-for="secao in secoes"
        :key="secao.titulo"
      >
        <h2 class="mb-3 text-xl font-semibold text-highlighted">
          {{ secao.titulo }}
        </h2>
        <p
          v-for="paragrafo in secao.paragrafos"
          :key="paragrafo"
          class="mb-2 text-toned"
        >
          {{ paragrafo }}
        </p>
        <template
          v-for="lista in secao.listas"
          :key="lista.titulo ?? secao.titulo"
        >
          <h3
            v-if="lista.titulo"
            class="mt-4 mb-2 font-semibold text-highlighted"
          >
            {{ lista.titulo }}
          </h3>
          <ul class="list-disc space-y-1 pl-5 text-toned">
            <li
              v-for="item in lista.itens"
              :key="item"
            >
              {{ item }}
            </li>
          </ul>
        </template>
      </UCard>

      <UCard>
        <h2 class="mb-3 text-xl font-semibold text-highlighted">
          10. Contato
        </h2>
        <p class="text-toned">
          Em caso de dúvidas sobre esta Política de Privacidade ou sobre o funcionamento do site, entre em contato com:
        </p>
        <UButton
          :to="mailtoContato"
          :label="empresa.email"
          icon="i-lucide-mail"
          variant="soft"
          class="mt-3"
        />

        <UAlert
          class="mt-6"
          color="primary"
          variant="subtle"
          icon="i-lucide-shield-check"
          title="Canal para exercício de direitos do titular"
        >
          <template #description>
            <div class="space-y-2">
              <p>
                O titular dos dados pessoais poderá exercer seus direitos previstos na Lei Geral de Proteção de Dados,
                tais como confirmação de tratamento, acesso, correção, anonimização ou eliminação de dados pessoais,
                mediante solicitação ao GRUPO EMBALARTE pelo canal <strong>{{ empresa.email }}</strong>.
              </p>
              <p>
                Para garantir a segurança das informações, o GRUPO EMBALARTE poderá solicitar dados adicionais para
                confirmação da identidade do solicitante. As solicitações serão analisadas e respondidas dentro dos
                prazos previstos na legislação aplicável.
              </p>
            </div>
          </template>
        </UAlert>
      </UCard>
    </UContainer>
  </div>
</template>
