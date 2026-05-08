<template>
  <!-- 首页最外层容器，包含公共导航、价格区块和底部导航。 -->
  <div class="page-shell">
    <!-- 公共顶部导航，包含页面导航、语言切换、登录和注册按钮。 -->
    <SiteHeader />

    <main class="page-main page-home-main">
      <HomeHeroSection />
      <HomeFeaturesSection />
      <HomeCommunityCarouselSection />
      <HomeVirtualBackgroundSection />
      <HomePricingSection />
      <HomeFaqSection />
      <HomeLearningSection />
    </main>

    <!-- 公共底部导航，包含品牌介绍、社交入口和站点链接。 -->
    <SiteFooter />
  </div>
</template>

<script setup>
import SiteHeader from '../components/SiteHeader.vue'
import SiteFooter from '../components/SiteFooter.vue'
import HomeHeroSection from './components/HomeHeroSection.vue'
import HomeFeaturesSection from './components/HomeFeaturesSection.vue'
import HomeCommunityCarouselSection from './components/HomeCommunityCarouselSection.vue'
import HomeVirtualBackgroundSection from './components/HomeVirtualBackgroundSection.vue'
import HomePricingSection from './components/HomePricingSection.vue'
import HomeFaqSection from './components/HomeFaqSection.vue'
import HomeLearningSection from './components/HomeLearningSection.vue'
import { createI18nPageContext } from '../utils/i18n-page'
import { setupI18nSeo } from '../utils/seo'

// 首页 SEO 继续复用当前多语言能力。
const { translate } = createI18nPageContext()

// 注册当前页面的 SEO，并自动生成 i18n 需要的 canonical 和 hreflang 标签。
setupI18nSeo({ translate })
</script>
