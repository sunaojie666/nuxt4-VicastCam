<template>
  <div class="tutorial-page-shell">
    <SiteHeader />

    <main class="tutorial-page-main">
      <TutorialHeroSection />
      <TutorialPlayerSection />
    </main>

    <SiteFooter />
  </div>
</template>

<script setup>
import SiteFooter from '../../components/SiteFooter.vue'
import SiteHeader from '../../components/SiteHeader.vue'
import TutorialHeroSection from './components/TutorialHeroSection.vue'
import TutorialPlayerSection from './components/TutorialPlayerSection.vue'

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
  title: '教程中心',
  description: '查看 VicastCam 教程中心，学习下载、安装和使用方法。',
})
</script>

<style scoped>
.tutorial-page-shell {
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

.tutorial-page-main {
  width: 100%;
  flex: 1;
  background: rgba(3, 7, 18, 1);
}
</style>
