<script>
export default {
  mounted() {
    window.scrollTo(0, 0);
  }
}
</script>

<template>
      <div class="container-history">
        <hr class="custom-hr">    
        <hr class="custom-hr">   
        <hr class="custom-hr">   
        <div class="texto-anterior">
        <h1 class="titulo-nossos-servicos" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
          NOSSOS SERVIÇOS
        </h1>
        <div class="textos">
        <div class="texto-intro">
        <p class="paragrafo-nossos-servicos-intro" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
          Bem-vindo à Embalarte, uma empresa inovadora e versátil 
          no setor de embalagens. Com um portfólio diversificado de produtos, 
          nos dedicamos a fornecer soluções de embalagem de alta qualidade 
          que atendem às necessidades específicas de cada cliente. <br>
        </p>
      </div>      
    </div>
      <div class="texto-explicacao">
      <img draggable="false" src="../../assets/images/2.4-Stores-EMBALARTE.png" v-motion-fade-visible-once class="imagem-nossos-servicos-img">
      <p class="paragrafo-nossos-servicos" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
          Entre nossos produtos, destacamos a fabricação de blisters, uma solução 
          ideal para proteger e exibir produtos de maneira eficaz. Os blisters são 
          amplamente utilizados em diversos setores, incluindo farmacêutico, 
          cosmético, eletrônico e de consumo, por sua capacidade de garantir 
          segurança e visibilidade ao produto.
        </p>
      </div>
        <div v-motion-fade-visible-once class="imagem-nossos-servicos">
          <p class="paragrafo-nossos-servicos" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
            Recebimento e Armazenagem <br>
            Na Embalarte, compreendemos a importância do processo de 
            recebimento e armazenagem para garantir a integridade dos 
            produtos antes de serem embalados. Nosso sistema de logística 
            é projetado para otimizar cada etapa, desde a chegada de materiais 
            até o armazenamento eficiente em nosso depósito.
          </p>
          <img draggable="false" src="../../assets/images/2.1-Stores-EMBALARTE.png" v-motion-fade-visible-once class="imagem-nossos-servicos-img">  
        </div>
        <div v-motion-fade-visible-once class="imagem-nossos-servicos">
          <img draggable="false" src="../../assets/images/2.2-Stores-EMBALARTE.png  " v-motion-fade-visible-once class="imagem-nossos-servicos-img">  
          <p class="paragrafo-nossos-servicos" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
            Além de nossas soluções de embalagem, a Embalarte também 
            oferece serviços especializados em encadernação, atendendo 
            a diversas necessidades de apresentação de documentos.
            Nossa equipe é especializada em oferecer acabamentos precisos 
            e de alta qualidade, assegurando que cada encadernação atenda 
            aos padrões estéticos e funcionais desejados por nossos clientes.
          </p>
        </div> 
        <div v-motion-fade-visible-once class="imagem-nossos-servicos">
          <p class="paragrafo-nossos-servicos" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
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
          <img draggable="false" src="../../assets/images/2.5-Stores-EMBALARTE.png" v-motion-fade-visible-once class="imagem-nossos-servicos-img">  
        </div>   
      </div>

      </div>
  </template>
  
  <style>
  /* Contêiner de imagens */
  .texto-anterior {
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background: linear-gradient(
    to bottom, /* Direção do gradiente */
    white 0%, /* Branco no topo */
    rgb(226, 226, 226) 20%, /* Cinza no meio */
    rgb(228, 228, 228) 100% /* Branco na base */
  );
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
}

.texto-intro {
  font-size: 1.7rem;
  padding: 0 30%; /* Mantém o padding lateral */
  display: flex; /* Torna o contêiner flexível */
  justify-content: center; /* Centraliza os parágrafos dentro do contêiner */
  align-items: center; /* Alinha verticalmente os parágrafos no centro */
  gap: 20px; /* Adiciona espaço entre os parágrafos */
  flex-wrap: wrap; /* Permite que os parágrafos quebrem para a próxima linha em telas menores */
}

.paragrafo-nossos-servicos {
  padding: 0 25%; /* Mantém o padding lateral */
  font-size: 1.4rem;
  text-align: center; /* Centraliza o texto dentro dos parágrafos */
  flex: 1; /* Permite que cada parágrafo ocupe o mesmo espaço */
  min-width: 250px; /* Define uma largura mínima para os parágrafos */
}
  .custom-hr {
  background-color: rgba(255, 255, 255, 0);
  color: rgba(255, 255, 255, 0);
  }
  /* Contêiner de imagens individuais */
  .imagem-nossos-servicos {
  display: flex;
  gap: 10px; /* Espaço entre as imagens */
  justify-content: center; /* Centraliza as imagens horizontalmente */
  flex-wrap: wrap; /* Permite que as imagens quebrem para a linha seguinte se necessário */
  
  }
  
  /* Estilo das imagens */
  .imagem-nossos-servicos-img {
  width: 20%; /* Define a largura desejada */
  height: 20%; /* Define a altura desejada */
  object-fit: contain; /* Ajusta a imagem para caber no contêiner sem cortar */
  border-radius: 10px; 
  }
  
  </style>