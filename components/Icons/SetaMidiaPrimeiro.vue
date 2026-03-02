<template>
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    :width="this.largura + 'em'"
    :height="this.altura + 'em'"
    viewBox="0 0 24 24" 
  > <path 
    :fill="this.cor" 
    d="m18 18l-8.5-6L18 6v12ZM8 18H6V6h2v12Z">
    </path>
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
  
  name: 'CiSearchMagnifyingGlass'
}
</script>