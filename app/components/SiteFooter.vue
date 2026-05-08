<template>
  <!-- 底部导航区域，左侧为品牌介绍，右侧为多列站点入口。 -->
  <footer class="site-footer">
    <div class="page-container site-footer-inner">
      <div class="site-footer-brand">
        <div class="site-footer-logo-row">
          <img
            class="site-footer-logo"
            src="~/assets/images/website.png"
            alt=""
            aria-hidden="true"
          >
          <span class="site-footer-brand-name">
            <span>{{ footerText.brandMain }}</span>
            <span class="site-footer-brand-accent">{{ footerText.brandAccent }}</span>
          </span>
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
import { createI18nPageContext } from '../utils/i18n-page'
import { createSiteFooterColumns, createSiteFooterText } from '../utils/footer-navigation'

// 从统一 i18n 工具中获取当前语言和翻译函数。
const { locale, translate } = createI18nPageContext()

// 底部模板只读取普通 ref，避免模板里直接写翻译 key。
const footerText = ref({})
const footerColumns = ref([])

// 当前语言变化时刷新底部所有文案。
const refreshFooterData = () => {
  footerText.value = createSiteFooterText(translate)
  footerColumns.value = createSiteFooterColumns(translate)
}

refreshFooterData()

// 切换语言后，底部导航同步切换对应语言。
watch(locale, () => {
  refreshFooterData()
})
</script>
