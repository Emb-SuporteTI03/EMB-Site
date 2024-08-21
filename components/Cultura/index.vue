<template>
  <div> 
    <div class="cultura_container">
      <hr class="custom-hr">    
      <hr class="custom-hr">   
      <h1 class="cultura_titulo" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
        NOSSA CULTURA
      </h1>
      <img draggable="false" src="../../assets/images/Capa LINK - EMBALARTE.png" v-motion-fade-visible-once class="imgem_final">

      <p class="cultura_paragrafo" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
        <br>
        <br>
        Na <strong>EMBALARTE</strong>, nossa cultura é a 
        essência que impulsiona nossa dedicação e 
        inovação no setor de embalagens. Nosso compromisso 
        vai além da simples produção de embalagens; 
        buscamos construir um ambiente de trabalho 
        que reflete nossos valores e nos inspira 
        a alcançar a excelência em tudo o que fazemos.
        <br>
        </p>              
        <p class="cultura_paragrafo" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
        Nossa cultura também é a base de 
        nossa identidade e o motor 
        que nos impulsiona a entregar 
        excelência em embalagens. 
        Estamos comprometidos em 
        criar um ambiente de trabalho 
        positivo, sustentável e 
        inovador que beneficia
         nossos clientes e colaboradores.
         <br>
         <br>
        <img draggable="false" src="../../assets/images/Logo-Grupo-Embalarte-5.png" v-motion-fade-visible-once class="cultura_imagem">

      </p>

      
    </div>
  </div>
</template>

<style>
/* Contêiner de imagens */
.cultura_container {
display: flex;
flex-direction: column;
gap: 20px; /* Espaço entre linhas de imagens */
}
.cultura_titulo {
font-size: 6rem;
text-align: center; /* Justifica o texto no centro */
color: #01385C;
}
.cultura_titulo2 {
font-size: 4rem;
text-align: center; /* Justifica o texto no centro */
}
.cultura_paragrafo {
padding: 0px 25%;
font-size: 1rem;
text-align: center; /* Justifica o texto no centro */
}

.cultura_imagem {
  width: 40%; /* Faz com que a imagem ocupe toda a largura do contêiner */
  height: auto; /* Mantém a proporção da imagem */
  object-fit: contain; /* Ajusta a imagem para caber no contêiner sem cortar */
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

.imagem_final {
  width: 100%; /* Define a largura da imagem como 100% do contêiner pai */
  height: auto; /* Mantém a proporção da imagem */
  object-fit: cover; /* Ajusta a imagem para cobrir o contêiner sem cortar */
}

</style>