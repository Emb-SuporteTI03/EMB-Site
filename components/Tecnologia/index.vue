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
        <hr class="custom-hr">   
        <h1 class="titulo-nassas-tecnologias" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
          NOSSAS TECNOLOGIAS
        </h1>  
        <div class="texto-intro-tecnologias">
              <img draggable="false" id="celular" src="../../assets/images/celular.png" class="imagem-intro-tec"/>
              <p class="paragrafo-tecnologias-intro" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
                  Bem-vindo à Embalarte, uma empresa inovadora e versátil 
                  no setor de embalagens. Com um portfólio diversificado de produtos, 
                  nos dedicamos a fornecer soluções de embalagem de alta qualidade 
                  que atendem às necessidades específicas de cada cliente. <br>
              </p>
              <img draggable="false" id="notebook" src="../../assets/images/notebook.png" class="imagem-intro-tec"/>
          </div> 
        <div class="texto-tecnologias">

    <div 
    id="recebimento"
    v-motion-fade-visible-once 
    class="imagem-nossos-servicos">
          <p class="paragrafo-nossas-tecnologias" id="texto_cm" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
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
          <img draggable="false" src="../../assets/images/tablet.png" v-motion-fade-visible-once class="imagem-nossos-servicos-img">  



        </div>   
      <div class="texto-explicacao">
        <img draggable="false" src="../../assets/images/app.jpeg" id="app-img" v-motion-fade-visible-once class="imagem-nossos-servicos-img">  
      <p 
      class="paragrafo-nossas-tecnologias" 
      id="blisters"
      style="font-family: 'Outfit', sans-serif;"
      v-motion-slide-visible-once-bottom>
      APLICATIVO PRÓPRIO <br>
          Entre nossos produtos, destacamos a fabricação de blisters, uma solução 
          ideal para proteger e exibir produtos de maneira eficaz. Os blisters são 
          amplamente utilizados em diversos setores, incluindo farmacêutico, 
          cosmético, eletrônico e de consumo, por sua capacidade de garantir 
          segurança e visibilidade ao produto.
        </p>
      </div>
        <div v-motion-fade-visible-once class="imagem-nossos-servicos">
          <p 
          class="paragrafo-nossas-tecnologias" 
          id="armazenagem"
          style="font-family: 'Outfit', sans-serif;" 
          v-motion-slide-visible-once-bottom>
            USO E DESENVOLVIMENTO DE API<br>
            Na Embalarte, compreendemos a importância do processo de 
            recebimento e armazenagem para garantir a integridade dos 
            produtos antes de serem embalados. Nosso sistema de logística 
            é projetado para otimizar cada etapa, desde a chegada de materiais 
            até o armazenamento eficiente em nosso depósito.
          </p>
          <img draggable="false" src="../../assets/images/api.png" v-motion-fade-visible-once class="imagem-nossos-servicos-img">  
        </div>
        <div class="separador"></div> <!-- Separador adicionado aqui -->

      </div>

      </div>
  </template>
  
  <style>

#notebook {
  transform: scaleX(-1); /* Reverte a imagem horizontalmente */
  width: 15%; /* Ensure images do not exceed viewport width */
  margin-right: 6%;
}

#celular {
  height: 32vh; /* Maintain aspect ratio */
  width: auto; /* Ensure images do not exceed viewport width */
  margin-left: 6%;
}

.texto-intro-tecnologias {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 35vh;
  background-color: rgb(154, 191, 207);
}

.paragrafo-tecnologias-intro {
  display: flex;
  align-items: center;
  justify-content: center;
}
.texto-intro-tecnologias p {
  width: 40%; /* Ajuste o valor conforme necessário */
  text-align: center; /* Opcional: centraliza o texto dentro do parágrafo */
}

.imagem-intro-tec {
  width: 150px; /* Define uma largura fixa para as imagens, ajuste conforme necessário */
  height: auto; /* Mantém a proporção da imagem */
}

.separador {
    width: 100px; /* Make it full-width or adjust as needed */
  }

  /* Contêiner de imagens */
  .texto-tecnologias {
    margin-left: 12%; /* Espaço à esquerda */
    margin-right: 12%; /* Espaço à direita */  
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
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

#app-img {
  border: 5px solid black; /* Adiciona uma borda preta de 5 pixels ao redor da imagem */
  width: 25%; /* Ajuste a largura da imagem conforme necessário */
  height: auto; /* Mantém a proporção da imagem com base na largura */
  /* Se você quiser definir uma altura específica e manter a proporção, use: */
  /* height: 200px; */
  /* width: auto; */
}


  .titulo-nassas-tecnologias {
  font-size: 6rem;
  color:#01395E;
  justify-content: center; /* Centraliza os parágrafos dentro do contêiner */
  align-items: center; /* Alinha verticalmente os parágrafos no centro */
  }
  .titulo-nassas-tecnologias2 {
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


.paragrafo-nossas-tecnologias {
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