<template>
  <div class="tutorial-page-shell">
    <SiteHeader />

    <main v-if="videoContent" class="tutorial-page-main">
      <TutorialHeroSection :content="videoContent.hero" />
      <TutorialPlayerSection :content="videoContent.player" :groups="videoContent.groups" />
    </main>

    <SiteFooter />
  </div>
</template>

<script setup>
import SiteFooter from '../../components/SiteFooter.vue'
import SiteHeader from '../../components/SiteHeader.vue'
import TutorialHeroSection from './components/TutorialHeroSection.vue'
import TutorialPlayerSection from './components/TutorialPlayerSection.vue'
import { getVideos } from '../../api/request/strapi'
import { setupPageSeo } from '../../utils/seo'

setupPageSeo('tutorial')

const config = useRuntimeConfig()
const { locale } = useI18n()
const siteUrl = String(config.public.siteUrl || 'https://vicastcam.com').replace(/\/+$/, '')
const createAbsoluteUrl = path => /^https?:\/\//.test(path) ? path : `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`
const tutorialPoster = '/images/tutorial/video-poster.png'

const videoContent = useState('tutorial-video-content', () => null)
const loadedVideoLocale = useState('tutorial-video-locale', () => '')

const getVideoContentData = (response) => {
  const entry = Array.isArray(response?.data)
    ? response.data[0]
    : response?.data || response
  const attributes = entry?.attributes || entry

  return attributes?.data || attributes?.videoBox || attributes || null
}

useLocalizedAsyncState({
  locale,
  loadedLocale: loadedVideoLocale,
  load: currentLocale => getVideos(currentLocale),
  sync: response => {
    videoContent.value = getVideoContentData(response)
  },
  reset: () => {
    videoContent.value = null
  },
})

const firstLesson = computed(() => {
  return videoContent.value?.groups?.flatMap(group => group.lessons || [])[0] || null
})

useHead(() => ({
  script: firstLesson.value?.video ? [
    {
      id: 'tutorial-video-jsonld',
      type: 'application/ld+json',
      textContent: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        name: firstLesson.value.title,
        description: firstLesson.value.description,
        thumbnailUrl: [createAbsoluteUrl(tutorialPoster)],
        uploadDate: '2026-06-09T09:03:25+08:00',
        contentUrl: createAbsoluteUrl(firstLesson.value.video),
      }),
    },
  ] : [],
}))
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
