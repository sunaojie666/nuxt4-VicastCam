export default defineNuxtPlugin((nuxtApp) => {
  const scrollToTop = () => {
    if (window.location.hash) {
      window.history.replaceState(
        window.history.state,
        '',
        `${window.location.pathname}${window.location.search}`,
      )
    }

    window.scrollTo(0, 0)
  }

  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual'
  }

  scrollToTop()

  nuxtApp.hook('app:mounted', () => {
    scrollToTop()
    window.requestAnimationFrame(scrollToTop)
    window.setTimeout(scrollToTop, 0)
  })
})
