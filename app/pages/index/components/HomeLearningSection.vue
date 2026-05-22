<template>
  <section id="home-sdk" class="home-learning-section" aria-labelledby="home-learning-title">
    <div class="home-learning-inner">
      <span class="home-learning-eyebrow home-section-eyebrow" data-reveal>{{ tutorialContent.sectionTag }}</span>

      <h2 id="home-learning-title" class="home-learning-title home-section-title" data-reveal style="--reveal-delay: 80ms">
        <span>{{ tutorialContent.titleMain }}</span>
        <span class="theme-gradient-text">{{ tutorialContent.titleHighlight }}</span>
      </h2>

      <p class="home-learning-subtitle home-section-subtitle" data-reveal style="--reveal-delay: 160ms">
        <span>{{ tutorialContent.description }}</span>
      </p>

      <div class="home-learning-grid">
        <article
          v-for="(course, index) in learningCards"
          :key="createLearningCardKey(course, index)"
          class="home-learning-card"
          data-reveal="scale"
          :style="{ '--reveal-delay': `${course.delay}ms` }"
        >
          <img
            v-if="course.coverImg"
            class="home-learning-image"
            :src="course.coverImg"
            :alt="course.title"
            loading="lazy"
          >

          <div class="home-learning-card-body">
            <div class="home-learning-tags">
              <span class="home-learning-tag home-learning-tag-muted">{{ course.tag1 }}</span>
              <span class="home-learning-tag home-learning-tag-primary">{{ course.tag2 }}</span>
            </div>

            <h3 class="home-learning-card-title" :dir="activeLocaleDir">{{ course.title }}</h3>
          </div>
        </article>
      </div>

      <NuxtLink :to="localePath('/tutorial')" class="home-learning-more theme-more-link">
        <span>{{ tutorialContent.buttonText }}</span>
        <img src="/images/Right.png" alt="" aria-hidden="true">
      </NuxtLink>

    </div>
  </section>
</template>

<script setup>
import { getCards, getTutorials } from '../../../api/request/strapi'

const localePath = useLocalePath()
const { locale, locales } = useI18n()
const config = useRuntimeConfig()

const activeLocaleDir = computed(() => {
  const activeLocale = locales.value.find(item => typeof item !== 'string' && item.code === locale.value)

  return activeLocale?.dir || 'ltr'
})

const tutorialContent = ref({
  sectionTag: '',
  titleMain: '',
  titleHighlight: '',
  description: '',
  buttonText: '',
})

const learningCards = ref([])

const createLearningCardKey = (course, index) => {
  return `${locale.value}-${course.id || course.title || index}`
}

const createStrapiAssetUrl = (url) => {
  if (!url) {
    return ''
  }

  if (/^(https?:)?\/\//.test(url) || url.startsWith('data:')) {
    return url
  }

  return `${String(config.public.strapiUrl || '').replace(/\/+$/, '')}${url}`
}

const getStrapiItemData = (item = {}) => item.attributes || item

const getStrapiCollectionData = (response) => {
  if (Array.isArray(response?.data)) {
    return response.data.map(getStrapiItemData)
  }

  if (Array.isArray(response)) {
    return response.map(getStrapiItemData)
  }

  return []
}

const getStrapiMediaUrl = (media) => {
  if (Array.isArray(media)) {
    return getStrapiMediaUrl(media[0])
  }

  if (Array.isArray(media?.data)) {
    return getStrapiMediaUrl(media.data[0])
  }

  if (media?.data) {
    return getStrapiMediaUrl(media.data)
  }

  const mediaData = media?.attributes || media || {}

  return createStrapiAssetUrl(mediaData.url || '')
}

const getTutorialContentData = (response) => {
  if (Array.isArray(response?.data)) {
    const firstItem = response.data[0] || {}

    return firstItem.attributes || firstItem
  }

  return response?.data?.attributes || response?.data || response || {}
}

const syncTutorialContent = (content = {}) => {
  const tutorialData = content.data || content

  tutorialContent.value = {
    sectionTag: tutorialData.sectionTag || '',
    titleMain: tutorialData.titleMain || '',
    titleHighlight: tutorialData.titleHighlight || '',
    description: tutorialData.description || '',
    buttonText: tutorialData.buttonText || '',
  }
}

const loadTutorialContent = () => {
  getTutorials(locale.value).then(
    response => {
      syncTutorialContent(getTutorialContentData(response))
    },
    () => {
      syncTutorialContent()
    }
  )
}

const syncLearningCards = (cards = []) => {
  learningCards.value = cards.map((card, index) => ({
    id: card.id || `${index}-${card.title || ''}`,
    title: card.title || '',
    tag1: card.tag1 || '',
    tag2: card.tag2 || '',
    coverImg: getStrapiMediaUrl(card.coverImg),
    delay: (index % 3) * 90,
  })).filter(card => card.title || card.tag1 || card.tag2 || card.coverImg)
}

const loadLearningCards = () => {
  getCards(locale.value).then(
    response => {
      syncLearningCards(getStrapiCollectionData(response))
    },
    () => {
      syncLearningCards()
    }
  )
}

onMounted(() => {
  loadTutorialContent()
  loadLearningCards()
})

watch(locale, () => {
  loadTutorialContent()
  loadLearningCards()
})
</script>

<style>
.home-learning-section {
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: 100px;
  padding-bottom: 110px;
  color: var(--theme-text);
  background-color: var(--theme-learning-background, var(--theme-surface-alt));
}

.home-learning-inner {
  width: min(100%, var(--page-max-width));
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-left: var(--page-padding-x);
  padding-right: var(--page-padding-x);
}

.home-learning-eyebrow {
  max-width: 100%;
  min-width: 84px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 14px;
  border: 1px solid var(--theme-primary-border-soft);
  border-radius: 999px;
  color: var(--theme-info-blue);
  background-color: var(--theme-primary-softer);
  font-size: 14px;
  font-weight: 500;
  line-height: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.home-learning-title {
  max-width: 100%;
  margin-top: 22px;
  color: var(--theme-white);
  font-size: 40px;
  font-weight: 800;
  line-height: 48px;
  text-align: center;
  overflow-wrap: anywhere;
  hyphens: auto;
}

.home-learning-title span {
  display: block;
}

.home-learning-subtitle {
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  color: var(--theme-text-muted-alt);
  font-size: 16px;
  font-weight: 400;
  line-height: 22px;
  text-align: center;
  overflow-wrap: anywhere;
  hyphens: auto;
}

.home-learning-grid {
  width: min(100%, var(--page-max-width));
  display: grid;
  direction: ltr;
  grid-template-columns: repeat(3, 368px);
  justify-content: center;
  gap: 26px 22px;
  margin-top: 74px;
}

.home-learning-card {
  overflow: hidden;
  width: 368px;
  height: 310px;
  border-radius: 8px;
  background-color: var(--theme-learning-card-background, var(--theme-page));
  border: 1px solid var(--theme-learning-card-border, transparent);
  direction: ltr;
}

:root[data-theme="light"] .home-learning-card {
  border-radius: 10px;
}

.home-learning-image {
  width: 100%;
  height: 206px;
  object-fit: cover;
}

.home-learning-card-body {
  min-height: 80px;
  padding: 22px 18px 18px;
}

.home-learning-tags {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  min-width: 0;
}

.home-learning-tag {
  max-width: 100%;
  height: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 700;
  line-height: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.home-learning-tag-muted {
  color: var(--theme-learning-tag-muted-text, var(--theme-text-muted));
  background-color: var(--theme-learning-tag-muted-background, var(--theme-panel-muted));
}

.home-learning-tag-primary {
  color: var(--theme-learning-tag-primary-text, var(--theme-success-light));
  background-color: var(--theme-learning-tag-primary-background, var(--theme-extra-6-78-59-072));
}

.home-learning-card-title {
  margin-top: 12px;
  color: var(--theme-learning-card-title, var(--theme-white));
  font-size: 14px;
  font-weight: 800;
  line-height: 20px;
  overflow: hidden;
  overflow-wrap: anywhere;
  hyphens: auto;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.home-learning-more {
  margin-top: 20px;
}

@media (max-width: 1153px) {

  .home-learning-grid {
    grid-template-columns: repeat(2, 368px);
  }
}

@media (max-width: 768px) {

  .home-learning-section {
    padding-top: 54px;
    padding-bottom: 74px;
  }

  .home-learning-title {
    margin-top: 18px;
    font-size: 32px;
    line-height: 38px;
  }

  .home-learning-subtitle {
    margin-top: 20px;
    font-size: 13px;
  }

  .home-learning-grid {
    width: min(100%, 420px);
    grid-template-columns: 1fr;
    justify-items: center;
    gap: 18px;
    margin-top: 48px;
  }

  .home-learning-card {
    width: min(100%, 368px);
  }

  .home-learning-more {
    margin-top: 20px;
  }

}
</style>
