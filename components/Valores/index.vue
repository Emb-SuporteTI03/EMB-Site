<template>
  <div> 
    <div class="container-history">
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
          <div class="image-content">
            <img draggable="false" src="../../assets/images/download.png" v-motion-fade-visible-once class="valores_imagem">
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
          <div class="image-content">
            <img draggable="false" src="../../assets/images/4127193.png" v-motion-fade-visible-once class="valores_imagem">
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
          <div class="image-content">
            <img draggable="false" src="../../assets/images/1924771.png" v-motion-fade-visible-once class="valores_imagem">
          </div>
        </div>
        
      </div>
    </div>
  </div>
</template>

<style>
/* Contêiner de imagens */
.container-history {
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
</style>
