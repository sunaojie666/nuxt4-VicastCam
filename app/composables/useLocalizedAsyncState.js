export const useLocalizedAsyncState = ({
  locale,
  loadedLocale,
  load,
  sync,
  reset,
}) => {
  let requestId = 0

  const getCurrentLocale = () => locale.value
  const isLoaded = computed(() => loadedLocale.value === getCurrentLocale())

  const loadContent = () => {
    const currentRequestId = ++requestId
    const currentLocale = getCurrentLocale()

    return load(currentLocale).then(
      response => {
        if (currentRequestId !== requestId || currentLocale !== getCurrentLocale()) {
          return
        }

        sync(response, currentLocale)
        loadedLocale.value = currentLocale
      },
      () => {
        if (currentRequestId !== requestId || currentLocale !== getCurrentLocale()) {
          return
        }

        reset?.(currentLocale)
        loadedLocale.value = ''
      }
    )
  }

  const loadIfNeeded = () => {
    if (!isLoaded.value) {
      return loadContent()
    }

    return Promise.resolve()
  }

  onServerPrefetch(() => {
    return loadContent()
  })

  onMounted(() => {
    loadIfNeeded()
  })

  watch(locale, () => {
    loadContent()
  })

  return {
    isLoaded,
    loadContent,
    loadIfNeeded,
  }
}
