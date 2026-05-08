<template>
  <!-- 顶部导航区域，左侧显示站点名称，中间显示页面导航，右侧显示功能按钮。 -->
  <header class="page-header">
    <div class="page-container page-header-inner">
      <div class="site-brand-row">
        <NuxtLink :to="localePath('/')" class="site-brand">
          <img
            class="site-brand-image"
            src="~/assets/images/website.png"
            alt=""
            aria-hidden="true"
          >
          <span class="site-brand-name">
            <span>{{ headerText.brandMain }}</span>
            <span class="site-brand-accent">{{ headerText.brandAccent }}</span>
          </span>
        </NuxtLink>

      </div>

      <!-- 页面导航当前只做入口展示，不绑定锚点，避免页面未开发时触发滚动报错。 -->
      <nav class="site-nav" :aria-label="headerText.navBrand">
        <button
          v-for="item in navigationItems"
          :key="item.key"
          type="button"
          class="site-nav-link"
          @click="closeMobileMenu"
        >
          <span>{{ item.label }}</span>
        </button>
      </nav>

      <div class="site-actions">
        <!-- 自定义语言下拉，保持 hover 展开和当前视觉样式，不再依赖组件库。 -->
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
            @blur="closeLocaleMenuLater"
          >
            <Icon class="locale-flag-icon" :name="activeLocale.flagIcon" aria-hidden="true" />
            <Icon class="locale-globe-icon" name="lucide:globe-2" aria-hidden="true" />
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
                  @mousedown.prevent
                  @click="switchLanguage(item.code)"
                  @blur="closeLocaleMenuLater"
                >
                  <Icon class="locale-flag-icon" :name="item.flagIcon" aria-hidden="true" />
                  <span>{{ item.name }}</span>
                </button>
              </li>
            </ul>
          </Transition>
        </div>

        <!-- 登录注册只做页面展示按钮，暂不绑定业务功能。 -->
        <button type="button" class="site-auth-button site-auth-login">
          {{ headerText.loginRegister }}
        </button>

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
          class="site-mobile-link"
          @click="closeMobileMenu"
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

// 当前路由用于在页面跳转后关闭手机端菜单。
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

// 当前路由变化后关闭手机端菜单。
watch(() => route.path, () => {
  closeMobileMenu()
})

onMounted(() => {
  const mediaQuery = window.matchMedia('(max-width: 768px)')
  const syncHeaderMode = () => {
    isSmallHeader.value = mediaQuery.matches

    if (!mediaQuery.matches) {
      localeMenuOpen.value = false
    }
  }

  syncHeaderMode()
  mediaQuery.addEventListener('change', syncHeaderMode)

  onBeforeUnmount(() => {
    mediaQuery.removeEventListener('change', syncHeaderMode)
  })
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
