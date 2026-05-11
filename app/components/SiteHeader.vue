<template>
  <!-- 顶部导航区域，左侧显示站点名称，中间显示页面导航，右侧显示功能按钮。 -->
  <header :class="['page-header', { 'page-header-scrolled': headerScrolled }]">
    <div class="page-header-inner">
      <div class="site-brand-row">
        <NuxtLink :to="localePath('/')" class="site-brand">
          <img
            class="site-brand-image"
            src="/images/logo.png"
            alt=""
            aria-hidden="true"
          >
          <span class="site-brand-name">
            <span>{{ headerText.brandMain }}</span>
            <span class="site-brand-accent">{{ headerText.brandAccent }}</span>
          </span>
        </NuxtLink>
      </div>

      <!-- 页面导航点击后滚动到首页对应区块。 -->
      <nav class="site-nav" :aria-label="headerText.navBrand">
        <button
          v-for="item in navigationItems"
          :key="item.key"
          type="button"
          :class="['site-nav-link', { 'site-nav-link-active': activeNavigationKey === item.key }]"
          @click="handleNavigationClick(item.key)"
        >
          <span>{{ item.label }}</span>
        </button>
      </nav>

      <div class="site-actions">
        <NuxtLink :to="localePath('/login')" class="site-auth-button site-auth-login" @click="closeMobileMenu">
          {{ headerText.loginRegister }}
        </NuxtLink>

        <NuxtLink :to="localePath('/profile')" class="site-profile-link" aria-label="个人中心" @click="closeMobileMenu">
          <span>D</span>
        </NuxtLink>

        <!-- 手机端菜单按钮，只负责展开或收起导航面板。 -->
        <button
          type="button"
          class="site-menu-button"
          :aria-label="headerText.menuLabel"
          :aria-expanded="mobileMenuOpen"
          @click="toggleMobileMenu"
        >
          <Icon class="site-menu-icon" :name="mobileMenuIcon" aria-hidden="true" />
        </button>
      </div>

      <!-- 手机端展开面板，复用同一份导航数据，避免桌面和手机两套文案不一致。 -->
      <div v-if="mobileMenuOpen" class="site-mobile-panel">
        <button
          v-for="item in navigationItems"
          :key="item.key"
          type="button"
          :class="['site-mobile-link', { 'site-mobile-link-active': activeNavigationKey === item.key }]"
          @click="handleNavigationClick(item.key)"
        >
          <span>{{ item.label }}</span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { createAvailableLocales, createI18nPageContext, createSiteHeaderText } from '../utils/i18n-page'
import { createSiteNavigationItems } from '../utils/navigation'

// 从工具函数中获取当前导航需要的多语言能力。
const { locale, locales, setLocale, translate } = createI18nPageContext()

// localePath 用来生成带当前语言前缀的页面地址。
const localePath = useLocalePath()

// switchLocalePath 用来生成当前页面对应语言的路由地址。
const switchLocalePath = useSwitchLocalePath()

// 当前路由用于在页面跳转后关闭手机端菜单和处理区块滚动。
const route = useRoute()

// 顶部导航模板只读取普通 ref，避免在模板中直接写翻译逻辑。
const availableLocales = ref([])
const navigationItems = ref([])
const headerText = ref({})
const activeLocale = ref({})
const localeMenuOpen = ref(false)
const mobileMenuOpen = ref(false)
const mobileMenuIcon = ref('lucide:menu')
const isSmallHeader = ref(false)
const activeNavigationKey = ref('clientDownload')
const headerScrolled = ref(false)

const navigationSectionMap = {
  clientDownload: {
    targetId: 'home-download',
    spyId: 'home-download',
  },
  features: {
    targetId: 'home-features-anchor',
    spyId: 'home-features',
  },
  pricing: {
    targetId: 'home-pricing-anchor',
    spyId: 'home-pricing',
  },
  faq: {
    targetId: 'home-faq-anchor',
    spyId: 'home-faq',
  },
}
const navigationScrollOrder = ['clientDownload', 'features', 'pricing', 'faq']

const normalizePath = path => {
  if (!path || path === '/') {
    return '/'
  }

  return path.replace(/\/+$/, '')
}

const getHomePath = () => localePath('/')

const isHomeRoute = () => {
  return normalizePath(route.path) === normalizePath(getHomePath())
}

// 打开或关闭手机端导航菜单。
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
  mobileMenuIcon.value = mobileMenuOpen.value ? 'lucide:x' : 'lucide:menu'
  localeMenuOpen.value = false
}

// 关闭手机端导航菜单。
const closeMobileMenu = () => {
  mobileMenuOpen.value = false
  mobileMenuIcon.value = 'lucide:menu'
}

const scrollToSection = (sectionId, behavior = 'smooth') => {
  const sectionElement = document.getElementById(sectionId)

  if (!sectionElement) {
    return
  }

  const headerHeight = document.querySelector('.page-header')?.getBoundingClientRect().height || 0
  const top = window.scrollY + sectionElement.getBoundingClientRect().top - headerHeight - 36

  window.scrollTo({
    top: Math.max(0, top),
    behavior,
  })
}

const syncActiveNavigationByScroll = () => {
  if (!isHomeRoute()) {
    return
  }

  const headerHeight = document.querySelector('.page-header')?.getBoundingClientRect().height || 0
  const threshold = headerHeight + 120
  let currentKey = 'clientDownload'

  for (const key of navigationScrollOrder) {
    const sectionId = navigationSectionMap[key]?.spyId
    const sectionElement = document.getElementById(sectionId)

    if (!sectionElement) {
      continue
    }

    const sectionTop = sectionElement.getBoundingClientRect().top
    if (sectionTop - threshold <= 0) {
      currentKey = key
    } else {
      break
    }
  }

  activeNavigationKey.value = currentKey
}

const syncHeaderScrolledState = () => {
  headerScrolled.value = window.scrollY > 20
}

const handleNavigationClick = async (key) => {
  closeMobileMenu()

  const sectionId = navigationSectionMap[key]?.targetId
  if (!sectionId) {
    return
  }
  activeNavigationKey.value = key

  if (!isHomeRoute()) {
    await navigateTo({ path: getHomePath() })
    nextTick(() => {
      window.setTimeout(() => {
        scrollToSection(sectionId)
        syncActiveNavigationByScroll()
      }, 40)
    })
    return
  }

  scrollToSection(sectionId)
  syncActiveNavigationByScroll()
}

// 鼠标移入或键盘聚焦时打开语言下拉，并关闭手机端导航。
const openLocaleMenu = () => {
  if (isSmallHeader.value) {
    return
  }

  localeMenuOpen.value = true
  closeMobileMenu()
}

// 鼠标移出语言区域时关闭语言下拉。
const closeLocaleMenu = () => {
  if (isSmallHeader.value) {
    return
  }

  localeMenuOpen.value = false
}

// 小屏没有 hover，语言切换使用点击展开或收起。
const handleLocaleButtonClick = () => {
  if (!isSmallHeader.value) {
    return
  }

  localeMenuOpen.value = !localeMenuOpen.value
  closeMobileMenu()
}

// blur 事件会先于点击触发，延迟关闭可以保证下拉项点击正常执行。
const closeLocaleMenuLater = () => {
  window.setTimeout(() => {
    localeMenuOpen.value = false
  }, 120)
}

// 根据当前语言刷新正在显示的语言项。
const refreshActiveLocale = () => {
  activeLocale.value = availableLocales.value.find(item => item.code === locale.value) || availableLocales.value[0] || {}
}

// 根据当前语言刷新导航列表，导航项不做高亮。
const refreshNavigationItems = () => {
  navigationItems.value = createSiteNavigationItems({
    translate,
  })
}

// 初始化或切换语言后，统一刷新顶部导航文案和语言清单。
const refreshHeaderData = () => {
  availableLocales.value = createAvailableLocales(locales)
  headerText.value = createSiteHeaderText(translate)
  refreshActiveLocale()
  refreshNavigationItems()
}

refreshHeaderData()

// 当前语言变化后重新刷新导航文案，支持直接访问 /ja 或从下拉框切换到日语。
watch(locale, () => {
  refreshHeaderData()
})

// 当前路由变化后关闭手机端菜单，并根据当前位置同步高亮。
watch(() => route.fullPath, () => {
  closeMobileMenu()
  if (!isHomeRoute()) {
    return
  }

  nextTick(() => {
    window.setTimeout(() => {
      syncActiveNavigationByScroll()
    }, 40)
  })
})

let headerMediaQuery = null
let syncHeaderMode = null
let syncScrollSpy = null

onMounted(() => {
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual'
  }

  if (window.location.hash) {
    window.history.replaceState({}, '', `${window.location.pathname}${window.location.search}`)
  }

  const navigationEntry = performance.getEntriesByType('navigation')[0]
  if (navigationEntry && navigationEntry.type === 'reload') {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }

  headerMediaQuery = window.matchMedia('(max-width: 900px)')
  syncHeaderMode = () => {
    isSmallHeader.value = headerMediaQuery.matches

    if (!headerMediaQuery.matches) {
      localeMenuOpen.value = false
    }
  }

  syncHeaderMode()
  headerMediaQuery.addEventListener('change', syncHeaderMode)

  syncScrollSpy = (() => {
    let ticking = false

    return () => {
      if (ticking) {
        return
      }

      ticking = true
      window.requestAnimationFrame(() => {
        syncActiveNavigationByScroll()
        syncHeaderScrolledState()
        ticking = false
      })
    }
  })()
  window.addEventListener('scroll', syncScrollSpy, { passive: true })
  window.addEventListener('resize', syncScrollSpy)

  syncActiveNavigationByScroll()
  syncHeaderScrolledState()
})

onBeforeUnmount(() => {
  if (headerMediaQuery && syncHeaderMode) {
    headerMediaQuery.removeEventListener('change', syncHeaderMode)
  }

  if (syncScrollSpy) {
    window.removeEventListener('scroll', syncScrollSpy)
    window.removeEventListener('resize', syncScrollSpy)
  }
})

// 下拉框切换语言时，切换语言并跳转到当前页面对应的语言路由。
const switchLanguage = async (code) => {
  localeMenuOpen.value = false

  if (locale.value !== code) {
    await setLocale(code)
    await navigateTo(switchLocalePath(code))
  }
}
</script>

<style>
/* Header layout */
.page-header {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 50;
  width: 100%;
  height: var(--page-header-height);
  min-height: var(--page-header-height);
  max-width: 100vw;
  display: flex;
  justify-content: center;
  border-radius: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  background-color: rgba(3, 7, 18, 0.82);
  box-shadow: 0 12px 34px rgba(0, 0, 0, 0.22);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  transform: none;
  backface-visibility: hidden;
  will-change: background-color, box-shadow;
  transition:
    background-color 0.28s ease,
    box-shadow 0.28s ease,
    border-color 0.28s ease;
}

.page-header-scrolled {
  border-bottom-color: rgba(98, 124, 176, 0.26);
  background-color: rgba(6, 12, 24, 0.94);
  box-shadow: 0 18px 36px rgba(1, 6, 16, 0.52);
  animation: page-header-slide-down 0.26s ease;
}

.page-header-inner,
.site-brand-image,
.site-brand-name,
.site-nav-link,
.site-auth-button,
.site-profile-link {
  transition: transform 0.26s ease, opacity 0.26s ease;
}

.page-header-scrolled .page-header-inner {
  transform: translateY(-1px);
}

.page-header-scrolled .site-brand-image {
  transform: scale(0.95);
}

@keyframes page-header-slide-down {
  from {
    transform: translateY(-8px);
    opacity: 0.92;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.page-header-inner {
  width: min(100%, 1440px);
  max-width: 1440px;
  margin: 0 auto;
  height: var(--page-header-height);
  min-height: var(--page-header-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-width: 0;
  position: relative;
}

/* Brand */
.site-brand-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 0 0 auto;
}

.site-brand {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--theme-header-text);
  font-size: 18px;
  font-weight: 700;
  line-height: 1.2;
  white-space: nowrap;
}

.site-brand:hover,
.site-brand:focus {
  color: var(--theme-header-text);
  background-color: transparent;
}

.site-brand-image {
  width: 40px;
  height: 40px;
  flex: 0 0 auto;
  object-fit: contain;
}

.site-brand-name {
  color: var(--theme-header-text);
  font-size: 18px;
}

.site-brand-accent {
  color: var(--theme-brand-accent);
}

/* Desktop navigation */
.site-nav {
  display: flex;
  align-items: center;
  gap: clamp(12px, 2vw, 25px);
  flex: 1 1 auto;
  justify-content: center;
  min-width: 0;
}

.site-nav-link {
  position: relative;
  min-width: 0;
  max-width: 132px;
  display: inline-flex;
  align-items: center;
  border-radius: 4px;
  padding: 6px 10px;
  color: var(--theme-header-text);
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  white-space: nowrap;
  transition: color 0.2s ease;
}

.site-nav-link span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

.site-nav-link::after {
  content: "";
  position: absolute;
  left: 10px;
  right: 10px;
  bottom: 0;
  height: 2px;
  background: rgba(36, 209, 238, 1);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.site-nav-link-active::after {
  opacity: 1;
}

.site-nav-link:hover {
  color: var(--theme-header-text);
}

.site-nav-link:focus,
.site-nav-link:active {
  color: var(--theme-header-text);
  background-color: transparent;
}

/* Actions */
.site-actions {
  display: flex;
  align-items: center;
  gap: 0;
  flex-wrap: nowrap;
  justify-content: flex-end;
  min-width: 0;
  flex: 0 0 auto;
}

.site-menu-button {
  display: none;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(45, 48, 56, 1);
  border-radius: 6px;
  color: var(--theme-header-text);
  background-color: var(--theme-surface);
}

.site-menu-button:hover,
.site-menu-button:focus {
  border-color: var(--theme-border);
  background-color: transparent;
}

.site-menu-icon {
  width: 20px;
  height: 20px;
}

/* Locale menu */
.site-locale-select {
  position: relative;
  display: inline-flex;
  align-items: center;
  margin-left: 50px;
}

.site-locale-select::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  height: 8px;
}

.site-select-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 110px;
  min-width: 110px;
  max-width: 110px;
  height: 30px;
  padding: 0 6px;
  border: 1px solid rgba(45, 48, 56, 1);
  border-radius: 6px;
  color: var(--theme-header-text);
  background-color: transparent;
  font-size: 14px;
  font-weight: 500;
  line-height: 30px;
  white-space: nowrap;
  cursor: pointer;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.site-select-button span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

.site-select-button:hover,
.site-select-button:focus {
  border-color: rgba(45, 48, 56, 1);
  background-color: transparent;
}

.site-auth-button {
  min-width: 100px;
  max-width: 150px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 5px 12px;
  margin-left: 24px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: border-color 0.2s ease, background-color 0.2s ease, color 0.2s ease;
}

.site-auth-login {
  color: var(--theme-header-text);
  background: var(--theme-login-background);
}

.site-auth-login:hover,
.site-auth-login:focus {
  color: var(--theme-header-text);
}

.site-profile-link {
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 36px;
  margin-left: 20px;
  border-radius: 50%;
  color: rgba(255, 255, 255, 1);
  background: linear-gradient(135deg, rgba(34, 211, 238, 1), rgba(59, 130, 246, 1));
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
}

.site-select-menu {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  z-index: 20;
  min-width: 150px;
  padding: 4px 0;
  border: 1px solid var(--theme-border);
  border-radius: 4px;
  background-color: rgba(17, 24, 39, 1);
  box-shadow: 0 10px 24px var(--theme-shadow);
}

.site-select-option {
  min-width: 150px;
  color: var(--theme-text);
  font-size: 14px;
  line-height: 20px;
  background-color: transparent;
}

.site-select-option-button {
  width: 100%;
  height: 36px;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  padding: 8px 12px;
  color: var(--theme-text);
  font-size: 14px;
  line-height: 20px;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}
.site-select-option-button span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

.site-select-option-button:hover,
.site-select-option-button:focus {
  color: rgba(64, 217, 247, 1);
  background-color: rgba(18, 44, 59, 1);
}

.site-select-fade-enter-active,
.site-select-fade-leave-active {
  transition: opacity 0.16s ease, transform 0.16s ease;
}

.site-select-fade-enter-from,
.site-select-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.site-mobile-panel {
  display: none;
}

.site-mobile-link {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  padding: 10px 12px;
  border-radius: 4px;
  color: var(--theme-text);
  font-size: 14px;
  font-weight: 500;
}
.site-mobile-link span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

.site-mobile-link:hover {
  color: var(--theme-header-text);
  background-color: transparent;
}

.site-mobile-link-active {
  color: var(--theme-header-text);
}

.site-mobile-link:focus,
.site-mobile-link:active {
  color: var(--theme-header-text);
  background-color: transparent;
}

.locale-flag-icon {
  width: 19px;
  height: 14px;
  flex: 0 0 auto;
  display: inline-block;
}

.locale-chevron-icon {
  width: 12px;
  height: 12px;
  color: var(--theme-text-muted);
  transition: transform 0.2s ease;
}

.site-locale-select:hover .locale-chevron-icon,
.site-locale-select:focus-within .locale-chevron-icon {
  transform: rotate(180deg);
}

/* Tablet header compaction */
@media (max-width: 1153px) and (min-width: 901px) {

  .page-header-inner {
    gap: 10px;
  }

  .site-nav {
    gap: clamp(6px, 1vw, 12px);
  }

  .site-nav-link {
    max-width: 96px;
    padding-left: 6px;
    padding-right: 6px;
  }

  .site-nav-link::after {
    left: 6px;
    right: 6px;
  }

  .site-auth-button {
    min-width: 82px;
    max-width: 112px;
    margin-left: 8px;
    padding-left: 10px;
    padding-right: 10px;
  }

  .site-profile-link {
    margin-left: 8px;
  }
}

/* Mobile header */
@media (max-width: 900px) {

  .page-header-inner {
    height: var(--page-header-height);
    min-height: var(--page-header-height);
    align-items: center;
    flex-wrap: nowrap;
    gap: 8px;
  }

  .site-brand-row {
    width: auto;
    min-width: 0;
    gap: 8px;
    flex: 1 1 auto;
  }

  .site-brand {
    min-width: 0;
    max-width: 100%;
  }

  .site-brand-name {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .site-nav {
    display: none;
  }

  .site-actions {
    width: auto;
    min-width: 0;
    gap: 6px;
    justify-content: flex-end;
    padding-bottom: 0;
    flex-wrap: nowrap;
    margin-left: auto;
    flex: 0 0 auto;
  }

  .site-locale-select {
    flex: 0 0 auto;
    margin-left: 0;
  }

  .site-select-button {
    min-width: 32px;
    width: 32px;
    max-width: 32px;
    flex: 0 0 32px;
    gap: 0;
    padding: 0;
    border-color: transparent;
    border-radius: 0;
    background-color: transparent;
  }

  .site-select-button:hover,
  .site-select-button:focus {
    border-color: transparent;
    background-color: transparent;
  }

  .site-select-button > span,
  .locale-chevron-icon {
    display: none;
  }

  .site-select-button > .locale-flag-icon {
    display: inline-block;
  }

  .site-select-menu {
    left: auto;
    right: 0;
    max-width: calc(100vw - 32px);
  }

  .site-auth-button {
    min-width: 68px;
    max-width: 92px;
    flex: 0 1 auto;
    height: 36px;
    padding: 5px 10px;
    margin-left: 0;
    font-size: 13px;
  }

  .site-profile-link {
    width: 36px;
    height: 36px;
    flex-basis: 36px;
    margin-left: 0;
  }

  .site-menu-button {
    display: inline-flex;
    flex: 0 0 40px;
  }

  .site-mobile-panel {
    position: absolute;
    top: calc(100% + 8px);
    right: var(--page-padding-x);
    z-index: 60;
    display: grid;
    width: max-content;
    min-width: 148px;
    max-width: calc(100vw - 32px);
    gap: 4px;
    padding: 8px;
    border: 1px solid var(--theme-border);
    border-radius: 6px;
    background-color: var(--theme-surface);
    box-shadow: 0 10px 24px var(--theme-shadow);
  }

  .site-mobile-panel::before {
    content: "";
    position: absolute;
    top: -7px;
    right: 18px;
    width: 12px;
    height: 12px;
    border-top: 1px solid var(--theme-border);
    border-left: 1px solid var(--theme-border);
    background-color: var(--theme-surface);
    transform: rotate(45deg);
  }

  .site-mobile-link {
    position: relative;
    z-index: 1;
    white-space: nowrap;
  }
}

@media (max-width: 390px) {
  .site-brand-name {
    display: none;
  }
}
</style>
