<template>
  <!-- 底部导航区域，左侧为品牌介绍，右侧为多列站点入口。 -->
  <footer class="site-footer">
    <div class="page-container site-footer-inner">
      <div class="site-footer-brand">
        <div class="site-footer-logo-row">
          <img
            class="site-footer-logo"
            src="/images/common/logo.png"
            alt=""
            aria-hidden="true"
          >
          <span class="site-footer-brand-name">
            <span>{{ footerText.brandMain }}</span>
            <span class="site-footer-brand-accent">{{ footerText.brandAccent }}</span>
          </span>
          <button
            type="button"
            class="site-footer-theme-button"
            :aria-label="themeSwitchLabel"
            @click="toggleTheme"
          >
            <span class="site-footer-theme-track" aria-hidden="true">
              <span class="site-footer-theme-thumb">
                <Icon :name="themeSwitchIcon" />
              </span>
            </span>
          </button>
        </div>

        <p class="site-footer-description">
          {{ footerText.description }}
        </p>

        <div v-if="footerText.socials.length" class="site-footer-socials" :aria-label="footerText.brand">
          <button
            v-for="item in footerText.socials"
            :key="item.key"
            type="button"
            class="site-footer-social-button"
            :aria-label="item.label"
          >
            <Icon class="site-footer-social-icon" :name="item.icon" aria-hidden="true" />
          </button>
        </div>
      </div>

      <nav class="site-footer-columns" :aria-label="footerText.brand">
        <section
          v-for="column in footerColumns"
          :key="column.key"
          class="site-footer-column"
        >
          <h2 class="site-footer-column-title">{{ column.title }}</h2>

          <button
            v-for="item in column.links"
            :key="item.key"
            type="button"
            class="site-footer-link"
            @click="handleFooterLinkClick(item)"
          >
            {{ item.label }}
          </button>
        </section>
      </nav>
    </div>
  </footer>
</template>

<script setup>
import { getFooter } from '../api/request/strapi'
import { createThemeContext } from '../utils/theme'

const localePath = useLocalePath()
const { locale } = useI18n()
const route = useRoute()
const { currentTheme, initTheme, setTheme } = createThemeContext()

const footerLinkActionsByKey = {
  features: { sectionId: 'home-features-anchor' },
  pricing: { sectionId: 'home-pricing-anchor' },
  download: { path: '/download' },
  changelog: { path: '/tutorial' },
  tutorial: { path: '/tutorial' },
  sdk: { path: '/sdk' },
  apiDocs: { path: '/sdk' },
  faq: { path: '/faq' },
  privacy: { path: '/privacy' },
  about: { path: '/about' },
  terms: { path: '/privacy' },
  salesPolicy: { path: '/privacy' },
  docs: { path: '/tutorial' },
  contact: { path: '/about' },
}

const footerColumnActionOrder = [
  ['features', 'pricing', 'download', 'changelog'],
  ['sdk', 'apiDocs'],
  ['about', 'privacy', 'terms', 'salesPolicy'],
  ['docs', 'tutorial', 'faq', 'contact'],
]

const footerLinkTextActionMap = {
  '功能特色': 'features',
  'features': 'features',
  'feature': 'features',
  '价格': 'pricing',
  'price': 'pricing',
  'pricing': 'pricing',
  '下载': 'download',
  'download': 'download',
  '更新日志': 'changelog',
  'updatelog': 'changelog',
  'changelog': 'changelog',
  'sdk': 'sdk',
  'api文档': 'apiDocs',
  'sdk文档': 'apiDocs',
  'apidocumentation': 'apiDocs',
  'apidoc': 'apiDocs',
  'apidocs': 'apiDocs',
  '关于我们': 'about',
  '关于': 'about',
  'aboutus': 'about',
  'about': 'about',
  '隐私政策': 'privacy',
  '隐私': 'privacy',
  'privacypolicy': 'privacy',
  'privacy': 'privacy',
  '服务条款': 'terms',
  'termsofservice': 'terms',
  'termsofuse': 'terms',
  '销售政策': 'salesPolicy',
  'salespolicy': 'salesPolicy',
  '文档': 'docs',
  'documentation': 'docs',
  'docs': 'docs',
  '教程': 'tutorial',
  'tutorial': 'tutorial',
  'tutorials': 'tutorial',
  '常见问题': 'faq',
  'faq': 'faq',
  '联系我们': 'contact',
  'contactus': 'contact',
  'contact': 'contact',
}

const footerColumns = ref([])
const footerContent = ref({
  brand: {
    name: '',
    description: '',
  },
})

const footerText = computed(() => {
  const brandName = footerContent.value.brand?.name || ''
  const brandMain = brandName.endsWith('Cam') ? brandName.slice(0, -3) : brandName
  const brandAccent = brandName.endsWith('Cam') ? 'Cam' : ''

  return {
    brand: brandName,
    brandMain,
    brandAccent,
    description: footerContent.value.brand?.description || '',
    socials: [],
  }
})
const themeSwitchIcon = computed(() => currentTheme.value === 'dark' ? 'lucide:sun' : 'lucide:moon')
const themeSwitchLabel = computed(() => currentTheme.value === 'dark' ? '切换浅色模式' : '切换深色模式')

const toggleTheme = () => {
  setTheme(currentTheme.value === 'dark' ? 'light' : 'dark')
}

const normalizePath = path => {
  if (!path || path === '/') {
    return '/'
  }

  return path.replace(/\/+$/, '')
}

const isHomeRoute = () => {
  return normalizePath(route.path) === normalizePath(localePath('/'))
}

const normalizeFooterActionText = value => {
  return String(value || '')
    .trim()
    .toLowerCase()
    .normalize('NFKC')
    .replace(/[^\p{L}\p{N}]+/gu, '')
}

const isExternalFooterPath = path => /^(https?:)?\/\//.test(path) || /^(mailto|tel):/i.test(path)

const scrollToSection = (sectionId) => {
  const sectionElement = document.getElementById(sectionId)

  if (!sectionElement) {
    return
  }

  const headerHeight = document.querySelector('.page-header')?.getBoundingClientRect().height || 0
  const top = window.scrollY + sectionElement.getBoundingClientRect().top - headerHeight - 36

  window.scrollTo({
    top: Math.max(0, top),
    behavior: 'smooth',
  })
}

const handleFooterLinkClick = (item) => {
  if (item.path) {
    if (isExternalFooterPath(item.path)) {
      navigateTo(item.path, { external: true })
      return
    }

    navigateTo(localePath(item.path))
    return
  }

  if (!item.sectionId || !process.client) {
    return
  }

  if (isHomeRoute()) {
    scrollToSection(item.sectionId)
    return
  }

  Promise.resolve(navigateTo(localePath('/'))).then(() => {
    nextTick(() => {
      window.setTimeout(() => scrollToSection(item.sectionId), 40)
    })
  })
}

const getFooterContentData = (response) => {
  if (Array.isArray(response?.data)) {
    const firstItem = response.data[0] || {}

    return firstItem.attributes || firstItem
  }

  return response?.data?.attributes || response?.data || response || {}
}

const createFooterLink = (link = {}, columnIndex, linkIndex) => {
  const text = String(link.text || '').trim()
  const directPath = String(link.path || link.href || link.url || '').trim()
  const explicitActionKey = [
    link.key,
    link.action,
    link.slug,
  ].map(normalizeFooterActionText).find(key => footerLinkActionsByKey[key])
  const textActionKey = footerLinkTextActionMap[normalizeFooterActionText(text)]
  const actionKey = explicitActionKey || textActionKey || footerColumnActionOrder[columnIndex]?.[linkIndex] || ''
  const action = footerLinkActionsByKey[actionKey] || {}

  return {
    key: `${columnIndex}-${linkIndex}-${text}`,
    label: text,
    path: directPath || action.path || '',
    sectionId: action.sectionId || '',
  }
}

const syncFooterContent = (footerData = {}) => {
  const footerObject = footerData.footerobj || footerData
  const content = footerObject.footer || {}

  footerContent.value = {
    brand: {
      name: content.brand?.name || '',
      description: content.brand?.description || '',
    },
  }

  footerColumns.value = Array.isArray(content.columns)
    ? content.columns.map((column, columnIndex) => ({
        key: `${columnIndex}-${column.title || ''}`,
        title: column.title || '',
        links: Array.isArray(column.links)
          ? column.links.map((link, linkIndex) => createFooterLink(link, columnIndex, linkIndex)).filter(link => link.label)
          : [],
      })).filter(column => column.title || column.links.length)
    : []
}

const loadFooterContent = () => {
  getFooter(locale.value).then(
    response => {
      syncFooterContent(getFooterContentData(response))
    },
    () => {
      syncFooterContent()
    }
  )
}

onMounted(() => {
  initTheme()
  loadFooterContent()
})

watch(locale, () => {
  loadFooterContent()
})

</script>

<style>
.site-footer {
  width: 100%;
  height: var(--page-footer-height);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--theme-footer-background, var(--theme-page));
}

.site-footer-inner {
  height: var(--page-footer-height);
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 0;
  padding-top: 64px;
  overflow: hidden;
  min-width: 0;
}
.site-footer-brand {
  width: 285px;
  flex: 0 0 285px;
  min-width: 0;
}
.site-footer-logo-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: nowrap;
  min-width: 0;
}
.site-footer-logo {
  width: 30px;
  height: 30px;
  flex: 0 0 auto;
  object-fit: contain;
}
.site-footer-brand-name {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--theme-footer-title);
  font-size: 20px;
  font-weight: 800;
  line-height: 24px;
  white-space: nowrap;
}
.site-footer-brand-accent {
  color: var(--theme-footer-brand-accent, var(--theme-brand-accent));
}

.site-footer-theme-button {
  width: 58px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 58px;
  margin-left: 8px;
  border: 0;
  border-radius: 999px;
  color: var(--theme-footer-title);
  background-color: transparent;
  cursor: pointer;
}

.site-footer-theme-button:hover,
.site-footer-theme-button:focus {
  background-color: transparent;
}

.site-footer-theme-track {
  position: relative;
  width: 52px;
  height: 28px;
  display: block;
  border: 1px solid var(--theme-header-control-border, var(--theme-border-control));
  border-radius: 999px;
  background: var(--theme-header-theme-track-background, var(--theme-panel-medium));
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.site-footer-theme-thumb {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: var(--theme-header-theme-thumb-color, var(--theme-page));
  background: var(--theme-header-theme-thumb-background, var(--theme-white));
  box-shadow: 0 2px 8px var(--theme-black-22);
  transition: transform 0.22s ease, color 0.2s ease, background-color 0.2s ease;
}

.site-footer-theme-thumb svg {
  width: 13px;
  height: 13px;
}

:root[data-theme="light"] .site-footer-theme-track {
  background: var(--theme-header-theme-track-background, var(--theme-extra-203-232-255-085));
}

:root[data-theme="light"] .site-footer-theme-thumb {
  color: var(--theme-header-theme-thumb-color, var(--theme-white));
  background: var(--theme-header-theme-thumb-background, var(--theme-primary));
  transform: translateX(24px);
}

.site-footer-description {
  margin-top: 24px;
  color: var(--theme-footer-text);
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  overflow-wrap: anywhere;
}
.site-footer-socials {
  display: flex;
  align-items: center;
  gap: 22px;
  margin-top: 28px;
}
.site-footer-social-button {
  width: 24px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--theme-footer-text);
  cursor: pointer;
  transition: color 0.2s ease, transform 0.2s ease;
}
.site-footer-social-button:hover,
.site-footer-social-button:focus {
  color: var(--theme-footer-link-hover);
  transform: translateY(-1px);
}
.site-footer-social-icon {
  width: 24px;
  height: 24px;
}

.site-footer-columns {
  flex: 1 1 auto;
  display: grid;
  grid-template-columns: repeat(4, minmax(80px, 1fr));
  column-gap: clamp(36px, 5vw, 84px);
  margin-left: 130px;
  min-width: 0;
}
.site-footer-column {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 0;
}
.site-footer-column-title {
  max-width: 100%;
  margin-bottom: 18px;
  color: var(--theme-footer-title);
  font-size: 16px;
  font-weight: 700;
  line-height: 22px;
  overflow: hidden;
  overflow-wrap: anywhere;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.site-footer-link {
  max-width: 100%;
  min-height: 24px;
  color: var(--theme-footer-text);
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  text-align: left;
  overflow: hidden;
  overflow-wrap: anywhere;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  cursor: pointer;
  transition: color 0.2s ease;
}
.site-footer-link + .site-footer-link {
  margin-top: 8px;
}
.site-footer-link:hover,
.site-footer-link:focus {
  color: var(--theme-footer-link-hover);
}
@media (max-width: 768px) {
  .site-footer {
    height: auto;
    min-height: var(--page-footer-height);
  }

  .site-footer-inner {
    height: auto;
    min-height: auto;
    flex-direction: column;
    gap: 36px;
    padding-top: 44px;
    padding-bottom: 44px;
    overflow: visible;
  }

  .site-footer-brand {
    width: 100%;
    flex-basis: auto;
  }

  .site-footer-columns {
    width: 100%;
    grid-template-columns: repeat(2, minmax(120px, 1fr));
    row-gap: 28px;
    margin-left: 0;
  }
}
</style>
