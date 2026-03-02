<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="this.largura + 'em'"
    :height="this.altura + 'em'"
    viewBox="0 0 24 24">
      <path
        fill="none"
        :stroke="this.cor"
        stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 11l-4 4l4 4m-4-4h11a4 4 0 0 0 0-8h-1" /></svg>
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
  
  name: 'TablerArrowBack'
}
</script>