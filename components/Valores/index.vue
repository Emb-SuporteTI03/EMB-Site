<template>
  <div> 
    <div class="container-history">
      <hr class="custom-hr">    
      <hr class="custom-hr">   
      <h1 class="about-us-title" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
        NOSSOS VALORES
      </h1>
      <p class="about-us-paragraph" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
        Valores da Empresa
Ética e Transparência:
<br>
Agir com honestidade em todas as interações e manter uma comunicação aberta sobre práticas e decisões.
Compromisso com o Cliente:
<br>

Priorizar as necessidades dos clientes e buscar sempre superar suas expectativas.
Responsabilidade Social e Ambiental:
<br>

Adotar práticas sustentáveis e contribuir positivamente para a comunidade.
Inovação e Criatividade:
<br>

Encorajar e implementar ideias novas e criativas para resolver problemas e melhorar produtos/serviços.
Qualidade e Excelência:
<br>

Manter altos padrões de qualidade em todos os aspectos do trabalho e buscar a excelência contínua.
Trabalho em Equipe:
<br>

Valorizar a colaboração e a sinergia entre os membros da equipe para alcançar objetivos comuns.
Desenvolvimento e Crescimento:
<br>

Investir no desenvolvimento profissional dos colaboradores e apoiar seu crescimento pessoal.

        
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
text-align: center; /* Justifica o texto no centro */
font-size: 6rem;
color: #01385C;
}
.about-us-title2 {
text-align: center; /* Justifica o texto no centro */
font-size: 4rem;
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