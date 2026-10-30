<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="this.largura + 'em'"
    :height="this.altura + 'em'"
    viewBox="0 0 48 48"
    ><g
    fill="none"
    :stroke="this.cor"
    stroke-width="4"
    > <path 
    stroke-linecap="round" 
    stroke-linejoin="round" 
    d="M42 24V9a3 3 0 0 0-3-3H9a3 3 0 0 0-3 3v30a3 3 0 0 0 3 3h15">
    </path>
    <circle 
    cx="32" 
    cy="32" 
    r="6"
    > </circle>
    <path 
    stroke-linecap="round" 
    stroke-linejoin="round" 
    d="m37 36l5 4M14 16h20m-20 8h8">
    </path>
    </g>
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
  
  name: 'Consulta'
}
</script>