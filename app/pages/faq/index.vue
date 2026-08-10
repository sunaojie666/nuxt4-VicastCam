<template>
  <div class="faq-page-shell">
    <SiteHeader />

    <main class="faq-page-main">
      <template v-if="localizedFaqPageContent">
        <FaqHeroSection :content="localizedFaqPageContent.hero" />
        <FaqContentSection :content="localizedFaqPageContent.content" :groups="localizedFaqPageContent.groups" />
      </template>
    </main>

    <SiteFooter />
  </div>
</template>

<script setup>
import SiteFooter from '../../components/SiteFooter.vue'
import SiteHeader from '../../components/SiteHeader.vue'
import FaqContentSection from './components/FaqContentSection.vue'
import FaqHeroSection from './components/FaqHeroSection.vue'
import { getGraphics } from '../../api/request/strapi'
import { createLocalizedUrl, setupPageSeo, setupStructuredData } from '../../utils/seo'

const config = useRuntimeConfig()
const { locale } = useI18n()
const siteUrl = computed(() => String(config.public.siteUrl || 'https://www.vicastcam.com').replace(/\/+$/, ''))
const defaultLocale = computed(() => config.public.i18n?.defaultLocale || 'en')
const faqPageUrl = computed(() => createLocalizedUrl('/faq', locale.value, siteUrl.value, defaultLocale.value))

const faqPageContent = useState('faq-page-content', () => null)
const loadedFaqPageLocale = useState('faq-page-locale', () => '')
const localizedFaqPageContent = computed(() => {
  return loadedFaqPageLocale.value === locale.value ? faqPageContent.value : null
})

const getFaqPageContentData = (response) => {
  const entry = Array.isArray(response?.data)
    ? response.data[0]
    : response?.data || response
  const attributes = entry?.attributes || entry

  return attributes?.data || null
}

useLocalizedAsyncState({
  locale,
  loadedLocale: loadedFaqPageLocale,
  load: currentLocale => getGraphics(currentLocale),
  sync: response => {
    faqPageContent.value = getFaqPageContentData(response)
  },
  reset: () => {
    faqPageContent.value = null
  },
})

setupPageSeo('faq', () => ({
  inheritCopy: false,
  ...(localizedFaqPageContent.value?.seo || {}),
}))

const getAnswerText = (question) => {
  return (question.answer || [])
    .flatMap(block => block.type === 'list' ? block.items : [block.text])
    .filter(Boolean)
    .join(' ')
}

setupStructuredData(() => {
  if (!localizedFaqPageContent.value) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: (localizedFaqPageContent.value.groups || []).flatMap(group => (group.questions || []).map(question => ({
      '@type': 'Question',
      name: question.title,
      acceptedAnswer: {
        '@type': 'Answer',
        text: getAnswerText(question),
      },
    }))),
    url: faqPageUrl.value,
  }
}, { id: 'faq-jsonld' })
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
