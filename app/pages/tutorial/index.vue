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
import { setupPageSeo } from '../../utils/seo'

setupPageSeo('tutorial')

const config = useRuntimeConfig()
const siteUrl = String(config.public.siteUrl || 'https://vicastcam.com').replace(/\/+$/, '')
const createAbsoluteUrl = path => /^https?:\/\//.test(path) ? path : `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`

const tutorialVideoPath = '/videos/tutorial-demo.mp4'
const tutorialVideoPosterPath = '/images/login/background.png'

useHead({
  script: [
    {
      id: 'tutorial-video-jsonld',
      type: 'application/ld+json',
      textContent: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        name: 'VicastCam Tutorial: Download and Install',
        description: 'A VicastCam tutorial video that introduces how to download, install, and start using VicastCam.',
        thumbnailUrl: [createAbsoluteUrl(tutorialVideoPosterPath)],
        uploadDate: '2026-06-09T09:03:25+08:00',
        duration: 'PT10S',
        contentUrl: createAbsoluteUrl(tutorialVideoPath),
      }),
    },
  ],
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
  background: var(--theme-route-page-background, var(--page-route-background));
}

.tutorial-page-main {
  width: 100%;
  flex: 1;
  background: var(--theme-route-page-background, var(--page-route-background));
}
</style>
