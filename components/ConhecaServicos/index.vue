<template>
  <main>
    <!-- Título e espaço invisível -->

      <div class="section-title">
        <strong class="title" v-motion-slide-visible-once-bottom>CONHEÇA NOSSOS SERVIÇOS</strong>
        <hr class="custom-hr">
        <hr class="custom-hr">
      </div>


    <!-- Container para as imagens e textos -->
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-6 col-lg-4 mb-3"> <!-- Ajuste para col-md-6 col-lg-4 para cards menores -->
          <div class="image-container">
            <NuxtLink to="/albuns/encadernacao" class="btn-nuxt-link">
              <img src="assets/images/processo-encadernacao.jpg" class="card-img-top card-image" alt="Encadernação">
              <div class="overlay"></div>
              <div class="card-body">
                <h5 class="card-title">Encadernação</h5>
                <p class="card-text">Encadernações em Espiral e Ring wire (wire-o)...</p>
              </div>
            </NuxtLink>
          </div>
        </div>
        <div class="col-md-6 col-lg-4 mb-3">
          <div class="image-container">
            <NuxtLink to="/albuns/manuseio" class="btn-nuxt-link">
              <img src="assets/images/processo-manuseio.png" class="card-img-top card-image" alt="Manuseio">
              <div class="overlay"></div>
              <div class="card-body">
                <h5 class="card-title">Manuseio e Montagem de Kit's</h5>
                <p class="card-text">Montagens de Kits Promocionais, On Pack's, Projetos Personalizados...</p>
              </div>
            </NuxtLink>
          </div>
        </div>
        <div class="col-md-6 col-lg-4 mb-3">
          <div class="image-container">
            <NuxtLink to="/albuns/shrink" class="btn-nuxt-link">
              <img src="assets/images/shrink-1.jpg" class="card-img-top card-image" alt="Shrink">
              <div class="overlay"></div>
              <div class="card-body">
                <h5 class="card-title">Shrink e Manuseios Diversos</h5>
                <p class="card-text">Shrink em filme poliolefínico com máquinas de alta performance...</p>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
    <div class="final-part">
      <br>
    </div>
  </main>
</template>

<style scoped>
.custom-hr {
  margin: 20px 0px 5px 0px;
  border: 0;
  height: 3px;
  color: #f2f2f200;
  background-color: #f2f2f200;
}

.container-fluid {
  background: linear-gradient(to bottom, rgb(156, 185, 204), #c0c0c0); /* Degradê de branco para cinza claro */
}

.final-part {
  background: linear-gradient(to bottom, #c0c0c0, #ffffff); /* Degradê de branco para cinza claro */
}

.section-title {
  text-align: center;
  background: linear-gradient(to bottom, rgb(170, 193, 209), rgb(156, 185, 204)); /* Degradê de branco para cinza claro */
  padding: 20px;
}

.card-image {
  width: 100%;
  height: auto;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.card-image:hover {
  transform: scale(1.05);
}

.card-body {
  background-color: rgba(0, 0, 0, 0.829);
  padding: 15px;
  border-radius: 10px;
  margin-top: -50px;
  position: relative;
  z-index: 1;
  transition: background-color 0.3s ease;
  opacity: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.image-container {
  position: relative;
  overflow: hidden;
  border-radius: 10px;

}

.btn-nuxt-link {
  text-decoration: none;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 10px;

}

.image-container:hover .overlay {
  opacity: 1;
  border-radius: 10px;

}

.card-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #fff;
  border-radius: 10px;

}

.card-text {
  font-size: 1.2rem;
  color: #fff;
}

.title {
  font-size: 4rem; 
  display: block;
  margin-top: 20px;
}

@media (max-width: 768px) {
  .col-md-6 {
    margin-bottom: 20px;
  }

  .title {
    font-size: 300%; /* Ajuste o tamanho conforme necessário */
    display: block;
    margin-top: 10px;
  }
}
</style>
