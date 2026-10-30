// Diretiva v-reveal: o elemento aparece deslizando de baixo quando entra na tela.
// Substitui o v-motion-slide-visible-once-bottom do @vueuse/motion do site antigo.
// Usa atributo data-reveal (e não classe) para não gerar hydration mismatch de class
// e para não ser apagado quando o Vue re-renderiza o class do elemento.
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive<HTMLElement>('reveal', {
    getSSRProps: () => ({ 'data-reveal': '' }),
    mounted(el) {
      if (!el.hasAttribute('data-reveal')) el.setAttribute('data-reveal', '')

      const observer = new IntersectionObserver(([entry]) => {
        if (entry?.isIntersecting) {
          el.setAttribute('data-reveal', 'visible')
          observer.disconnect()
        }
      }, { threshold: 0.15 })

      observer.observe(el)
    }
  })
})
