<template>
  <div> 
    <div class="container-history-pc">
      <h1 class="valores_titulo" id="titulo-container" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
        NOSSA CULTURA
      </h1>
      <div class="about-us-paragraph" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
        
        <div class="section">
          <div class="text-content">
            <h2 class="valores_titulo2">Nossa MISSÃO:</h2>
            <ul class="styled-list">
              <li><strong>Oferecer inovação</strong> em processos e soluções logísticas respeitando a </li>
              <li>necessidade e individualidade de <strong>cada cliente</strong>, visando o equilíbrio</li>
              <li>sustentável em todos os seus quatro alicerces: <strong>Ambiental, Social,</strong></li>
              <li><strong>Governança e Econômico/Financeiro.</strong></li>
            </ul>
          </div>
          <div class="image-content">
            <img draggable="false" src="../../assets/images/download.png" v-motion-fade-visible-once class="valores_imagem">
          </div>
        </div>

        <div class="section">
          <div class="text-content">
            <h2 class="valores_titulo2">Nossa VISÃO:</h2>
            <ul class="styled-list">
              <li>Ser um grupo <strong>competitivo</strong> que atue nos diversos segmentos de mercado</li>
              <li>oferecendo soluções que <strong>superem as expectativas</strong> de nossos clientes.</li>
            </ul>
          </div>
          <div class="image-content">
            <img draggable="false" src="../../assets/images/4127193.png" v-motion-fade-visible-once class="valores_imagem">
          </div>
        </div>

        <div class="section">
          <div class="text-content">
            <h2 class="valores_titulo2">Nossos VALORES:</h2>
            <ul class="styled-list">
              <li>O relacionamento no <strong>GRUPO EMBALARTE</strong> é baseado na <strong>valorização</strong> </li>
              <li>do ser humano, na <strong>confiança</strong>, no <strong>respeito mútuo</strong> no <strong>senso de justiça</strong>,</li>
              <li> na <strong>transparência</strong>, e no <strong>compartilhamento de responsabilidades.</strong></li>
            </ul>
          </div>
          <div class="image-content">
            <img draggable="false" src="../../assets/images/1924771.png" v-motion-fade-visible-once class="valores_imagem">
          </div>
        </div>
        
      </div>
    </div>

    <div class="container-history-cellphone">
      <h1 class="valores_titulo" id="titulo-container" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
        NOSSOS VALORES
      </h1>
      <div class="about-us-paragraph" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
        
        <div class="section">
          <div class="text-content">
            <h2 class="valores_titulo2">Valores Fundamentais:</h2>
            <ul class="styled-list">
              <li><strong>Integridade:</strong> Fazer o que é certo, mesmo quando ninguém está olhando.</li>
              <li><strong>Inovação:</strong> Buscar constantemente novas e melhores formas de atender às necessidades dos nossos clientes.</li>
              <li><strong>Excelência: </strong>Comprometimento com a qualidade e a melhoria contínua.</li>
              <li><strong>Colaboração:</strong> Trabalhar em equipe e valorizar as contribuições de todos os membros.</li>
              <li><strong>Respeito:</strong> Tratar todos com dignidade e consideração.</li>       
            </ul>
          </div>
        </div>

        <div class="section">
          <div class="text-content">
            <h2 class="valores_titulo2">Ambiente de Trabalho:</h2>
            <ul class="styled-list">
              <li><strong>Inclusivo e Diverso:</strong> Promover um ambiente que valorize a diversidade e a inclusão.</li>
              <li><strong>Colaborativo:</strong> Estimular o trabalho em equipe e a comunicação aberta.</li>
              <li><strong>Apoio ao Desenvolvimento:</strong> Oferecer oportunidades para crescimento profissional e pessoal.</li>
            </ul>
          </div>
        </div>

        <div class="section">
          <div class="text-content">
            <h2 class="valores_titulo2">Estilo de Liderança:</h2>
            <ul class="styled-list">
              <li><strong>Inspirador:</strong> Líderes que motivam e engajam suas equipes.</li>
              <li><strong>Acessível:</strong> Líderes que estão disponíveis para ouvir e apoiar suas equipes.</li>
              <li><strong>Transparente:</strong> Comunicação clara e honesta sobre os objetivos e desafios da empresa.</li>
            </ul>
          </div>

        </div>
        
      </div>
    </div>
  </div>
</template>

<style>
/* Contêiner de imagens */
.container-history-cellphone {
  display: none;
}
.container-history-pc {
  display: flex;
  flex-direction: column;
  gap: 20px; /* Espaço entre linhas de imagens */
}

.valores_titulo {
  font-size: 8vh;
  text-align: center; /* Justifica o texto no centro */
  color: #01385C;
}

.valores_titulo2 {
  font-size: 5vh;
  text-align: center; /* Justifica o texto no centro */
  color: #01385C;
}

#titulo-container {
  margin-top: 6%;
}

.about-us-paragraph {
  padding: 0px 15%;
  font-size: 1rem;
  text-align: left; /* Alinha o texto à esquerda */
}

/* Estilização da lista */
.styled-list {
  list-style-type: none; /* Remove marcadores da lista */
  padding-left: 0;
}

.styled-list li {
  margin-bottom: 10px; /* Espaçamento entre itens da lista */
  font-size: 2.5vh;
}

.section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px; /* Espaçamento entre seções */
}

/* Texto à esquerda */
.text-content {
  width: 60%;
}

/* Imagem à direita */
.image-content {
  width: 35%;
  display: flex;
  justify-content: center;
}

.valores_imagem {
  width: 20vh; /* Faz com que a imagem ocupe toda a largura do contêiner */
  height: auto; /* Mantém a proporção da imagem */
  object-fit: contain; /* Ajusta a imagem para caber no contêiner sem cortar */
}

@media only screen and (max-width: 768px){
  .container-history-pc {
    display: none;
  }

  .container-history-cellphone {
    display: block;
    margin-top: 10vh;
  }

  .section {
    display: flex;
    align-items: center;
    justify-content: center;  
    margin-bottom: 1vh; /* Espaçamento entre seções */
  }

  .valores_titulo2 {
  font-size: 5vh;
  display: flex;
  text-align: center; /* Justifica o texto no centro */
  justify-content: center;  
  color: #01385C;
  margin-left: -7.5vh;
  margin-right: -7.5vh;
}

}
</style>
