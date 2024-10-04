<script>
export default {
  data() {
    return {
      volume: 0,
      isDropdownActive: false,
      isSubDropdownActive: false,
      mapAtual: '1',
      contato: {
        nome: '',
        email: '',
        mensagem: ''
      },
      login: {
        usuario: '',
        senha: ''
      }
    };
  },
  methods: {
      togglePlayPause() {
      const video = this.$refs.autoPlayVideo;
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    },
    updateVolume() {
      const video = this.$refs.autoPlayVideo;
      video.volume = this.volume / 100; // Convert volume to 0.0 - 1.0 range
      console.log('o volume agora é: ', video.volume)
    },
    toggleDropdown() {
      this.isDropdownActive = !this.isDropdownActive;
    },
    updateMapValue(value, event) {
      // Update the global variable
      this.mapAtual = value;
      const allLinks = document.querySelectorAll('.lista-cidades a');
      allLinks.forEach(link => link.classList.remove('selected'));
      
      const clickedLink = event.target;
      clickedLink.classList.add('selected');
    },
    handleIntersection(entries) {
      entries.forEach(entry => {
        const video = this.$refs.autoPlayVideo;
        if (entry.isIntersecting) {
          // Video enters the viewport - play the video
          video.play();
        } else {
          // Video leaves the viewport - pause the video
          video.pause();
        }
      });
    },
    handleMouseMove(event) {
      const circle = this.$el;
      const { clientX: x, clientY: y } = event;

      circle.style.left = `${x}px`;
      circle.style.top = `${y}px`;
    },

  },
  mounted() {
    document.addEventListener('mousemove', this.handleMouseMove);

    this.updateVolume(); // Define o volume inicial

    // Verifica se o navegador suporta IntersectionObserver
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(this.handleIntersection, { threshold: 0.5 });

      // Inicia a observação do elemento de vídeo
      observer.observe(this.$refs.autoPlayVideo);
    } else {
      // Fallback: Se o IntersectionObserver não for suportado, reproduz o vídeo sem verificar a visibilidade
      this.$refs.autoPlayVideo.play();
    }
  },
  beforeDestroy() {
  },
};

</script>

<template>
  <main>

    <div class = "for-pc">
      <div class="about-us-section" id="aboutUs">
      <div class="about-us-container">
        <div class="quem-somos-txt">
          <h1 class="about-us-title" v-motion-slide-visible-once-bottom>QUEM SOMOS</h1>
          <hr class="about-us-divider">
          <p class="about-us-paragraph" v-motion-slide-visible-once-bottom>
            A EMBALARTE nasceu do sonho de Fernando Alves Vieira em criar uma empresa forte e sólida, para oferecer 
            ao mercado soluções completas e personalizadas. Fundada em 1999 e com mais de 25 anos de experiência, vem conquistado 
            seu espaço como uma das melhores empresas no segmento. Situada na Cidade de Santana de Paranaíba no Estado de 
            São Paulo, dispõe em sua planta própria, 4.000m2 de área. Localizada próximo as rodovias Anhanguera e Bandeirantes 
            e de fácil acesso ao Rodoanel, possibilita agilidade no processo de distribuição e transporte dos materiais. 
            Equipamentos de ponta, funcionários treinados e qualificados, gestão e tecnologia completam a estrutura voltada para 
            atingir excelência em todas as operações realizadas. Tudo isto atrelado ao atendimento personalizado dos gestores que 
            são treinados para buscar a melhor solução de acordo com a necessidade dos nossos clientes.
          </p>
        </div>
        <div class="video-container">
          <!-- Add ref to video element -->
          <video 
          ref="autoPlayVideo" 
          preload="auto" 
          autoplay 
          @click="togglePlayPause"
          style="cursor: pointer;"
        >
          <source src="../../assets/images/videoEmb.mp4" type="video/mp4">
          Your browser does not support the video tag.
        </video>
        <div class="volume-video">
        <i class="bi bi-volume-down" style="font-size: 2.4rem;"></i>
            <input 
            type="range" 
            min="0" 
            max="100" 
            v-model="volume" 
            @input="updateVolume"
          />
          </div>
        </div>
      </div>
    </div>
    <div  class="local-section">
      <div class="caixa-mapa">
        <div class="map-box">
          <iframe class="mapa"
            v-if="mapAtual == 1"
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d460.678557502492!2d-46.88537203440607!3d-23.403045692778065!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cf1c60570bde1f%3A0x5aa53ca281712703!2sGRUPO%20EMBALARTE!5e1!3m2!1spt-BR!2sbr!4v1727880282949!5m2!1spt-BR!2sbr"
            allowfullscreen loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            draggable="false"
          ></iframe>  

          <iframe class="mapa"
            v-if="mapAtual == 2"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d911.2457160832454!2d-46.76151485984224!3d-23.48653332479644!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cefea4ba9775b9%3A0x6a406eae9c012bde!2sAv.%20Jornalista%20Paulo%20Zingg%2C%20946%20-%20Jardim%20Jaragua%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2005157-030!5e1!3m2!1spt-BR!2sbr!4v1724785866527!5m2!1spt-BR!2sbr"
            allowfullscreen loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            draggable="false"
          ></iframe>  

          <iframe class="mapa"
            v-if="mapAtual == 3"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1827.2562987508402!2d-45.76307128105925!3d-23.139376013124085!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cc4de55cbd9cb9%3A0x6a121faa2b04301b!2zU29tb3MgRWR1Y2HDp8OjbyAtIENlbnRybyBkZSBEaXN0cmlidWnDp8Ojbw!5e1!3m2!1spt-BR!2sbr!4v1724786136908!5m2!1spt-BR!2sbr"
            allowfullscreen loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            draggable="false"
          ></iframe>  
          <iframe class="mapa"
            v-if="mapAtual == 4"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117214.19914789771!2d-46.96267711347425!3d-23.35405332990589!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cf1e958732e083%3A0xef1224749a327978!2sCajamar%2C%20State%20of%20S%C3%A3o%20Paulo!5e0!3m2!1sen!2sbr!4v1723553685528!5m2!1sen!2sbr"
            allowfullscreen loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            draggable="false"
          ></iframe>  

        </div>
      </div>
      <iframe class="mapa-cel"
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14646.357919884578!2d-46.8853484!3d-23.4030639!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cf1c60570bde1f%3A0x5aa53ca281712703!2sGRUPO%20EMBALARTE!5e0!3m2!1spt-BR!2sbr!4v1720455342886!5m2!1spt-BR!2sbr"
            allowfullscreen loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
      ></iframe>
      <div class="text-overlay">
        <strong class="filiais-txt" id="about-us-nos">NÓS, DO GRUPO EMBALARTE</strong>
        <strong class="filiais-txt" id="localTexto">TEMOS NOSSA MATRIZ EM<br> </strong>
          <ul class="lista-cidades">
            <li><a @click.prevent="updateMapValue('1', $event)" style="font-size: 1.6rem;">📌 Santana de Parnaíba</a></li>
          </ul>
           <strong class="filiais-txt" id="localTexto">
          E ESTAMOS PRESENTES EM OUTRAS 3 CIDADES <br> NO ESTADO DE SÃO PAULO!</strong>
        <ul class="lista-cidades">
          <li><a @click.prevent="updateMapValue('2', $event)" style="font-size: 1.6rem;">📌 São Paulo</a></li>
          <li><a @click.prevent="updateMapValue('3', $event)" style="font-size: 1.6rem;">📌 São José dos Campos</a></li>
          <li><a @click.prevent="updateMapValue('4', $event)" style="font-size: 1.6rem;">📌 Cajamar</a></li>
        </ul>
    <hr class="custom-hr">
    <hr class="custom-hr">
    <hr class="custom-hr">
      </div>    
    </div>
    <div class="diferenciais">
      <h1 class="diferenciais-titulo">NOSSOS DIFERENCIAIS</h1>
      <br>
      <br>
      <br>
      <div class="grid-container">
      <div class="grid-item">🏢 Unidade própria com 4.000m²</div>
      <div class="grid-item">👥 Equipe treinada e qualificada</div>
      <div class="grid-item">🏭 Modernas instalações</div>
      <div class="grid-item">🚗 Próximo às Rodovias Anhanguera e Bandeirantes</div>
      <div class="grid-item">🚛 Docas com facilidade de acesso para carga e descarga</div>
      <div class="grid-item">📱 Controle por software e aplicativos mobile</div>
    </div>
    <br>
    <br>
    <br>
</div>
</div>


    <div class="espaco-cell">
      <br>
      <br>
      <br>
    <img src="../../assets/images/grupoembalarte_cover.jpg" v-motion-fade-visible-once alt="Imagem de Quem Somos" id="ImgTexto">

        <p id="paragrafo" class="quem-somos-txt" v-motion-slide-visible-once-bottom>
          <strong>
          A EMBALARTE nasceu do sonho de Fernando Alves Vieira em criar uma empresa forte e sólida, para oferecer 
          ao mercado soluções completas e personalizadas. Fundada em 1999 e com 16 anos de experiência, vem conquistado 
          seu espaço como uma das melhores empresas no segmento. Situada na Cidade de Santana de Paranaíba no Estado de 
          São Paulo, dispõe em sua planta própria, 4.000m2 de área.
          </strong>
        </p>
        <img src="../../assets/images/containers.jpg" v-motion-fade-visible-once alt="Imagem de Quem Somos" id="ImgTexto">

    <div class="text-overlay">
        <div class="embalarte-txt">
        <strong class="filiais-txt" id="about-us-nos">NÓS, DO GRUPO EMBALARTE</strong>
        </div>
        <strong class="filiais-txt" id="localTexto">TEMOS NOSSA SEDE EM<br> </strong>
          <ul class="lista-cidades-cllr">
            <li><a>📌 Santana de Parnaíba</a></li>
          </ul>
           <strong class="filiais-txt" id="localTexto">
          E ESTAMOS PRESENTES EM OUTRAS 3 CIDADES NO ESTADO DE SÃO PAULO!</strong>
        <ul class="lista-cidades-cllr">
          <li><a>📌 São Paulo</a></li>
          <li><a>📌 São José dos Campos</a></li>
          <li><a>📌 Cajamar</a></li>
        </ul>

    <hr class="custom-hr">
    <hr class="custom-hr">
      </div>  
    </div>
  </main>
</template>

<style scoped>

/* Grid Container */
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4%;
}

/* Grid Item */
.grid-item {
  background: #e2e2e2;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 2%;
  text-align: center;
  font-size: 1.6rem;         /* Ajuste o tamanho da fonte conforme necessário */

}

/* Barra para espaçamento ---------------------------------------------------\ */
.custom-hr {
  margin: 20px 0px 5px 0px;
  border: 0;
  height: 3px;
  background-color: rgba(255, 255, 255, 0);
}
/* --------------------------------------------------------------------------/ */

/* Parte dos textos e imagens -----------------------------------------------\ */
.about-us-container {
  width: 80%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
}

.volume-video {
  display: flex;
  margin-left: 35%;
}

.lista-cidades {
  list-style-type: none; /* Remove default list styling */
  padding: 0;
}

.lista-cidades li {
  margin: 6% 0; /* Space between items */
}

.lista-cidades a {
  text-decoration: none; /* Remove underline from links */
  color: #007bff; /* Blue color for links */
  font-weight: bold; /* Bold text */
  display: inline-block; /* Make the entire list item clickable */
  font-size: 0.8rem; /* Slightly larger font size */
  padding: 5% 5%; /* More responsive padding */
  margin-left: -10%;
  border-radius: 5px; /* Rounded corners */
  transition: transform 0.3s ease-in-out, background-color 0.3s, color 0.3s; /* Smooth transition effects */
  border: 2px solid #86acca; /* Blue border */
  user-select: none; /* Prevent text selection */
  cursor: pointer; /* Change cursor to pointer on hover */
}

.lista-cidades a:hover {
  background-color: #f0f0f0; /* Change background on hover */
  color: #0056b3; /* Darker blue on hover */
  transform: scale(1.1); /* Scale the link by 110% when hovered */
}

.selected {
  transform: scale(1.1); /* Scale the link by 120% to indicate selection */
  background-color: #e0e0e0; /* Optional: Change background color for selected state */
}

.call-servicos {
  font-size: 2rem;         /* Ajuste o tamanho da fonte conforme necessário */
  color: #000;             /* Ajuste a cor do texto conforme necessário */
}
.about-us-section {
  overflow: hidden; 
  display: flex;
  flex-direction: column;
  align-items: center; /* Centraliza o conteúdo horizontalmente */
  text-align: center; /* Centraliza o texto dentro do contêiner */
  background: linear-gradient(
    to bottom,
    #ffffff 5%, /* Azul claro de 30% a 70% */
    #c7c7c7 70% /* Branco no fundo */
  );
}

.quem-somos-txt {
  font-family: "Outfit", sans-serif; /* Fonte */ 
  text-align: center; /* Centraliza o texto */
  flex: 1;
  margin-top: 0%;
}

#about-us-nos {
  font-size: 2.5rem;
  top: 10px; /* Valor positivo para mover o texto para baixo */
}
  .video-container {
    width: 80vh;
  }
  .video-container video{
    width: 50%;
    max-width: 600px
  }
  .video-container video{
  width: 85%;
  margin-top: 20%;
  }
.about-us-divider {
  border: 0;
}
.about-us-title {
  font-size: 4rem;
  color: black;
}
.about-us-paragraph {
  padding: 0px 7% 0px 7%;
  font-size: 1.3rem;
}
#ImgTexto {
  max-width: 100%;
  height: auto;
  border-radius: 10px 10px 10px 10px;
}
.container-history {
  border: 1px solid rgb(150, 150, 150); /* Define a borda com 5px de espessura, estilo sólido e cor preta */
  border-radius: 5px; /* Arredonda os cantos da borda */
}
/* --------------------------------------------------------------------------/ */

/* Parte exclusiva do mapa -----------------------------------------------------------\ */
.local-section {
  font-family: 'Mulish', sans-serif;
  display: flex;
  align-items: flex-start; /* Alinha os itens no topo */
  padding-left: 2%;
  background: linear-gradient(
    to bottom,
    #c7c7c7 0%, /* Azul claro até 90% da altura */
    #ffffff 97%  /* Branco começando a partir de 90% até o fundo */
  );
}

.blur-effect {
  filter: blur(5px); /* Ajuste o valor conforme necessário */
  transition: filter 0.3s ease;
}

/* Adicione esta classe para remover o desfoque */
.no-blur {
  filter: none;
  transition: filter 0.3s ease;
}
.filiais-txt {
  font-family: "Outfit", sans-serif; /* Fonte */ 
}

#localTexto {
  font-size: 1.8rem;
  margin-bottom: 6%;
  margin-top: 5%;
}
.caixa-mapa {
  background: rgb(58, 106, 141);
  border-radius: 10px;
  padding: 15px;
  width: 35%; /* A largura será 70% da largura do elemento pai */
  aspect-ratio: 1 / 1; /* Mantém a proporção quadrada */
  margin-top: 10%;
  margin-left: 11%;
}

.map-box {
  background: #ffffff;
  padding: 12px; /* Ajuste conforme necessário */
  border-radius: 10px;
  overflow: hidden;
  width: 100%;
  height: 100%;
}
.mapa {
  width: 100%;
  height: 100%;
  border: 0;
  border-radius: 10px;
}

.lista-cidades {
  list-style-type: none;
  padding-left: 0;
  margin-bottom: -5%;
  margin-top: -5%;
}
.text-overlay {
  font-family: 'Mulish', sans-serif; /* Aplica a fonte 'Mulish' */
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-left: 0%;
  margin-top: 5%;
}

.text-overlay a {
font-size: 1.8rem;
}

.diferenciais {
  margin-left: 15%;
  margin-right: 15%;
  margin-top: 7.5%;
}
.diferenciais-titulo {
  align-items: center;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 3rem;
  font-weight: bold;
}
/* --------------------------------------------------------------------------/ */


/* Para o celular -----------------------------------------------------------\ */
.espaco-cell {
  display: none;
}
.mapa-cel {
  display: none;
}


@media (max-width: 768px) {
  .for-pc{
  display: none;
}
.about-us-paragraph {
  display: flex;
  justify-content: center; /* Centraliza horizontalmente */
  align-items: center; /* Centraliza verticalmente */
  height: 25vh; /* Faz o contêiner ocupar toda a altura da viewport */
  text-align: center; /* Alinha o texto no centro do parágrafo */
}

.about-us-paragraph p {
  max-width: 600px; /* Ajuste o tamanho máximo conforme necessário */
  margin: 0; /* Remove as margens padrão do parágrafo */
  padding: 20px; /* Adiciona um pouco de espaço ao redor do texto */
}

.call-servicos {
  text-align: center; /* Center text within the container */
}

.imagem-link {
  display: flex;
  justify-content: center; /* Center image horizontally within its container */
  align-items: center; /* Center image vertically within its container */
}

.call-servicos {
  display: flex;
  justify-content: center; /* Centraliza horizontalmente */
  align-items: center; /* Centraliza verticalmente */
  height: 10%; /* Faz o contêiner ocupar toda a altura da viewport */
  text-align: center; /* Alinha o texto no centro do parágrafo */
}
  /* Estilos para telas menores */
  .local-section {
    flex-direction: column-reverse; 
  }

  #ImgTexto {
    border-radius: 0px;
  }

  .espaco-cell {
  display: block;
  }

  .mapa-cel {
    display: block;
    width: 100%;
  }

  .caixa-mapa {
    display: none;
  }

  .map-box {
    display: none;
  }

  .mapa {
    display: none;
  }

  .about-us-container {
    display: flex; /* Usa flexbox para o layout */
    align-items: center; /* Alinha verticalmente o texto e a imagem ao centro */
    justify-content: space-between; /* Espaça o texto e a imagem igualmente */
  }

  .quem-somos-txt {
    flex: 1; /* Faz o texto ocupar o máximo de espaço disponível */
    margin-right: 0px; /* Espaçamento entre o texto e a imagem */
  }

  .lista-cidades-cllr {
    list-style-type: none;
    padding-left: 0;
    font-size: 1.2em;
    margin-bottom: -20px;
    margin-top: -50px;
  }

  .lista-cidades-cllr {
  list-style-type: none; /* Remove default list styling */
  padding: 0;
}

.lista-cidades-cllr li {
  margin: 15px 0; /* Add space between items */
}

.lista-cidades-cllr a {
  text-decoration: none; /* Remove underline from links */
  color: #000000; /* Blue color for links */
  font-weight: bold; /* Bold text */
  display: inline-block; /* Make the entire list item clickable */
  padding: 10px 15px; /* Add padding to clickable area */
  border-radius: 5px; /* Rounded corners */
  border: 2px solid #86acca; /* Black border */
  user-select: none; /* Prevent text selection */
  cursor: pointer; /* Change cursor to pointer on hover */
}


.text-overlay {
  margin-left: -0%;
  display: flex;
  flex-direction: column; /* Stack items vertically */
  align-items: center; /* Center items horizontally */
  justify-content: center; /* Center items vertically */
  height: 100vh; /* Full viewport height */
  width: 100vw; /* Full viewport width */
  text-align: center; /* Center text within each item */
}

.embalarte-txt {
  margin-bottom: 20px; /* Space below the title */
}

.quem-somos-txt {
  display: block; /* Ensure each text element takes full width */
  margin-bottom: 10px; /* Space between text elements */
}

.lista-cidades-cllr {
  list-style-type: none; /* Remove default list styling */
  padding: 0; /* Remove default padding */
  margin: 0; /* Remove default margin */
}

.lista-cidades-cllr li {
  margin-bottom: 5px; /* Space between list items */
}

.custom-hr {
  width: 80%; /* Width of the horizontal rule */
  border: 1px solid #000; /* Style of the horizontal rule */
  margin: 20px 0; /* Space above and below the horizontal rule */
}
  .custom-hr {
  border: 0;
  height: 3px;
  background-color: rgba(255, 255, 255, 0);
}

#paragrafo {
  font-size: 20px
}

.call-servicos {
  font-size: 1.5rem;
}
}
@media (max-width: 750px){
  #paragrafo {
    margin-top: 50px;
  }
}
/* --------------------------------------------------------------------------/ */

</style>