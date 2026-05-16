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
        <div
          class="site-locale-select"
          @mouseenter="openLocaleMenu"
          @mouseleave="closeLocaleMenu"
        >
          <button
            class="site-select-button"
            type="button"
            :aria-label="headerText.localeSwitchLabel"
            :aria-expanded="localeMenuOpen"
            aria-haspopup="listbox"
            @click="handleLocaleButtonClick"
            @focus="openLocaleMenu"
          >
            <Icon class="locale-flag-icon" :name="activeLocale.flagIcon" aria-hidden="true" />
            <span>{{ activeLocale.name }}</span>
            <Icon class="locale-chevron-icon" name="lucide:chevron-down" aria-hidden="true" />
          </button>

          <Transition name="site-select-fade">
            <ul v-if="localeMenuOpen" class="site-select-menu" role="listbox">
              <li
                v-for="item in availableLocales"
                :key="item.code"
                class="site-select-option"
                role="option"
                :aria-selected="item.code === locale"
              >
                <button
                  type="button"
                  class="site-select-option-button"
                  @click="switchLanguage(item.code)"
                >
                  <Icon class="locale-flag-icon" :name="item.flagIcon" aria-hidden="true" />
                  <span>{{ item.name }}</span>
                </button>
              </li>
            </ul>
          </Transition>
        </div>

        <NuxtLink
          v-if="!isLoggedIn"
          :to="localePath('/login')"
          class="site-auth-button site-auth-login"
          @click="closeMobileMenu"
        >
          {{ headerText.loginRegister }}
        </NuxtLink>

        <div
          v-else
          class="site-profile-menu"
          @mouseenter="openProfileMenu"
          @mouseleave="closeProfileMenu"
          @focusin="openProfileMenu"
          @focusout="handleProfileMenuFocusOut"
        >
          <button
            type="button"
            class="site-profile-link"
            :aria-label="profileLinkLabel"
            :aria-expanded="profileMenuOpen"
            aria-haspopup="menu"
            @click="handleProfileButtonClick"
          >
            <img
              v-if="authUser.avatar"
              class="site-profile-avatar"
              :src="authUser.avatar"
              :alt="profileLinkLabel"
            >
            <span v-else>{{ profileInitial }}</span>
          </button>

          <Transition name="site-select-fade">
            <div v-if="profileMenuOpen" class="site-profile-dropdown" role="menu">
              <button type="button" class="site-profile-menu-item" role="menuitem" @click="goToProfile">
                <Icon name="lucide:user-round" aria-hidden="true" />
                <span>个人中心</span>
              </button>
              <button type="button" class="site-profile-menu-item" role="menuitem" @click="handleLogout">
                <Icon name="lucide:log-out" aria-hidden="true" />
                <span>退出登录</span>
              </button>
            </div>
          </Transition>
        </div>

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
import { getNavigation } from '../api/request/strapi'

const { locale, locales } = useI18n()

// localePath 用来生成带当前语言前缀的页面地址。
const localePath = useLocalePath()

// switchLocalePath 只负责生成当前页面对应语言的路由。
const switchLocalePath = useSwitchLocalePath()

// 当前路由用于在页面跳转后关闭手机端菜单和处理区块滚动。
const route = useRoute()
const { authUser, clearAuth } = useAuth()

// 顶部导航模板只读取普通 ref，避免在模板中直接写翻译逻辑。
const availableLocales = ref([])
const navigationItems = ref([])
const headerText = ref({})
const activeLocale = ref({})
const localeMenuOpen = ref(false)
const profileMenuOpen = ref(false)
const mobileMenuOpen = ref(false)
const mobileMenuIcon = ref('lucide:menu')
const isSmallHeader = ref(false)
const activeNavigationKey = ref('')
const headerScrolled = ref(false)
const isLoggedIn = computed(() => {
  return Boolean(authUser.value?.user_id || authUser.value?.email || authUser.value?.nickname)
})
const profileName = computed(() => {
  return authUser.value?.nickname || authUser.value?.email || '个人中心'
})
const profileInitial = computed(() => {
  return profileName.value.trim().slice(0, 1).toUpperCase() || 'U'
})
const profileLinkLabel = computed(() => {
  return `${profileName.value}的个人中心`
})

const createSiteHeaderText = () => {
  return {
    navBrand: 'VicastCam 导航',
    brandMain: 'Vicast',
    brandAccent: 'Cam',
    menuLabel: '打开菜单',
    loginRegister: '',
    localeSwitchLabel: '切换语言',
  }
}

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
}

// 关闭手机端导航菜单。
const closeMobileMenu = () => {
  mobileMenuOpen.value = false
  mobileMenuIcon.value = 'lucide:menu'
}

// 根据 i18n 配置生成语言切换框数据，只用于切换 Strapi 请求语言和路由。
const createAvailableLocales = () => {
  return locales.value.map(item => {
    if (typeof item === 'string') {
      return { code: item, name: item, flagIcon: 'circle-flags:xx' }
    }

    return {
      code: item.code,
      name: item.name || item.code,
      flagIcon: item.flagIcon || 'circle-flags:xx',
    }
  })
}

const refreshActiveLocale = () => {
  activeLocale.value = availableLocales.value.find(item => item.code === locale.value) || availableLocales.value[0] || {}
}

// 桌面端滑过打开语言下拉，手机端保留点击打开。
const openLocaleMenu = () => {
  if (isSmallHeader.value) {
    return
  }

  localeMenuOpen.value = true
  closeMobileMenu()
}

const closeLocaleMenu = () => {
  if (isSmallHeader.value) {
    return
  }

  localeMenuOpen.value = false
}

const openProfileMenu = () => {
  if (isSmallHeader.value) {
    return
  }

  profileMenuOpen.value = true
  localeMenuOpen.value = false
  closeMobileMenu()
}

const closeProfileMenu = () => {
  profileMenuOpen.value = false
}

const handleProfileMenuFocusOut = (event) => {
  if (event.currentTarget?.contains(event.relatedTarget)) {
    return
  }

  closeProfileMenu()
}

const handleProfileButtonClick = () => {
  profileMenuOpen.value = !profileMenuOpen.value
  localeMenuOpen.value = false
  closeMobileMenu()
}

const goToProfile = () => {
  closeProfileMenu()
  closeMobileMenu()
  navigateTo(localePath('/profile'))
}

const handleLogout = () => {
  closeProfileMenu()
  closeMobileMenu()
  clearAuth()

  if (process.client) {
    $fetch('/api/auth/logout', {
      method: 'POST',
    }).catch(() => null)
  }

  navigateTo(localePath('/'))
}

const handleLocaleButtonClick = () => {
  if (!isSmallHeader.value) {
    return
  }

  localeMenuOpen.value = !localeMenuOpen.value
  closeMobileMenu()
}

// 默认中文使用 prefix_except_default，不应该跳到 /zh-CN。
const createDefaultLocalePath = () => {
  if (route.fullPath === '/en') {
    return '/'
  }

  if (route.fullPath.startsWith('/en/')) {
    return route.fullPath.slice(3) || '/'
  }

  if (route.fullPath.startsWith('/en?')) {
    return `/${route.fullPath.slice(4)}`
  }

  return route.fullPath || '/'
}

const switchLanguage = (code) => {
  localeMenuOpen.value = false

  if (!code || code === locale.value) {
    return
  }

  const targetPath = code === 'zh-CN' ? createDefaultLocalePath() : switchLocalePath(code)

  navigateTo(targetPath || '/')
}

// Strapi 导航字段和页面锚点 key 的对应关系。
const navigationFieldMap = [
  { key: 'clientDownload', field: 'navClientDownload' },
  { key: 'features', field: 'navFeatures' },
  { key: 'pricing', field: 'navPricing' },
  { key: 'faq', field: 'navFaq' },
  { key: 'sdk', label: 'SDK' },
]

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
    activeNavigationKey.value = ''
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

const handleNavigationClick = (key) => {
  closeMobileMenu()

  if (key === 'sdk') {
    navigateTo(localePath('/sdk'))
    return
  }

  const sectionId = navigationSectionMap[key]?.targetId
  if (!sectionId) {
    return
  }
  activeNavigationKey.value = key

  if (!isHomeRoute()) {
    Promise.resolve(navigateTo({ path: getHomePath() })).then(() => {
      nextTick(() => {
        window.setTimeout(() => {
          scrollToSection(sectionId)
          syncActiveNavigationByScroll()
        }, 40)
      })
    })
    return
  }

  scrollToSection(sectionId)
  syncActiveNavigationByScroll()
}

// 根据 Strapi 返回的导航数据生成顶部导航和登录按钮文案。
const refreshNavigationItems = (navigationData) => {
  navigationItems.value = navigationFieldMap.map(item => {
    return {
      key: item.key,
      label: item.label || navigationData[item.field] || '',
    }
  })

  headerText.value = {
    ...headerText.value,
    loginRegister: navigationData.navAuth || '',
  }
}

// 请求 Strapi 导航栏单类型内容。
const loadSiteNavigation = () => {
  getNavigation(locale.value).then((navigationContent) => {
    refreshNavigationItems(navigationContent?.data?.[0] || {})
  })
}

// 初始化顶部导航文案和导航清单。
const refreshHeaderData = () => {
  availableLocales.value = createAvailableLocales()
  refreshActiveLocale()
  headerText.value = createSiteHeaderText()
}

refreshHeaderData()

// 当前语言变化时刷新切换框选中项，并重新请求 Strapi 导航文案。
watch(locale, () => {
  refreshActiveLocale()
  loadSiteNavigation()
})

// 当前路由变化后关闭手机端菜单，并根据当前位置同步高亮。
watch(() => route.fullPath, () => {
  closeMobileMenu()
  localeMenuOpen.value = false
  closeProfileMenu()
  if (!isHomeRoute()) {
    activeNavigationKey.value = ''
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
  loadSiteNavigation()

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

    if (!isSmallHeader.value) {
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
  flex: 0 0 auto;
  min-width: max-content;
  max-width: none;
  display: inline-flex;
  align-items: center;
  border-radius: 4px;
  padding: 6px 10px;
  color: var(--theme-header-text);
  font-size: 16px;
  font-weight: 500;
  line-height: 20px;
  white-space: nowrap;
  transition: color 0.2s ease;
}

.site-nav-link span {
  min-width: max-content;
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
  overflow: hidden;
}

.site-profile-menu {
  position: relative;
  display: inline-flex;
  align-items: center;
  margin-left: 20px;
}

.site-profile-menu::after {
  content: "";
  position: absolute;
  top: 100%;
  right: 0;
  width: 100%;
  height: 8px;
}

.site-profile-menu .site-profile-link {
  margin-left: 0;
  cursor: pointer;
}

.site-profile-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.site-profile-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  z-index: 20;
  width: 138px;
  padding: 6px;
  border: 0;
  border-radius: 8px;
  background-color: rgba(17, 24, 39, 1);
  box-shadow: 0 10px 24px var(--theme-shadow);
}

.site-profile-menu-item {
  width: 100%;
  height: 38px;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 0 10px;
  border-radius: 6px;
  color: var(--theme-text);
  font-size: 14px;
  line-height: 20px;
  text-align: left;
  cursor: pointer;
  transition: color 0.2s ease, background-color 0.2s ease;
}

.site-profile-menu-item svg {
  width: 16px;
  height: 16px;
  flex: 0 0 auto;
  color: var(--theme-text-muted);
}

.site-profile-menu-item:hover,
.site-profile-menu-item:focus {
  color: rgba(64, 217, 247, 1);
  background-color: rgba(18, 44, 59, 1);
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
    max-width: none;
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

  .site-profile-menu {
    margin-left: 8px;
  }

  .site-profile-menu .site-profile-link {
    margin-left: 0;
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

  .site-select-menu {
    left: auto;
    right: 0;
    max-width: calc(100vw - 32px);
  }

  .site-auth-button {
    min-width: 86px;
    max-width: none;
    flex: 0 0 auto;
    height: 36px;
    padding: 0 14px;
    margin-left: 0;
    font-size: 13px;
    line-height: 36px;
  }

  .site-profile-link {
    width: 36px;
    height: 36px;
    flex-basis: 36px;
    margin-left: 0;
  }

  .site-profile-menu {
    margin-left: 0;
  }

  .site-profile-dropdown {
    right: 0;
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
