<template>
  <!-- 首页最外层容器，包含公共导航、价格区块和底部导航。 -->
  <div class="page-shell">
    <!-- 公共顶部导航，包含页面导航、登录和注册按钮。 -->
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

    <aside class="home-float-actions" aria-label="快捷操作">
      <button
        type="button"
        class="home-float-button"
        aria-label="联系客服"
        @click="handleContactSupport"
      >
        <Icon name="lucide:headset" aria-hidden="true" />
      </button>

      <Transition name="home-back-to-top-fade">
        <button
          v-if="showBackToTop"
          type="button"
          class="home-float-button home-float-button-top"
          aria-label="回到顶部"
          @click="handleBackToTop"
        >
          <Icon name="lucide:arrow-up" aria-hidden="true" />
        </button>
      </Transition>
    </aside>

    <!-- 公共底部导航，包含品牌介绍、社交入口和站点链接。 -->
    <SiteFooter />
  </div>
</template>

<script setup>
import SiteHeader from '../../components/SiteHeader.vue'
import SiteFooter from '../../components/SiteFooter.vue'
import HomeHeroSection from './components/HomeHeroSection.vue'
import HomeFeaturesSection from './components/HomeFeaturesSection.vue'
import HomeCommunityCarouselSection from './components/HomeCommunityCarouselSection.vue'
import HomeVirtualBackgroundSection from './components/HomeVirtualBackgroundSection.vue'
import HomePricingSection from './components/HomePricingSection.vue'
import HomeFaqSection from './components/HomeFaqSection.vue'
import HomeLearningSection from './components/HomeLearningSection.vue'
import { setupPageSeo } from '../../utils/seo'

setupPageSeo('home')

const showBackToTop = ref(false)

const syncBackToTopVisibility = () => {
  showBackToTop.value = window.scrollY > 420
}

const handleBackToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleContactSupport = () => {
  const footer = document.querySelector('.site-footer')
  if (!footer) {
    return
  }

  footer.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

onMounted(() => {
  syncBackToTopVisibility()
  window.addEventListener('scroll', syncBackToTopVisibility, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', syncBackToTopVisibility)
})
</script>

<style scoped>
.home-float-actions {
  position: fixed;
  right: clamp(14px, 4.1667vw, 80px);
  bottom: max(26px, calc(env(safe-area-inset-bottom) + 18px));
  z-index: 45;
  display: grid;
  gap: 20px;
}

.home-float-button {
  width: 60px;
  height: 60px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(203, 232, 255, 0.85);
  border-radius: 50%;
  color: rgba(23, 30, 45, 1);
  background: rgba(255, 255, 255, 0.96);
  box-shadow: none;
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
}

.home-float-button:hover,
.home-float-button:focus {
  color: rgba(255, 255, 255, 1);
  border-color: rgba(118, 232, 250, 0.9);
  background: linear-gradient(
    112.91deg,
    rgba(36, 207, 237, 1) 0%,
    rgba(88, 171, 248, 1) 53.06%,
    rgba(103, 231, 249, 1) 100%
  );
  box-shadow: 0 0 18px rgba(53, 196, 245, 0.62), 0 10px 24px rgba(5, 16, 35, 0.42);
}

.home-float-button :deep(svg) {
  width: 24px;
  height: 24px;
}

.home-float-button-top :deep(svg) {
  width: 24px;
  height: 24px;
  stroke-width: 2.6;
}

.home-back-to-top-fade-enter-active,
.home-back-to-top-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.home-back-to-top-fade-enter-from,
.home-back-to-top-fade-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

@media (max-width: 900px) {
  .home-float-actions {
    right: 14px;
    bottom: max(16px, calc(env(safe-area-inset-bottom) + 10px));
    gap: 14px;
  }

  .home-float-button {
    width: 60px;
    height: 60px;
  }

  .home-float-button :deep(svg) {
    width: 24px;
    height: 24px;
  }

  .home-float-button-top :deep(svg) {
    width: 24px;
    height: 24px;
    stroke-width: 2.6;
  }
}
</style>
