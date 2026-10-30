<template>
  <svg 
    xmlns="http://www.w3.org/2000/svg"
    :width="this.largura + 'em'"
    :height="this.altura + 'em'" 
    viewBox="0 0 16 16"
    > <path 
    :fill="this.cor"
    d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z"/>
  </svg>
</template>

<script>
export default {
  data () {
    return {
      cor: this.$props.corProp,
      altura: this.$props.alturaProp,
      largura: this.$props.larguraProp
    }
  },

  // Props:
  props: {
    corProp: String,
    alturaProp: String,
    larguraProp: String,
  },
  
  name: 'SetaPreenchidaEsquerda'
}
</script>