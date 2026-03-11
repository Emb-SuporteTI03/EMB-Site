<script>
import { useAuthStore } from '~/stores/auth';

export default {
  // Props:
  props: {
    funcionalidadeProp: String,
    destinoVoltarProp: String,
    notShowVoltareHomeProp: Boolean,
    srcFoto: String,

    // 👇 NOVA PROP OPCIONAL
    onClickVoltarHome: {
      type: Function,
      required: false
    }
  },


  data () {
    return {
      // Variáveis únicas da página: -----------\
      funcionalidade: this.$props.funcionalidadeProp,
      destinoVoltar: this.$props.destinoVoltarProp,
      notShowVoltareHome: this.$props.notShowVoltareHomeProp,
      ///////////////////////////////////////////
      nomeAbrevUser: localStorage.getItem('nomeAbreviado'),
      isLogoutButtonShowing: true,
    }
  },

  methods: {
    hideShowLogoutButton () {
      this.isLogoutButtonShowing = !this.isLogoutButtonShowing
    },

    clickConfirmaLogoutButton() {
      const authStore = useAuthStore();

      const siglaLogin = localStorage.getItem('sigla')
      let cookiesAceitos = localStorage.getItem('cookiesAceitos');
      let privacidadeAceita = localStorage.getItem('politicaPrivacidadeAceita');

      // limpa estado do pinia
      authStore.logout()

      // limpa storage
      localStorage.clear()

      localStorage.setItem('cookiesAceitos', cookiesAceitos);
      localStorage.setItem("politicaPrivacidadeAceita", privacidadeAceita)


      // restaura sigla
      if (siglaLogin) {
        localStorage.setItem('sigla', siglaLogin)
      }

      // redireciona
      navigateTo('/')
    },

    // 👇 MÉTODO CENTRALIZADO
    handleClickVoltarHome () {
      if (typeof this.onClickVoltarHome === 'function') {
        this.onClickVoltarHome()
      }
    }
  },


  mounted () {
  }
}

</script>

<template>

  <nav class="navbar BOX-SHADOW-black D-flex ALITEM-center BGC-branco HEIGHT-6vh WIDTH-100 PADDING-0">
  
    <div class="container-fluid ALITEM-center">

      <div class="D-flex ALITEM-center">
      <NuxtLink
        v-if="!this.notShowVoltareHome"
        class="TEXTDECO-none MARGIN-R26"
        :to="this.destinoVoltar"
        title="Voltar"
        @click.native="handleClickVoltarHome"
      >
        <IconsSetaArrowEsquerda corProp="black" alturaProp="2" larguraProp="2" />
      </NuxtLink>


      <NuxtLink
        v-if="!this.notShowVoltareHome"
        class="TEXTDECO-none MARGIN-R10"
        to="/"
        title="Home"
        @click.native="handleClickVoltarHome"
      >
        <IconsHome corProp="black" alturaProp="2" larguraProp="2" />
      </NuxtLink>

        <!-- Imagem -->
        <!-- <img
          :src="srcFoto"
          alt="Logo do cliente"
          class="IMG-logo"
        /> -->

      </div>

      <div class="D-flex JC-space-between ALITEM-center WIDTH-0">
        <!-- Título -->
        <span class="FSIZE-30px FWEIGHT-bold">
          {{ funcionalidade }} 
        </span>
      </div>

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
            <NuxtLink to="/" >
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

<style>
.IMG-logo {
  height: 30px;
  object-fit: contain;
  margin-left: 1rem;
}
</style>