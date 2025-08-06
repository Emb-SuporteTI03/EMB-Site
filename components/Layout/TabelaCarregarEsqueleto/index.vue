<script>
export default {
  props: {
    Linhas: Number,
    Colunas: Number
  },
  
  data () {
    return {
      linhasValor: this.$props.Linhas,
      colunasValor: this.$props.Colunas,
    }
  },
}
</script>

<template>

  <tbody class="BORRAD-5 BOR-B-grey-5">
    <tr v-for="(i) in linhasValor"  class="">
      <td v-for="(j) in colunasValor" :key="j">
        <p class="loading-elements">Padrão</p>
      </td>
    </tr>
  </tbody>

</template>

<style>
.loading-elements {
  border-radius: 5px;
  animation: pulse-bg 1.5s infinite, pulse-text 1.5s infinite;
}

@keyframes pulse-bg {
  0% {
    background-color: #f0f0f0;
  }
  50% {
    background-color: #bcbcbc;
  }
  100% {
    background-color: #f0f0f0;
  }
}

@keyframes pulse-text {
  0% {
    color: #f0f0f0;
  }
  50% {
    color: #bcbcbc;
  }
  100% {
    color: #f0f0f0;
  }
}
</style>