// 拼接 SEO 文案 key，例如 meta.title 或 about.meta.title。
export const createSeoKey = (keyPrefix, key) => `${keyPrefix}.${key}`

// 根据图片路径生成兜底 alt，避免页面图片完全没有替代文本。
export const createImageAlt = (src, fallbackAlt = '') => {
  if (fallbackAlt) {
    return fallbackAlt
  }

  if (!src) {
    return ''
  }

  const fileName = src.split('/').pop().split('?')[0]
  return fileName.replace(/\.[a-z0-9]+$/i, '').replace(/[-_]+/g, ' ')
}

// translate 是 i18n 的翻译函数；keyPrefix 用来支持不同页面的 SEO 文案分组。
export const setupI18nSeo = ({ translate, keyPrefix = 'meta', image = '' }) => {
  // useLocaleHead 会生成 html lang、canonical、hreflang、Open Graph locale 等多语言 SEO 标签。
  const localeHead = useLocaleHead({
    seo: {
      // canonicalQueries 为空表示 canonical 不保留 query 参数，避免重复收录。
      canonicalQueries: [],
    },
  })

  // baseSeoMeta 是所有页面都会输出的标题、描述和社交分享基础字段。
  const baseSeoMeta = {
    title: () => translate(createSeoKey(keyPrefix, 'title')),
    description: () => translate(createSeoKey(keyPrefix, 'description')),
    ogTitle: () => translate(createSeoKey(keyPrefix, 'title')),
    ogDescription: () => translate(createSeoKey(keyPrefix, 'description')),
    twitterCard: 'summary_large_image',
    twitterTitle: () => translate(createSeoKey(keyPrefix, 'title')),
    twitterDescription: () => translate(createSeoKey(keyPrefix, 'description')),
  }

  // 页面传入真实分享图时，才输出图片 SEO 标签，避免引用不存在的图片。
  if (image) {
    baseSeoMeta.ogImage = image
    baseSeoMeta.twitterImage = image
  }

  // useSeoMeta 负责页面基础 SEO 标签，文案来自当前语言 JSON。
  useSeoMeta(baseSeoMeta)

  // useHead 合并 i18n 自动生成的 SEO 标签，其中已经包含规范 canonical 和 hreflang。
  useHead(() => ({
    meta: localeHead.value.meta,
    link: localeHead.value.link,
    htmlAttrs: localeHead.value.htmlAttrs,
  }))
}
