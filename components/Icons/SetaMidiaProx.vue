<template>
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    :width="this.largura + 'em'"
    :height="this.altura + 'em'"
    viewBox="0 0 24 24" 
  > <path 
      :fill="this.cor"
      d="m14.5 12l-5-5v10l5-5Z">
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