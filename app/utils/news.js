const isRecord = (value) => value && typeof value === 'object' && !Array.isArray(value)

const isAbsoluteUrl = (value) => /^(?:https?:)?\/\//i.test(value) || /^data:/i.test(value)

const resolveAssetUrl = (src, base) => {
  const value = String(src || '').trim()

  if (!value) {
    return ''
  }

  if (isAbsoluteUrl(value)) {
    return value
  }

  const normalizedBase = String(base || '').replace(/\/+$/, '')

  return `${normalizedBase}/${value.replace(/^\/+/, '')}`
}

// 兼容 Strapi v4（attributes 包裹）与 v5（扁平字段）两种响应结构。
const getItemData = (item) => {
  if (isRecord(item) && isRecord(item.attributes)) {
    return item.attributes
  }

  return isRecord(item) ? item : {}
}

// 路由参数使用 Strapi 的公开标识 documentId（v5），兼容回退到旧版 id / slug。
const getItemId = (item) => {
  const data = getItemData(item)

  if (data.documentId) {
    return String(data.documentId)
  }

  if (data.document_id) {
    return String(data.document_id)
  }

  if (data.id !== undefined && data.id !== null && data.id !== '') {
    return String(data.id)
  }

  return String(data.slug || '')
}

const getStrapiMediaUrl = (media, base) => {
  if (Array.isArray(media)) {
    return getStrapiMediaUrl(media[0], base)
  }

  if (typeof media === 'string') {
    return resolveAssetUrl(media, base)
  }

  if (isRecord(media)) {
    if (media.attributes) {
      return getStrapiMediaUrl(media.attributes, base)
    }

    if (media.data) {
      return getStrapiMediaUrl(media.data, base)
    }

    if (media.url) {
      return resolveAssetUrl(media.url, base)
    }

    if (media.src) {
      return getStrapiMediaUrl(media.src, base)
    }
  }

  return ''
}

const toDateIso = (value) => {
  if (!value) {
    return ''
  }

  const date = new Date(value)

  return Number.isNaN(date.getTime()) ? String(value) : date.toISOString()
}

// 跨语言稳定的文章 key：各语种同一篇文章的发布日期一致，用它做路由 key 可避免
// “每种语言独立 documentId”导致切语言后 URL 指向不存在的文章而 404。
const toDateKey = (value) => {
  const iso = toDateIso(value)

  return iso ? iso.slice(0, 10) : ''
}

const toDisplayDate = (value) => {
  if (!value) {
    return ''
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return String(value)
  }

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

const collectText = (node) => {
  if (typeof node === 'string') {
    return node
  }

  if (!isRecord(node)) {
    return ''
  }

  if (typeof node.text === 'string') {
    return node.text
  }

  const children = Array.isArray(node.children) ? node.children : []

  return children.map(collectText).join('')
}

// 将 Strapi 富文本块转换为详情页模板所需的 { type: 'p' | 'img' } 结构。
const normalizeContentBlocks = (content, base) => {
  const blocks = Array.isArray(content) ? content : []
  const result = []

  for (const block of blocks) {
    if (!isRecord(block)) {
      continue
    }

    const type = block.type || block.tag || ''

    if (type === 'p' || type === 'paragraph' || type === 'text' || type === 'heading' || type === 'h1' || type === 'h2' || type === 'h3') {
      const text = collectText(block).trim()

      if (text) {
        result.push({ type: 'p', text })
      }

      continue
    }

    if (type === 'img' || type === 'image') {
      const media = block.image || block.src || block.url
      const src = getStrapiMediaUrl(media, base)

      if (src) {
        result.push({
          type: 'img',
          src,
          alt: block.alt || block.alternativeText || block.altText || '',
        })
      }

      continue
    }

    // 其他类型的组件块，尽量按文本 / 图片兜底解析。
    const text = collectText(block).trim()
    const media = block.image || block.src
    const src = media ? getStrapiMediaUrl(media, base) : ''

    if (text) {
      result.push({ type: 'p', text })
    } else if (src) {
      result.push({
        type: 'img',
        src,
        alt: block.alt || block.alternativeText || block.title || '',
      })
    }
  }

  return result
}

const getCategoryKey = (categoryValue, fallback) => {
  if (fallback) {
    return String(fallback)
  }

  if (typeof categoryValue === 'string') {
    return categoryValue
  }

  if (isRecord(categoryValue)) {
    const data = getItemData(categoryValue)

    return String(data.key || data.slug || data.name || data.title || '')
  }

  return ''
}

export const buildCategoryLabelMap = (categories = []) => {
  const map = {}

  for (const category of categories) {
    if (!category || !category.key) {
      continue
    }

    map[String(category.key)] = category.label || category.name || String(category.key)
  }

  return map
}

export const normalizeStrapiArticles = (response, strapiBase = '') => {
  const rawList = Array.isArray(response?.data)
    ? response.data
    : Array.isArray(response)
      ? response
      : []

  return rawList.map((item) => {
    const data = getItemData(item)

    return {
      id: getItemId(data),
      dateKey: toDateKey(data.date || data.publishedAt || data.createdAt),
      title: data.title || '',
      excerpt: data.excerpt || data.summary || data.description || '',
      image: getStrapiMediaUrl(data.coverImg || data.image || data.cover, strapiBase),
      icon: data.icon || '',
      categoryKey: getCategoryKey(data.category, data.categoryKey),
      date: toDisplayDate(data.date || data.publishedAt || data.createdAt),
      dateIso: toDateIso(data.date || data.publishedAt || data.createdAt),
    }
  }).filter((item) => item.id)
}

export const normalizeStrapiArticle = (article, strapiBase = '') => {
  const data = getItemData(article)
  const authorData = data.author ? getItemData(data.author) : {}
  const cover = getStrapiMediaUrl(data.coverImg || data.cover || data.image, strapiBase)
  const authorName = typeof data.author === 'string'
    ? data.author
    : (data.authorName || authorData.name || authorData.title || '')

  return {
    id: getItemId(data),
    dateKey: toDateKey(data.date || data.publishedAt || data.createdAt),
    title: data.title || '',
    excerpt: data.excerpt || data.summary || data.description || '',
    content: normalizeContentBlocks(data.content || data.blocks || data.body, strapiBase),
    categoryKey: getCategoryKey(data.category, data.categoryKey),
    author: authorName || 'VicastCam',
    authorAvatar: getStrapiMediaUrl(data.authorAvatar || data.author_avatar || authorData.avatar || authorData.image, strapiBase),
    cover,
    image: cover,
    date: toDisplayDate(data.date || data.publishedAt || data.createdAt),
    dateIso: toDateIso(data.date || data.publishedAt || data.createdAt),
  }
}

export const normalizeNewsPage = (response) => {
  const records = response?.data
  const firstRecord = Array.isArray(records) ? records[0] : records
  const data = getItemData(firstRecord)
  const source = data.newspage || data.newspageData || data.data || data || {}

  const categories = (Array.isArray(source.categories) ? source.categories : [])
    .map((category) => {
      const item = getItemData(category)

      return {
        key: String(item.key || item.slug || item.name || ''),
        label: String(item.label || item.name || item.value || item.key || ''),
      }
    })
    .filter((category) => category.key)

  return {
    hero: source.hero || {},
    breadcrumb: source.breadcrumb || {},
    note: source.note || '',
    pagination: source.pagination || {},
    moreTitle: source.moreTitle || source.more_title || '',
    categories,
    readMore: source.readMore || source.read_more || '',
    emptyText: source.emptyText || source.empty_text || '',
    publishedLabel: source.publishedLabel || source.published_label || '',
    share: source.share || '',
    shareToast: source.shareToast || source.share_toast || '',
    shareToastError: source.shareToastError || source.share_toast_error || '',
    aria: source.aria || {},
  }
}
