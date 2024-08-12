<template>
    <div> 
      <div class="container-history">
        <hr class="custom-hr">    
        <hr class="custom-hr">   
        <h1 class="about-us-title" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
          NOSSA CULTURA
        </h1>
        <p class="about-us-paragraph" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
          Na Embalarte, prezamos pelo ....................................... <br>
          ................................................................... <br>
          .......................................................----------.. 
          
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
  color:rgb(7, 7, 100);
}
.about-us-title2 {
  font-size: 4rem;
}
.about-us-paragraph {
  padding: 0px 10px;
  font-size: 2rem;
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
  width: 20%; /* Define a largura desejada */
  height: 20%; /* Define a altura desejada */
  object-fit: contain; /* Ajusta a imagem para caber no contêiner sem cortar */
}

</style>