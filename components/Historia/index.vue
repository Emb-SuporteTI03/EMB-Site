<template>
    <div> 
      <div class="container-historia">
        <hr class="custom-hr">    
        <hr class="custom-hr">   
        <div class="titulo">
        <h1 class="titulo_historia" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
          NOSSA HISTÓRIA
        </h1>
        <hr class="custom-hr">     
        <hr class="custom-hr">     
      </div>
      <div class="historia">
        <div v-motion-fade-visible-once class="imagens_historia">
          <img draggable="false" src="../../assets/images/1999.png" v-motion-fade-visible-once class="imagens_historia-img">
          <div class="Linha"></div>
          <img draggable="false" src="../../assets/images/2004.png" v-motion-fade-visible-once class="imagens_historia-img">
          <div class="Linha"></div>
          <img draggable="false" src="../../assets/images/2007.png" v-motion-fade-visible-once class="imagens_historia-img">
          <div class="Linha"></div>
          <img draggable="false" src="../../assets/images/2010.png" v-motion-fade-visible-once class="imagens_historia-img">
        </div>
        <hr class="custom-hr">   
        <img draggable="false" src="../../assets/images/seta_ligacao (1).png" v-motion-fade-visible-once class="ligacao">
        <div v-motion-fade-visible-once class="imagens_historia">
          <img draggable="false" src="../../assets/images/2012 (2).png" v-motion-fade-visible-once class="imagens_historia-img">
          <div class="Linha"></div>
          <img draggable="false" src="../../assets/images/2017.png" v-motion-fade-visible-once class="imagens_historia-img">
          <div class="Linha"></div>
          <img draggable="false" src="../../assets/images/2019.png" v-motion-fade-visible-once class="imagens_historia-img">
          <div class="Linha"></div>
          <img draggable="false" src="../../assets/images/2021.png" v-motion-fade-visible-once class="imagens_historia-img">
        </div>
      </div>
    </div>
    </div>
  </template>
  
<style>
.ligacao {
  margin-left: 15%; /* Distancia lateral */
  margin-top: -5%; /* Distância para a linha de cima */
  width: 70%; /* Tamanho da imagem */
  height: auto; /* Mantém a proporção da imagem */
}

/* Relativo às duas linhas de caixa de história */
.historia {
  margin-left: 2.6%; /* Espaço à esquerda */
  margin-right: 2.6%; /* Espaço à direita */  
}
  /* Contêiner de imagens */
  .container-historia {
  display: flex; /* Flexbox */
  flex-direction: column; /* Deixa os itens (que são o título e as linhas) um em baixo do outro*/
}
.titulo_historia {
  font-size: 6rem; 
  display: flex; /* Precisa disso para poder centralizar */
  justify-content: center; /* Centraliza horizontalmente */
  color:#01385C;
}

/* Linha de ligação entre os quadrados de história */
.Linha {
  margin-top: 7%; 
  width: 5%; /* Largura da barra */
  height: 3px; /* Altura da barra horizontal antes da rotação */
  background-color: #01385C; /* Cor da barra */
  border: none; /* Remove a borda padrão */
}

.custom-hr {
background-color: rgba(255, 255, 255, 0);
color: rgba(255, 255, 255, 0);
}
/* Contêiner de imagens individuais */
.imagens_historia {
  display: flex;
  justify-content: center; /* Centraliza as imagens horizontalmente */
  flex-wrap: wrap; /* Permite que as imagens quebrem para a linha seguinte se necessário */
}

/* Estilo das imagens */
.imagens_historia-img {
  width: 18%; /* Define a largura desejada */
  height: 18%; /* Define a altura desejada */
  object-fit: contain; /* Ajusta a imagem para caber no contêiner sem cortar */
}

</style>