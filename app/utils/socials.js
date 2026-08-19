const socialPlatformDefinitions = [
  {
    key: 'tiktok',
    label: 'TikTok',
    icon: 'lucide:music-2',
    image: '/images/about/social/tiktok.png',
  },
  {
    key: 'youtube',
    label: 'YouTube',
    icon: 'lucide:youtube',
    image: '/images/about/social/youtube.png',
  },
  {
    key: 'facebook',
    label: 'Facebook',
    icon: 'lucide:facebook',
    image: '/images/about/social/facebook.png',
  },
  {
    key: 'instagram',
    label: 'Instagram',
    icon: 'lucide:instagram',
    image: '/images/about/social/instagram.png',
  },
  {
    key: 'twitch',
    label: 'Twitch',
    icon: 'lucide:tv',
    image: '/images/about/social/twitch.png',
  },
]

const isRecord = value => value && typeof value === 'object' && !Array.isArray(value)

const getSocialsObject = (source = {}) => {
  const candidates = [
    source.socials,
    source.socialLinks,
    source.footer?.socials,
    source.footer?.socialLinks,
    source.footerobj?.socials,
    source.footerobj?.socialLinks,
    source.footerobj?.footer?.socials,
    source.footerobj?.footer?.socialLinks,
  ]

  return candidates.find(isRecord) || (isRecord(source) ? source : {})
}

export const getSocialContentData = (response) => {
  const records = response?.data
  const firstRecord = Array.isArray(records) ? records[0] : records
  const record = firstRecord?.attributes || firstRecord || {}

  return record.data?.attributes || record.data || record.socials || record
}

export const normalizeSocialHref = value => {
  const href = String(value || '').trim()

  if (!href) {
    return ''
  }

  const normalizedHref = /^https?:\/\//i.test(href)
    ? href
    : /^[\w.-]+\.[a-z]{2,}(?:[/:?#]|$)/i.test(href)
      ? `https://${href}`
      : ''

  try {
    const url = new URL(normalizedHref)

    return url.protocol === 'http:' || url.protocol === 'https:' ? url.toString() : ''
  } catch {
    return ''
  }
}

export const createSocialLinks = (source = {}) => {
  const socials = getSocialsObject(source)

  return socialPlatformDefinitions.map(platform => {
    const configuredHref = normalizeSocialHref(socials[platform.key])

    if (!configuredHref) {
      return null
    }

    return {
      ...platform,
      href: configuredHref,
    }
  }).filter(Boolean)
}
