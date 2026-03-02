<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="this.largura + 'em'"
    :height="this.altura + 'em'"
    viewBox="0 0 24 24"
  ><path
      :fill="this.cor"
      d="M8 4a2 2 0 0 0-2 2v4h2V6h8v3h-2.5l3.5 3.5L20.5 9H18V6a2 2 0 0 0-2-2zm-5 8v2h8v-2zm0 3v2h8v-2zm10 0v2h8v-2zM3 18v2h8v-2zm10 0v2h8v-2z">
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

  name: 'MdiTransfer'
}
</script>