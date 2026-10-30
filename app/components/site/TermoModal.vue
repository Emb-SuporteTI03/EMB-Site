<template>
  <UModal
    title="Termo de Responsabilidade"
    scrollable
  >
    <UButton
      label="Termo de Responsabilidade"
      color="neutral"
      variant="link"
    />

    <template #body>
      <div class="space-y-4 text-sm text-toned">
        <h3 class="font-semibold text-highlighted">
          TERMO DE RESPONSABILIDADE E USO DO PORTAL
        </h3>

        <p>
          Este portal é disponibilizado pela empresa para uso exclusivo de clientes e parceiros comerciais autorizados,
          com a finalidade de consulta de informações relacionadas a pedidos, entregas e demais dados vinculados
          às relações comerciais existentes.
        </p>
        <p>Ao acessar o sistema, o usuário declara estar ciente e concordar com as seguintes condições:</p>

        <template
          v-for="clausula in clausulas"
          :key="clausula.titulo"
        >
          <h4 class="font-semibold text-highlighted">
            {{ clausula.titulo }}
          </h4>
          <p>{{ clausula.texto }}</p>
          <ul
            v-if="clausula.itens"
            class="list-disc space-y-1 pl-5"
          >
            <li
              v-for="item in clausula.itens"
              :key="item"
            >
              {{ item }}
            </li>
          </ul>
        </template>

        <USeparator />
        <p><strong>Última atualização:</strong> 09/03/2026</p>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
const clausulas = [
  {
    titulo: '1. Uso das Credenciais de Acesso',
    texto: 'O acesso ao portal é realizado mediante credenciais individuais (login e senha). O usuário é integralmente responsável pela guarda e sigilo dessas informações, comprometendo-se a não compartilhá-las com terceiros. Qualquer atividade realizada por meio da conta será considerada de responsabilidade do titular das credenciais.'
  },
  {
    titulo: '2. Uso Adequado do Sistema',
    texto: 'O portal deve ser utilizado exclusivamente para fins relacionados à consulta de informações comerciais entre as partes. É vedado ao usuário:',
    itens: [
      'utilizar o sistema para fins ilícitos ou não autorizados;',
      'tentar acessar informações que não estejam relacionadas à sua empresa ou às suas permissões;',
      'realizar qualquer tentativa de violação de segurança, acesso indevido ou interferência no funcionamento do sistema.'
    ]
  },
  {
    titulo: '3. Integridade das Informações',
    texto: 'A empresa empenha esforços para garantir a exatidão e atualização das informações disponibilizadas no portal. Contudo, eventuais divergências podem ocorrer em razão de atualizações operacionais, integrações de sistemas ou fatores externos. As informações apresentadas no portal possuem caráter informativo e devem ser confirmadas com a empresa em caso de necessidade operacional ou comercial.'
  },
  {
    titulo: '4. Disponibilidade do Sistema',
    texto: 'A empresa não garante disponibilidade contínua e ininterrupta do portal, podendo ocorrer interrupções temporárias para manutenção, atualização de sistemas ou eventos técnicos alheios ao seu controle.'
  },
  {
    titulo: '5. Segurança e Monitoramento',
    texto: 'Para fins de segurança e auditoria, o sistema poderá registrar informações relacionadas ao acesso dos usuários, incluindo data e horário de login e utilização das funcionalidades disponíveis.'
  },
  {
    titulo: '6. Proteção de Dados',
    texto: 'Os dados utilizados para acesso ao portal são tratados de acordo com as disposições da Lei Geral de Proteção de Dados Pessoais (LGPD), sendo utilizados exclusivamente para fins de autenticação, controle de acesso e execução das relações comerciais entre as partes.'
  },
  {
    titulo: '7. Suspensão de Acesso',
    texto: 'A empresa reserva-se o direito de suspender ou revogar o acesso ao portal a qualquer momento em caso de uso indevido, violação das regras estabelecidas neste termo ou encerramento da relação comercial.'
  },
  {
    titulo: '8. Aceitação',
    texto: 'O acesso e utilização deste portal implicam na leitura, compreensão e aceitação integral dos termos aqui descritos.'
  }
]
</script>
