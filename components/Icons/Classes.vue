<template>
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    :width="this.largura + 'em'"
    :height="this.altura + 'em'"
    viewBox="0 0 24 24"
    > <path 
    :fill="this.cor"
    d="M5.616 20q-.667 0-1.141-.475T4 18.386V5.615q0-.666.475-1.14T5.615 4h12.77q.666 0 1.14.475T20 5.615v12.77q0 .666-.475 1.14t-1.14.475z">
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
  
  name: 'Classes'
}
</script>