<template>
  <div class="faq-page-shell">
    <SiteHeader />

    <main class="faq-page-main">
      <FaqHeroSection />
      <FaqContentSection />
    </main>

    <SiteFooter />
  </div>
</template>

<script setup>
import SiteFooter from '../../components/SiteFooter.vue'
import SiteHeader from '../../components/SiteHeader.vue'
import FaqContentSection from './components/FaqContentSection.vue'
import FaqHeroSection from './components/FaqHeroSection.vue'
import { setupPageSeo } from '../../utils/seo'

setupPageSeo('faq')
</script>

<style scoped>
.faq-page-shell {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-x: clip;
  padding-top: var(--page-header-height);
  color: var(--theme-text);
  background: var(--theme-route-page-background, var(--page-route-background));
}

.faq-page-main {
  width: 100%;
  flex: 1;
  background: var(--theme-route-page-background, var(--page-route-background));
}
</style>
