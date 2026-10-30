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
      d="m15 15l6 6m-11-4a7 7 0 1 1 0-14a7 7 0 0 1 0 14">
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
  
  name: 'Lupa'
}
</script>



