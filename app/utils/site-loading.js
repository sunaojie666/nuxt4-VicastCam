export const siteLoadingStartEvent = 'site-loading:start'
export const siteLoadingEndEvent = 'site-loading:end'

const createLoadingId = () => {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

const emitSiteLoadingEvent = (eventName, detail = {}) => {
  if (!process.client) {
    return
  }

  window.dispatchEvent(new CustomEvent(eventName, {
    detail,
  }))
}

export const startSiteLoading = (detail = {}) => {
  const id = detail.id || createLoadingId()

  emitSiteLoadingEvent(siteLoadingStartEvent, {
    ...detail,
    id,
  })

  return id
}

export const endSiteLoading = (id) => {
  if (!id) {
    return
  }

  emitSiteLoadingEvent(siteLoadingEndEvent, {
    id,
  })
}
