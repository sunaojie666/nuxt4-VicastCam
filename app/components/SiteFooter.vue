<template>
  <!-- 底部导航区域，左侧为品牌介绍，右侧为多列站点入口。 -->
  <footer class="site-footer">
    <div class="page-container site-footer-inner">
      <div class="site-footer-brand">
        <div class="site-footer-logo-row">
          <img
            class="site-footer-logo"
            src="/images/logo.png"
            alt=""
            aria-hidden="true"
          >
          <span class="site-footer-brand-name">
            <span>{{ footerText.brandMain }}</span>
            <span class="site-footer-brand-accent">{{ footerText.brandAccent }}</span>
          </span>

          <div
            class="site-footer-locale-wrap"
            @mouseenter="openLocaleMenu"
            @mouseleave="closeLocaleMenu"
          >
            <button
              class="site-footer-select-button"
              type="button"
              :aria-label="localeSwitchLabel"
              :aria-expanded="localeMenuOpen"
              aria-haspopup="listbox"
              @click="handleLocaleButtonClick"
              @focus="openLocaleMenu"
              @blur="closeLocaleMenuLater"
            >
              <Icon class="site-footer-locale-flag-icon" :name="activeLocale.flagIcon" aria-hidden="true" />
              <span>{{ activeLocale.name }}</span>
              <Icon class="site-footer-locale-chevron-icon" name="lucide:chevron-down" aria-hidden="true" />
            </button>

            <Transition name="site-footer-select-fade">
              <ul v-if="localeMenuOpen" class="site-footer-select-menu" role="listbox">
                <li
                  v-for="item in availableLocales"
                  :key="item.code"
                  class="site-footer-select-option"
                  role="option"
                  :aria-selected="item.code === locale"
                >
                  <button
                    type="button"
                    class="site-footer-select-option-button"
                    @mousedown.prevent
                    @click="switchLanguage(item.code)"
                    @blur="closeLocaleMenuLater"
                  >
                    <Icon class="site-footer-locale-flag-icon" :name="item.flagIcon" aria-hidden="true" />
                    <span>{{ item.name }}</span>
                  </button>
                </li>
              </ul>
            </Transition>
          </div>
        </div>

        <p class="site-footer-description">
          {{ footerText.description }}
        </p>

        <div class="site-footer-socials" :aria-label="footerText.brand">
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
          >
            {{ item.label }}
          </button>
        </section>
      </nav>
    </div>
  </footer>
</template>

<script setup>
import { createAvailableLocales, createI18nPageContext } from '../utils/i18n-page'
import { createSiteFooterColumns, createSiteFooterText } from '../utils/footer-navigation'

// 从统一 i18n 工具中获取当前语言和翻译函数。
const { locale, locales, setLocale, translate } = createI18nPageContext()
const switchLocalePath = useSwitchLocalePath()

// 底部模板只读取普通 ref，避免模板里直接写翻译 key。
const footerText = ref({})
const footerColumns = ref([])
const availableLocales = ref([])
const localeSwitchLabel = ref('语言')
const activeLocale = ref({})
const localeMenuOpen = ref(false)

// 当前语言变化时刷新底部所有文案。
const refreshFooterData = () => {
  footerText.value = createSiteFooterText(translate)
  footerColumns.value = createSiteFooterColumns(translate)
  availableLocales.value = createAvailableLocales(locales)
  localeSwitchLabel.value = translate('locale.switchLabel')
  activeLocale.value = availableLocales.value.find(item => item.code === locale.value) || availableLocales.value[0] || {}
}

refreshFooterData()

// 切换语言后，底部导航同步切换对应语言。
watch(locale, () => {
  refreshFooterData()
})

const openLocaleMenu = () => {
  localeMenuOpen.value = true
}

const closeLocaleMenu = () => {
  localeMenuOpen.value = false
}

const handleLocaleButtonClick = () => {
  localeMenuOpen.value = !localeMenuOpen.value
}

const closeLocaleMenuLater = () => {
  window.setTimeout(() => {
    localeMenuOpen.value = false
  }, 120)
}

const switchLanguage = async (code) => {
  localeMenuOpen.value = false
  if (!code || code === locale.value) {
    return
  }
  await setLocale(code)
  await navigateTo(switchLocalePath(code))
}
</script>

<style>
.site-footer {
  width: 100%;
  min-height: var(--page-footer-height);
  display: flex;
  justify-content: center;
  background: rgba(3, 7, 18, 1);
}
.site-footer-inner {
  min-height: var(--page-footer-height);
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
  flex-wrap: wrap;
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
  font-size: 18px;
  font-weight: 800;
  line-height: 24px;
  white-space: nowrap;
}
.site-footer-brand-accent {
  color: var(--theme-brand-accent);
}

.site-footer-locale-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
  margin-left: 10px;
}

.site-footer-locale-wrap::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  height: 8px;
}

.site-footer-select-button {
  width: 110px;
  min-width: 110px;
  max-width: 110px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 0 6px;
  border: 1px solid rgba(45, 48, 56, 1);
  border-radius: 6px;
  color: rgba(226, 234, 245, 1);
  background: transparent;
  font-size: 14px;
  font-weight: 500;
  line-height: 30px;
  white-space: nowrap;
  cursor: pointer;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.site-footer-select-button span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

.site-footer-select-button:hover,
.site-footer-select-button:focus {
  border-color: rgba(45, 48, 56, 1);
  background-color: transparent;
}

.site-footer-locale-flag-icon {
  width: 19px;
  height: 14px;
  flex: 0 0 auto;
  display: inline-block;
}

.site-footer-locale-chevron-icon {
  width: 12px;
  height: 12px;
  color: var(--theme-footer-text);
  transition: transform 0.2s ease;
}

.site-footer-locale-wrap:hover .site-footer-locale-chevron-icon,
.site-footer-locale-wrap:focus-within .site-footer-locale-chevron-icon {
  transform: rotate(180deg);
}

.site-footer-select-menu {
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

.site-footer-select-option {
  min-width: 150px;
  color: var(--theme-text);
  font-size: 14px;
  line-height: 20px;
  background-color: transparent;
}

.site-footer-select-option-button {
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

.site-footer-select-option-button span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

.site-footer-select-option-button:hover,
.site-footer-select-option-button:focus {
  color: rgba(64, 217, 247, 1);
  background-color: rgba(18, 44, 59, 1);
}

.site-footer-select-fade-enter-active,
.site-footer-select-fade-leave-active {
  transition: opacity 0.16s ease, transform 0.16s ease;
}

.site-footer-select-fade-enter-from,
.site-footer-select-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
.site-footer-description {
  margin-top: 24px;
  color: var(--theme-footer-text);
  font-size: 12px;
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
  width: 22px;
  height: 22px;
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
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
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
  font-size: 12px;
  font-weight: 400;
  line-height: 20px;
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

  .site-footer-inner {
    min-height: auto;
    flex-direction: column;
    gap: 36px;
    padding-top: 44px;
    padding-bottom: 44px;
  }

  .site-footer-brand {
    width: 100%;
    flex-basis: auto;
  }

  .site-footer-locale-wrap {
    margin-left: 0;
  }

  .site-footer-columns {
    width: 100%;
    grid-template-columns: repeat(2, minmax(120px, 1fr));
    row-gap: 28px;
    margin-left: 0;
  }
}
</style>
