<template>
  <main>
    <!-- ... outros elementos do template ... -->
    <hr class="custom-hr">
    <hr id="tracinho-final" class="custom-hr1">
    <hr class="custom-hr">
    <hr class="custom-hr">
    <hr class="custom-hr">
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
          <img src="../../assets/images/funcionario-interacao-2.png" v-motion-fade-visible-once alt="Imagem de Quem Somos" class="about-us-image-txt-img">
        </div>
      </div>
      <hr class="custom-hr" id="História">
      <hr class="custom-hr">
      <hr class="custom-hr">
      <hr class="custom-hr">
      <hr class="custom-hr">
      <h1 class="about-us-title" v-motion-slide-visible-once-bottom>NOSSA HISTÓRIA</h1>
      <hr class="custom-hr">
      <div v-motion-fade-visible-once class="about-us-image">
        <img draggable="false" src="../../assets/images/1999.png" v-motion-fade-visible-once alt="Imagem de Quem Somos" class="about-us-image-img">
        <img draggable="false" src="../../assets/images/2004.png" v-motion-fade-visible-once alt="Imagem de Quem Somos" class="about-us-image-img">
        <img draggable="false" src="../../assets/images/2007.png" v-motion-fade-visible-once alt="Imagem de Quem Somos" class="about-us-image-img">
        <img draggable="false" src="../../assets/images/2010.png" v-motion-fade-visible-once alt="Imagem de Quem Somos" class="about-us-image-img">
      </div>  
      <div v-motion-fade-visible-once class="about-us-image">
        <img draggable="false" src="../../assets/images/2012.png" v-motion-fade-visible-once alt="Imagem de Quem Somos" class="about-us-image-img">
        <img draggable="false" src="../../assets/images/2017.png" v-motion-fade-visible-once alt="Imagem de Quem Somos" class="about-us-image-img">
        <img draggable="false" src="../../assets/images/2019.png" v-motion-fade-visible-once alt="Imagem de Quem Somos" class="about-us-image-img">
        <img draggable="false" src="../../assets/images/2021.png" v-motion-fade-visible-once alt="Imagem de Quem Somos" class="about-us-image-img">
      </div> 

    </div>

    <hr class="custom-hr">
    <hr class="custom-hr">
    <hr class="custom-hr">
    <hr class="custom-hr1">
    <div v-motion-fade-visible-once class="presenca">
      <div class="caixa-mapa">
        <div class="map-box">
          <iframe class="mapa"
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14646.357919884578!2d-46.8853484!3d-23.4030639!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cf1c60570bde1f%3A0x5aa53ca281712703!2sGRUPO%20EMBALARTE!5e0!3m2!1spt-BR!2sbr!4v1720455342886!5m2!1spt-BR!2sbr"
            allowfullscreen loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
      <iframe class="mapa-cel"
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14646.357919884578!2d-46.8853484!3d-23.4030639!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cf1c60570bde1f%3A0x5aa53ca281712703!2sGRUPO%20EMBALARTE!5e0!3m2!1spt-BR!2sbr!4v1720455342886!5m2!1spt-BR!2sbr"
            allowfullscreen loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
      ></iframe>
      <div class="text-overlay">
        <strong class="estamos">NÓS ESTAMOS EM 4 CIDADES<br>NO ESTADO DE SÃO PAULO!</strong>
        <ul class="lista-cidades">
          <li>Santana de Parnaíba</li>
          <li>Osasco</li>
          <li>São José dos Campos</li>
          <li>Cajamar</li>
        </ul>
      </div>
    </div>

    <hr class="custom-hr" id="linhaQmSomos">

    <div class="espaco-cell">
    <hr class="custom-hr">
    <hr class="custom-hr">
    <hr class="custom-hr">
    <hr class="custom-hr">
    </div>


  </main>
</template>

<style scoped>

.espaco-cell {
  display: none;
}

.mapa-cel {
  display: none;
}



.about-us-image-txt-img {
  max-width: 100%;
  height: auto;
  border-radius: 10px; /* Apenas o canto inferior direito arredondado */
}

.about-us-title {
  font-size: 4rem;
}

.about-us-image {
  display: flex; /* Alinha as imagens lado a lado */
  justify-content: space-between; /* Espaço igual entre as imagens */
  flex-wrap: wrap; /* Permite que as imagens quebrem linha se não couberem */
}

.about-us-image-img {
  width: 300px; /* Ajuste a largura conforme necessário */
  height: auto; /* Mantém a proporção da imagem */
  margin: 10px; /* Espaçamento entre as imagens */
}

.about-us-image-cont {
  width: 800px; /* Ajuste para o tamanho desejado */
  flex-shrink: 0; /* Garante que a imagem não encolha */
}

@media (max-width: 300px) {
.about-us-image-img{
  display: none;
}
}

@media (max-width: 768px) {
  /* Estilos para telas menores */
  .presenca {
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
    margin-top: 2.5%;
  }

  .text-overlay h2, .text-overlay p {
    margin: 0; /* Remove margens padrão */
  }
}

/* Estilos para telas maiores */
.caixa-mapa {
  background: rgb(58, 106, 141);
  border-radius: 10px;
  padding: 15px;
  margin: 20px auto; /* Centraliza verticalmente e alinha ao centro horizontalmente */
  width: 40%; /* Aumenta a largura da caixa do mapa */
  margin-left: auto; /* Alinha à direita */
}

.map-box {
  background: #ffffff;
  padding: 12px; /* Ajuste conforme necessário */
  border-radius: 10px;
  overflow: hidden;
}

.mapa {
  width: 100%;
  height: 300px;
  border: 0;
}

.about-us-section {
  display: flex;
  flex-direction: column;
  align-items: center; /* Centraliza o conteúdo horizontalmente */
  text-align: center; /* Centraliza o texto dentro do contêiner */
  padding: 20px; /* Espaçamento interno opcional */
}


.custom-hr {
  margin: 20px 0px 5px 0px;
  border: 0;
  height: 3px;
  background-color: rgba(255, 255, 255, 0);
}

.custom-hr-blue {
  margin: 20px 20px 5px 5px;
  height: 30px;
  color: rgb(2, 40, 253);
}

.estamos {
  font-size: 1.8em;
  margin-bottom: 50px;
  margin-top: 30px;
}

.about-us-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  }

  .about-us-image-txt-img {
  max-width: 100%;
  height: auto;
  border-radius: 10px; /* Apenas o canto inferior direito arredondado */
}

.about-us-image {
  flex: 1;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
  .about-us-text {
    text-align: center; /* Centraliza o texto */
    padding: 0 20px; /* Espaçamento interno */
    flex: 1;
  padding: 20px;
  border-radius: 0 10px 10px 0; /* Apenas a borda direita arredondada */
  font-family: "Outfit", sans-serif;
  margin-right: 20px; /* Espaçamento à direita */
  }

.lista-cidades {
  list-style-type: none;
  padding-left: 0;
  font-size: 1.4em;
  margin-bottom: 30px;
}

.about-us-divider {
  margin: 20px 0px 5px 0px;
  border: 0;
  height: 3px;
  background-color: rgba(255, 255, 255, 0.1);
}

.about-us-paragraph {
  padding: 0px 10px 0px 10px;
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
  margin-top: 2.5%;
  margin-left: 10%;
}

.text-overlay h2, .text-overlay p {
  margin: 0; /* Remove margens padrão */
}

.presenca {
  font-family: 'Mulish', sans-serif;
  display: flex;
  align-items: flex-start; /* Alinha os itens no topo */
  padding-left: 2%;
  margin: 20px; /* Ajuste o margin conforme necessário */
  margin-top: 5%;
}

.imagem {
  width: 50%; /* Ajusta o tamanho da imagem em relação ao tamanho do contêiner pai */
  height: auto; /* Mantém a proporção da imagem */
  margin-right: 20px; /* Espaçamento à direita da imagem */
  display: block; /* Garante que a imagem se comporte corretamente */
}
</style>

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
    window.addEventListener('scroll', this.handleScroll);
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