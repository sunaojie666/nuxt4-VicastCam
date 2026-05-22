<template>
  <section id="home-features" class="home-features-section" aria-labelledby="home-features-title">
    <div class="home-features-inner">
      <span id="home-features-anchor" class="home-features-eyebrow home-section-eyebrow" data-reveal>{{ featuresSection.title_tag }}</span>

      <h2 id="home-features-title" class="home-features-title home-section-title" data-reveal style="--reveal-delay: 80ms">
        <span>{{ featuresSection.title_main }}</span>
        <span class="theme-gradient-text">{{ featuresSection.title_highlight }}</span>
      </h2>

      <p class="home-features-subtitle home-section-subtitle" data-reveal style="--reveal-delay: 160ms">
        <span>{{ featuresSection.description }}</span>
      </p>

      <div class="home-features-grid">
        <article
          v-for="(feature, index) in features"
          :key="feature.id"
          :class="['home-features-card', feature.direction]"
          data-reveal="feature"
          :style="{ '--reveal-delay': `${feature.delay}ms`, '--feature-icon-bg': feature.gradient }"
        >
          <span class="home-features-icon">
            <img v-if="index === 0" src="/images/live/1.png" alt="" aria-hidden="true">
            <img v-else-if="index === 1" src="/images/live/2.png" alt="" aria-hidden="true">
            <img v-else-if="index === 2" src="/images/live/3.png" alt="" aria-hidden="true">
            <img v-else-if="index === 3" src="/images/live/4.png" alt="" aria-hidden="true">
            <img v-else-if="index === 4" src="/images/live/5.png" alt="" aria-hidden="true">
            <img v-else src="/images/live/6.png" alt="" aria-hidden="true">
          </span>

          <h3>{{ feature.title }}</h3>
          <p>{{ feature.description }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import { getFeature } from '../../../api/request/strapi'

const featureGradients = [
  'linear-gradient(135.96deg, var(--theme-cyan-deep) 0%, var(--theme-primary) 100%)',
  'linear-gradient(135.96deg, var(--theme-primary) 0%, var(--theme-extra-56-189-248-1) 100%)',
  'linear-gradient(135.96deg, var(--theme-extra-45-212-191-1) 0%, var(--theme-extra-56-189-248-1) 100%)',
  'linear-gradient(135.96deg, var(--theme-primary-strong) 0%, var(--theme-extra-56-189-248-1) 100%)',
  'linear-gradient(135.96deg, var(--theme-accent) 0%, var(--theme-extra-20-184-166-1) 100%)',
  'linear-gradient(135.96deg, var(--theme-primary-light) 0%, var(--theme-cyan-deep) 100%)',
]
const featureDirections = [
  'home-features-card-left',
  'home-features-card-up',
  'home-features-card-right',
  'home-features-card-left',
  'home-features-card-up',
  'home-features-card-right',
]

const { locale } = useI18n()
const featuresSection = ref({
  title_tag: '',
  title_main: '',
  title_highlight: '',
  description: '',
})
const featureItems = ref([])

const features = computed(() => {
  return featureItems.value.map((feature, index) => ({
    id: feature.id || `${feature.title}-${index}`,
    title: feature.title || '',
    description: feature.desc || feature.description || '',
    gradient: featureGradients[index % featureGradients.length],
    direction: featureDirections[index % featureDirections.length],
    delay: (index % 3) * 90,
  })).filter(feature => feature.title || feature.description)
})

const getFeatureContentData = (response) => {
  if (Array.isArray(response?.data)) {
    const firstItem = response.data[0] || {}

    return firstItem.attributes || firstItem
  }

  return response?.data?.attributes || response?.data || response || {}
}

const syncFeatureContent = (featureData = {}) => {
  const featureContent = featureData.featureObj || featureData

  featuresSection.value = {
    ...(featureContent.features_section || {}),
  }

  featureItems.value = Array.isArray(featureContent.feature_items) && featureContent.feature_items.length
    ? featureContent.feature_items
    : []
}

const loadFeatureContent = () => {
  getFeature(locale.value).then(
    response => {
      syncFeatureContent(getFeatureContentData(response))
    },
    () => {
      syncFeatureContent()
    }
  )
}

onMounted(() => {
  loadFeatureContent()
})

watch(locale, () => {
  loadFeatureContent()
})
</script>

<style>
.reveal-ready .home-features-card-left[data-reveal="feature"]:not(.is-revealed) {
  transform: translate3d(-96px, 48px, 0) scale(0.92);
}

.reveal-ready .home-features-card-right[data-reveal="feature"]:not(.is-revealed) {
  transform: translate3d(96px, 48px, 0) scale(0.92);
}

.reveal-ready .home-features-card-up[data-reveal="feature"]:not(.is-revealed) {
  transform: translate3d(0, 82px, 0) scale(0.92);
}

.home-features-section {
  width: 100%;
  padding-top: 78px;
  padding-bottom: 80px;
  color: var(--theme-white);
  background-color: var(--theme-feature-background, var(--theme-page));
}

.home-features-inner {
  width: min(100%, var(--page-max-width));
  margin: 0 auto;
  padding-left: var(--page-padding-x);
  padding-right: var(--page-padding-x);
}

.home-features-eyebrow {
  max-width: 100%;
  width: fit-content;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  padding: 0 13px;
  border: 1px solid var(--theme-primary-border);
  border-radius: 999px;
  color: var(--theme-primary-light);
  background-color: var(--theme-primary-softer);
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.home-features-title {
  max-width: 100%;
  margin-top: 18px;
  color: var(--theme-white);
  font-size: 40px;
  font-weight: 900;
  line-height: 52px;
  text-align: center;
  overflow-wrap: anywhere;
  hyphens: auto;
}

.home-features-title span {
  display: block;
}

.home-features-subtitle {
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  color: var(--theme-text-muted-alt);
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  text-align: center;
  overflow-wrap: anywhere;
  hyphens: auto;
}

.home-features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-items: center;
  gap: 22px;
  margin-top: 80px;
}

.home-features-card {
  width: 370px;
  min-height: 263px;
  height: auto;
  overflow: visible;
  padding: 28px 29px;
  border: 1px solid var(--theme-feature-card-border, transparent);
  border-radius: 8px;
  background: var(--theme-feature-card-background, url("/images/live/bg.png") center / cover no-repeat);
  transition:
    transform 0.28s ease,
    background-color 0.28s ease,
    box-shadow 0.28s ease;
}

.home-features-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 18px 36px var(--theme-black-22);
}

.home-features-icon {
  width: 45px;
  height: 45px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: var(--feature-icon-bg);
}

.home-features-icon img {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

.home-features-card h3 {
  margin-top: 20px;
  color: var(--theme-feature-card-title, var(--theme-white));
  font-size: 18px;
  font-weight: 900;
  line-height: 24px;
  overflow-wrap: anywhere;
  hyphens: auto;
}

.home-features-card p {
  margin-top: 14px;
  color: var(--theme-feature-card-text, var(--theme-text-muted));
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  overflow-wrap: anywhere;
  hyphens: auto;
}

:root[data-theme="light"] .home-features-section {
  padding-top: 54px;
  padding-bottom: 72px;
  color: var(--theme-feature-title);
}

:root[data-theme="light"] .home-features-eyebrow {
  height: 24px;
  padding: 0 15px;
  border-color: var(--theme-feature-eyebrow-border);
  color: var(--theme-feature-card-border);
  background-color: var(--theme-feature-eyebrow-background);
  font-size: 12px;
  font-weight: 600;
}

:root[data-theme="light"] .home-features-title {
  margin-top: 16px;
  color: var(--theme-feature-title);
  font-size: 40px;
  line-height: 48px;
  font-weight: 900;
}

:root[data-theme="light"] .home-features-subtitle {
  margin-top: 20px;
  color: var(--theme-feature-card-text);
  font-size: 14px;
  line-height: 22px;
}

:root[data-theme="light"] .home-features-grid {
  gap: 22px;
  margin-top: 70px;
}

:root[data-theme="light"] .home-features-card {
  min-height: 210px;
  height: auto;
  padding: 28px 30px;
  border-radius: 10px;
  box-shadow: none;
}

:root[data-theme="light"] .home-features-card:hover {
  box-shadow: 0 14px 30px var(--theme-feature-card-shadow);
}

:root[data-theme="light"] .home-features-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
}

:root[data-theme="light"] .home-features-icon img {
  width: 18px;
  height: 18px;
}

:root[data-theme="light"] .home-features-card h3 {
  margin-top: 18px;
  font-size: 16px;
  line-height: 22px;
}

:root[data-theme="light"] .home-features-card p {
  margin-top: 13px;
  font-size: 13px;
  line-height: 20px;
}

@media (max-width: 1153px) {

  .home-features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {

  .home-features-section {
    padding-top: 56px;
    padding-bottom: 56px;
  }

  .home-features-title {
    margin-top: 18px;
    font-size: 32px;
    line-height: 40px;
  }

  .home-features-subtitle {
    margin-top: 18px;
    font-size: 13px;
  }

  .home-features-subtitle span {
    display: inline;
  }

  .home-features-grid {
    grid-template-columns: 1fr;
    gap: 16px;
    margin-top: 42px;
  }

  .home-features-card {
    width: min(100%, 370px);
    min-height: 180px;
    padding: 24px;
  }
}
</style>
