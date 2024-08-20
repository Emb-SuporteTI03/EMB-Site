<script>
export default {
  data() {
    return {
      initial: {
        scale: 0.5, // Começa pequeno
        x: 100, // Começa da direita
        opacity: 0,
      },
      enter: {
        scale: 1, // Fica no tamanho normal
        x: 0, // Move para a posição final
        opacity: 1,
        transition: {
          scale: {
            duration: 5000, // Duração da animação de escala
            ease: 'ease-out', // Tipo de easing
          },
          x: {
            duration: 7000, // Duração da animação de movimento
            ease: 'ease-out', // Tipo de easing
          },
          opacity: {
            duration: 1000, // Duração da animação de opacidade
          },
        },
        mounted() {
          window.addEventListener('scroll', this.handleScroll);
        },
        unmounted() {
          window.removeEventListener('scroll', this.handleScroll);
        },
      },
    };
    
  },
  methods: {
  }
}
</script>

<template>
  <div class="for-pc-servicos">
      <div class="container-history">
      <hr class="custom-hr">   
      <hr class="custom-hr">    
        <hr class="custom-hr">   
        <h1 class="titulo-nossos-servicos" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
          NOSSOS SERVIÇOS
        </h1>  
        <div class="texto-intro">
              <img draggable="false" src="../../assets/images/deposito_sf.png" class="imagem-intro"/>
              <p class="paragrafo-nossos-servicos-intro" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
                  Bem-vindo à Embalarte, uma empresa inovadora e versátil 
                  no setor de embalagens. Com um portfólio diversificado de produtos, 
                  nos dedicamos a fornecer soluções de embalagem de alta qualidade 
                  que atendem às necessidades específicas de cada cliente. <br>
              </p>
              <img draggable="false" id="galpao_direita" src="../../assets/images/deposito_sf.png" class="imagem-intro"/>
          </div> 
        <hr class="custom-hr">   
          
        <div class="texto-anterior">
          <hr class="custom-hr">   

         <div 
    id="recebimento"
    v-motion-fade-visible-once 
    class="imagem-nossos-servicos">
          <p class="paragrafo-nossos-servicos" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
            Lorem ipsum dolor sit amet, consectetur 
      adipiscing elit. Cras rhoncus tincidunt
       urna sit amet dignissim. Nam lacinia justo 
       eu tellus rutrum eleifend. Proin libero 
       dui, pulvinar ut justo in, dapibus
        consectetur arcu. Cras gravida, massa ac 
        efficitur efficitur, magna tellus ornare mi, 
        ut finibus nisi dolor egestas orci. In a nisi 
        eu lectus elementum convallis eu in mauris. Nam 
        ut tellus eget urna aliquet ultrices. Proin mollis 
        fermentum rhoncus. Quisque dictum enim quis nunc mollis, 
        ac blandit dui aliquam. In et consectetur sem, at 
        efficitur massa. Morbi volutpat consectetur mi, 
        vitae posuere nibh consequat eget. Ut 
        placerat ante ac aliquam imperdiet. Suspendisse 
        massa massa, maximus sed neque non, vulputate 
        fringilla leo. Sed semper, sem ac mattis lacinia, 
        augue arcu facilisis nibh, eu rhoncus nisi odio eget quam.
          </p>

          <img draggable="false" id="caminhao" src="../../assets/images/Novo Projeto (1).png" 
       v-motion
       :initial="initial"
       :enter="enter"
       class="animado">

        </div>   
      <div class="texto-explicacao">
      <img 
      draggable="false" 
      id="blister" 
      src="../../assets/images/lipstick-blister-001-beauty_(1)-transformed.png" 
      v-motion-slide-visible-once-left>
      <p 
      class="paragrafo-nossos-servicos" 
      id="blisters"
      style="font-family: 'Outfit', sans-serif;"
      v-motion-slide-visible-once-bottom>
      Lorem ipsum dolor sit amet, consectetur 
      adipiscing elit. Cras rhoncus tincidunt
       urna sit amet dignissim. Nam lacinia justo 
       eu tellus rutrum eleifend. Proin libero 
       dui, pulvinar ut justo in, dapibus
        consectetur arcu. Cras gravida, massa ac 
        efficitur efficitur, magna tellus ornare mi, 
        ut finibus nisi dolor egestas orci. In a nisi 
        eu lectus elementum convallis eu in mauris. Nam 
        ut tellus eget urna aliquet ultrices. Proin mollis 
        fermentum rhoncus. Quisque dictum enim quis nunc mollis, 
        ac blandit dui aliquam. In et consectetur sem, at 
        efficitur massa. Morbi volutpat consectetur mi, 
        vitae posuere nibh consequat eget. Ut 
        placerat ante ac aliquam imperdiet. Suspendisse 
        massa massa, maximus sed neque non, vulputate 
        fringilla leo. Sed semper, sem ac mattis lacinia, 
        augue arcu facilisis nibh, eu rhoncus nisi odio eget quam.
        </p>
      </div>
        <div v-motion-fade-visible-once class="imagem-nossos-servicos">
          <p 
          class="paragrafo-nossos-servicos" 
          id="armazenagem"
          style="font-family: 'Outfit', sans-serif;" 
          v-motion-slide-visible-once-bottom>
          Lorem ipsum dolor sit amet, consectetur 
      adipiscing elit. Cras rhoncus tincidunt
       urna sit amet dignissim. Nam lacinia justo 
       eu tellus rutrum eleifend. Proin libero 
       dui, pulvinar ut justo in, dapibus
        consectetur arcu. Cras gravida, massa ac 
        efficitur efficitur, magna tellus ornare mi, 
        ut finibus nisi dolor egestas orci. In a nisi 
        eu lectus elementum convallis eu in mauris. Nam 
        ut tellus eget urna aliquet ultrices. Proin mollis 
        fermentum rhoncus. Quisque dictum enim quis nunc mollis, 
        ac blandit dui aliquam. In et consectetur sem, at 
        efficitur massa. Morbi volutpat consectetur mi, 
        vitae posuere nibh consequat eget. Ut 
        placerat ante ac aliquam imperdiet. Suspendisse 
        massa massa, maximus sed neque non, vulputate 
        fringilla leo. Sed semper, sem ac mattis lacinia, 
        augue arcu facilisis nibh, eu rhoncus nisi odio eget quam.
          </p>
          <img draggable="false" src="../../assets/images/3789695.png" v-motion-fade-visible-once class="imagem-nossos-servicos-img">  
        </div>
        <div v-motion-fade-visible-once class="imagem-nossos-servicos">
          <img
          draggable="false" 
          src="../../assets/images/notebook-icon-free-png.webp" 
          id="caderno"
          v-motion-fade-visible-once 
          class="imagem-nossos-servicos-img">  
          <p 
          class="paragrafo-nossos-servicos" 
          id="encadernacao"
          style="font-family: 'Outfit', sans-serif;" 
          v-motion-slide-visible-once-bottom>
          Lorem ipsum dolor sit amet, consectetur 
      adipiscing elit. Cras rhoncus tincidunt
       urna sit amet dignissim. Nam lacinia justo 
       eu tellus rutrum eleifend. Proin libero 
       dui, pulvinar ut justo in, dapibus
        consectetur arcu. Cras gravida, massa ac 
        efficitur efficitur, magna tellus ornare mi, 
        ut finibus nisi dolor egestas orci. In a nisi 
        eu lectus elementum convallis eu in mauris. Nam 
        ut tellus eget urna aliquet ultrices. Proin mollis 
        fermentum rhoncus. Quisque dictum enim quis nunc mollis, 
        ac blandit dui aliquam. In et consectetur sem, at 
        efficitur massa. Morbi volutpat consectetur mi, 
        vitae posuere nibh consequat eget. Ut 
        placerat ante ac aliquam imperdiet. Suspendisse 
        massa massa, maximus sed neque non, vulputate 
        fringilla leo. Sed semper, sem ac mattis lacinia, 
        augue arcu facilisis nibh, eu rhoncus nisi odio eget quam.
          </p>
        </div> 
        <div class="separador"></div> <!-- Separador adicionado aqui -->

      </div>

      </div>
  </div>

  <div class="for-cllr-servicos">
    <hr class="custom-hr">    
    <hr class="custom-hr">    
    <hr class="custom-hr">    
    <hr class="custom-hr">    
    <hr class="custom-hr">    
    <hr class="custom-hr">    
    <hr class="custom-hr">    

    <div class="intro-container-cllr">
      <h1 class="titulo-nossos-servicos" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
        NOSSOS SERVIÇOS
      </h1>  
    </div>

    <div class="texto-intro">
              <p class="paragrafo-nossos-servicos-intro" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
                  Bem-vindo à Embalarte, uma empresa inovadora e versátil 
                  no setor de embalagens. Com um portfólio diversificado de produtos, 
                  nos dedicamos a fornecer soluções de embalagem de alta qualidade 
                  que atendem às necessidades específicas de cada cliente. <br>
              </p>
          </div> 
          <div 
    id="recebimento"
    v-motion-fade-visible-once 
    class="imagem-nossos-servicos">
    
    <img draggable="false" id="caminhao" src="../../assets/images/Novo Projeto (1).png" 
       v-motion
       :initial="initial"
       :enter="enter"
       class="animado">

          <p class="paragrafo-nossos-servicos" id="texto_cm" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
            Recebimento e Armazenagem <br>
            Na Embalarte, reconhecemos o papel crucial que a logística de distribuição e o 
            atendimento eficiente desempenham no sucesso das operações de e-commerce. 
            Oferecemos soluções personalizadas para garantir que seus produtos cheguem 
            ao cliente final de forma rápida e segura.
            Aqui, nosso compromisso é oferecer soluções inovadoras e completas 
            que apoiem o crescimento do seu negócio, especialmente no dinâmico 
            mundo do e-commerce. Confie em nós para ser seu parceiro de confiança 
            em todas as etapas do processo, desde a embalagem até a entrega final.
          </p>

          <div class="separador"></div> <!-- Separador adicionado aqui -->
          <div class="separador"></div> <!-- Separador adicionado aqui -->
        </div> 
  </div>
  </template>
  
<style>

.for-cllr-servicos {
  display: none; 
}
#galpao_direita {
    transform: scaleX(-1); /* Reverte a imagem horizontalmente */
}
.texto-intro {
    display: flex; /* Flexbox for images and text layout */
    align-items: center; /* Center items vertically */
    justify-content: space-between;
    width: 100%; /* Full width of the parent container */
    overflow: hidden; /* Hide overflow if images are too large */
    background-color: rgb(154, 191, 207);
}
.imagem-intro {
    flex: 1; /* Allow images to grow and shrink */
    height: auto; /* Maintain aspect ratio */
    max-width: 100%; /* Ensure images do not exceed viewport width */
    object-fit: cover; /* Ensure images cover the allocated space */
    margin: -60px; /* Remove margin to ensure images touch edges */
}
.paragrafo-nossos-servicos-intro {
    font-size: 1.4rem;
    flex: 1; /* Faz com que o texto ocupe o espaço restante entre as imagens */
    text-align: center; /* Centraliza o texto dentro do parágrafo */
    margin: 0 20px; /* Espaço adicional entre o texto e as imagens */
}
.separador {
    width: 100px; /* Make it full-width or adjust as needed */
}
/* Contêiner de imagens */
.texto-anterior {
    width: 85%; 
    background-color: #D5D5D5;
    border-radius: 80px; 
    border: 3px solid #01395E;
}

#caminhao {
  width: 30%; /* Ajuste para a largura desejada */
  height: auto; /* Mantém a proporção da imagem */
}

#blister {
  width: 30%; /* Ajuste para a largura desejada */
  height: auto; /* Mantém a proporção da imagem */
}
#caderno {
  margin-top: 5%;
  width: 20%; /* Ajuste para a largura desejada */
  height: auto; /* Mantém a proporção da imagem */
  margin-left: 10%;
}
.animado {
  display: inline-block; /* Para permitir o efeito de transformação */
  animation: pulsar 2s infinite; /* Adiciona a animação de pulsação */
}
/* Define a animação de pulsação */
@keyframes pulsar {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1); /* Aumenta um pouco */
  }
  100% {
    transform: scale(1);
  }
}
.container-history {
  display: flex;
  flex-direction: column; /* Alinha os elementos em coluna */
  justify-content: center; /* Centraliza horizontalmente */
  align-items: center; /* Alinha verticalmente */
  text-align: center; /* Centraliza o texto dentro do contêiner */
}
.titulo-nossos-servicos {
  font-size: 6rem;
  color:#01395E;
  justify-content: center; /* Centraliza os parágrafos dentro do contêiner */
  align-items: center; /* Alinha verticalmente os parágrafos no centro */
}
.titulo-nossos-servicos2 {
  font-size: 4rem;
  
}
.texto-explicacao {
  display: flex; /* Torna o contêiner flexível */
  justify-content: center; /* Centraliza os parágrafos dentro do contêiner */
  align-items: center; /* Alinha verticalmente os parágrafos no centro */
  gap: 20px; /* Adiciona espaço entre os parágrafos */
  flex-wrap: wrap; /* Permite que os parágrafos quebrem para a próxima linha em telas menores */
  margin: 20px 80px; /* Ajuste o espaçamento vertical */
}
html {
  overflow-x: hidden;
}
body {
  overflow-x: hidden;
}
.paragrafo-nossos-servicos {
  padding: 0 25%; /* Mantém o padding lateral */
  font-size: 1.1rem;
  text-align: center; /* Centraliza o texto dentro dos parágrafos */
  flex: 1; /* Permite que cada parágrafo ocupe o mesmo espaço */
  min-width: 250px; /* Define uma largura mínima para os parágrafos */
  margin-top: 50px;
  margin-left: -200px;
  margin-right: -120px;
}
.custom-hr {
  background-color: rgba(255, 255, 255, 0);
  color: rgba(255, 255, 255, 0);
}
  /* Contêiner de imagens individuais */

/* Estilo das imagens */
.imagem-nossos-servicos-img {
  width: 30%; /* Ajuste para a largura desejada */
  height:  30%; /* Mantém a proporção da imagem */
  object-fit: contain; /* Ajusta a imagem para caber no contêiner sem cortar */
  border-radius: 10px; 
}
/* Contêiner para centralizar imagens e texto */
.imagem-nossos-servicos {
  display: flex;
  align-items: center;
  justify-content: flex-start; /* Alinha o conteúdo à esquerda */
  margin: 15px 100px; /* Ajuste o espaçamento vertical */
}
@media (max-width: 768px){
  .for-pc-servicos{
    display: none;
  }
  .for-cllr-servicos{
    display: block;
  }
  .intro-container-cllr {
    display: flex;
    justify-content: center; /* Center horizontally */
    align-items: center; /* Center vertically */
    width: 100%; /* Ensure full width of parent container */
    height: 10vh; /* Optional: Full viewport height if needed */
  }
  .texto-intro {
    padding-top: 10%;
    padding-bottom: 10%;
    margin-top: 20%;
  }
  .paragrafo-nossos-servicos-intro {
    margin-left: -10%;
  }
  #recebimento {
    display: block;
    top: 100%
  }
  #caminhao {
    left: 32%;
    top:  5%;
  }
  #texto_cm {
    margin-top: 40%;
    margin-left: -20%;
    margin-right: -25%;
  }
  .titulo-nossos-servicos {
    font-size: 3rem;
    display: flex;
    justify-content: center; /* Center horizontally */
    align-items: center; /* Center vertically */
    text-align: center; /* Ensure text inside is centered */
    margin: 0; /* Remove default margins */
  }
}

  </style>