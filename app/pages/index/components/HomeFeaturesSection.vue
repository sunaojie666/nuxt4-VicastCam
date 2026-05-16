<template>
  <section id="home-features" class="home-features-section" aria-labelledby="home-features-title">
    <div class="home-features-inner">
      <span id="home-features-anchor" class="home-features-eyebrow" data-reveal>{{ featuresSection.title_tag }}</span>

      <h2 id="home-features-title" class="home-features-title" data-reveal style="--reveal-delay: 80ms">
        <span>{{ featuresSection.title_main }}</span>
        <span class="theme-gradient-text">{{ featuresSection.title_highlight }}</span>
      </h2>

      <p class="home-features-subtitle" data-reveal style="--reveal-delay: 160ms">
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
  'linear-gradient(135.96deg, rgba(6, 182, 212, 1) 0%, rgba(59, 130, 246, 1) 100%)',
  'linear-gradient(135.96deg, rgba(59, 130, 246, 1) 0%, rgba(56, 189, 248, 1) 100%)',
  'linear-gradient(135.96deg, rgba(45, 212, 191, 1) 0%, rgba(56, 189, 248, 1) 100%)',
  'linear-gradient(135.96deg, rgba(37, 99, 235, 1) 0%, rgba(56, 189, 248, 1) 100%)',
  'linear-gradient(135.96deg, rgba(34, 211, 238, 1) 0%, rgba(20, 184, 166, 1) 100%)',
  'linear-gradient(135.96deg, rgba(96, 165, 250, 1) 0%, rgba(6, 182, 212, 1) 100%)',
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
  color: rgba(255, 255, 255, 1);
  background-color: rgba(3, 7, 18, 1);
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
  border: 1px solid rgba(59, 130, 246, 0.34);
  border-radius: 999px;
  color: rgba(96, 165, 250, 1);
  background-color: rgba(30, 64, 175, 0.22);
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
  color: rgba(255, 255, 255, 1);
  font-size: 40px;
  font-weight: 900;
  line-height: 52px;
  text-align: center;
  overflow-wrap: anywhere;
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
  color: rgba(149, 156, 168, 1);
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  text-align: center;
  overflow-wrap: anywhere;
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
  height: 263px;
  overflow: hidden;
  padding: 28px 29px;
  border-radius: 8px;
  background: url("/images/live/bg.png") center / cover no-repeat;
  transition:
    transform 0.28s ease,
    background-color 0.28s ease,
    box-shadow 0.28s ease;
}

.home-features-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 18px 36px rgba(0, 0, 0, 0.22);
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
  color: rgba(255, 255, 255, 1);
  font-size: 18px;
  font-weight: 900;
  line-height: 24px;
  overflow: hidden;
  overflow-wrap: anywhere;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.home-features-card p {
  margin-top: 14px;
  color: rgba(148, 163, 184, 1);
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  overflow: hidden;
  overflow-wrap: anywhere;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
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
