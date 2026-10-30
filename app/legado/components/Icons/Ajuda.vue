<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="this.largura + 'em'"
    :height="this.altura + 'em'"
    viewBox="0 0 14 14"
    > <circle 
    cx="7" 
    cy="7" 
    r="6.5" 
    fill="none" 
    :stroke="this.cor" 
    stroke-linecap="round" 
    stroke-linejoin="round"
    > </circle>  
    <path 
    fill="none" 
    :stroke="this.cor" 
    stroke-linecap="round" 
    stroke-linejoin="round" 
    d="M5.5 5.5A1.5 1.5 0 1 1 7 7v1">
    </path> <path 
    :fill="this.cor" 
    d="M7 9.5a.75.75 0 1 0 .75.75A.76.76 0 0 0 7 9.5Z"
    ></path>
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

  name: 'StreamlineInterfaceHelpQuestionCircleCircleFaqFrameHelpInfoMarkMoreQueryQuestion'
}
</script>