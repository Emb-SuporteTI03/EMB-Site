<template>
    <div> 
      <div class="container-history">
        <hr class="custom-hr">    
        <hr class="custom-hr">   
        <div class="titulo">
        <h1 class="about-us-title" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
          NOSSA HISTÓRIA
        </h1>
        <h2 class="about-us-title2" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
          O COMEÇO: 
        <hr class="custom-hr">   
      </h2>
      </div>
      <div class="historia">
        <div v-motion-fade-visible-once class="about-us-image">
          <img draggable="false" src="../../assets/images/1999.png" v-motion-fade-visible-once class="about-us-image-img">
          <div class="Linha"></div>
          <img draggable="false" src="../../assets/images/2004.png" v-motion-fade-visible-once class="about-us-image-img">
          <div class="Linha"></div>
          <img draggable="false" src="../../assets/images/2007.png" v-motion-fade-visible-once class="about-us-image-img">
          <div class="Linha"></div>
          <img draggable="false" src="../../assets/images/2010.png" v-motion-fade-visible-once class="about-us-image-img">
        </div>
        <hr class="custom-hr">   
        <h2 class="about-us-title2" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
          NOSSO DESENVOLVIMENTO: 
        <hr class="custom-hr">   
      </h2>
        <div v-motion-fade-visible-once class="about-us-image">
          <img draggable="false" src="../../assets/images/2012.png" v-motion-fade-visible-once class="about-us-image-img">
          <div class="Linha"></div>
          <img draggable="false" src="../../assets/images/2017.png" v-motion-fade-visible-once class="about-us-image-img">
          <div class="Linha"></div>
          <img draggable="false" src="../../assets/images/2019.png" v-motion-fade-visible-once class="about-us-image-img">
          <div class="Linha"></div>
          <img draggable="false" src="../../assets/images/2021.png" v-motion-fade-visible-once class="about-us-image-img">
        </div>
      </div>
    </div>
    </div>
  </template>
  
<style>
.historia {
  margin-left: 2.6%; /* Espaço à esquerda */
  margin-right: 2.6%; /* Espaço à direita */  
}
  /* Contêiner de imagens */
  .container-history {
  display: flex;
  flex-direction: column;
  gap: 20px; /* Espaço entre linhas de imagens */
}
.about-us-title {
  font-size: 6rem;
  color:rgb(7, 7, 100);
}
.about-us-title2 {
  font-size: 4rem;
}
.Linha {
  margin-top: 7%;
  width: 100px; /* Largura da barra horizontal antes da rotação */
  height: 5px; /* Altura da barra horizontal antes da rotação */
  background-color: rgb(76, 76, 163); /* Cor da barra */
  border: none; /* Remove a borda padrão */
}

.custom-hr {
background-color: rgba(255, 255, 255, 0);
color: rgba(255, 255, 255, 0);
}
/* Contêiner de imagens individuais */
.about-us-image {
  display: flex;
  justify-content: center; /* Centraliza as imagens horizontalmente */
  flex-wrap: wrap; /* Permite que as imagens quebrem para a linha seguinte se necessário */
}

/* Estilo das imagens */
.about-us-image-img {
  width: 20%; /* Define a largura desejada */
  height: 20%; /* Define a altura desejada */
  object-fit: contain; /* Ajusta a imagem para caber no contêiner sem cortar */
  border-radius: 5px; /* Adiciona cantos arredondados */
}

</style>