<template>
  <main class="D-flex FD-column WIDTH-100 BGC-branco">
    
        <!-- Menu Superior -->
      <MenuSuperiorEstoque
        funcionalidadeProp="CONSULTA DO ESTOQUE"
      />

    <!-- Imagem fundo -->
    <div class="D-flex JC-center ALITEM-center HEIGHT-24vh">
      <img src="assets\images\prateleiras-galpao.jpg" alt="imagem fundo" class="imagem-fundo-dentro HEIGHT-30vh WIDTH-100">
      <!-- <img src="assets\images\logoEmbalarteH.png" alt="Logo Grupo Embalarte" class="WIDTH-40 HEIGHT-15 POSITION-absolute Z-INDEX-1" title="Grupo Embalarte"> -->
    </div>

    <!-- Div com Cards -->
    <div class="D-flex JC-center ALITEM-flex-start HEIGHT-56vh OFLOW-auto">

      <!-- Lista de cards -->
      <div class="lista-cards row row-cols-2 row-cols-md-4 D-flex JC-flex-start MARGIN-B5 g-3">

        <div class="col D-flex ALITEM-center JC-center" title="⛔ Usuário sem permissão">
          <div class="card card-setor BOR-azul-0 WIDTH-80 ">
            <NuxtLink to="sla/informar-entrega"
              id="1" class="TEXTDECO-none card-nuxtlink BORRAD-5">
              <div class="card-body D-flex FD-column ALITEM-center JC-space-between">
                <IconsCaminhao
                  class="logo-setor"
                  corProp="rgb(var(--cor-azul-fin))"
                  alturaProp="8"
                  larguraProp="8"
                />
                <p class="nome-setor FFAMILY-monospace COLOR-azul-preto">Informar Entrega</p>
              </div>
            </NuxtLink>
          </div>
        </div>

        <div class="col D-flex ALITEM-center JC-center" title="⛔ Usuário sem permissão">
          <div class="card card-setor BGC-branco  BOR-azul-0 WIDTH-80">
            <NuxtLink to="sla/consulta-estoque" id="3" class="TEXTDECO-none card-nuxtlink BORRAD-5">
              <div class="card-body D-flex FD-column ALITEM-center JC-space-around">
                <IconsEstoque
                  class="logo-setor"
                  corProp="rgba(var(--cor-verde))"
                  alturaProp="8"
                  larguraProp="8"
                />
                <p class="nome-setor FFAMILY-monospace COLOR-azul-preto">Estoque</p>
              </div>
            </NuxtLink>
          </div>
        </div>

      </div>

    </div>

    <Rodape />
  </main>
</template>

<style>
/* Como usar cores: Preto, Branco, Cinzas e uma cor brilhante/colorida */
.imagem-fundo-dentro {
  opacity: 0.5;
  object-fit: cover;
  object-position: center;
}

/* .imagem-fundo {
  background-image: url('assets/images/prateleiras-galpao.jpg');
} */
.disabled {
  opacity: 0.2;
  pointer-events: none;
  cursor: not-allowed;
}

.lista-cards { width: 60%; }

/* .nome-setor { font-size: 1px; } */

.nome-setor-area { font-size: 9px; }


@media only screen and (max-width: 768px) { /* Celulares|Tablets */
  .lista-cards { width: 100%; }

  .nome-setor-area { font-size: 7px; }

  /* .logo-setor { width: 100%; height: 100%; } */

  .nome-setor { font-size: 15px; }
}

@media only screen and (min-width : 769px) and (max-width: 1100px) { /* Computadores: Telas menores */
  .nome-setor { font-size: 17px; }
}
</style>