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
import { createLocalizedUrl, setupPageSeo, setupStructuredData } from '../../utils/seo'

setupPageSeo('faq')

const config = useRuntimeConfig()
const { locale } = useI18n()
const siteUrl = computed(() => String(config.public.siteUrl || 'https://www.vicastcam.com').replace(/\/+$/, ''))
const defaultLocale = computed(() => config.public.i18n?.defaultLocale || 'en')
const faqPageUrl = computed(() => createLocalizedUrl('/faq', locale.value, siteUrl.value, defaultLocale.value))

setupStructuredData(() => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '如何下载与安装VicastCam',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '打开 VicastCam 后进入直播预览界面，确认摄像头和麦克风权限已开启，然后选择合适的背景效果和画面比例即可快速完成基础设置。',
      },
    },
  ],
  url: faqPageUrl.value,
}), { id: 'faq-jsonld' })
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
