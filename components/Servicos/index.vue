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

    scrollToSection(sectionId) {
      // Navegar para a página desejada
      this.$router.push('/Nossos-Servicos').then(() => {
        // Rolar suavemente até a seção desejada
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
    
  }
}
</script>

<template>
      <div class="container-history">
      <hr class="custom-hr">   
      <hr class="custom-hr">    
        <hr class="custom-hr">   
        <h1 class="titulo-nossos-servicos" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
          NOSSOS SERVIÇOS
        </h1>  
        <div class="texto-intro">
              <img draggable="false" src="../../assets/images/deposito_sf.png" class="imagem-intro"/>
              <p style="font-family: 'Outfit', sans-serif;">
                  Bem-vindo à Embalarte, uma empresa inovadora e versátil 
                  no setor de embalagens. Com um portfólio diversificado de produtos, 
                  nos dedicamos a fornecer soluções de embalagem de alta qualidade 
                  que atendem às necessidades específicas de cada cliente. <br>
              </p>
              <img draggable="false" id="galpao_direita" src="../../assets/images/deposito_sf.png" class="imagem-intro"/>
        </div> 
        <hr class="custom-hr" id="Armazenagem">   
        <hr class="custom-hr2">
        
        <div class="texto-servicos">

        <div class="nossos_servicos">
          <p class="paragrafo-nossos-servicos_esquerda" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
        <h2>Armazenagem</h2>

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
          <img draggable="false"src="../../assets/images/armazenagem_servicos.jpg"  id="armazenagem" class="imagem-intro">
        </div>
        <hr class="custom-hr2"  id="Picking_Packing">
        <hr class="custom-hr2">
       

        <div class="nossos_servicos">
        <img src="../../assets/images/pickPack.jpg">
        <p 
        class="paragrafo-nossos-servicos_direita" 
        style="font-family: 'Outfit', sans-serif;"
        v-motion-slide-visible-once-bottom>
        <h2>Picking e Packing e Cross-Docking</h2>
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

        <hr class="custom-hr" id="Atendimento_E-Commerce">   
        <hr class="custom-hr2">
        <div class="nossos_servicos">
          <p class="paragrafo-nossos-servicos_esquerda" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
        <h2>Atendimento E-commerce</h2>

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
          <img draggable="false" src="../../assets/images/e-commerce.jpg" v-motion-fade-visible-once class = "nossos_servicos-img">  
        </div>


        <hr class="custom-hr" id="Manuseio_e_Kits">   
        <hr class="custom-hr2">

        <div class="nossos_servicos">
          <img draggable="false"  src="../../assets/images/manuseio7.png" 
          v-motion-fade-visible-once class = "nossos_servicos-img"> 
          <p class="paragrafo-nossos-servicos_direita" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
        <h2>Manuseios Diversos e Montagem de Kits</h2>
         
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

        <hr class="custom-hr" id="Logistica_Promocional">   
        <hr class="custom-hr2">

        <div class="nossos_servicos">
          <p class="paragrafo-nossos-servicos_esquerda" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
        <h2>Logistica Promocional</h2>

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
          <img draggable="false" src="../../assets/images/logistica.jpg" v-motion-fade-visible-once class = "nossos_servicos-img"> 
        </div>

        <hr class="custom-hr" id="Envaze_e_Blister">   
        <hr class="custom-hr2">

        <div class="nossos_servicos">
          <img draggable="false" src="../../assets/images/bisnaga.png" v-motion-fade-visible-once class = "nossos_servicos-img"> 
          <p class="paragrafo-nossos-servicos_direita" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
        <h2>Envaze e Blister</h2>

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

        <hr class="custom-hr" id="Encadernacao">   
        <hr class="custom-hr2">


        <div class="nossos_servicos">
          <p class="paragrafo-nossos-servicos_esquerda" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
            <h2>Encadernações em Espiral</h2>
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
          <img draggable="false" src="../../assets/images/caderno.png" v-motion-fade-visible-once class = "nossos_servicos-img"> 

        </div>

        <hr class="custom-hr" id="Etiquetagem">   
        <hr class="custom-hr2">

        <div class="nossos_servicos">
          <img draggable="false" src="../../assets/images/etiquetagem.png" v-motion-fade-visible-once class = "nossos_servicos-img"> 
          <p class="paragrafo-nossos-servicos_direita" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
            <h2>Etiquetagem e Rótulagem</h2>
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

        <hr class="custom-hr" id="Gravacao">   
        <hr class="custom-hr2">


        <div class="nossos_servicos">
          <p class="paragrafo-nossos-servicos_esquerda" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
            <h2>Gravação Inkjet</h2>
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
          <img draggable="false" src="../../assets/images/inkjet-removebg-preview.png" v-motion-fade-visible-once class = "nossos_servicos-img"> 

        </div>
        
        <hr class="custom-hr" id="Distribuicao">   
        <hr class="custom-hr2">


        <div class="nossos_servicos">
          <img draggable="false"src="../../assets/images/Novo Projeto (1).png" 
          v-motion
          :initial="initial"
          :enter="enter"
          class="animado">
          <p class="paragrafo-nossos-servicos_direita" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
            <h2>Distribuição em Nível Nacional</h2>
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
      </div>
    </div>


  <div class="container-tecnologia" id="Secao_Tecnologia">
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

#galpao_direita {
    transform: scaleX(-1); /* Reverte a imagem horizontalmente */
}
#armazenagem {
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
.texto-intro p {
  font-size: 1.4rem;
}
.imagem-intro {
    flex: 1; /* Allow images to grow and shrink */
    height: auto; /* Maintain aspect ratio */
    max-width: 100%; /* Ensure images do not exceed viewport width */
    object-fit: cover; /* Ensure images cover the allocated space */
    margin: -60px; /* Remove margin to ensure images touch edges */
}

.nossos_servicos img {
  width: 30%; /* Ajuste para a largura desejada */
  height: auto; /* Mantém a proporção da imagem */
  object-fit: contain; /* Ajusta a imagem para caber no contêiner sem cortar */
}

.nossos_servicos{
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 5% 10%; /* Ajuste o espaçamento vertical */
}

.separador {
    width: 100px; /* Make it full-width or adjust as needed */
}
/* Contêiner de imagens */
.nossos_servicos {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 5% 10%; /* Ajuste o espaçamento vertical */
}

.texto-servicos {
  margin-left: 12%; /* Espaço à esquerda */
  margin-right: 12%; /* Espaço à direita */  
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
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
  width: 30%; /* Ajuste para a largura desejada */
  height:  30%; /* Mantém a proporção da imagem */
  margin-bottom: 10%;
  object-fit: contain; /* Ajusta a imagem para caber no contêiner sem cortar */
  border-radius: 10px; 
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

.paragrafo-nossos-servicos_esquerda {
  margin-left: 5%; /* Espaço à esquerda */
  margin-right: 7%; /* Espaço à direita */  
}

.paragrafo-nossos-servicos_direita {
  margin-left: 5%; 
  margin-right: 7%;  
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