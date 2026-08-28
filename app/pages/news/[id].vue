<template>
  <div class="news-article-shell">
    <SiteHeader />

    <main class="news-article-main">
      <div class="news-article-header" :style="coverStyle">
        <div class="page-container news-article-header-inner">
          <nav class="news-article-breadcrumb" :aria-label="articleCopyCrumbs.breadcrumb">
            <NuxtLink :to="localePath('/news')">{{ articleCopyCrumbs.home }}</NuxtLink>
            <span class="news-article-breadcrumb-sep">/</span>
            <NuxtLink :to="categoryNewsPath" class="news-article-breadcrumb-category">{{ article.category }}</NuxtLink>
            <span class="news-article-breadcrumb-sep">/</span>
            <span class="news-article-breadcrumb-current">{{ article.title }}</span>
          </nav>

          <div class="news-article-header-content">
            <span class="news-article-category">{{ article.category }}</span>
            <h1 class="news-article-title">{{ article.title }}</h1>
            <div class="news-article-meta">
              <img
                v-if="article.authorAvatar"
                :src="article.authorAvatar"
                alt=""
                aria-hidden="true"
                class="news-article-avatar"
              >
              <span
                v-else
                class="news-article-avatar news-article-avatar-fallback"
                aria-hidden="true"
              >{{ article.author.slice(0, 1).toUpperCase() }}</span>
              <div class="news-article-author-info">
                <span class="news-article-author">{{ article.author }}</span>
                <span class="news-article-time">{{ newsPageCopy.publishedLabel }} {{ article.date }}</span>
              </div>
              <button
                type="button"
                class="news-article-share"
                :aria-label="newsPageCopy.aria.share"
                @click="shareArticle"
              >
                <Icon name="lucide:share-2" aria-hidden="true" />
                <span>{{ newsPageCopy.share }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="page-container news-article-container">
        <div class="news-article-body">
          <template v-for="(block, index) in article.content" :key="index">
            <p v-if="block.type === 'p'" class="news-article-paragraph">{{ block.text }}</p>
            <figure v-else-if="block.type === 'img'" class="news-article-figure">
              <img
                :src="resolveContentImage(block.src)"
                :alt="block.alt || article.title"
                loading="lazy"
              >
            </figure>
          </template>
        </div>

        <p v-if="newsPageCopy.note" class="news-article-note">{{ newsPageCopy.note }}</p>

        <nav
          v-if="prevArticle || nextArticle"
          class="news-article-pagination"
          :class="{ 'news-article-pagination--both': prevArticle && nextArticle }"
          :aria-label="newsPageCopy.aria.pagination"
        >
          <NuxtLink
            v-if="prevArticle"
            :to="localePath(`/news/${prevArticle.dateKey || prevArticle.id}`)"
            class="news-article-pager news-article-pager-prev"
          >
            <Icon name="lucide:chevron-left" class="news-article-pager-arrow" />
            <span class="news-article-pager-content">
              <span class="news-article-pager-label">{{ newsPageCopy.pagination.prev }}</span>
              <span class="news-article-pager-title">{{ prevArticle.title }}</span>
            </span>
          </NuxtLink>

          <NuxtLink
            v-if="nextArticle"
            :to="localePath(`/news/${nextArticle.dateKey || nextArticle.id}`)"
            class="news-article-pager news-article-pager-next"
          >
            <span class="news-article-pager-content">
              <span class="news-article-pager-title">{{ nextArticle.title }}</span>
              <span class="news-article-pager-label">{{ newsPageCopy.pagination.next }}</span>
            </span>
            <Icon name="lucide:chevron-right" class="news-article-pager-arrow" />
          </NuxtLink>
        </nav>

        <section class="news-article-recommended" aria-labelledby="news-article-recommended-title">
          <h2 id="news-article-recommended-title" class="news-article-recommended-title">{{ newsPageCopy.moreTitle }}</h2>
          <div class="news-article-recommended-grid">
            <NuxtLink
              v-for="item in recommendedArticles"
              :key="item.id"
              :to="localePath(`/news/${item.dateKey || item.id}`)"
              class="news-article-recommended-card"
            >
              <div class="recommended-card-visual">
                <img v-if="item.image" :src="item.image" :alt="item.title">
              </div>
              <div class="recommended-card-meta">
                <span class="recommended-card-category">{{ item.category }}</span>
                <time :datetime="item.dateIso">{{ item.date }}</time>
              </div>
              <h3 class="recommended-card-title">{{ item.title }}</h3>
            </NuxtLink>
          </div>
        </section>
      </div>
    </main>

    <SiteFooter />
  </div>
</template>

<script setup>
import SiteFooter from '../../components/SiteFooter.vue'
import SiteHeader from '../../components/SiteHeader.vue'
import { getNews, getNewsArticle as fetchStrapiArticle, getNewsPage } from '../../api/request/strapi'
import { setupPageSeo } from '../../utils/seo'
import { buildCategoryLabelMap, normalizeNewsPage, normalizeStrapiArticle, normalizeStrapiArticles } from '../../utils/news'
import { useSiteToast } from '../../composables/useSiteToast'

// 动态页：路由参数（文章 id / 语言前缀）变化时重新挂载，确保推荐列表和文章都按当前语言拉取，避免 404 或旧数据。
definePageMeta({
  key: (route) => route.fullPath,
})

const route = useRoute()
const localePath = useLocalePath()
const { locale } = useI18n()
const strapiBase = String(useRuntimeConfig().public.strapiUrl || '').replace(/\/+$/, '')
const { showSuccessToast, showErrorToast } = useSiteToast()

const resolveContentImage = (src) => {
  if (!src) {
    return ''
  }
  if (/^(?:https?:)?\/\//i.test(src)) {
    return src
  }
  return `${strapiBase}${src}`
}

const copyTextToClipboard = async (text) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }

  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  textarea.remove()
}

const shareArticle = async () => {
  const url = window.location.href
  try {
    await copyTextToClipboard(url)
    showSuccessToast(newsPageCopy.value.shareToast)
  } catch {
    showErrorToast(newsPageCopy.value.shareToastError)
  }
}

const routeId = computed(() => String(route.params.id || ''))

const { data: rawArticleList } = await useAsyncData(
  `news-list-${locale.value}`,
  () => getNews(locale.value)
    .then((response) => normalizeStrapiArticles(response, strapiBase))
    .catch(() => [])
)

const { data: newsPageData } = await useAsyncData(
  `news-page-${locale.value}`,
  () => getNewsPage(locale.value)
    .then((response) => normalizeNewsPage(response))
    .catch(() => ({
      hero: {},
      breadcrumb: {},
      note: '',
      pagination: {},
      moreTitle: '',
      categories: [],
      readMore: '',
      emptyText: '',
      publishedLabel: '',
      share: '',
      shareToast: '',
      shareToastError: '',
      aria: {},
    }))
)

const newsPageCopy = computed(() => newsPageData.value || {
  hero: {},
  breadcrumb: {},
  note: '',
  pagination: {},
  moreTitle: '',
  categories: [],
  readMore: '',
  emptyText: '',
  publishedLabel: '',
  share: '',
  shareToast: '',
  shareToastError: '',
  aria: {},
})

const categoryLabelMap = computed(() => buildCategoryLabelMap(newsPageCopy.value.categories))
const articleList = computed(() => {
  const list = rawArticleList.value || []
  return list.map((item) => ({
    ...item,
    category: categoryLabelMap.value[item.categoryKey] || item.categoryKey,
  }))
})

// 用统一的跨语言 key 解析当前语言下该文章的真实 documentId：
// 优先 dateKey（各语种稳定一致），兼容旧式 documentId 直接访问。
const resolvedArticleDocId = computed(() => {
  const key = routeId.value
  const list = articleList.value || []

  if (!key) {
    return ''
  }

  const match = list.find((item) => item.dateKey === key) || list.find((item) => item.id === key)

  return match ? match.id : key
})

const { data: remoteArticle } = await useAsyncData(
  computed(() => `news-article-${routeId.value}-${locale.value}-${resolvedArticleDocId.value}`),
  () => {
    const docId = resolvedArticleDocId.value

    if (!docId) {
      return null
    }

    return fetchStrapiArticle(docId, locale.value)
      .then((response) => normalizeStrapiArticle(response?.data, strapiBase))
      .catch(() => null)
  }
)

const article = computed(() => {
  const article = remoteArticle.value
  if (!article) {
    return null
  }

  return {
    ...article,
    category: categoryLabelMap.value[article.categoryKey] || article.categoryKey,
  }
})

const articleCopyCrumbs = computed(() => ({
  breadcrumb: newsPageCopy.value.aria.breadcrumb || '',
  home: newsPageCopy.value.breadcrumb?.home || '',
}))

const categoryNewsPath = computed(() => {
  const key = article.value?.categoryKey

  return key ? `${localePath('/news')}?category=${encodeURIComponent(key)}` : localePath('/news')
})

const currentIndex = computed(() => {
  const id = article.value?.id
  const list = articleList.value || []
  if (!id) {
    return -1
  }
  return list.findIndex((item) => item.id === id)
})

const prevArticle = computed(() => {
  const index = currentIndex.value
  const list = articleList.value || []
  return index >= 0 && index < list.length - 1 ? list[index + 1] : null
})

const nextArticle = computed(() => {
  const index = currentIndex.value
  const list = articleList.value || []
  return index > 0 ? list[index - 1] : null
})

const recommendedArticles = computed(() => {
  const current = article.value
  const list = articleList.value || []
  if (!current) {
    return []
  }
  const others = list.filter((item) => item.id !== current.id)
  const sameCategory = others.filter((item) => item.categoryKey === current.categoryKey)
  const rest = others.filter((item) => item.categoryKey !== current.categoryKey)
  return [...sameCategory, ...rest].slice(0, 3)
})

const coverStyle = computed(() => {
  const cover = article.value.cover || article.value.image
  return cover
    ? { '--news-article-cover-img': `url(${cover})` }
    : {}
})

if (!article.value) {
  throw createError({ statusCode: 404, statusMessage: 'Article not found', fatal: true })
}

setupPageSeo('news', () => ({
  inheritCopy: false,
  title: article.value.title,
  description: article.value.excerpt,
}))
</script>

<style scoped>
.news-article-shell {
  --news-page-bg: #050a14;
  --news-panel-bg: #0b1220;
  --news-visual-bg: #0a1020;
  --news-title: #ffffff;
  --news-text: #cbd5e1;
  --news-muted: #77839a;
  --news-tag-color: #4fabff;
  --news-tag-bg: rgba(31, 127, 232, 0.16);
  --news-border: rgba(255, 255, 255, 0.07);
  --news-divider: rgba(255, 255, 255, 0.06);
  --news-hover-bg: rgba(255, 255, 255, 0.03);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-top: var(--page-header-height);
  color: var(--theme-text);
  background: var(--news-page-bg);
}

.news-article-main {
  width: 100%;
  flex: 1;
}

.news-article-container {
  width: min(100%, 1155px);
  max-width: 1155px;
  padding-top: 44px;
  padding-bottom: 90px;
}

.news-article-breadcrumb {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.82);
  font-size: 13px;
}

.news-article-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.news-article-share {
  flex: 0 0 auto;
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 16px;
  border: 1px solid transparent;
  border-radius: 8px;
  color: #ffffff;
  background: linear-gradient(135deg, #1f7fe8, #2aa2ff);
  font-size: 13px;
  font-weight: 500;
  line-height: 1;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(31, 127, 232, 0.35);
  transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
}

.news-article-share:hover {
  filter: brightness(1.06);
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(31, 127, 232, 0.45);
}

.news-article-share svg {
  width: 17px;
  height: 17px;
}

.news-article-breadcrumb a {
  color: rgba(255, 255, 255, 0.82);
  transition: color 0.2s ease;
}

.news-article-breadcrumb a:hover {
  color: #ffffff;
}

.news-article-breadcrumb-sep {
  color: rgba(255, 255, 255, 0.4);
}

.news-article-breadcrumb-current {
  color: #ffffff;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 320px;
}

.news-article-header {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 320px;
  padding: 30px 0 15px;
  margin-bottom: 0;
  overflow: hidden;
  background-color: var(--news-visual-bg);
}

.news-article-header-inner {
  display: flex;
  flex-direction: column;
  flex: 1;
  width: min(100%, 1155px);
  max-width: 1155px;
}

.news-article-header::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background-image: var(--news-article-cover-img);
  background-size: cover;
  background-position: center;
}

.news-article-header::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: linear-gradient(90deg, rgba(2, 6, 23, 0.82) 0%, rgba(2, 6, 23, 0.48) 46%, rgba(2, 6, 23, 0.08) 100%);
}

.news-article-header > * {
  position: relative;
  z-index: 1;
}

.news-article-header-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 48px;
}

.news-article-category {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  align-self: flex-start;
  width: 74px;
  height: 26px;
  white-space: nowrap;
  border-radius: 6px;
  color: var(--news-tag-color);
  background: var(--news-tag-bg);
  font-size: 11px;
  font-weight: 500;
  line-height: 1;
}

.news-article-title {
  max-width: 1000px;
  margin-top: 18px;
  color: #ffffff;
  font-size: 32px;
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: 0.01em;
}

.news-article-meta {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 60px;
}

.news-article-avatar {
  flex: 0 0 auto;
  width: 51px;
  height: 51px;
  border-radius: 50%;
  object-fit: cover;
}

.news-article-avatar-fallback {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  background: linear-gradient(135deg, #1f7fe8, #2aa2ff);
  font-size: 22px;
}

.news-article-author-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
}

.news-article-author {
  display: inline-flex;
  align-items: center;
  color: #ffffff;
  font-size: 20px;
  font-weight: 600;
  line-height: 1;
}

.news-article-time {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  line-height: 1;
}

.news-article-body {
  margin-bottom: 34px;
}

.news-article-body {
  margin-top: 30px;
}

.news-article-paragraph {
  margin-bottom: 22px;
  color: var(--news-text);
  font-size: 16px;
  line-height: 1.9;
  text-indent: 2em;
}

.news-article-figure {
  margin: 26px 0 30px;
  border-radius: 12px;
  overflow: hidden;
}

.news-article-figure img {
  height: auto;
  display: block;
  border-radius: 12px;
}

.news-article-note {
  margin-top: 6px;
  padding-top: 18px;
  border-top: 1px solid var(--news-divider);
  color: var(--news-muted);
  font-size: 13px;
  line-height: 1.8;
}

.news-article-pagination {
  display: flex;
  align-items: stretch;
  margin-top: 40px;
  border: 1px solid var(--news-border);
  border-radius: 12px;
  background: var(--news-panel-bg);
  overflow: hidden;
}

.news-article-pager {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 20px;
  color: var(--news-text);
  transition: background 0.2s ease;
}

.news-article-pager:hover {
  background: var(--news-hover-bg);
}

.news-article-pager-prev {
  text-align: left;
}

.news-article-pager-next {
  justify-content: flex-end;
  text-align: right;
}

.news-article-pagination--both .news-article-pager-prev {
  border-right: 1px solid var(--news-divider);
}

.news-article-pager-label {
  color: var(--news-muted);
  font-size: 12px;
}

.news-article-pager-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.news-article-pager-arrow {
  flex: 0 0 auto;
  width: 20px;
  height: 20px;
  color: var(--news-tag-color);
}

.news-article-pager-title {
  color: var(--news-title);
  font-size: 14px;
  font-weight: 600;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-article-recommended {
  margin-top: 48px;
}

.news-article-recommended-title {
  color: var(--news-title);
  font-size: 24px;
  font-weight: 700;
}

.news-article-recommended-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
  margin-top: 22px;
  width: 100%;
}

.news-article-recommended-card {
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--news-border);
  border-radius: 12px;
  background: var(--news-panel-bg);
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.news-article-recommended-card:hover {
  border-color: rgba(56, 168, 255, 0.5);
  transform: translateY(-3px);
}

.recommended-card-visual {
  width: 100%;
  aspect-ratio: 5 / 2;
  overflow: hidden;
  background: var(--news-visual-bg);
}

.recommended-card-visual img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.recommended-card-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px 0;
}

.recommended-card-category {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  height: 24px;
  padding: 0 10px;
  border-radius: 6px;
  color: var(--news-tag-color);
  background: var(--news-tag-bg);
  font-size: 11px;
  font-weight: 500;
  line-height: 1;
}

.recommended-card-meta time {
  color: var(--news-muted);
  font-size: 12px;
}

.recommended-card-title {
  margin: 0;
  padding: 10px 16px 16px;
  color: var(--news-title);
  font-size: 16px;
  font-weight: 700;
  line-height: 1.45;
}

:root[data-theme="light"] .news-article-shell {
  --news-page-bg: #f6f8fb;
  --news-panel-bg: #ffffff;
  --news-visual-bg: #eef1f6;
  --news-title: #1b2433;
  --news-text: #4b5563;
  --news-muted: #9aa4b5;
  --news-tag-color: #1f7fe8;
  --news-tag-bg: rgba(31, 127, 232, 0.12);
  --news-border: rgba(31, 41, 55, 0.1);
  --news-divider: rgba(31, 41, 55, 0.08);
  --news-hover-bg: rgba(31, 41, 55, 0.04);
}

@media (max-width: 900px) {
  .news-article-recommended-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 600px) {
  .news-article-container {
    padding-top: 24px;
    padding-bottom: 56px;
  }

  .news-article-breadcrumb-current {
    max-width: 200px;
  }

  .news-article-header {
    height: 360px;
    padding: 28px 26px;
  }

  .news-article-title {
    font-size: 32px;
  }

  .news-article-avatar {
    width: 40px;
    height: 40px;
  }

  .news-article-author {
    font-size: 16px;
  }

  .news-article-time {
    font-size: 14px;
  }

  .news-article-pagination {
    flex-direction: column;
  }

  .news-article-pager-prev {
    border-right: none;
  }

  .news-article-pagination--both .news-article-pager-prev {
    border-bottom: 1px solid var(--news-divider);
  }

  .news-article-recommended-grid {
    grid-template-columns: 1fr;
  }
}
</style>
