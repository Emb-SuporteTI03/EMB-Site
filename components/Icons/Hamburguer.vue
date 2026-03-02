<template>
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    :width="this.largura + 'em'"
    :height="this.altura + 'em'" 
    viewBox="0 0 24 24"
    > <path 
    :fill="this.cor"
    fillRule="evenodd" 
    clipRule="evenodd"
    d="M20.75 7a.75.75 0 0 1-.75.75H4a.75.75 0 0 1 0-1.5h16a.75.75 0 0 1 .75.75m0 5a.75.75 0 0 1-.75.75H4a.75.75 0 0 1 0-1.5h16a.75.75 0 0 1 .75.75m0 5a.75.75 0 0 1-.75.75H4a.75.75 0 0 1 0-1.5h16a.75.75 0 0 1 .75.75" 
    > </path>
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
    
    name: 'Hamburguer'
  }
  </script>