<script>
export default {
  // Props:
  props: {
    funcionalidadeProp: String,
    destinoVoltarProp: String,
  },

  data () {
    return {
      // Variáveis únicas da página: -----------\
      funcionalidade: this.$props.funcionalidadeProp,
      destinoVoltar: this.$props.destinoVoltarProp,
      ///////////////////////////////////////////
      nomeAbrevUser: localStorage.getItem('nomeAbreviado'),
      isLogoutButtonShowing: true,
    }
  },

  methods: {
    hideShowLogoutButton () {
      this.isLogoutButtonShowing = !this.isLogoutButtonShowing
    },
    clickConfirmaLogoutButton () {
      let siglaLogin = localStorage.getItem('sigla');
      localStorage.clear();
      localStorage.setItem('sigla', siglaLogin);
    },
  },

  mounted () {
  }
}

</script>

<template>

  <nav class="navbar BOX-SHADOW-black D-flex ALITEM-center BGC-branco HEIGHT-6vh WIDTH-100 PADDING-0">
    <div class="container-fluid ALITEM-center">

      <!-- Logo -->
      <!-- <img
        src="assets\images\Logo-E-azul-enhanced.png"
        alt="Logo Grupo Embalarte"
        class="WIDTH-2 HEIGHT-2"
        title="Grupo Embalarte"
      /> -->

      <NuxtLink
        class="TEXTDECO-none WIDTH-3"
        to="/"
        title="Home"
      > <IconsHome corProp="black" alturaProp="2" larguraProp="2" />
      </NuxtLink>

      <!-- Título da página -->
      <span
        class="D-flex JC-center FSIZE-30px FWEIGHT-bold WIDTH-80"
      >{{ this.funcionalidade }}</span>

      <div class="D-flex WIDTH-10 JC-flex-end ALITEM-center">

        <!-- Botão Ajuda -->
        <!-- <button
          type="button"
          class="BGC-transparent BOR-none BORRAD-30"
          data-bs-toggle="modal"
          data-bs-target="#tutorialModal"
          title="Tutorial"
        ><IconsMedioAjuda /></button> -->
        
        <!-- Botão LOGOUT -->
        <div>
           <span v-if="isLogoutButtonShowing"><strong>{{ this.nomeAbrevUser }}</strong></span>
         </div>

        <button
          v-if="isLogoutButtonShowing"
          title="Sair"
          class="ANIMATION-OPA-0-1 COLOR-azul-login BOR-none BORRAD-5 BGC-transparent"
          @click="hideShowLogoutButton"
        ><IconsUserRedondo
          corProp="black"
          alturaProp="2"
          larguraProp="2"
        /></button>

        <!-- Opção para confirmar Logout -->
        <div v-if="!isLogoutButtonShowing" class="D-flex ANIMATION-OPA-0-1 FD-column BORRAD-10 MARGIN-T-5"
          :class="{ 'show': !isLogoutButtonShowing }"
        >
          <p class="FSIZE-11px">Confirma o Logout?</p>
          <div class="MARGIN-T-22 WIDTH-100 HEIGHT-70">
            <!-- Botão 'NÃO' -->
            <button
              class="btn btn-danger BORRAD-0 WIDTH-50 HEIGHT-20px FSIZE-10px PADDING-T3-B18 BOR-B-L-RAD-10"
              @click="hideShowLogoutButton"
            >Não</button>
            <!-- Botão 'SIM' -->
            <NuxtLink to="/login" >
              <button
                class="btn btn-success BORRAD-0 WIDTH-50 HEIGHT-20px FSIZE-10px PADDING-T3-B18 BOR-B-R-RAD-10"
                @click="this.clickConfirmaLogoutButton()"
              >Sim</button>
            </NuxtLink>
          </div>
        </div>

      </div>

    </div>
  </nav>

</template>

<style></style>