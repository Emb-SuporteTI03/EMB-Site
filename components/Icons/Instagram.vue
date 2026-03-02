<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="this.largura + 'em'"
    :height="this.altura + 'em'" 
		viewBox="0 0 24 24"
		>
    <g
    fill="none"
    :stroke="this.cor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    > <path 
    d="M4 8a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z"
    > </path>
    <path 
    d="M9 12a3 3 0 1 0 6 0a3 3 0 1 0-6 0m7.5-4.5v.01"
    > </path>
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
  
  name: 'Instagram'
}
</script>