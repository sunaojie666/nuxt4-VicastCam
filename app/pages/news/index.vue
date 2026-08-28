<template>
  <div class="news-page-shell">
    <SiteHeader />

    <main class="news-page-main">
      <section class="news-hero" aria-labelledby="news-title">
        <div class="page-container news-hero-inner">
          <span class="news-eyebrow">{{ newsPageCopy.hero.eyebrow }}</span>
          <h1 id="news-title">{{ newsPageCopy.hero.title }}</h1>
          <strong class="news-hero-lead">{{ newsPageCopy.hero.lead }}</strong>
          <p>{{ newsPageCopy.hero.description }}</p>
        </div>
      </section>

      <section class="news-content page-container" :aria-label="newsPageCopy.aria.newsList">
        <div class="news-toolbar">
          <div class="news-tabs" role="tablist" :aria-label="newsPageCopy.aria.newsTabs">
            <button
              v-for="category in categories"
              :key="category.key"
              type="button"
              :class="['news-tab', { 'news-tab-active': activeCategory === category.key }]"
              role="tab"
              :aria-selected="activeCategory === category.key"
              @click="activeCategory = category.key"
            >{{ category.label }}</button>
          </div>
          <button
            type="button"
            class="news-view-button"
            :aria-label="viewMode === 'list' ? newsPageCopy.aria.toggleToGrid : newsPageCopy.aria.toggleToList"
            @click="toggleViewMode"
          >
            <img
              class="news-view-icon"
              :src="viewMode === 'list' ? '/images/news/icon-view-list.svg' : '/images/news/icon-view-grid.svg'"
              alt=""
              aria-hidden="true"
              role="presentation"
            >
          </button>
        </div>

        <div v-if="filteredArticles.length" :class="viewMode === 'list' ? 'news-list' : 'news-grid'">
          <article
            v-for="article in filteredArticles"
            :key="article.id"
            :class="['news-card', viewMode === 'list' ? 'news-card-list' : 'news-card-grid']"
            @click="selectArticle(article)"
          >
            <div class="news-card-visual">
              <img v-if="article.image" :src="article.image" :alt="article.title">
              <Icon v-else :name="article.icon" aria-hidden="true" />
            </div>
            <div class="news-card-body">
              <div class="news-card-meta">
                <span class="news-card-category">{{ article.category }}</span>
                <time class="news-date-inline" :datetime="article.dateIso">{{ article.date }}</time>
              </div>
              <h2>{{ article.title }}</h2>
              <p>{{ article.excerpt }}</p>
              <time class="news-date-block" :datetime="article.dateIso">{{ article.date }}</time>
              <span class="news-card-link">{{ newsPageCopy.readMore }} <Icon name="lucide:arrow-right" aria-hidden="true" /></span>
            </div>
            <span v-if="viewMode === 'list'" class="news-card-arrow">
              <img src="/images/news/icon-arrow-right.svg" alt="" aria-hidden="true" role="presentation">
            </span>
          </article>
        </div>
        <div v-else class="news-empty">
          <Icon name="lucide:search-x" aria-hidden="true" />
          <p>{{ newsPageCopy.emptyText }}</p>
        </div>
      </section>
    </main>

    <SiteFooter />
  </div>
</template>

<script setup>
import SiteHeader from '../../components/SiteHeader.vue'
import SiteFooter from '../../components/SiteFooter.vue'
import { getNews, getNewsPage } from '../../api/request/strapi'
import { setupPageSeo } from '../../utils/seo'
import { buildCategoryLabelMap, normalizeNewsPage, normalizeStrapiArticles } from '../../utils/news'

const { locale } = useI18n()
const strapiBase = String(useRuntimeConfig().public.strapiUrl || '').replace(/\/+$/, '')
const rawArticles = useState('news-articles', () => [])
const loadedNewsLocale = useState('news-articles-locale', () => '')

const emptyNewsPageCopy = {
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
}
const newsPageCopy = useState('news-page-copy', () => emptyNewsPageCopy)
const loadedNewsPageLocale = useState('news-page-copy-locale', () => '')

useLocalizedAsyncState({
  locale,
  loadedLocale: loadedNewsPageLocale,
  load: (currentLocale) => getNewsPage(currentLocale),
  sync: (response) => {
    const copy = normalizeNewsPage(response)
    newsPageCopy.value = copy
  },
  reset: () => {
    newsPageCopy.value = emptyNewsPageCopy
  },
})

useLocalizedAsyncState({
  locale,
  loadedLocale: loadedNewsLocale,
  load: (currentLocale) => getNews(currentLocale),
  sync: (response) => {
    rawArticles.value = normalizeStrapiArticles(response, strapiBase)
  },
  reset: () => {
    rawArticles.value = []
  },
})

const route = useRoute()
const activeCategory = ref(
  typeof route.query.category === 'string' && route.query.category
    ? route.query.category
    : 'all'
)
const viewMode = ref('grid')

watch(() => route.query.category, (value) => {
  activeCategory.value = typeof value === 'string' && value ? value : 'all'
})
const categories = computed(() => newsPageCopy.value.categories)
const categoryLabelMap = computed(() => buildCategoryLabelMap(newsPageCopy.value.categories))
const articles = computed(() => {
  return rawArticles.value.map((item) => ({
    ...item,
    category: categoryLabelMap.value[item.categoryKey] || item.categoryKey,
  }))
})
const filteredArticles = computed(() => {
  const list = articles.value

  return activeCategory.value === 'all'
    ? list
    : list.filter(article => article.categoryKey === activeCategory.value)
})

const toggleViewMode = () => {
  viewMode.value = viewMode.value === 'list' ? 'grid' : 'list'
}

const localePath = useLocalePath()
const selectArticle = (article) => {
  const key = article.dateKey || article.id

  navigateTo(localePath(`/news/${key}`))
}

setupPageSeo('news', () => ({
  inheritCopy: false,
  title: '新闻资讯 | VicastCam',
  description: '了解 VicastCam 的最新动态与行业资讯，获取产品更新、媒体报道与企业动态。',
}))
</script>

<style scoped>
.news-page-shell {
  --news-page-bg: #050a14;
  --news-panel-bg: #0b1220;
  --news-panel-deep: #0a1020;
  --news-visual-bg: #0a1020;
  --news-tab-bg: #141c2b;
  --news-tab-hover-bg: #1a2435;
  --news-tab-color: #8b94a6;
  --news-text: #9aa4b5;
  --news-title: #ffffff;
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

.news-page-main {
  width: 100%;
  flex: 1;
}

.news-hero {
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  background: #030b27 url('/images/news/news-hero-bg.png') center / cover no-repeat;
}

.news-hero-inner {
  min-height: 298px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 40px;
  padding-bottom: 40px;
  text-align: center;
}

.news-eyebrow {
  display: inline-flex;
  padding: 5px 14px;
  border: 1px solid rgba(56, 168, 255, 0.5);
  border-radius: 999px;
  color: #72c1ff;
  background: rgba(9, 45, 111, 0.55);
  font-size: 13px;
  font-weight: 500;
  line-height: 1;
}

.news-hero h1 {
  margin-top: 18px;
  color: #ffffff;
  font-size: clamp(34px, 4.6vw, 50px);
  font-weight: 800;
  letter-spacing: 0.02em;
  line-height: 1.15;
}

.news-hero-lead {
  display: block;
  margin-top: 16px;
  color: #28c6ec;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.5;
}

.news-hero p {
  margin-top: 14px;
  color: #7d8aa0;
  font-size: 15px;
  font-weight: 500;
  line-height: 1.6;
}

.news-content {
  padding-top: 44px;
  padding-bottom: 90px;
}

.news-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 26px;
}

.news-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.news-tab {
  padding: 8px 20px;
  border: 1px solid rgba(255, 255, 255, 0);
  border-radius: 999px;
  color: var(--news-tab-color);
  background: var(--news-tab-bg);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}

.news-tab:hover {
  color: var(--news-title);
  background: var(--news-tab-hover-bg);
}

.news-tab-active,
.news-tab-active:hover {
  border-color: rgba(56, 168, 255, 0.4);
  color: #ffffff;
  background: linear-gradient(135deg, #1f7fe8, #2aa2ff);
}

.news-view-button {
  width: 34px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  cursor: pointer;
  border-radius: 10px;
  background: transparent;
}

.news-view-icon {
  width: 34px;
  height: 34px;
  display: block;
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  justify-content: center;
  gap: 20px;
  width: 100%;
}

.news-card {
  width: 100%;
  min-height: 409px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--news-border);
  border-radius: 14px;
  background: var(--news-panel-bg);
  cursor: pointer;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.news-card:hover {
  border-color: rgba(56, 168, 255, 0.5);
  transform: translateY(-3px);
}

.news-card-visual {
  flex: 0 0 auto;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  overflow: hidden;
  background: var(--news-visual-bg);
}

.news-card-visual img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.news-card:hover .news-card-visual img {
  transform: scale(1.04);
}

.news-card-visual svg {
  width: 38px;
  height: 38px;
  color: var(--news-text);
}

.news-card-body {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 18px 20px 20px;
}

.news-card-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.news-card-category {
  min-width: 74px;
  width: auto;
  height: 26px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  white-space: nowrap;
  border-radius: 6px;
  color: var(--news-tag-color);
  background: var(--news-tag-bg);
  font-size: 11px;
  font-weight: 500;
  line-height: 1;
}

.news-card-meta time {
  color: var(--news-muted);
  font-size: 12px;
}

.news-card h2 {
  margin-top: 12px;
  color: var(--news-title);
  font-size: 19px;
  font-weight: 700;
  line-height: 1.45;
}

.news-card p {
  margin-top: 8px;
  color: var(--news-text);
  font-size: 13px;
  line-height: 1.6;
}

.news-card-link {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin-top: auto;
  padding-top: 12px;
  color: #3aa8ff;
  font-size: 13px;
  font-weight: 500;
}

.news-card-link svg {
  width: 15px;
  height: 15px;
  transition: transform 0.2s ease;
}

.news-card:hover .news-card-link svg {
  transform: translateX(4px);
}

/* 列表视图 */
.news-list {
  display: flex;
  flex-direction: column;
  gap: 0;
  overflow: hidden;
  border: 1px solid var(--news-border);
  border-radius: 14px;
  background: var(--news-panel-bg);
}

.news-card-list {
  width: 100%;
  min-height: 220px;
  flex-direction: row;
  align-items: center;
  padding: 0 20px;
  border-bottom: 1px solid var(--news-divider);
  border-radius: 0;
  background: transparent;
  transition: background 0.2s ease;
}

.news-card-list:hover {
  background: var(--news-hover-bg);
}

.news-card-list:last-child {
  border-bottom: none;
}

.news-card-list .news-card-visual {
  flex: 0 0 auto;
  width: 352px;
  height: 180px;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background: var(--news-visual-bg);
  border-radius: 8px;
}

.news-card-list .news-card-visual img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.news-card-list .news-card-body {
  flex: 1;
  min-width: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 0 0 26px;
}

.news-card-list .news-card-meta {
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
}

.news-card-list .news-card-meta time {
  display: none;
}

.news-card-list h2 {
  margin-top: 12px;
  font-size: 21px;
  font-weight: 700;
  line-height: 1.35;
}

.news-card-list p {
  margin-top: 10px;
  font-size: 14px;
  line-height: 1.7;
  color: var(--news-text);
}

.news-card-list .news-card-link {
  display: none;
}

.news-card-list .news-date-block {
  display: block;
  margin-top: 12px;
  padding-top: 0;
  color: var(--news-muted);
  font-size: 12px;
}

.news-date-block {
  display: none;
}

.news-card-arrow {
  flex: 0 0 auto;
  width: 28px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 20px;
  color: #3aa8ff;
}

.news-card-arrow img {
  width: 22px;
  height: 22px;
}

.news-empty {
  display: grid;
  place-items: center;
  gap: 12px;
  min-height: 240px;
  color: var(--news-muted);
}

.news-empty svg {
  width: 36px;
  height: 36px;
}

@media (max-width: 900px) {
  .news-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .news-card-list .news-card-visual {
    width: 300px;
    height: 180px;
  }

  .news-card-list .news-card-body {
    padding-left: 20px;
  }

  .news-card-list h2 {
    font-size: 19px;
  }
}

@media (max-width: 600px) {
  .news-hero-inner {
    min-height: 298px;
    padding-top: 32px;
    padding-bottom: 32px;
  }

  .news-toolbar {
    align-items: flex-start;
    flex-direction: column;
  }

  .news-grid {
    grid-template-columns: 1fr;
  }

  .news-card {
    width: 100%;
    height: auto;
  }

  .news-card-list {
    height: auto;
    flex-direction: column;
    align-items: stretch;
    padding: 16px;
  }

  .news-card-list .news-card-visual {
    width: 100%;
    height: 220px;
  }

  .news-card-list .news-card-visual img {
    width: 100%;
    height: 100%;
    border-radius: 0;
  }

  .news-card-list .news-card-body {
    min-height: 0;
    padding: 18px 4px 4px;
  }

  .news-card-list h2 {
    font-size: 19px;
  }

  .news-card-arrow {
    display: none;
  }

  .news-content {
    padding-top: 28px;
    padding-bottom: 56px;
  }
}

:root[data-theme="light"] .news-page-shell {
  --news-page-bg: #f6f8fb;
  --news-panel-bg: #ffffff;
  --news-visual-bg: #eef1f6;
  --news-tab-bg: #eef1f6;
  --news-tab-hover-bg: #e3e9f2;
  --news-tab-color: #5b6577;
  --news-text: #5b6577;
  --news-title: #1b2433;
  --news-muted: #9aa4b5;
  --news-tag-color: #1f7fe8;
  --news-tag-bg: rgba(31, 127, 232, 0.12);
  --news-border: rgba(31, 41, 55, 0.1);
  --news-divider: rgba(31, 41, 55, 0.08);
  --news-hover-bg: rgba(31, 41, 55, 0.04);
}

:root[data-theme="light"] .news-hero {
  background: linear-gradient(180deg, rgba(248, 250, 252, 0.4) 0%, rgba(248, 250, 252, 0.9) 100%), url('/images/common/light-page-hero-bg.png') center / cover no-repeat #f6f8fb;
  border-bottom: 1px solid var(--news-divider);
}

:root[data-theme="light"] .news-hero h1 {
  color: #1b2433;
}

:root[data-theme="light"] .news-eyebrow {
  color: #1f7fe8;
  border-color: rgba(31, 127, 232, 0.3);
  background: rgba(31, 127, 232, 0.1);
}

:root[data-theme="light"] .news-hero p {
  color: #5b6577;
}

:root[data-theme="light"] .news-hero-lead {
  color: #1f7fe8;
}

:root[data-theme="light"] .news-card-link,
:root[data-theme="light"] .news-card-list .news-card-link {
  color: #1f7fe8;
}
</style>
