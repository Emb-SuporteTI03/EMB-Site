<template>
  <main class="carrossel-main">
    <!-- TEXTO BOAS VINDAS -->
     <div class="carrosel-pc">
    <div class="boas-vindas-texto">
      <div class="div-cima">
        <hr class="custom-hr2">
        <img id="imagemNadiv" src="../../assets/images/logo-embalarte-sem-fundo.jpg" class="logo">
        <hr class="custom-hr2">
      </div>
      <p class="text-justify texto-justificado" style="padding: 0px 10px;">O <strong>Grupo EMBALARTE</strong> oferece soluções logísticas 
        adaptadas às necessidades específicas de cada cliente. Nosso atendimento 
        personalizado, suporte dedicado e gestão eficiente são os principais 
        diferenciais que garantem a qualidade e a excelência de nossos 
        serviços. Solicite um orçamento sem compromisso para o seu projeto.</p>
    </div>
  </div>
    <div>

    </div>
    <swiper
      :grabCursor="true"
      :effect="'creative'"
      :creativeEffect="{
        prev: {
          shadow: true,
          translate: ['-20%', 0, -1],
        },
        next: {
          translate: ['100%', 0, 0],
        },
      }"
      :simulateTouch="true"
      :modules="modules"
      :autoplay="{
        delay: 10000,           
        disableOnInteraction: false 
      }"
      class="mySwiper3"
    >
      <swiper-slide>
        <img src="assets/images/galpao_carrossel.jpeg" alt="estantes" class="swiper-image" />
      </swiper-slide>
      <swiper-slide>
        <img src="assets/images/container_carrossel.jpeg" alt="estantes" class="swiper-image" />
      </swiper-slide>
      <swiper-slide>
        <img src="assets/images/caminhao_carrossel1.jpeg" alt="containers" class="swiper-image" />
      </swiper-slide>

      <swiper-slide>
        <img src="assets/images/tec_carrossel.jpeg" alt="containers" class="swiper-image" />
      </swiper-slide>
    </swiper>
    <div>
    <hr class="custom-hr2">
    <hr class="custom-hr2">

    </div>
    <hr class="custom-hr2">
  </main>
</template>

<style scoped>
body {
  overflow-x: hidden;
}

.mySwiper3 {
  width: 100%;
  height: 100%; /* Define uma altura fixa para o carrossel */
}


.swiper-slide {
  display: flex;
  height: 60%;
  justify-content: center;
  align-items: center;
  height: 100%; /* Ajusta a altura do slide para 100% do contêiner do Swiper */
}

.img {
  opacity: 0.7; /* Define a opacidade da imagem */
}

.swiper-image {
  width: auto;
  width: 100%;
  height: 100%;
  display: block;

}

.boas-vindas-cellr {
  display: none; 
}

.text-justify {
  font-size: 30px;
}

.text-center {
  font-size: 200%;
  margin: 0;
}

.custom-hr1 {
  margin: 20px 0px 5px 0px;
  border: 0;
  height: 3px;
  background-color: rgb(58, 106, 141);
}

.custom-hr2 {
  margin: 20px 0px 5px 0px;
  border: 0;
  height: 3px;
  background-color: rgba(255, 255, 255, 0);
}

.tracinho-final {
  margin-top: 10px;
}

.boas-vindas-texto {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 300;
  text-align: center;
  color: rgb(58, 106, 141);
  background-color: rgba(255, 255, 255, 0.8);
  padding: 20px;
  border-radius: 10px;
  max-width: 1500px; 
  max-height: 1500px; 
  width: 50%; 
}



.custom-carousel1-control {
  
  background-color: rgb(172, 172, 172);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  border: none;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  color: white;
}

.custom-carousel1-control.carousel-control-next {
  right: 10px;
}

.custom-carousel1-control.carousel-control-prev {
  left: 10px;
}

.div-cima {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 5%;
  padding: 20px;
}

#imagemNadiv {
  width: 45%;
}

.logo {
  width: 100px;
  height: auto;
  margin-left: 20px;
}


@media (max-width: 768px) {
  .carrossel-main {
  display: none;
  }
}



</style>

<script>
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/swiper-bundle.css';

import { Navigation, Pagination, EffectFlip, EffectCreative, Autoplay } from 'swiper/modules';
export default {
  components: {
    Swiper,
    SwiperSlide,
  },
  data() {
    return {
      modules: [EffectCreative, Navigation, Pagination, Autoplay, EffectFlip],
    };
  },
};

</script>