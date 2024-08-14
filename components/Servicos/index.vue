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
      <div class="container-history">
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
        <div class="texto-anterior">

    <div 
    id="recebimento"
    v-motion-fade-visible-once 
    class="imagem-nossos-servicos">
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
          Entre nossos produtos, destacamos a fabricação de blisters, uma solução 
          ideal para proteger e exibir produtos de maneira eficaz. Os blisters são 
          amplamente utilizados em diversos setores, incluindo farmacêutico, 
          cosmético, eletrônico e de consumo, por sua capacidade de garantir 
          segurança e visibilidade ao produto.
        </p>
      </div>
        <div v-motion-fade-visible-once class="imagem-nossos-servicos">
          <p 
          class="paragrafo-nossos-servicos" 
          id="armazenagem"
          style="font-family: 'Outfit', sans-serif;" 
          v-motion-slide-visible-once-bottom>
            Recebimento e Armazenagem <br>
            Na Embalarte, compreendemos a importância do processo de 
            recebimento e armazenagem para garantir a integridade dos 
            produtos antes de serem embalados. Nosso sistema de logística 
            é projetado para otimizar cada etapa, desde a chegada de materiais 
            até o armazenamento eficiente em nosso depósito.
          </p>
          <img draggable="false" src="../../assets/images/3789695.png" v-motion-fade-visible-once class="imagem-nossos-servicos-img">  
        </div>
        <div v-motion-fade-visible-once class="imagem-nossos-servicos">
          <img draggable="false" src="../../assets/images/notebook-icon-free-png.webp" v-motion-fade-visible-once class="imagem-nossos-servicos-img">  
          <p 
          class="paragrafo-nossos-servicos" 
          id="encadernacao"
          style="font-family: 'Outfit', sans-serif;" 
          v-motion-slide-visible-once-bottom>
            Além de nossas soluções de embalagem, a Embalarte também 
            oferece serviços especializados em encadernação, atendendo 
            a diversas necessidades de apresentação de documentos.
            Nossa equipe é especializada em oferecer acabamentos precisos 
            e de alta qualidade, assegurando que cada encadernação atenda 
            aos padrões estéticos e funcionais desejados por nossos clientes.
          </p>
        </div> 
        <div class="separador"></div> <!-- Separador adicionado aqui -->

      </div>

      </div>
  </template>
  
  <style>

#galpao_direita {
    transform: scaleX(-1); /* Reverte a imagem horizontalmente */
}

.texto-intro {
    display: flex; /* Flexbox for images and text layout */
    align-items: center; /* Center items vertically */
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
    flex: 2; /* Allow text to take up more space */
    text-align: center; /* Center text if needed */
    margin: 0 10px; /* Space between text and images */
}


.separador {
    width: 100px; /* Make it full-width or adjust as needed */
  }

  /* Contêiner de imagens */
  .texto-anterior {
    margin-left: 12%; /* Espaço à esquerda */
    margin-right: 12%; /* Espaço à direita */  
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background: 
        /* Gradiente horizontal: Branco nas laterais e cinza no centro */
        linear-gradient(to right, white 0%, white 25%, rgb(226, 226, 226) 50%, white 75%, white 100%),
        /* Gradiente vertical: Branco no topo e cinza no centro */
        linear-gradient(to bottom, white 0%, rgb(226, 226, 226) 50%, rgb(228, 228, 228) 100%);

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
  .textos {
    background: linear-gradient(
    to bottom, /* Direção do gradiente */
    rgb(228, 228, 228) 0% /* Branco na base */
    rgb(114, 114, 114) 50%, /* Cinza no meio */
    rgb(255, 255, 255) 100%, /* Cinza no meio */
  );
  }
.container-history {
  display: flex;
  flex-direction: column; /* Alinha os elementos em coluna */
  justify-content: center; /* Centraliza horizontalmente */
  align-items: center; /* Alinha verticalmente */
  text-align: center; /* Centraliza o texto dentro do contêiner */
}

/* CSS for positioning the image */
#caminhao {
  position: fixed; /* Fix the image to the viewport */
  right: -120px; /* Align to the right side of the viewport */
  margin-top: -150px;
  width: 40%; /* Set the initial width of the image */
  transition: transform 0.3s ease-in-out; /* Smooth scaling transition */
  z-index: 1000; /* Ensure the image is above other content */
}

#blister {
  width: 30%; /* Set the initial width of the image */
  transition: transform 0.3s ease-in-out; /* Smooth scaling transition */
  z-index: 100; /* Ensure the image is above other content */
}


  .titulo-nossos-servicos {
  font-size: 6rem;
  color:rgb(7, 7, 100);
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
  margin-left: -270px;
  margin-right: -75px;
  margin-bottom: 150px;
}
#recebimento {
  margin-left: 10px;
  margin-right: 10%;  
}

#blisters {
  margin-left: -15%;
  margin-right: -25%;
  margin-top: 12%; 
}

#armazenagem {
  margin-left: -30%;
  margin-right: -5%;
  margin-top: 15%; 
}

#encadernacao {
  margin-left: -10%;
  margin-right: -25%;
  margin-top: 15%; 
}

  .custom-hr {
  background-color: rgba(255, 255, 255, 0);
  color: rgba(255, 255, 255, 0);
  }
  /* Contêiner de imagens individuais */
.imagem-nossos-servicos-img {
  width: 100%; /* Ajuste para a largura desejada */
  height: auto; /* Mantém a proporção da imagem */
  object-fit: contain; /* Ajusta a imagem para caber no contêiner sem cortar */
  border-radius: 10px; 
}

/* Estilo das imagens */
.imagem-nossos-servicos-img {
  width: 20%; /* Ajuste para a largura desejada */
  height: auto; /* Mantém a proporção da imagem */
  object-fit: contain; /* Ajusta a imagem para caber no contêiner sem cortar */
  border-radius: 10px; 
}

/* Contêiner para centralizar imagens e texto */
.imagem-nossos-servicos {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 80px; /* Ajuste o espaçamento vertical */
}
  
  </style>