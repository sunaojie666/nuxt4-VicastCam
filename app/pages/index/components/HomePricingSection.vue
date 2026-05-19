<template>
  <section id="home-pricing" class="home-pricing-section" aria-labelledby="home-pricing-title">
    <div class="home-pricing-inner">
      <span id="home-pricing-anchor" class="home-pricing-eyebrow" data-reveal>{{ pricingContent.sectionTag }}</span>

      <h2 id="home-pricing-title" class="home-pricing-title" data-reveal style="--reveal-delay: 80ms">
        <span>{{ pricingContent.titleMain }}</span>
        <span class="theme-gradient-text">{{ pricingContent.titleHighlight }}</span>
      </h2>

      <p class="home-pricing-subtitle" data-reveal style="--reveal-delay: 160ms">{{ pricingContent.description }}</p>

      <div class="home-pricing-grid">
        <article
          v-for="plan in pricingPlans"
          :key="plan.id"
          :class="['home-pricing-card', { 'home-pricing-card-featured': plan.featured }]"
          data-reveal="scale"
          :style="{ '--reveal-delay': `${plan.delay}ms` }"
        >
          <span v-if="plan.badgeText" class="home-pricing-badge">{{ plan.badgeText }}</span>

          <div>
            <h2 class="home-pricing-card-title">{{ plan.name }}</h2>
            <p class="home-pricing-card-description">{{ plan.description }}</p>
          </div>

          <div class="home-pricing-price">
            <img v-if="plan.priceImage" :src="plan.priceImage" :alt="`${plan.name} 价格`">
            <template v-else>
              <strong>{{ plan.price }}</strong>
              <span v-if="plan.unit">{{ plan.unit }}</span>
            </template>
            <del v-if="plan.originalPrice">{{ plan.originalPrice }}</del>
          </div>

          <ul class="home-pricing-features">
            <li
              v-for="feature in plan.benefits"
              :key="feature"
              class="home-pricing-feature"
            >
              <img class="home-pricing-check" src="/images/tick.png" alt="" aria-hidden="true">
              <span>{{ feature }}</span>
            </li>
          </ul>

          <button class="home-pricing-button" type="button">{{ plan.cta }}</button>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import { getPricings } from '../../../api/request/strapi'

const { locale } = useI18n()
const { vipPlans, loadVipTypes } = useVipTypes()

const pricingContent = ref({
  sectionTag: '',
  titleMain: '',
  titleHighlight: '',
  description: '',
})

const pricingPlans = computed(() => vipPlans.value)

const getPricingContentData = (response) => {
  if (Array.isArray(response?.data)) {
    const firstItem = response.data[0] || {}

    return firstItem.attributes || firstItem
  }

  return response?.data?.attributes || response?.data || response || {}
}

const syncPricingContent = (content = {}) => {
  const pricingData = content.data || content

  pricingContent.value = {
    sectionTag: pricingData.sectionTag || '',
    titleMain: pricingData.titleMain || '',
    titleHighlight: pricingData.titleHighlight || '',
    description: pricingData.description || '',
  }
}

const loadPricingContent = () => {
  getPricings(locale.value).then(
    response => {
      syncPricingContent(getPricingContentData(response))
    },
    () => {
      syncPricingContent()
    }
  )
}

onMounted(() => {
  loadPricingContent()
  loadVipTypes()
})

watch(locale, () => {
  loadPricingContent()
})
</script>

<style>
.home-pricing-section {
  position: relative;
  z-index: 3;
  width: 100%;
  min-height: 927px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  margin-top: -385px;
  padding-top: 300px;
  padding-bottom: 80px;
  color: var(--theme-text);
  background-color: transparent;
}

.home-pricing-inner {
  width: min(100%, var(--page-max-width));
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-left: var(--page-padding-x);
  padding-right: var(--page-padding-x);
}

.home-pricing-eyebrow {
  max-width: 100%;
  min-width: 95px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 14px;
  border: 1px solid rgba(59, 130, 246, 0.28);
  border-radius: 999px;
  color: rgba(99, 179, 255, 1);
  background-color: rgba(30, 64, 175, 0.22);
  font-size: 14px;
  font-weight: 500;
  line-height: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.home-pricing-title {
  width: max-content;
  max-width: 100%;
  margin-top: 22px;
  color: rgba(255, 255, 255, 1);
  font-size: 40px;
  font-weight: 800;
  line-height: 48px;
  text-align: center;
  overflow-wrap: anywhere;
}

.home-pricing-title span {
  display: block;
}

.home-pricing-title span:first-child {
  white-space: nowrap;
}

.home-pricing-subtitle {
  max-width: 100%;
  margin-top: 20px;
  color: rgba(149, 156, 168, 1);
  font-size: 16px;
  font-weight: 400;
  line-height: 22px;
  text-align: center;
  overflow-wrap: anywhere;
}

.home-pricing-grid {
  width: min(100%, var(--page-max-width));
  display: grid;
  grid-template-columns: repeat(3, 370px);
  justify-content: center;
  gap: 22px;
  margin-top: 64px;
}

.home-pricing-card {
  position: relative;
  width: 370px;
  height: 514px;
  display: flex;
  flex-direction: column;
  overflow: visible;
  padding: 34px 32px 33px;
  border: 1px solid rgba(30, 41, 59, 1);
  border-radius: 8px;
  color: rgba(248, 250, 252, 1);
  background-color: rgba(15, 23, 42, 1);
}

.home-pricing-card-featured {
  border-color: rgba(8, 179, 213, 0.72);
  background: linear-gradient(180deg, rgba(8, 55, 75, 0.72) 0%, rgba(8, 38, 58, 0.94) 100%);
  box-shadow: 0 0 0 1px rgba(8, 179, 213, 0.2);
}

.home-pricing-badge {
  position: absolute;
  top: -15px;
  left: 50%;
  min-width: 124px;
  max-width: calc(100% - 48px);
  height: 27px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 14px;
  transform: translateX(-50%);
  border-radius: 999px;
  color: rgba(255, 255, 255, 1);
  background: var(--theme-login-background);
  box-shadow: 0 8px 20px rgba(8, 179, 213, 0.35);
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.home-pricing-card-title {
  color: rgba(255, 255, 255, 1);
  font-size: 18px;
  font-weight: 800;
  line-height: 26px;
  overflow: hidden;
  overflow-wrap: anywhere;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.home-pricing-card-description {
  margin-top: 10px;
  color: rgba(148, 163, 184, 1);
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  overflow: hidden;
  overflow-wrap: anywhere;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.home-pricing-price {
  margin-top: 43px;
  min-height: 44px;
  display: flex;
  align-items: baseline;
  gap: 8px;
  flex-wrap: wrap;
}

.home-pricing-price img {
  width: auto;
  max-height: 44px;
  object-fit: contain;
}

.home-pricing-price strong {
  color: rgba(255, 255, 255, 1);
  font-size: 42px;
  font-weight: 800;
  line-height: 44px;
}

.home-pricing-price span {
  color: rgba(148, 163, 184, 1);
  font-size: 16px;
  font-weight: 600;
  line-height: 22px;
}

.home-pricing-price del {
  color: rgba(100, 116, 139, 1);
  font-size: 14px;
  line-height: 20px;
}

.home-pricing-features {
  display: grid;
  gap: 14px;
  margin-top: 30px;
}

.home-pricing-feature {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  color: rgba(203, 213, 225, 1);
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
}
.home-pricing-feature span {
  min-width: 0;
  overflow: hidden;
  overflow-wrap: anywhere;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.home-pricing-check {
  width: 13px;
  height: 13px;
  flex: 0 0 auto;
  object-fit: contain;
}

.home-pricing-button {
  width: 100%;
  height: 46px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: auto;
  border: 1px solid rgba(51, 65, 85, 1);
  border-radius: 6px;
  color: rgba(255, 255, 255, 1);
  background-color: rgba(15, 23, 42, 1);
  font-size: 13px;
  font-weight: 800;
  line-height: 1;
  padding: 0 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  transition: border-color 0.2s ease, background-color 0.2s ease, transform 0.2s ease;
}

.home-pricing-button:hover,
.home-pricing-button:focus {
  border-color: rgba(8, 179, 213, 0.8);
  transform: translateY(-1px);
}

.home-pricing-card-featured .home-pricing-button {
  border-color: transparent;
  background: var(--theme-login-background);
  box-shadow: 0 9px 18px rgba(8, 179, 213, 0.3);
}

@media (max-width: 1153px) {
  .home-pricing-section {
    min-height: auto;
    margin-top: -320px;
    padding-top: 160px;
    padding-bottom: 72px;
  }

  .home-pricing-grid {
    grid-template-columns: repeat(2, 370px);
  }

  .home-pricing-card-featured {
    order: -1;
  }
}

@media (max-width: 768px) {

  .home-pricing-section {
    margin-top: 0;
    padding-top: 80px;
    padding-bottom: 56px;
    background-color: var(--theme-page);
  }

  .home-pricing-title {
    max-width: 340px;
    margin-top: 18px;
    font-size: 32px;
    line-height: 38px;
  }

  .home-pricing-title span:first-child {
    white-space: normal;
  }

  .home-pricing-subtitle {
    margin-top: 18px;
    font-size: 13px;
  }

  .home-pricing-grid {
    width: min(calc(100% - var(--page-padding-x) * 2), 320px);
    grid-template-columns: 1fr;
    justify-items: center;
    gap: 18px;
    margin-top: 54px;
  }

  .home-pricing-card {
    width: 100%;
    height: 468px;
    padding: 26px 22px 22px;
  }

  .home-pricing-price {
    margin-top: 28px;
    font-size: 32px;
    line-height: 38px;
  }

  .home-pricing-features {
    gap: 12px;
    margin-top: 24px;
  }

  .home-pricing-button {
    height: 42px;
  }
}
</style>
