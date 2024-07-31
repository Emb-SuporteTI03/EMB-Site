<template>
  <main>
    <MenuSuperior />
    <hr class="custom-hr">
    <hr class="custom-hr">
    <hr class="custom-hr">
    <hr class="custom-hr">

    <div class="fotos">
      <img src="assets/images/encadernacao-espirais.jpg" class="card-img imagem-card" alt="Encadernação de espirais">
      <img src="assets/images/encadernacao-maquina1.jpg" class="card-img imagem-card" alt="Encadernação - Máquina 1">
      <img src="assets/images/encadernacao-maquina2.jpg" class="card-img imagem-card" alt="Encadernação - Máquina 2">
      <img src="assets/images/encadernacao-maquina3.jpg" class="card-img imagem-card" alt="Encadernação - Máquina 3">
      <img src="assets/images/encadernacao-maquina4.jpg" class="card-img imagem-card" alt="Encadernação - Máquina 4">
      <img src="assets/images/encadernacao-caderno.jpg" class="card-img imagem-card" alt="Encadernação de caderno">
    </div>

    <Rodape />
  </main>
</template>

<style scoped>
.fotos {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between; /* Distribui as imagens uniformemente */
}

.imagem-card {
  width: calc(33.33% - 10px); /* Calcula o tamanho para caber três imagens por linha com espaço entre elas */
  margin-bottom: 10px; /* Espaçamento entre as linhas de imagens */
}

@media (max-width: 768px) {
  .imagem-card {
    width: calc(50% - 10px); /* Para telas menores, duas imagens por linha */
  }
}

@media (max-width: 480px) {
  .imagem-card {
    width: 100%; /* Uma imagem por linha em telas muito estreitas */
  }
}
</style>
