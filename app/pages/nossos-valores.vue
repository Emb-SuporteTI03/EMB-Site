<script setup lang="ts">
useSeoMeta({
  title: 'Nossos valores',
  description: 'Valores fundamentais, ambiente de trabalho e estilo de liderança do Grupo Embalarte.'
})

const grupos = [
  {
    titulo: 'Valores fundamentais',
    imagem: '/images/cultura/missao.png',
    itens: [
      ['Integridade', 'Fazer o que é certo, mesmo quando ninguém está olhando.'],
      ['Inovação', 'Buscar constantemente novas e melhores formas de atender às necessidades dos nossos clientes.'],
      ['Excelência', 'Comprometimento com a qualidade e a melhoria contínua.'],
      ['Colaboração', 'Trabalhar em equipe e valorizar as contribuições de todos os membros.'],
      ['Respeito', 'Tratar todos com dignidade e consideração.']
    ]
  },
  {
    titulo: 'Ambiente de trabalho',
    imagem: '/images/cultura/visao.png',
    itens: [
      ['Inclusivo e Diverso', 'Promover um ambiente que valorize a diversidade e a inclusão.'],
      ['Colaborativo', 'Estimular o trabalho em equipe e a comunicação aberta.'],
      ['Apoio ao Desenvolvimento', 'Oferecer oportunidades para crescimento profissional e pessoal.']
    ]
  },
  {
    titulo: 'Estilo de liderança',
    imagem: '/images/cultura/valores.png',
    itens: [
      ['Inspirador', 'Líderes que motivam e engajam suas equipes.'],
      ['Acessível', 'Líderes que estão disponíveis para ouvir e apoiar suas equipes.'],
      ['Transparente', 'Comunicação clara e honesta sobre os objetivos e desafios da empresa.']
    ]
  }
]
</script>

<template>
  <div>
    <UPageHero title="Nossos valores" />

    <UContainer class="max-w-5xl pb-12">
      <SectionBloco
        v-for="grupo in grupos"
        :key="grupo.titulo"
        :titulo="grupo.titulo"
        :imagem="grupo.imagem"
      >
        <ul class="space-y-2">
          <li
            v-for="[nome, texto] in grupo.itens"
            :key="nome"
          >
            <strong>{{ nome }}:</strong> {{ texto }}
          </li>
        </ul>
      </SectionBloco>
    </UContainer>

    <SectionContato />
  </div>
</template>
