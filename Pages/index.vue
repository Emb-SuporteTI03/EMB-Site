<template>
    <MenuSuperior @cookies-aceitos="cookiesAceitosDoMenu" />
    <Carrossel />
    <QuemSomos />
    <Contato />

    <div v-if="mostrarAvisoCookies" class="cookie-bar">

        <div class="cookie-conteudo">

            <div class="cookie-texto">
            Utilizamos cookies e tecnologias de armazenamento local para melhorar sua experiência.
            Ao continuar navegando, você concorda com nossa
            <a href="/Politica-de-Privacidade" target="_blank">Política de Privacidade</a>.
            </div>

            <div class="cookie-botoes">
            <button class="btn btn-secondary btn-sm" @click="recusarCookies">
                Recusar
            </button>

            <button class="btn btn-light btn-sm" @click="aceitarCookies">
                Aceitar
            </button>
            </div>

        </div>

    </div>

    <Rodape />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const mostrarAvisoCookies = ref(false)

onMounted(() => {
  const escolha = localStorage.getItem("cookiesAceitos")

  if (!escolha) {
    mostrarAvisoCookies.value = true
  }
})

const cookiesAceitosDoMenu = () => {
  mostrarAvisoCookies.value = false
}

const aceitarCookies = () => {
  localStorage.setItem("cookiesAceitos", "true")
  mostrarAvisoCookies.value = false
}

const recusarCookies = () => {
  localStorage.setItem("cookiesAceitos", "false")
  mostrarAvisoCookies.value = false
}
</script> 

<style scoped>
.cookie-bar{
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;

  background: #1f1f1f;
  color: white;

  padding: 16px 24px;
  z-index: 9999;

  box-shadow: 0 -3px 10px rgba(0,0,0,0.2);
}

.cookie-conteudo{
  max-width: 1100px;
  margin: auto;

  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.cookie-texto{
  font-size: 14px;
  line-height: 1.4;
}

.cookie-texto a{
  color: #7fd3ff;
  text-decoration: underline;
}

.cookie-botoes{
  display: flex;
  gap: 10px;
}
</style>