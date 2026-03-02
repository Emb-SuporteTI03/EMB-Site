<template>
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    :width="this.largura + 'em'"
    :height="this.altura + 'em'"
    viewBox="0 0 24 24" 
  > <path 
      :fill="this.cor"
      d="M18 18h-2V6h2v12ZM6 18V6l8.5 6L6 18Z">
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