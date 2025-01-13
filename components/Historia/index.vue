<script>
export default {
  data() {
    return {
      eventos: [
        {
          ano: "1999",
          titulo: "Nascimento do Grupo Embalarte",
          descricao:
            "Fernando e Tatiana fundaram a empresa com o objetivo de oferecer ao mercado soluções completas e personalizadas. Neste ano começa o início de um sonho que seria consolidado com foco, respeito e solidez.",
        },
        {
          ano: "2004",
          titulo: "Mudança para Rua São Paulo",
          descricao:
            "A estrutura anterior na Rua Rio de Janeiro em Santana de parnaíba não comportava mais o sonho dos nossos clientes, precisamos mudar para uma estrutura maior.",
        },
        {
          ano: "2007",
          titulo: "Tecnologia e investimentos",
          descricao:
            "Mais funcionários foram contratados, o que resultou numa expansão da empresa. Aquisição de equipamentos automáticos foram necessários para absorver o crecimento da demanda.",
        },
        {
          ano: "2010",
          titulo: "Foco na Qualidade",
          descricao:
            "Com tantos sonhos, ainda a serem realizados, foi necessário a criação de uma SGQ com base na necessidade e expectativa de nossos clientes.",
        },
        {
          ano: "2012",
          titulo: "Lar nosso Lar",
          descricao:
            "Depois de 3 anos de construção, inauguramos nossa sede própria, com mais de 4.000m², localizada próxima as principais rodovias do Estado de São Paulo (Anhanguera e Bandeirantes) e de fácil acesso ao Rodoanel.",
        },
        {
          ano: "2017",
          titulo: "Mais espaço",
          descricao:
            "Dobramos nossa capacidade de armazenagem para mais de 2.000 posições verticalizadas.",
        },
        {
          ano: "2019",
          titulo: "Entregar e Receber com cuidado e carinho",
          descricao:
            "Ampliamos a estrutura de recebimento e expedição com a criação de dois novos pulmões. Haja fôlego!",
        },
        {
          ano: "2021",
          titulo: "Ao infinito... E além!",
          descricao:
            "Abertura de nossa primeira filial em São José dos Campos/SP, realizando operações dentro da unidade de um dos nossos principais clientes.",
        },
        {
          ano: "2023",
          titulo: "Expansão da Filial de São José dos Campos",
          descricao:
            "No ano de 2023 tives um grande avanço: Expandimos consideravelmente a filial localizada em São José dos Campos.",
        },
        {
          ano: "2024",
          titulo: "Filial em São Paulo",
          descricao:
            "Foi aberta mais uma filial, esta em São Paulo, na Zona Oeste. A empresa segue pensando em inovar e crescer.",
        },
      ],
    };
  },
};
</script>


<template>
  <div class="container-historia">
    <div class="titulo">
      <h1 
        class="titulo_historia" 
        style="font-family: 'Outfit', sans-serif; margin-top: 10vh;" 
        v-motion-slide-visible-once-bottom
      >
        NOSSA TRAJETÓRIA
      </h1>
    </div>

    <!-- Timeline -->
    <div class="timeline">
      <div class="timeline-event" v-for="(event, index) in eventos" :key="index">
      
        <div 
          class="event-content" 
          :class="{'left': index % 2 === 0, 'right': index % 2 !== 0}"
        >
          <span class="event-year">{{ event.ano }}</span>

          <div class="event-text">
            <span class="event-title">{{ event.titulo }}</span>
            <p class="event-description">{{ event.descricao }}</p>
          </div>

        </div>

        <!-- Alterando a classe da bolinha -->
        <div :class="['timeline-marker', { 'odd': index % 2 === 0, 'even': index % 2 !== 0 }]"></div>
      </div>
    </div>


  </div>
</template>

  
<style scoped>
.container-historia {
  padding: 20px;
}

.titulo {
  text-align: center;
  margin-bottom: 40px;
}

.titulo_historia {
  font-size: 10vh;
  color: #01385c;
}

.custom-hr {
  width: 60px;
  height: 4px;
  background-color: #01385c;
  margin: 10px auto;
  border: none;
}

/* Timeline */
.timeline {
  position: relative;
  margin: 50px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.timeline::before {
  content: "";
  position: absolute;
  width: 4px;
  background-color: #01385c;
  top: 0;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 0;
}

.timeline-event {
  position: relative;
  width: 100%; /* Garante que os itens ocupem todo o espaço */
  display: flex;
  justify-content: space-between;
  margin: 20px 0;
}

.timeline-marker {
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
  top: 45%; /* Coloca a bolinha no centro do item */
  margin-top: 10px; /* Ajuste para descer um pouco */
}

/* Bolinhas ímpares (1, 3, 5...) - Cor de fundo azul */
.timeline-marker.odd {
  background-color: #01385c;
  border: 1px solid #01385c;
}

/* Bolinhas pares (2, 4, 6...) - Fundo branco com borda azul */
.timeline-marker.even {
  background-color: white;
  border: 1px solid #01385c;
}

/* Conteúdo dos eventos */
.event-content {
  width: 25%; /* Mantém largura responsiva, se necessário */
  max-width: 400px; /* Largura máxima */
  max-height: 500px; /* Altura máxima */
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #01385c;
  box-shadow: 0px 8px 12px rgba(0, 0, 0, 0.3);
  z-index: 2;
}

/* Estilo para eventos à esquerda */
.event-content.left {
  background-color: #01385c; /* Fundo azul */
  color: white; /* Texto branco */
  text-align: center;
  margin-left: 20%;
}

.event-content.left .event-description {
  color: white; /* Cor do texto da descrição em branco para eventos à esquerda */
}

.event-content.left .event-title {
  color: white; /* Cor do texto da descrição em branco para eventos à esquerda */
}

.event-content.left .event-year {
  color: white; /* Cor do texto da descrição em branco para eventos à esquerda */
}

/* Estilo para eventos à direita */
.event-content.right {
  background-color: white; /* Fundo branco */
  color: #01385c; /* Texto azul */
  text-align: center;
  margin-left: 55%; /* Mantém o conteúdo alinhado à direita */
}

.event-content.right .event-description {
  color: #01385c; /* Cor do texto da descrição em azul para eventos à direita */
}

/* Ano e Texto */
.event-year {
  font-size: 24px;
  font-weight: bold;
  color: #01385c;
}

.event-title {
  font-size: 18px;
  font-weight: bold;
  color: #01385c;
  margin-top: 10px;
}

.event-description {
  font-size: 16px;
  margin-top: 5px;
}

@media (max-width: 768px) {
  .event-content {
    width: 90%; /* Ajusta para ocupar quase toda a largura da tela */
    max-width: 320px; /* Mantém o limite máximo */
    margin: 10px auto; /* Centraliza em telas menores */
  }
}

</style>
