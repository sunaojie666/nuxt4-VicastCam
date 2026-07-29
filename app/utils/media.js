import { computed, useRuntimeConfig } from '#imports'
import { createMediaUrl, defaultMediaUrl, normalizeMediaBaseUrl } from '../../media.config'

export { createMediaUrl, defaultMediaUrl, normalizeMediaBaseUrl }

export const useMediaBaseUrl = () => {
  const config = useRuntimeConfig()

  return computed(() => normalizeMediaBaseUrl(config.public.mediaUrl || defaultMediaUrl))
}

export const useMediaUrl = () => {
  const mediaBaseUrl = useMediaBaseUrl()

  return path => createMediaUrl(path, mediaBaseUrl.value)
}
