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
          <div class="site-footer-locale-select">
            <button
              type="button"
              class="site-footer-locale-button"
              :dir="activeFooterLocale.dir || 'ltr'"
              :aria-label="footerLocaleSwitchLabel"
              :aria-expanded="footerLocaleMenuOpen"
              aria-haspopup="listbox"
              @click="toggleFooterLocaleMenu"
            >
              <Icon class="site-footer-locale-flag" :name="activeFooterLocale.flagIcon || 'circle-flags:xx'" aria-hidden="true" />
              <span>{{ activeFooterLocale.name }}</span>
              <Icon class="site-footer-locale-chevron" name="lucide:chevron-down" aria-hidden="true" />
            </button>

            <Transition name="site-footer-locale-fade">
              <ul
                v-if="footerLocaleMenuOpen"
                class="site-footer-locale-menu"
                :dir="activeFooterLocale.dir || 'ltr'"
                role="listbox"
              >
                <li
                  v-for="item in footerLocales"
                  :key="item.code"
                  class="site-footer-locale-option"
                  role="option"
                  :aria-selected="item.code === locale"
                >
                  <button
                    type="button"
                    class="site-footer-locale-option-button"
                    :dir="item.dir || 'ltr'"
                    @click="switchFooterLanguage(item.code)"
                  >
                    <Icon class="site-footer-locale-flag" :name="item.flagIcon || 'circle-flags:xx'" aria-hidden="true" />
                    <span class="site-footer-locale-copy">
                      <span>{{ item.name }}</span>
                      <small v-if="item.translatedName">{{ item.translatedName }}</small>
                    </span>
                  </button>
                </li>
              </ul>
            </Transition>
          </div>
        </div>

        <p v-if="footerText.description" class="site-footer-description">
          {{ footerText.description }}
        </p>

        <a class="site-footer-email" :href="businessEmailHref" aria-label="business email">
          <Icon name="lucide:mail" aria-hidden="true" />
          <span>{{ businessEmail }}</span>
        </a>

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

      <p class="site-footer-copyright">
        {{ copyrightText }}
      </p>
    </div>
  </footer>
</template>

<script setup>
import { getFooter } from '../api/request/strapi'
import { createThemeContext } from '../utils/theme'

const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()
const { locale, locales } = useI18n()
const route = useRoute()
const { currentTheme, initTheme, setTheme } = createThemeContext()
const footerLocaleMenuOpen = ref(false)
let closeFooterLocaleMenuOnOutsideClick = null
const businessEmail = 'business@vicastcam.com'
const businessEmailHref = `mailto:${businessEmail}`
const copyrightText = 'Copyright © 2025 VICAST INTERNATIONAL LIMITED Copyright © 2026 VICAST LTD'

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
  terms: { path: '/terms' },
  salesPolicy: { path: '/sales-policy' },
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
const footerLocaleSwitchLabel = '切换语言'

const toggleTheme = () => {
  setTheme(currentTheme.value === 'dark' ? 'light' : 'dark')
  footerLocaleMenuOpen.value = false
}

const getFooterLocaleLanguage = (localeItem) => {
  if (!localeItem || typeof localeItem === 'string') {
    return localeItem || ''
  }

  return localeItem.language || localeItem.code || ''
}

const createFooterLocaleDisplayNames = () => {
  const activeLocaleConfig = locales.value.find(item => typeof item !== 'string' && item.code === locale.value) || {}
  const displayLocale = getFooterLocaleLanguage(activeLocaleConfig) || locale.value

  if (typeof Intl === 'undefined' || !Intl.DisplayNames) {
    return null
  }

  try {
    return new Intl.DisplayNames([displayLocale], {
      type: 'language',
      languageDisplay: 'standard',
    })
  } catch {
    return null
  }
}

const normalizeFooterLocaleTranslatedName = (localeItem, translatedName) => {
  const localeCode = typeof localeItem === 'string' ? localeItem : localeItem?.code

  if (localeCode !== 'zh-TW') {
    return translatedName
  }

  return String(translatedName || '')
    .replace(/台湾/g, '香港')
    .replace(/台灣/g, '香港')
    .replace(/臺灣/g, '香港')
    .replace(/Taiwan/g, 'Hong Kong')
}

const createFooterLocaleFlagIcon = (localeItem) => {
  if (typeof localeItem === 'string') {
    return localeItem === 'zh-TW' ? 'circle-flags:cn' : 'circle-flags:xx'
  }

  return localeItem.code === 'zh-TW' ? 'circle-flags:cn' : localeItem.flagIcon || 'circle-flags:xx'
}

const createFooterLocaleNativeName = (localeItem) => {
  if (typeof localeItem === 'string') {
    return localeItem
  }

  return localeItem.name || localeItem.code
}

const createFooterLocaleDisplayName = (localeItem, displayNames) => {
  if (typeof localeItem === 'string') {
    return displayNames?.of(localeItem) || localeItem
  }

  const languageCode = getFooterLocaleLanguage(localeItem)

  return displayNames?.of(languageCode) || localeItem.name || localeItem.code
}

const createFooterLocaleTranslatedName = (localeItem, displayNames) => {
  const nativeName = createFooterLocaleNativeName(localeItem)
  const translatedName = normalizeFooterLocaleTranslatedName(localeItem, createFooterLocaleDisplayName(localeItem, displayNames))

  if (!translatedName || translatedName === nativeName) {
    return ''
  }

  return translatedName
}

const footerLocales = computed(() => {
  const displayNames = createFooterLocaleDisplayNames()

  return locales.value.map(item => {
    if (typeof item === 'string') {
      return {
        code: item,
        name: createFooterLocaleNativeName(item),
        translatedName: createFooterLocaleTranslatedName(item, displayNames),
        flagIcon: createFooterLocaleFlagIcon(item),
        dir: 'ltr',
      }
    }

    return {
      code: item.code,
      name: createFooterLocaleNativeName(item),
      translatedName: createFooterLocaleTranslatedName(item, displayNames),
      flagIcon: createFooterLocaleFlagIcon(item),
      dir: item.dir || 'ltr',
    }
  })
})

const activeFooterLocale = computed(() => footerLocales.value.find(item => item.code === locale.value) || footerLocales.value[0] || {})

const toggleFooterLocaleMenu = () => {
  footerLocaleMenuOpen.value = !footerLocaleMenuOpen.value
}

const nonDefaultFooterLocaleCodes = computed(() => {
  return footerLocales.value
    .map(item => item.code)
    .filter(code => code && code !== 'zh-CN')
})

const createDefaultFooterLocalePath = () => {
  for (const code of nonDefaultFooterLocaleCodes.value) {
    const prefix = `/${code}`

    if (route.fullPath === prefix) {
      return '/'
    }

    if (route.fullPath.startsWith(`${prefix}/`)) {
      return route.fullPath.slice(prefix.length) || '/'
    }

    if (route.fullPath.startsWith(`${prefix}?`)) {
      return `/${route.fullPath.slice(prefix.length + 1)}`
    }
  }

  return route.fullPath || '/'
}

const switchFooterLanguage = (code) => {
  footerLocaleMenuOpen.value = false

  if (!code || code === locale.value) {
    return
  }

  const targetPath = code === 'zh-CN' ? createDefaultFooterLocalePath() : switchLocalePath(code)

  navigateTo(targetPath || '/')
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

const openPageInNewTab = (path) => {
  if (!process.client || !path) {
    return
  }

  window.open(path, '_blank', 'noopener,noreferrer')
}

const getHomeSectionNewTabPath = (sectionId) => {
  const homePath = localePath('/')
  const separator = homePath.includes('?') ? '&' : '?'

  return `${homePath}${separator}scrollTarget=${encodeURIComponent(sectionId)}`
}

const createLocalizedFooterPath = (item = {}) => {
  const basePath = localePath(item.path || '/')
  const queryEntries = Object.entries(item.query || {}).filter(([, value]) => value !== undefined && value !== null && value !== '')

  if (!queryEntries.length) {
    return basePath
  }

  const separator = basePath.includes('?') ? '&' : '?'
  const query = queryEntries
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&')

  return `${basePath}${separator}${query}`
}

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
      openPageInNewTab(item.path)
      return
    }

    openPageInNewTab(createLocalizedFooterPath(item))
    return
  }

  if (!item.sectionId || !process.client) {
    return
  }

  if (isHomeRoute()) {
    scrollToSection(item.sectionId)
    return
  }

  openPageInNewTab(getHomeSectionNewTabPath(item.sectionId))
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
  const directPathBase = directPath.split(/[?#]/)[0]
  const shouldUseActionQuery = !directPath || (action.path && normalizePath(directPathBase) === normalizePath(action.path))

  return {
    key: `${columnIndex}-${linkIndex}-${text}`,
    label: text,
    path: directPath || action.path || '',
    query: shouldUseActionQuery ? action.query || {} : {},
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

  closeFooterLocaleMenuOnOutsideClick = (event) => {
    if (!footerLocaleMenuOpen.value) {
      return
    }

    const localeSelect = document.querySelector('.site-footer-locale-select')
    if (localeSelect?.contains(event.target)) {
      return
    }

    footerLocaleMenuOpen.value = false
  }

  document.addEventListener('click', closeFooterLocaleMenuOnOutsideClick)
})

onBeforeUnmount(() => {
  if (closeFooterLocaleMenuOnOutsideClick) {
    document.removeEventListener('click', closeFooterLocaleMenuOnOutsideClick)
  }
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
  position: relative;
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

:root[data-theme="dark"] .site-footer-logo {
  border-radius: 7px;
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

.site-footer-locale-select {
  position: relative;
  display: none;
  align-items: center;
  flex: 0 0 auto;
  min-width: 0;
  margin-left: 14px;
}

.site-footer-locale-button {
  width: auto;
  max-width: min(214px, calc(100vw - 32px));
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  padding: 0 12px;
  border: 1px solid var(--theme-header-control-border, var(--theme-border-control));
  border-radius: 6px;
  color: var(--theme-footer-title);
  background-color: transparent;
  font-size: 14px;
  font-weight: 500;
  line-height: 36px;
  white-space: nowrap;
  cursor: pointer;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.site-footer-locale-button[dir="rtl"] {
  flex-direction: row-reverse;
  text-align: right;
}

.site-footer-locale-button span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

.site-footer-locale-button:hover,
.site-footer-locale-button:focus {
  border-color: var(--theme-header-control-border, var(--theme-border-control));
  background-color: transparent;
}

.site-footer-locale-flag {
  width: 22px;
  height: 16px;
  flex: 0 0 auto;
  display: inline-block;
}

.site-footer-locale-chevron {
  width: 14px;
  height: 14px;
  flex: 0 0 auto;
  margin-left: auto;
  color: var(--theme-text-muted);
  transition: transform 0.2s ease;
}

.site-footer-locale-select:hover .site-footer-locale-chevron,
.site-footer-locale-select:focus-within .site-footer-locale-chevron {
  transform: rotate(180deg);
}

.site-footer-locale-menu {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  z-index: 20;
  min-width: 214px;
  width: max-content;
  max-width: calc(100vw - 32px);
  max-height: min(420px, 60vh);
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior: contain;
  padding: 4px 0;
  border: 1px solid var(--theme-header-dropdown-border, var(--theme-border));
  border-radius: 4px;
  background-color: var(--theme-header-dropdown-background, var(--theme-surface-alt));
  box-shadow: var(--theme-header-dropdown-shadow, 0 10px 24px var(--theme-shadow));
  scrollbar-width: thin;
  scrollbar-color: var(--theme-header-dropdown-icon, var(--theme-extra-64-217-247-07)) var(--theme-header-dropdown-background, var(--theme-surface));
}

.site-footer-locale-menu[dir="rtl"] {
  left: auto;
  right: 0;
  text-align: right;
}

.site-footer-locale-menu::-webkit-scrollbar {
  width: 6px;
}

.site-footer-locale-menu::-webkit-scrollbar-track {
  background: var(--theme-header-dropdown-background, var(--theme-surface));
}

.site-footer-locale-menu::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: var(--theme-header-dropdown-icon, var(--theme-extra-64-217-247-07));
}

.site-footer-locale-option {
  color: var(--theme-header-dropdown-text, var(--theme-text));
  font-size: 14px;
  line-height: 20px;
  background-color: transparent;
}

.site-footer-locale-option-button {
  width: 100%;
  min-width: 176px;
  min-height: 48px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 14px;
  color: var(--theme-header-dropdown-text, var(--theme-text));
  font-size: 14px;
  line-height: 20px;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.site-footer-locale-option-button[dir="rtl"] {
  flex-direction: row-reverse;
  text-align: right;
}

.site-footer-locale-copy {
  min-width: 0;
  display: grid;
  gap: 2px;
  text-align: left;
}

.site-footer-locale-option-button[dir="rtl"] .site-footer-locale-copy {
  text-align: right;
}

.site-footer-locale-copy > span,
.site-footer-locale-copy > small {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

.site-footer-locale-copy > small {
  color: var(--theme-header-dropdown-icon, var(--theme-text-muted));
  font-size: 12px;
  line-height: 16px;
}

.site-footer-locale-option-button:hover,
.site-footer-locale-option-button:focus {
  color: var(--theme-header-dropdown-hover-text, var(--theme-accent-bright));
  background-color: var(--theme-header-dropdown-hover-background, var(--theme-accent-hover));
}

.site-footer-locale-fade-enter-active,
.site-footer-locale-fade-leave-active {
  transition: opacity 0.16s ease, transform 0.16s ease;
}

.site-footer-locale-fade-enter-from,
.site-footer-locale-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.site-footer-description {
  margin-top: 24px;
  color: var(--theme-footer-text);
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  overflow-wrap: anywhere;
}
.site-footer-email {
  max-width: 100%;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  color: var(--theme-footer-text);
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  overflow-wrap: anywhere;
  transition: color 0.2s ease;
}
.site-footer-email:hover,
.site-footer-email:focus {
  color: var(--theme-footer-link-hover);
}
.site-footer-email svg {
  width: 16px;
  height: 16px;
  flex: 0 0 auto;
}
.site-footer-email span {
  min-width: 0;
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
.site-footer-copyright {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 38px;
  max-width: 100%;
  padding: 0 24px;
  color: var(--theme-footer-text);
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  text-align: center;
  opacity: 0.42;
  overflow-wrap: anywhere;
}
@media (max-width: 900px) {
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

  .site-footer-copyright {
    position: static;
    padding: 0;
    text-align: left;
  }

  .site-footer-brand {
    width: 100%;
    flex-basis: auto;
  }

  .site-footer-logo-row {
    row-gap: 10px;
    flex-wrap: wrap;
  }

  .site-footer-locale-select {
    display: inline-flex;
    flex: 0 0 auto;
    margin-left: 8px;
  }

  .site-footer-locale-button {
    width: auto;
  }

  .site-footer-columns {
    width: 100%;
    grid-template-columns: repeat(2, minmax(120px, 1fr));
    row-gap: 28px;
    margin-left: 0;
  }
}
</style>
