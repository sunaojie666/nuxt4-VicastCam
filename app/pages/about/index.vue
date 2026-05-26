<template>
  <div class="about-page-shell">
    <SiteHeader />

    <main class="about-page-main">
      <section class="about-hero-section" aria-labelledby="about-hero-title">
        <video
          v-if="aboutHeroVideoSrc"
          :key="aboutHeroVideoSrc"
          class="about-hero-video"
          :src="aboutHeroVideoSrc"
          autoplay
          muted
          loop
          playsinline
          preload="metadata"
          aria-hidden="true"
        />

        <div class="about-hero-overlay"></div>

        <div class="about-hero-inner">
          <span class="about-hero-eyebrow">{{ aboutBox.hero.eyebrow }}</span>

          <h1 id="about-hero-title" class="about-hero-title">
            <span>{{ aboutBox.hero.titleMain }}</span>
            <span class="theme-gradient-text">
              {{ aboutBox.hero.titleHighlight }}
              <img class="about-hero-title-line" src="/images/common/title-underline.png" alt="" aria-hidden="true">
            </span>
          </h1>

          <p class="about-hero-subtitle">
            <span>{{ aboutBox.hero.description }}</span>
          </p>

          <div class="about-hero-actions">
            <button type="button" class="about-hero-action about-hero-action-primary" @click="handleContactClick">
              {{ aboutBox.hero.primaryButtonText }}
            </button>
            <NuxtLink :to="localePath('/sdk')" class="about-hero-action about-hero-action-ghost">
              {{ aboutBox.hero.secondaryButtonText }}
            </NuxtLink>
          </div>
        </div>
      </section>

      <section class="about-innovation-section" aria-labelledby="about-innovation-title">
        <div class="page-container about-innovation-inner">
          <span class="about-innovation-eyebrow">{{ aboutBox.innovation.sectionTag }}</span>

          <h2 id="about-innovation-title" class="about-innovation-title">
            <span>{{ aboutBox.innovation.titleMain }}</span>
            <span class="theme-gradient-text">{{ aboutBox.innovation.titleHighlight }}</span>
          </h2>

          <p class="about-innovation-subtitle">
            {{ aboutBox.innovation.description }}
          </p>

          <div class="about-innovation-grid">
            <article class="about-innovation-feature">
              <span>{{ aboutBox.innovation.featureTag }}</span>
              <h3>{{ aboutBox.innovation.featureTitle }}</h3>
              <p>
                {{ aboutBox.innovation.featureDescription }}
              </p>
            </article>

            <div class="about-stat-grid">
              <article v-for="(stat, index) in aboutStats" :key="stat.value || `stat-${index}`" class="about-stat-card">
                <strong>{{ stat.value }}</strong>
                <span>{{ stat.label }}</span>
                <p>{{ stat.text }}</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section class="about-roadmap-section" aria-labelledby="about-roadmap-title">
        <div class="page-container about-roadmap-inner">
          <span class="about-roadmap-eyebrow">{{ aboutBox.roadmap.sectionTag }}</span>

          <h2 id="about-roadmap-title" class="about-roadmap-title">
            <span>{{ aboutBox.roadmap.titleMain }}</span>
            <span class="theme-gradient-text">{{ aboutBox.roadmap.titleHighlight }}</span>
          </h2>

          <p class="about-roadmap-subtitle">
            {{ aboutBox.roadmap.description }}
          </p>

          <div class="about-roadmap-list">
            <article
              v-for="(item, index) in roadmapItems"
              :key="item.year || `roadmap-${index}`"
              :class="['about-roadmap-card', { 'about-roadmap-card-active': item.year === activeRoadmapYear }]"
              @mouseenter="activeRoadmapYear = item.year"
              @focusin="activeRoadmapYear = item.year"
            >
              <strong>{{ item.year }}</strong>
              <div class="about-roadmap-card-copy">
                <h3>{{ item.title }}</h3>
                <p>{{ item.text }}</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section class="about-social-section" aria-labelledby="about-social-title">
        <div class="page-container about-social-inner">
          <span class="about-social-eyebrow">{{ aboutBox.social.sectionTag }}</span>

          <h2 id="about-social-title" class="about-social-title">
            <span>{{ aboutBox.social.titleMain }}</span>
            <span class="theme-gradient-text">{{ aboutBox.social.titleHighlight }}</span>
          </h2>

          <p class="about-social-subtitle">
            {{ aboutBox.social.description }}
          </p>

          <div class="about-social-grid">
            <a
              v-for="(item, index) in socialItems"
              :key="item.key || item.title || `social-${index}`"
              class="about-social-card"
              :href="item.href"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span class="about-social-icon" aria-hidden="true">
                <Icon v-if="item.icon" :name="item.icon" />
              </span>
              <span class="about-social-copy">
                <strong>{{ item.title }}</strong>
                <small>{{ item.description }}</small>
              </span>
            </a>
          </div>
        </div>
      </section>
    </main>

    <SiteFooter />
  </div>
</template>

<script setup>
import SiteFooter from '../../components/SiteFooter.vue'
import SiteHeader from '../../components/SiteHeader.vue'
import { getAbouts, getHomes } from '../../api/request/strapi'
import { setupPageSeo } from '../../utils/seo'

const config = useRuntimeConfig()
const localePath = useLocalePath()
const { locale } = useI18n()
const activeRoadmapYear = ref('2024')
const aboutHeroVideoSrc = ref('')
let aboutRequestId = 0
let heroVideoRequestId = 0

const emptyAboutBox = {
  hero: {
    eyebrow: '',
    titleMain: '',
    titleHighlight: '',
    description: '',
    primaryButtonText: '',
    secondaryButtonText: '',
  },
  innovation: {
    sectionTag: '',
    titleMain: '',
    titleHighlight: '',
    description: '',
    featureTag: '',
    featureTitle: '',
    featureDescription: '',
    stats: [],
  },
  roadmap: {
    sectionTag: '',
    titleMain: '',
    titleHighlight: '',
    description: '',
    items: [],
  },
  social: {
    sectionTag: '',
    titleMain: '',
    titleHighlight: '',
    description: '',
    items: [],
  },
  seo: {
    title: '',
    description: '',
  },
}

const createEmptyAboutBox = () => ({
  hero: { ...emptyAboutBox.hero },
  innovation: { ...emptyAboutBox.innovation, stats: [] },
  roadmap: { ...emptyAboutBox.roadmap, items: [] },
  social: { ...emptyAboutBox.social, items: [] },
  seo: { ...emptyAboutBox.seo },
})

const aboutBox = ref(createEmptyAboutBox())

const normalizeList = (items) => {
  return Array.isArray(items) ? items.filter(Boolean) : []
}

const normalizeAboutBox = (box = {}) => {
  const source = box || {}

  return {
    hero: {
      ...emptyAboutBox.hero,
      ...(source.hero || {}),
    },
    innovation: {
      ...emptyAboutBox.innovation,
      ...(source.innovation || {}),
      stats: normalizeList(source.innovation?.stats),
    },
    roadmap: {
      ...emptyAboutBox.roadmap,
      ...(source.roadmap || {}),
      items: normalizeList(source.roadmap?.items),
    },
    social: {
      ...emptyAboutBox.social,
      ...(source.social || {}),
      items: normalizeList(source.social?.items),
    },
    seo: {
      ...emptyAboutBox.seo,
      ...(source.seo || {}),
    },
  }
}

const getAboutBoxFromResponse = (response) => {
  const records = response?.data
  const firstRecord = Array.isArray(records) ? records[0] : records
  const record = firstRecord?.attributes || firstRecord || {}

  return normalizeAboutBox(record.aboutBox)
}

const createStrapiAssetUrl = (url) => {
  if (!url) {
    return ''
  }

  return url.startsWith('http') ? url : `${config.public.strapiUrl.replace(/\/+$/, '')}${url}`
}

const loadAboutHeroVideo = () => {
  const requestId = ++heroVideoRequestId
  const currentLocale = locale.value

  getHomes(currentLocale).then(
    homeContent => {
      if (requestId !== heroVideoRequestId || currentLocale !== locale.value) {
        return
      }

      const videoUrl = homeContent?.data?.[0]?.bgVideo?.[0]?.url || ''
      aboutHeroVideoSrc.value = createStrapiAssetUrl(videoUrl)
    },
    () => {
      if (requestId !== heroVideoRequestId || currentLocale !== locale.value) {
        return
      }

      aboutHeroVideoSrc.value = ''
    }
  )
}

const roadmapItems = computed(() => aboutBox.value.roadmap.items)
const aboutStats = computed(() => aboutBox.value.innovation.stats)
const socialItems = computed(() => aboutBox.value.social.items)

const syncActiveRoadmapYear = () => {
  activeRoadmapYear.value = roadmapItems.value.find(item => item.year === activeRoadmapYear.value)?.year || roadmapItems.value[0]?.year || ''
}

const loadAboutBox = () => {
  const requestId = ++aboutRequestId
  const currentLocale = locale.value

  getAbouts(currentLocale).then(
    aboutContent => {
      if (requestId !== aboutRequestId || currentLocale !== locale.value) {
        return
      }

      aboutBox.value = getAboutBoxFromResponse(aboutContent)
      syncActiveRoadmapYear()
    },
    () => {
      if (requestId !== aboutRequestId || currentLocale !== locale.value) {
        return
      }

      aboutBox.value = createEmptyAboutBox()
      syncActiveRoadmapYear()
    }
  )
}

const handleContactClick = () => {
  if (!process.client) {
    return
  }

  document.querySelector('.site-footer')?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
}

onMounted(() => {
  loadAboutBox()
  loadAboutHeroVideo()
})

watch(locale, () => {
  loadAboutBox()
  loadAboutHeroVideo()
})

setupPageSeo('about', () => aboutBox.value.seo)
</script>

<style scoped>
.about-page-shell {
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

.about-page-main {
  --about-section-background: var(--theme-surface-alt);
  --about-section-background-alt: var(--theme-page);
  --about-card-background: var(--theme-page);
  --about-card-border: var(--theme-surface-soft);
  --about-card-hover-background: var(--theme-learning-card-hover-background, var(--theme-surface-deep));
  --about-card-hover-border: var(--theme-learning-card-hover-border, var(--theme-brand-accent-72));
  --about-card-shadow: none;
  --about-card-hover-shadow: 0 18px 36px var(--theme-learning-card-hover-shadow, var(--theme-brand-accent-20));
  --about-title: var(--theme-white);
  --about-text: var(--theme-text-muted);
  width: 100%;
  flex: 1;
  background: var(--theme-route-page-background, var(--page-route-background));
}

:root[data-theme="light"] .about-page-main {
  --about-section-background: var(--theme-feature-background, var(--theme-route-page-background));
  --about-section-background-alt: var(--theme-pricing-background, var(--theme-route-page-background));
  --about-card-background: var(--theme-learning-card-background, var(--theme-route-card-background));
  --about-card-border: var(--theme-learning-card-border, var(--theme-route-card-border));
  --about-card-hover-background: var(--theme-learning-card-hover-background, var(--theme-route-card-background));
  --about-card-hover-border: var(--theme-learning-card-hover-border, var(--theme-brand-accent-72));
  --about-card-shadow: var(--theme-route-card-shadow);
  --about-card-hover-shadow: 0 18px 36px var(--theme-learning-card-hover-shadow, var(--theme-brand-accent-20));
  --about-title: var(--theme-feature-title, var(--theme-route-card-title));
  --about-text: var(--theme-feature-card-text, var(--theme-route-card-text));
}

:root[data-theme="light"] .about-innovation-eyebrow,
:root[data-theme="light"] .about-roadmap-eyebrow,
:root[data-theme="light"] .about-social-eyebrow {
  border-color: var(--theme-feature-eyebrow-border);
  color: var(--theme-feature-card-border);
  background-color: var(--theme-feature-eyebrow-background);
  box-shadow: none;
}

.about-hero-section {
  position: relative;
  width: 100%;
  min-height: 929px;
  height: auto;
  display: flex;
  justify-content: center;
  overflow: hidden;
  color: var(--theme-route-card-title, var(--theme-white));
  background:
    linear-gradient(180deg, var(--theme-surface-start) 0%, var(--theme-page) 100%),
    radial-gradient(circle at 50% 20%, var(--theme-primary-softer), transparent 58%);
  border-bottom: none;
}

.about-hero-video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.8;
}

.about-hero-overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, var(--theme-page-36) 0%, var(--theme-page-62) 58%, var(--theme-page-96) 100%),
    radial-gradient(circle at 50% 26%, var(--theme-extra-15-23-42-004) 0%, var(--theme-page-72) 72%);
}

.about-hero-inner {
  position: relative;
  z-index: 1;
  width: min(100%, var(--page-max-width));
  min-height: 929px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 172px var(--page-padding-x) 72px;
  text-align: center;
}

.about-hero-eyebrow {
  max-width: 100%;
  width: fit-content;
  min-width: 0;
  min-height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 18px;
  border: 1px solid var(--theme-accent-border);
  border-radius: 999px;
  color: var(--theme-accent-text);
  background-color: var(--theme-cyan-panel);
  box-shadow: inset 0 0 18px var(--theme-accent-soft);
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  overflow-wrap: anywhere;
}

.about-hero-title {
  max-width: min(100%, 980px);
  margin-top: 22px;
  color: var(--theme-white);
  font-size: clamp(44px, 4.35vw, 58px);
  font-weight: 900;
  line-height: 1.17;
  text-align: center;
  overflow-wrap: anywhere;
  hyphens: auto;
}

.about-hero-title span {
  display: block;
  white-space: normal;
}

.about-hero-title span:last-child {
  position: relative;
  display: inline-block;
  max-width: 100%;
}

.about-hero-title-line {
  position: absolute;
  left: 50%;
  bottom: -14px;
  width: min(250px, 72%);
  height: auto;
  transform: translateX(-50%);
}

.about-hero-subtitle {
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 32px;
  color: var(--theme-text-soft);
  font-size: 20px;
  line-height: 30px;
  overflow-wrap: anywhere;
}

.about-hero-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 26px;
  margin-top: 37px;
}

.about-hero-action {
  min-width: 144px;
  max-width: min(100%, 300px);
  height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 18px;
  border-radius: 15px;
  font-size: 14px;
  font-weight: 800;
  line-height: 20px;
  white-space: nowrap;
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease, background 0.2s ease, transform 0.2s ease;
}

.about-hero-action-primary {
  color: var(--theme-white);
  border-color: transparent;
  background: linear-gradient(124.24deg, var(--theme-brand-accent) 0%, var(--theme-primary-end) 100%);
  box-shadow: 0 0 18px var(--theme-extra-14-165-233-036);
}

.about-hero-action-ghost {
  color: var(--theme-white);
  border: 1px solid transparent;
  background: var(--theme-white-05);
}

.about-hero-actions:has(.about-hero-action-ghost:hover) .about-hero-action-primary,
.about-hero-actions:has(.about-hero-action-ghost:focus) .about-hero-action-primary {
  color: var(--theme-white);
  border-color: transparent;
  background: var(--theme-white-05);
  box-shadow: none;
}

.about-hero-action:hover,
.about-hero-action:focus {
  color: var(--theme-white);
  border-color: transparent;
  background: linear-gradient(124.24deg, var(--theme-brand-accent) 0%, var(--theme-primary-end) 100%);
  box-shadow: 0 0 18px var(--theme-extra-14-165-233-036);
  transform: translateY(-1px);
}

.about-innovation-section {
  width: 100%;
  padding: 78px 0 80px;
  background: var(--about-section-background);
}

.about-innovation-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.about-innovation-eyebrow {
  min-width: 76px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 13px;
  border: 1px solid var(--theme-accent-border);
  border-radius: 999px;
  color: var(--theme-accent-text);
  background-color: var(--theme-cyan-panel);
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
}

.about-innovation-title {
  max-width: 100%;
  margin-top: 18px;
  color: var(--about-title);
  font-size: 40px;
  font-weight: 900;
  line-height: 52px;
  text-align: center;
  overflow-wrap: anywhere;
}

.about-innovation-title span {
  display: block;
}

.about-innovation-subtitle {
  max-width: 100%;
  margin-top: 20px;
  color: var(--about-text);
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  overflow-wrap: anywhere;
}

.about-innovation-grid {
  width: min(100%, var(--page-max-width));
  display: grid;
  grid-template-columns: minmax(0, 1fr) 368px;
  gap: 22px;
  margin-top: 80px;
}

.about-innovation-feature,
.about-stat-card {
  border: 1px solid var(--about-card-border);
  border-radius: 8px;
  background: var(--about-card-background);
  box-shadow: var(--about-card-shadow);
}

.about-innovation-feature {
  min-height: 310px;
  padding: 42px 44px;
}

.about-innovation-feature span {
  color: var(--theme-accent);
  font-size: 12px;
  font-weight: 800;
  line-height: 18px;
}

.about-innovation-feature h3 {
  margin-top: 14px;
  color: var(--about-title);
  font-size: 40px;
  font-weight: 900;
  line-height: 48px;
}

.about-innovation-feature p {
  margin-top: 24px;
  color: var(--about-text);
  font-size: 16px;
  line-height: 24px;
  overflow-wrap: anywhere;
}

.about-stat-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 22px;
}

.about-stat-card {
  min-height: 144px;
  padding: 28px 24px;
}

.about-stat-card strong {
  display: block;
  color: var(--theme-accent);
  font-size: 28px;
  font-weight: 900;
  line-height: 34px;
}

.about-stat-card span {
  display: block;
  margin-top: 4px;
  color: var(--about-title);
  font-size: 14px;
  font-weight: 800;
  line-height: 20px;
}

.about-stat-card p {
  margin-top: 6px;
  color: var(--about-text);
  font-size: 12px;
  line-height: 18px;
}

.about-roadmap-section {
  width: 100%;
  padding: 78px 0 80px;
  background: var(--about-section-background-alt);
}

.about-roadmap-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.about-roadmap-eyebrow {
  min-width: 76px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 13px;
  border: 1px solid var(--theme-accent-border);
  border-radius: 999px;
  color: var(--theme-accent-text);
  background-color: var(--theme-cyan-panel);
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
}

.about-roadmap-title {
  max-width: 100%;
  margin-top: 18px;
  color: var(--about-title);
  font-size: 40px;
  font-weight: 900;
  line-height: 52px;
  text-align: center;
  overflow-wrap: anywhere;
}

.about-roadmap-title span {
  display: block;
}

.about-roadmap-subtitle {
  max-width: 100%;
  margin-top: 20px;
  color: var(--about-text);
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  overflow-wrap: anywhere;
}

.about-roadmap-list {
  width: min(100%, var(--page-max-width));
  display: grid;
  gap: 16px;
  margin-top: 76px;
}

.about-roadmap-card {
  width: 100%;
  min-height: 96px;
  display: grid;
  grid-template-columns: 116px minmax(0, 1fr);
  align-items: center;
  gap: 22px;
  padding: 20px 34px 20px 38px;
  border: 1px solid var(--about-card-border);
  border-radius: 8px;
  background: var(--about-card-background);
  box-shadow: var(--about-card-shadow);
  color: var(--about-text);
  transition: border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
}

.about-roadmap-card:hover,
.about-roadmap-card:focus-within,
.about-roadmap-card-active {
  border-color: var(--about-card-hover-border);
  background: var(--about-card-hover-background);
  box-shadow: inset 0 0 0 1px var(--about-card-hover-border), var(--about-card-hover-shadow);
}

.about-roadmap-card strong {
  color: var(--theme-accent);
  font-size: 26px;
  font-weight: 900;
  line-height: 32px;
}

.about-roadmap-card-copy {
  min-width: 0;
}

.about-roadmap-card-copy h3 {
  color: var(--about-title);
  font-size: 20px;
  font-weight: 900;
  line-height: 28px;
}

.about-roadmap-card-copy p {
  margin-top: 7px;
  color: var(--about-text);
  font-size: 13px;
  line-height: 22px;
  overflow-wrap: anywhere;
}

.about-social-section {
  width: 100%;
  padding: 78px 0 110px;
  background: var(--about-section-background);
}

.about-social-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.about-social-eyebrow {
  min-width: 76px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 13px;
  border: 1px solid var(--theme-accent-border);
  border-radius: 999px;
  color: var(--theme-accent-text);
  background-color: var(--theme-cyan-panel);
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
}

.about-social-title {
  max-width: 100%;
  margin-top: 18px;
  color: var(--about-title);
  font-size: 40px;
  font-weight: 900;
  line-height: 52px;
  text-align: center;
  overflow-wrap: anywhere;
}

.about-social-title span {
  display: block;
}

.about-social-subtitle {
  max-width: 100%;
  margin-top: 20px;
  color: var(--about-text);
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  overflow-wrap: anywhere;
}

.about-social-grid {
  width: min(100%, var(--page-max-width));
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 22px;
  margin-top: 76px;
}

.about-social-card {
  min-width: 0;
  min-height: 88px;
  display: grid;
  grid-template-columns: 40px minmax(0, 1fr);
  align-items: center;
  gap: 16px;
  padding: 18px 20px;
  border: 1px solid var(--about-card-border);
  border-radius: 8px;
  color: var(--about-title);
  background: var(--about-card-background);
  box-shadow: var(--about-card-shadow);
  transition: border-color 0.2s ease, background-color 0.2s ease, transform 0.2s ease;
}

.about-social-card:hover,
.about-social-card:focus {
  border-color: var(--about-card-hover-border);
  background: var(--about-card-hover-background);
  box-shadow: var(--about-card-hover-shadow);
  transform: translateY(-2px);
}

.about-social-icon {
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: var(--theme-white);
}

.about-social-icon svg {
  width: 24px;
  height: 24px;
}

.about-social-copy {
  min-width: 0;
  display: grid;
  gap: 10px;
}

.about-social-copy strong {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--about-title);
  font-size: 16px;
  font-weight: 900;
  line-height: 22px;
  white-space: nowrap;
}

.about-social-copy small {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--about-text);
  font-size: 12px;
  line-height: 18px;
  white-space: nowrap;
}

@media (max-width: 900px) {
  .about-hero-section {
    min-height: 720px;
  }

  .about-hero-inner {
    min-height: 720px;
    padding: 62px 18px 58px;
  }

  .about-hero-title {
    font-size: 36px;
    line-height: 44px;
  }

  .about-hero-subtitle {
    margin-top: 26px;
    font-size: 13px;
    line-height: 22px;
  }

  .about-hero-actions {
    width: min(100%, 360px);
    gap: 14px;
    margin-top: 32px;
  }

  .about-hero-action {
    width: auto;
    min-width: 144px;
    max-width: min(100%, 300px);
  }

  .about-innovation-section {
    padding-top: 54px;
    padding-bottom: 74px;
  }

  .about-innovation-title,
  .about-roadmap-title,
  .about-social-title {
    margin-top: 18px;
    font-size: 32px;
    line-height: 38px;
  }

  .about-innovation-subtitle,
  .about-roadmap-subtitle,
  .about-social-subtitle {
    margin-top: 20px;
    font-size: 13px;
    line-height: 22px;
  }

  .about-innovation-grid {
    grid-template-columns: 1fr;
    gap: 18px;
    margin-top: 48px;
  }

  .about-innovation-feature {
    min-height: 0;
    padding: 28px 22px;
  }

  .about-innovation-feature h3 {
    font-size: 30px;
    line-height: 38px;
  }

  .about-innovation-feature p {
    font-size: 13px;
    line-height: 22px;
  }

  .about-stat-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }

  .about-stat-card {
    min-height: 120px;
    padding: 22px 18px;
  }

  .about-roadmap-section {
    padding-top: 54px;
    padding-bottom: 72px;
  }

  .about-roadmap-list {
    gap: 12px;
    margin-top: 48px;
  }

  .about-roadmap-card {
    grid-template-columns: 1fr;
    gap: 10px;
    padding: 18px;
  }

  .about-social-section {
    padding-top: 54px;
    padding-bottom: 72px;
  }

  .about-social-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    margin-top: 48px;
  }
}

@media (max-width: 520px) {
  .about-stat-grid {
    grid-template-columns: 1fr;
  }

  .about-social-grid {
    grid-template-columns: 1fr;
  }
}
</style>
