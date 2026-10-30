<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="this.largura + 'em'"
    :height="this.altura + 'em'"
    viewBox="0 0 24 24"
    > <path 
    fill="none" 
    :stroke="this.cor"
    stroke-linecap="round" 
    stroke-linejoin="round" 
    stroke-width="2" 
    d="M15 5H9m6 4v3h4l-7 7l-7-7h4V9z">
    </path></svg>
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
  
  name: 'SolteAqui2'
}
</script>