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
      <p class="text-justify texto-justificado" style="padding: 0px 10px;">O <strong>Grupo EMBALARTE</strong> oferece as mais diversas soluções logísticas de acordo com cada necessidade. Atendimento personalizado, suporte e gestão são nossos maiores diferenciais. Solicite um orçamento para o seu projeto sem compromisso.</p>
    </div>
  </div>
    <div>

    </div>
    <!-- FIM DO TEXTO BOAS VINDAS -->

    <!-- Carrossel de imagens -->
    <div id="carouselExample" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-inner">
        <!-- Slide 1 -->
        <div class="carousel-item active">
          <img src="assets/images/carrossel-estantes.png" class="d-block w-100 carrossel-imagem" alt="estantes">
        </div>

        <!-- Slide 2 -->
        <div class="carousel-item">
          <img src="assets/images/carrossel-linha-producao.png" class="d-block w-100 carrossel-imagem" alt="producao">
        </div>

        <!-- Slide 3 -->
        <div class="carousel-item">
          <img src="assets/images/landing.jpg" class="d-block w-100 carrossel-imagem" alt="fachada">
        </div>

        <!-- Slide 4 -->
        <div class="carousel-item">
          <img src="assets/images/containers.jpg" class="d-block w-100 carrossel-imagem" alt="fachada">
        </div>
      </div>

      <!-- Controles do carrossel -->
      <button class="carousel-control-prev custom-carousel1-control" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next custom-carousel1-control" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
    <div>
    <hr class="custom-hr2" id="linhaInv">
    <hr class="custom-hr2" id="linhaInv">

    </div>
    <hr class="custom-hr2" id="linhaInv">
  </main>
</template>

<style scoped>

.carrossel-main {
  position: relative;
  padding: 0;
  margin: 0;
  width: 100%;
  overflow: hidden;
}

.boas-vindas-cellr {
  display: none; 
}

.text-justify {
  font-size: 120%;
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
  background-color: rgba(255, 255, 255, 1);
  padding: 20px;
  border-radius: 10px;
}

.carousel-item {
  /* Definindo altura do carrossel */
  height: 80vh;
  opacity: 0.5;
  overflow: hidden;
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

.carrossel-imagem {
  height: 100%;
  width: 100%;
  object-fit: cover;
}


@media (max-width: 768px) {
  .carrossel-main {
  display: none;
  }
}



</style>
