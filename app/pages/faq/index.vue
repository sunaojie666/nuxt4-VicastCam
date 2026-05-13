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

const localeHead = useLocaleHead({
  seo: {
    canonicalQueries: [],
  },
})

useHead(() => ({
  meta: localeHead.value.meta,
  link: localeHead.value.link,
  htmlAttrs: localeHead.value.htmlAttrs,
}))

useSeoMeta({
  title: '常见问题',
  description: '查看 VicastCam 常见问题、下载、安装和直播使用说明。',
})
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
  background: rgba(3, 7, 18, 1);
}

.faq-page-main {
  width: 100%;
  flex: 1;
  background: rgba(3, 7, 18, 1);
}
</style>
