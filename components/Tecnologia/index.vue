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
  <div class="container-tecnologia">
    <hr class="custom-hr">   
    <hr class="custom-hr">   
    <hr class="custom-hr">   

    <h1 class="titulo-nossas-tecnologias" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
      NOSSAS TECNOLOGIAS
    </h1>  

    <div class="texto-intro-tecnologias">
      <div class="item-tecnologia">
        <img draggable="false" id="celular" src="../../assets/images/celular.png" class="imagem-intro-tec"/>
      </div>
      <div class="item-tecnologia">
        <p class="paragrafo-tecnologias-intro" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
          Bem-vindo à Embalarte, uma empresa inovadora e versátil 
          no setor de embalagens. Com um portfólio diversificado de produtos, 
          nos dedicamos a fornecer soluções de embalagem de alta qualidade 
          que atendem às necessidades específicas de cada cliente. <br>
        </p>
      </div>
      <div class="item-tecnologia">
        <img draggable="false" id="notebook" src="../../assets/images/notebook.png" class="imagem-intro-tec"/>
      </div>
    </div> 
    
    <div class="texto-tecnologias">

    <div class="nossas_tecnologias">
      <p class="paragrafo-nossas-tecnologias_esquerda" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
      <strong>Recebimento e Armazenagem</strong> <br>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ornare venenatis iaculis. Phasellus tempor bibendum enim, id sodales dui posuere nec. Curabitur rhoncus, erat ut hendrerit fermentum, arcu dolor gravida tortor, quis placerat ipsum libero non risus. Ut fringilla elit vestibulum ipsum finibus, quis tempor eros iaculis. Curabitur in purus sit amet nunc venenatis rutrum. Ut vitae eros at ex varius bibendum nec a arcu. Cras ut viverra sem.
      
      </p>
      <img draggable="false" src="../../assets/images/tablet.png" v-motion-fade-visible-once class="nossas_tecnologias-img">  
    </div>   

    <div class="nossas_tecnologias">
      <img draggable="false" id="appEmb" src="../../assets/images/app.jpeg" v-motion-fade-visible-once class="nossas_tecnologias-img">  
      <p class="paragrafo-nossas-tecnologias_direita" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
      <strong>APLICATIVO PRÓPRIO</strong> <br>
      Suspendisse et condimentum quam. Nunc pretium aliquam tellus non condimentum. Ut condimentum neque lobortis sem pretium pretium. Vivamus tincidunt sem mauris, at viverra nibh tristique et. Sed tortor lacus, interdum vel porttitor vel, sodales non nulla. Suspendisse in libero ipsum. Integer lobortis malesuada nibh sit amet consectetur. Donec sit amet urna tellus. Vivamus vehicula id ipsum ac viverra. Mauris ut ligula et tellus maximus lobortis. Proin condimentum nunc dui, sit amet ultricies mauris interdum vitae. Duis vitae ipsum lobortis, imperdiet ex eget, ornare massa. Integer sapien nunc, maximus ut feugiat et, hendrerit sed ante.
    </p>
    </div>

    <div class="nossas_tecnologias">
      <p class="paragrafo-nossas-tecnologias_esquerda" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
        <strong>USO E DESENVOLVIMENTO DE API</strong><br>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ornare venenatis iaculis. Phasellus tempor bibendum enim, id sodales dui posuere nec. Curabitur rhoncus, erat ut hendrerit fermentum, arcu dolor gravida tortor, quis placerat ipsum libero non risus. Ut fringilla elit vestibulum ipsum finibus, quis tempor eros iaculis. Curabitur in purus sit amet nunc venenatis rutrum. Ut vitae eros at ex varius bibendum nec a arcu. Cras ut viverra sem.
      </p>
      <img draggable="false" src="../../assets/images/api.png" v-motion-fade-visible-once class="nossas_tecnologias-img">  
    </div>
  </div>

</div>
  </template>
  
  <style>
.custom-hr {
  background-color: rgba(255, 255, 255, 0);
  color: rgba(255, 255, 255, 0);
}

.titulo-nossas-tecnologias {
  font-size: 6rem;
  color:#01395E;
  justify-content: center; /* Centraliza os parágrafos dentro do contêiner */
  align-items: center; /* Alinha verticalmente os parágrafos no centro */
}

.item-tecnologia {
  flex: 1; /* Faz com que cada item ocupe uma parte igual do espaço disponível */
  display: flex;
  justify-content: center; /* Centraliza o conteúdo dentro do item */
  align-items: center; /* Alinha verticalmente o conteúdo no centro */
}

.imagem-intro-tec {
  max-width: 100%; /* Garante que as imagens não excedam o tamanho do contêiner */
  height: auto; /* Mantém a proporção das imagens */
}

#notebook {
  transform: scaleX(-1); /* Reverte a imagem horizontalmente */
  width: 40%; /* Ensure images do not exceed viewport width */
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

/* Contêiner para centralizar imagens e texto */
.nossas_tecnologias {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 5% 10%; /* Ajuste o espaçamento vertical */
}

.paragrafo-tecnologias-intro {
  font-size: 1.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
}


.texto-tecnologias {
  margin-left: 12%; /* Espaço à esquerda */
  margin-right: 12%; /* Espaço à direita */  
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

#appEmb {
  border: 2px solid #01395E; /* Borda tracejada de 2px com cor azul */
}

.paragrafo-nossas-tecnologias_esquerda {
  margin-left: 5%; /* Espaço à esquerda */
  margin-right: 7%; /* Espaço à direita */  
}

.paragrafo-nossas-tecnologias_direita {
  margin-left: 5%; /* Espaço à esquerda */
  margin-right: 7%; /* Espaço à direita */  
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

.container-tecnologia {
  display: flex;
  flex-direction: column; /* Alinha os elementos em coluna */
  justify-content: center; /* Centraliza horizontalmente */
  align-items: center; /* Alinha verticalmente */
  text-align: center; /* Centraliza o texto dentro do contêiner */
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

/* Estilo das imagens */
.nossas_tecnologias-img {
  width: 20%; /* Ajuste para a largura desejada */
  height: auto; /* Mantém a proporção da imagem */
  object-fit: contain; /* Ajusta a imagem para caber no contêiner sem cortar */
}
  
  </style>