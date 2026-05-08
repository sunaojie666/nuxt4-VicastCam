export default defineNuxtPlugin((nuxtApp) => {
  const revealSelector = '[data-reveal]'

  nuxtApp.hook('app:mounted', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    document.documentElement.classList.add('reveal-ready')

    if (prefersReducedMotion) {
      document.querySelectorAll(revealSelector).forEach((element) => {
        element.classList.add('is-revealed')
      })
      return
    }

    const observedElements = new WeakSet()

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return
        }

        entry.target.classList.add('is-revealed')
        observer.unobserve(entry.target)
      })
    }, {
      threshold: 0.16,
      rootMargin: '0px 0px -12% 0px',
    })

    const observeRevealElements = () => {
      document.querySelectorAll(revealSelector).forEach((element) => {
        if (observedElements.has(element)) {
          return
        }

        observedElements.add(element)
        observer.observe(element)
      })
    }

    observeRevealElements()

    const mutationObserver = new MutationObserver(observeRevealElements)
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    })
  })
})
