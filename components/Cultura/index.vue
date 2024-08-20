<template>
  <div> 
    <div class="container-history">
      <hr class="custom-hr">    
      <hr class="custom-hr">   
      <h1 class="about-us-title" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
        NOSSA CULTURA
      </h1>
      <p class="about-us-paragraph" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
        Valores Fundamentais:
        <br>

Integridade: Fazer o que é certo, mesmo quando ninguém está olhando.
Inovação: Buscar constantemente novas e melhores formas de atender às necessidades dos nossos clientes.
Excelência: Comprometimento com a qualidade e a melhoria contínua.
Colaboração: Trabalhar em equipe e valorizar as contribuições de todos os membros.
Respeito: Tratar todos com dignidade e consideração.
Ambiente de Trabalho:
<br>
Inclusivo e Diverso: Promover um ambiente que valorize a diversidade e a inclusão.
Colaborativo: Estimular o trabalho em equipe e a comunicação aberta.
Apoio ao Desenvolvimento: Oferecer oportunidades para crescimento profissional e pessoal.
Estilo de Liderança:
<br>

Inspirador: Líderes que motivam e engajam suas equipes.
Acessível: Líderes que estão disponíveis para ouvir e apoiar suas equipes.
Transparente: Comunicação clara e honesta sobre os objetivos e desafios da empresa.
<br>

        
      </p>
      <div v-motion-fade-visible-once class="about-us-image">
        <img draggable="false" src="../../assets/images/1924771.png" v-motion-fade-visible-once class="about-us-image-img">
        <img draggable="false" src="../../assets/images/4127193.png" v-motion-fade-visible-once class="about-us-image-img">
        <img draggable="false" src="../../assets/images/download.png" v-motion-fade-visible-once class="about-us-image-img">

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
.about-us-title {
font-size: 6rem;
text-align: center; /* Justifica o texto no centro */

color: #01385C;
}
.about-us-title2 {
font-size: 4rem;
text-align: center; /* Justifica o texto no centro */

}
.about-us-paragraph {
padding: 0px 15%;
font-size: 1rem;
text-align: center; /* Justifica o texto no centro */
}
.custom-hr {
background-color: rgba(255, 255, 255, 0);
color: rgba(255, 255, 255, 0);
}
/* Contêiner de imagens individuais */
.about-us-image {
display: flex;
gap: 10px; /* Espaço entre as imagens */
justify-content: center; /* Centraliza as imagens horizontalmente */
flex-wrap: wrap; /* Permite que as imagens quebrem para a linha seguinte se necessário */
}

/* Estilo das imagens */
.about-us-image-img {
width: 10%; /* Define a largura desejada */
height: 10%; /* Define a altura desejada */
object-fit: contain; /* Ajusta a imagem para caber no contêiner sem cortar */
}

</style>