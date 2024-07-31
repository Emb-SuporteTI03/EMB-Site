<script>
</script>

<template>
  <main>

    <MenuSuperior />
  
    <div style="padding: 100px 0px 0px 0px;" class="">
      <hr class="custom-hr1">
      <div>
        <div class="div-titulo-pagina-fotos">
          <h2 class="titulo-pagina-fotos">Manuseio e Montagem de Kit's</h2>
          <p class="paragrafo-pagina-fotos">Conjunto Promocional do tipo leve três e pague dois ou a agregação de um brinde ao pacote original do produto.</p>
        </div>
        <div class="corpo-pagina-fotos">
            <!-- Cards ------------------------------------------------------------------------------------->
          <div class="row row-cols-1 row-cols-md-3 g-4 grid-cards">

            <div class="col">
              <div class="card">
                <img src="assets/images/manuseio1.jpg" class="card-img imagem-card" alt="...">
                <div class="card-img-overlay">
                  <h5 class="card-title" style="color: black"></h5>
                  <p class="card-text"></p>
                  <p class="card-text"><small></small></p>
                </div>
              </div>
            </div>

            <div class="col">
              <div class="card">
                <img src="assets/images/manuseio2.jpg" class="card-img imagem-card" alt="...">
                <div class="card-img-overlay">
                  <h5 class="card-title" style="color: black"></h5>
                  <p class="card-text"></p>
                  <p class="card-text"><small></small></p>
                </div>
              </div>
            </div>

            <div class="col">
              <div class="card">
                <img src="assets/images/manuseio3.jpg" class="card-img imagem-card" alt="...">
                <div class="card-img-overlay">
                  <h5 class="card-title" style="color: black"></h5>
                  <p class="card-text"></p>
                  <p class="card-text"><small></small></p>
                </div>
              </div>
            </div>

            <div class="col">
              <div class="card">
                <img src="assets/images/Manuseio4.jpg" class="card-img imagem-card" alt="...">
                <div class="card-img-overlay">
                  <h5 class="card-title" style="color: black"></h5>
                  <p class="card-text"></p>
                  <p class="card-text"><small></small></p>
                </div>
              </div>
            </div>

            <div class="col">
              <div class="card">
                <img src="assets/images/manuseio5.jpg" class="card-img imagem-card" alt="...">
                <div class="card-img-overlay">
                  <h5 class="card-title" style="color: black"></h5>
                  <p class="card-text"></p>
                  <p class="card-text"><small></small></p>
                </div>
              </div>
            </div>

            <div class="col">
              <div class="card">
                <img src="assets/images/manuseio7.png" class="card-img imagem-card" alt="...">
                <div class="card-img-overlay">
                  <h5 class="card-title" style="color: black">Card title</h5>
                  <p class="card-text"></p>
                  <p class="card-text"><small></small></p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  
    <Rodape />
  </main>
</template>

<style>

.imagem-card {
  object-fit: cover
}

/* .div-titulo-pagina-fotos {
} */

.titulo-pagina-fotos {
  display: flex;
  color: rgb(58, 106, 141);
  justify-content: center;
}

.paragrafo-pagina-fotos {
  display: flex;
  justify-content: center;
}

/* .corpo-pagina-fotos {

} */

@media only screen and (max-width: 768px) {
  .div-titulo-pagina-fotos {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .paragrafo-pagina-fotos {
    text-align: justify;
    width: 95%;
  }
}

</style>