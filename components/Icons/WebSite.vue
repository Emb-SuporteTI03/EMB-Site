<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="this.largura + 'em'"
    :height="this.altura + 'em'"
    viewBox="0 0 24 24"
    > <g 
    fill="none" 
    :stroke="this.cor"
    stroke-linecap="round" 
    stroke-linejoin="round" 
    stroke-width="2"
    > <path 
    d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0-18 0m.6-3h16.8M3.6 15h16.8">
    </path> <path 
    d="M11.5 3a17 17 0 0 0 0 18m1-18a17 17 0 0 1 0 18">
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

  name: 'WebSite'
}
</script>