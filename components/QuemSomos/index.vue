<script>
export default {
  data() {
    return {
      isDropdownActive: false,
      isSubDropdownActive: false,
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
  mounted() {
    window.scrollTo(0, 0);
    window.addEventListener('scroll', this.handleScroll);
  },
  unmounted() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    scrollToSection(id) {
      const headerOffset = 150; // Substitua pelo valor da altura do cabeçalho em pixels
      const element = document.getElementById(id);
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }    
    // --------------------/
  }
};
</script>

<template>
  <main>
    <div class="about-us-section" id="aboutUs">
      <div class="about-us-container">
        <div class="about-us-text">
          <h1 class="about-us-title" v-motion-slide-visible-once-bottom>QUEM SOMOS</h1>
          <hr class="about-us-divider">
          <p class="about-us-paragraph" v-motion-slide-visible-once-bottom>
            A EMBALARTE nasceu do sonho de Fernando Alves Vieira em criar uma empresa forte e sólida, para oferecer 
            ao mercado soluções completas e personalizadas. Fundada em 1999 e com 16 anos de experiência, vem conquistado 
            seu espaço como uma das melhores empresas no segmento. Situada na Cidade de Santana de Paranaíba no Estado de 
            São Paulo, dispõe em sua planta própria, 4.000m2 de área. Localizada próximo as rodovias Anhanguera e Bandeirantes 
            e de fácil acesso ao Rodoanel, possibilita agilidade no processo de distribuição e transporte dos materiais. 
            Equipamentos de ponta, funcionários treinados e qualificados, gestão e tecnologia completam a estrutura voltada para 
            atingir excelência em todas as operações realizadas. Tudo isto atrelado ao atendimento personalizado dos gestores que 
            são treinados para buscar a melhor solução de acordo com a necessidade dos nossos clientes.
          </p>
        </div>
        <div v-motion-fade-visible-once class="about-us-image">
          <img src="../../assets/images/funcionario-interacao-2.png" v-motion-fade-visible-once alt="Imagem de Quem Somos" id="ImgTexto">
        </div>
      </div>
    </div>
    <div  class="local-section">
      <div class="caixa-mapa">
        <div class="map-box">
          <iframe class="mapa"
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14646.357919884578!2d-46.8853484!3d-23.4030639!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cf1c60570bde1f%3A0x5aa53ca281712703!2sGRUPO%20EMBALARTE!5e0!3m2!1spt-BR!2sbr!4v1720455342886!5m2!1spt-BR!2sbr"
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
        <div class="embalarte-txt">
        <strong class="about-us-text" id="about-us-nos">NÓS, DO GRUPO EMBALARTE</strong>
        </div>
        <strong class="about-us-text" id="localTexto">ESTAMOS EM 4 CIDADES<br>NO ESTADO DE SÃO PAULO!</strong>

        <ul class="lista-cidades">
          <li>Santana de Parnaíba</li>
          <li>Osasco</li>
          <li>São José dos Campos</li>
          <li>Cajamar</li>
        </ul>
    <hr class="custom-hr">
    <hr class="custom-hr">
    <hr class="custom-hr">
    <hr class="custom-hr">
    <hr class="custom-hr">
    <hr class="custom-hr">
      </div>    
    </div>
    <div class="full-height">
    <strong class="call-servicos">
      CONHEÇA MAIS SOBRE NOSSOS SERVIÇOS, ENTRE NO GALPÃO
    </strong>
    <br>
    <br>
    <div class="imagem-link">
      <router-link :to="{ path: '/Nossos-Servicos' }" style="color: black; text-decoration: none;">
        <img src="../../assets/images/galpao.jpg" v-motion-fade-visible-once class="services-img">
      </router-link>
    </div>


  </div>



    <div class="espaco-cell">
    <hr class="custom-hr">
    <hr class="custom-hr">
    </div>


  </main>
</template>

<style scoped>

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
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
}
.services-img {
  border-radius: 15px; /* Arredonda as bordas da imagem */
  width: 100%; /* Ajusta a largura da imagem conforme o contêiner */
  max-width: 500px; /* Define um tamanho máximo para a imagem */
  transition: transform 0.3s ease; /* Adiciona uma transição suave para o efeito de crescimento */
}

/* Efeito de crescimento ao passar o mouse */
.services-img:hover {
  transform: scale(1.2); /* Aumenta o tamanho da imagem em 10% */
}


.full-height {
  display: grid;
  place-items: center;     /* Centraliza horizontal e verticalmente */  
}

.call-servicos {
  font-size: 2rem;         /* Ajuste o tamanho da fonte conforme necessário */
  color: #000;             /* Ajuste a cor do texto conforme necessário */
}
.about-us-section {
  display: flex;
  flex-direction: column;
  align-items: center; /* Centraliza o conteúdo horizontalmente */
  text-align: center; /* Centraliza o texto dentro do contêiner */
  padding: 20px; /* Espaçamento interno */
  background: linear-gradient(
    to bottom,
    #ffffff 5%, /* Azul claro de 30% a 70% */
    #adc7dd 70% /* Branco no fundo */
  );
  position: relative;
}
.about-us-text {
  font-family: "Outfit", sans-serif; /* Fonte */ 
  text-align: center; /* Centraliza o texto */
  padding: 20px 20px 20px 20px; /* Espaçamento interno */
  flex: 1;
  margin-right: 20px; /* Espaçamento à direita */
}
.embalarte-txt #about-us-nos {
  font-size: 2.5em;
  position: relative;
  top: 10px; /* Valor positivo para mover o texto para baixo */
}

.about-us-divider {
  border: 0;
}
.about-us-title {
  font-size: 4rem;
  color: black;
}
.about-us-paragraph {
  padding: 0px 10px 0px 10px;
  font-size: 1.2rem;
}

.about-us-image-cont {
  flex-shrink: 0; /* Garante que a imagem não encolha */
}
.about-us-image {
  display: flex; /* Alinha as imagens lado a lado */
  align-items: center;  /* Centraliza as imagens no contêiner */
  flex-wrap: wrap; /* Permite que as imagens quebrem linha se não couberem */
  flex: 1; /* Precisa disso */
  padding: 20px; /* Espaço interno ao redor das imagens */
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
.about-us-image-img {
  width: 300px; /* Ajuste a largura conforme necessário */
  height: auto; /* Mantém a proporção da imagem */
  margin: 10px; /* Espaçamento entre as imagens */
  position: relative;
  top: -15px; /* Valor positivo para mover o texto para baixo */
  
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
    #adc7dd 0%,  /* Azul claro no topo */
    #adc7dd 85%, /* Azul claro até 90% da altura */
    #ffffff 97%  /* Branco começando a partir de 90% até o fundo */
  );

}
#localTexto {
  font-size: 1.8em;
  margin-bottom: 50px;
  margin-top: 25px;
}
.caixa-mapa {
  background: rgb(58, 106, 141);
  border-radius: 10px;
  padding: 15px;
  width: 40%; /* Aumenta a largura da caixa do mapa */
  margin-top: 0.5%;
  margin-left: 5%;
}
.map-box {
  background: #ffffff;
  padding: 12px; /* Ajuste conforme necessário */
  border-radius: 10px;
  overflow: hidden;
}
.mapa {
  width: 100%;
  height: 400px;
  border: 0;
  border-radius: 10px;
}
.lista-cidades {
  list-style-type: none;
  padding-left: 0;
  font-size: 1.4em;
  margin-bottom: 30px;
}
.text-overlay {
  font-family: 'Mulish', sans-serif; /* Aplica a fonte 'Mulish' */
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
  text-align: center;
  margin-left: 10%;
}
/* --------------------------------------------------------------------------/ */


/* Para o celular -----------------------------------------------------------\ */
.espaco-cell {
  display: none;
}
.mapa-cel {
  display: none;
}
@media (max-width: 300px) {
.about-us-image-img{
  display: none;
}
}
@media (max-width: 768px) {
  /* Estilos para telas menores */
  .local-section {
    flex-direction: column-reverse; 
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

  .about-us-text {
    flex: 1; /* Faz o texto ocupar o máximo de espaço disponível */
    margin-right: 0px; /* Espaçamento entre o texto e a imagem */
  }

  .lista-cidades {
    list-style-type: none;
    padding-left: 0;
    font-size: 1.4em;
    margin-bottom: 30px;
    text-align: center; /* Centraliza a lista de cidades */
  }

  .text-overlay {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 10px;
    text-align: center;
    font-family: 'Mulish', sans-serif; /* Aplica a fonte 'Mulish' */
    position: relative;
    margin-top: -20px; /* Valor negativo para subir o texto */
  }

  .text-overlay h2, .text-overlay p {
    margin: 0; /* Remove margens padrão */
  }
}
/* --------------------------------------------------------------------------/ */

</style>