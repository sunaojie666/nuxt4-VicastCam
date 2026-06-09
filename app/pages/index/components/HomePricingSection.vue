<template>
  <section id="home-pricing" class="home-pricing-section" aria-labelledby="home-pricing-title">
    <div class="home-pricing-inner">
      <span id="home-pricing-anchor" class="home-pricing-eyebrow home-section-eyebrow" data-reveal>{{ pricingContent.sectionTag }}</span>

      <h2 id="home-pricing-title" class="home-pricing-title home-section-title" data-reveal style="--reveal-delay: 80ms">
        <span>{{ pricingContent.titleMain }}</span>
        <span class="theme-gradient-text">{{ pricingContent.titleHighlight }}</span>
      </h2>

      <p class="home-pricing-subtitle home-section-subtitle" data-reveal style="--reveal-delay: 160ms">{{ pricingContent.description }}</p>

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
            <img v-if="plan.priceImage" class="home-pricing-price-image" :src="plan.priceImage" :alt="`${plan.name} ${pricingContent.priceAltSuffix}`.trim()">
            <span v-if="plan.priceImage" class="home-pricing-price-text">
              <strong>{{ plan.price }}</strong>
              <span v-if="plan.unit">{{ plan.unit }}</span>
            </span>
            <template v-if="!plan.priceImage">
              <strong>{{ plan.price }}</strong>
              <span v-if="plan.unit">{{ plan.unit }}</span>
            </template>
            <del v-if="plan.originalPrice">{{ plan.originalPrice }}</del>
          </div>
          <p v-if="plan.priceNote" class="home-pricing-price-note">{{ plan.priceNote }}</p>

          <ul class="home-pricing-features">
            <li
              v-for="feature in plan.benefits"
              :key="feature"
              class="home-pricing-feature"
            >
              <Icon class="home-pricing-check" name="lucide:check" aria-hidden="true" />
              <span>{{ feature }}</span>
            </li>
          </ul>

          <button class="home-pricing-button" type="button" @click="handlePlanCheckout(plan)">{{ plan.cta }}</button>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import { getPricings } from '../../../api/request/strapi'

const localePath = useLocalePath()
const router = useRouter()
const { locale } = useI18n()
const { vipPlans, loadVipTypes } = useVipTypes()
const { showErrorToast } = useSiteToast()

const pricingContent = ref({
  sectionTag: '',
  titleMain: '',
  titleHighlight: '',
  description: '',
  priceAltSuffix: '',
  freePlanMessage: '',
  plans: [],
})

const normalizePlanText = value => String(value || '').trim()
const normalizePriceValue = value => normalizePlanText(value).replace(/[,¥￥$]/g, '').trim()
const normalizePlanType = value => {
  const type = normalizePlanText(value).toLowerCase()

  if (['free', 'f', 'free-plan'].includes(type)) {
    return 'free'
  }

  if (['month', 'monthly', 'm', 'monthly-plan'].includes(type)) {
    return 'month'
  }

  if (['year', 'yearly', 'annual', 'y', 'yearly-plan'].includes(type)) {
    return 'year'
  }

  if (['life', 'lifetime', 'permanent', 'l', 'lifetime-plan'].includes(type)) {
    return 'life'
  }

  return type
}

const isFreePlan = (plan = {}) => {
  const planType = normalizePlanType(plan.type || plan.id)
  const planPrice = normalizePriceValue(plan.price)

  return planType === 'free' || /^0(?:\.00)?$/.test(planPrice)
}

const getSourcePlanType = (source = {}) => {
  const explicitType = normalizePlanType(source.type || source.planType || source.productType || source.termType)

  if (explicitType) {
    return explicitType
  }

  const text = [
    source.id,
    source.name,
    source.description,
    source.subtitle,
    source.unit,
    source.price,
  ].map(normalizePlanText).join(' ')
  const normalizedText = text.toLowerCase()
  const code = normalizePlanText(source.name || source.id).toUpperCase()
  const price = normalizePriceValue(source.price)

  if (code === 'L' || normalizedText.includes('life') || normalizedText.includes('lifetime') || text.includes('\u7ec8\u8eab') || text.includes('\u6c38\u4e45') || /89\.99|99\.99/.test(price)) {
    return 'life'
  }

  if (code === 'Y' || normalizedText.includes('year') || normalizedText.includes('annual') || text.includes('\u5e74') || price.includes('69.99')) {
    return 'year'
  }

  if (code === 'M' || normalizedText.includes('month') || text.includes('\u6708') || price.includes('9.99')) {
    return 'month'
  }

  if (normalizedText.includes('free') || text.includes('\u514d\u8d39') || /^0(?:\.00)?$/.test(price)) {
    return 'free'
  }

  return ''
}

const findSourcePlan = (sourcePlans = [], plan = {}) => {
  const planType = normalizePlanType(plan.type || plan.id)

  return sourcePlans.find(source => getSourcePlanType(source) === planType) || null
}

const normalizePricingPlan = (plan = {}, index = 0) => {
  const type = normalizePlanText(plan.type || plan.id)

  return {
    id: normalizePlanText(plan.id || `${type || 'pricing'}-plan-${index}`),
    productId: normalizePlanText(plan.productId),
    type,
    name: normalizePlanText(plan.name),
    description: normalizePlanText(plan.description),
    price: normalizePlanText(plan.price),
    priceImage: normalizePlanText(plan.priceImage),
    originalPrice: normalizePlanText(plan.originalPrice),
    unit: normalizePlanText(plan.unit),
    priceNote: normalizePlanText(plan.priceNote),
    cta: normalizePlanText(plan.cta),
    badgeText: normalizePlanText(plan.badgeText),
    featured: Boolean(plan.featured),
    delay: Number.isFinite(Number(plan.delay)) ? Number(plan.delay) : index * 120,
    benefits: Array.isArray(plan.benefits) ? plan.benefits.map(normalizePlanText).filter(Boolean) : [],
  }
}

const getPricingContentData = (response) => {
  if (Array.isArray(response?.data)) {
    const firstItem = response.data[0] || {}

    return firstItem.attributes || firstItem
  }

  return response?.data?.attributes || response?.data || response || {}
}

const getPricingBoxData = (pricingData = {}) => {
  const jsonData = pricingData.data || pricingData.pricingData || pricingData.pricing_data || pricingData

  return jsonData.pricingBox || jsonData.pricing_box || jsonData || {}
}

const syncPricingContent = (pricingData = {}) => {
  const pricingBox = getPricingBoxData(pricingData)

  pricingContent.value = {
    sectionTag: normalizePlanText(pricingBox.sectionTag),
    titleMain: normalizePlanText(pricingBox.titleMain),
    titleHighlight: normalizePlanText(pricingBox.titleHighlight),
    description: normalizePlanText(pricingBox.description),
    priceAltSuffix: normalizePlanText(pricingBox.priceAltSuffix),
    freePlanMessage: normalizePlanText(pricingBox.freePlanMessage),
    plans: Array.isArray(pricingBox.plans) ? pricingBox.plans : [],
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

const displayPlans = computed(() => {
  return Array.isArray(pricingContent.value.plans)
    ? pricingContent.value.plans.map(normalizePricingPlan).filter(plan => plan.name || plan.price || plan.benefits.length)
    : []
})

const pricingPlans = computed(() => {
  const sourcePlans = Array.isArray(vipPlans.value) ? vipPlans.value : []

  return displayPlans.value.map(plan => ({
    ...plan,
    id: plan.productId || findSourcePlan(sourcePlans, plan)?.id || plan.id,
  }))
})

const handlePlanCheckout = (plan = {}) => {
  if (isFreePlan(plan)) {
    showErrorToast(pricingContent.value.freePlanMessage || '')
    return
  }

  const target = {
    path: localePath('/checkout'),
  }

  if (plan.id) {
    target.query = {
      productId: plan.id,
    }
  }

  if (!process.client) {
    return
  }

  window.open(router.resolve(target).href, '_blank', 'noopener,noreferrer')
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
  --home-pricing-overlap: 385px;
  --home-pricing-card-background: var(--theme-pricing-card-background);
  --home-pricing-card-border: rgba(31, 42, 62, 1);
  --home-pricing-card-featured-background: rgba(6, 34, 52, 0.94);
  --home-pricing-card-featured-border: rgba(42, 130, 228, 1);
  --home-pricing-card-title: var(--theme-white);
  --home-pricing-card-copy: var(--theme-text-muted-alt);
  --home-pricing-feature-check: rgba(75, 235, 140, 1);
  --home-pricing-featured-check: rgba(34, 211, 238, 1);
  --home-pricing-button-background: rgba(12, 18, 32, 0.76);
  --home-pricing-button-border: rgba(39, 51, 75, 1);
  --home-pricing-button-text: var(--theme-white);
  --home-pricing-button-active-background: linear-gradient(90deg, rgba(32, 184, 214, 1) 0%, rgba(48, 118, 239, 1) 100%);
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
  background:
    linear-gradient(
      to bottom,
      transparent 0,
      transparent var(--home-pricing-overlap),
      var(--theme-pricing-background, transparent) var(--home-pricing-overlap),
      var(--theme-pricing-background, transparent) 100%
    );
}

:root[data-theme="light"] .home-pricing-section {
  --home-pricing-card-border: var(--theme-pricing-card-border);
  --home-pricing-card-featured-background: rgba(239, 248, 255, 1);
  --home-pricing-card-title: var(--theme-feature-title);
  --home-pricing-card-copy: var(--theme-feature-card-text);
  --home-pricing-button-background: var(--theme-pricing-button-background);
  --home-pricing-button-border: var(--theme-pricing-button-border);
  --home-pricing-button-text: var(--theme-pricing-button-text);
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

.home-pricing-title {
  width: auto;
  max-width: min(100%, 860px);
  margin-top: 22px;
  color: var(--theme-white);
  font-size: 40px;
  font-weight: 800;
  line-height: 48px;
  text-align: center;
  overflow-wrap: anywhere;
  hyphens: auto;
}

.home-pricing-title span {
  display: block;
}

.home-pricing-title span:first-child {
  white-space: normal;
}

.home-pricing-subtitle {
  max-width: 100%;
  margin-top: 20px;
  color: var(--theme-text-muted-alt);
  font-size: 16px;
  font-weight: 400;
  line-height: 22px;
  text-align: center;
  overflow-wrap: anywhere;
  hyphens: auto;
}

.home-pricing-grid {
  width: min(100%, 1154px);
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 274px));
  justify-content: center;
  gap: 20px;
  margin-top: 56px;
}

.home-pricing-card {
  position: relative;
  isolation: isolate;
  width: 100%;
  min-height: 461px;
  display: flex;
  flex-direction: column;
  overflow: visible;
  padding: 27px 28px 28px;
  border: 1px solid var(--home-pricing-card-border);
  border-radius: 8px;
  color: var(--theme-text);
  background-color: var(--home-pricing-card-background);
  transition:
    border-color 0.32s ease,
    background-color 0.32s ease,
    box-shadow 0.34s ease,
    transform 0.34s cubic-bezier(0.22, 1, 0.36, 1);
}

.home-pricing-card::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: inherit;
  pointer-events: none;
  opacity: 0;
  background:
    radial-gradient(circle at 50% 0%, var(--theme-brand-accent-20), transparent 58%),
    var(--theme-pricing-card-hover-background);
  transition: opacity 0.34s ease;
}

.home-pricing-card > * {
  position: relative;
  z-index: 1;
}

.home-pricing-card:hover,
.home-pricing-card:focus-within {
  border-color: var(--home-pricing-card-featured-border);
  background-color: var(--home-pricing-card-featured-background);
  box-shadow: 0 16px 34px var(--theme-pricing-card-hover-shadow);
  transform: translateY(-6px) scale(1.012);
}

.home-pricing-card:hover::before,
.home-pricing-card:focus-within::before {
  opacity: 0;
}

.reveal-ready .home-pricing-card.is-revealed:hover,
.reveal-ready .home-pricing-card.is-revealed:focus-within {
  transform: translateY(-6px) scale(1.012);
}

.home-pricing-card:hover .home-pricing-button,
.home-pricing-card:focus-within .home-pricing-button {
  border-color: transparent;
  color: var(--theme-white);
  background: var(--home-pricing-button-active-background);
  box-shadow: 0 9px 18px var(--theme-brand-accent-30);
}

.home-pricing-card:hover .home-pricing-check,
.home-pricing-card:focus-within .home-pricing-check {
  color: var(--home-pricing-featured-check);
}

.home-pricing-card-featured {
  border-color: var(--home-pricing-card-featured-border);
  background-color: var(--home-pricing-card-featured-background);
  box-shadow: inset 0 0 0 1px rgba(42, 130, 228, 0.22);
}

.home-pricing-card-featured:hover,
.home-pricing-card-featured:focus-within {
  border-color: var(--home-pricing-card-featured-border);
  background-color: var(--home-pricing-card-featured-background);
}

.home-pricing-card-featured::before {
  opacity: 0;
}

.home-pricing-card-featured:hover::before,
.home-pricing-card-featured:focus-within::before {
  opacity: 0;
}

.home-pricing-card-featured .home-pricing-button {
  border-color: transparent;
  color: var(--theme-white);
  background: var(--home-pricing-button-active-background);
  box-shadow: 0 10px 22px rgba(42, 130, 228, 0.24);
}

.home-pricing-grid:has(.home-pricing-card:hover) .home-pricing-card-featured:not(:hover),
.home-pricing-grid:has(.home-pricing-card:focus-within) .home-pricing-card-featured:not(:focus-within) {
  border-color: var(--home-pricing-card-border);
  background-color: var(--home-pricing-card-background);
  box-shadow: none;
}

.home-pricing-grid:has(.home-pricing-card:hover) .home-pricing-card-featured:not(:hover) .home-pricing-button,
.home-pricing-grid:has(.home-pricing-card:focus-within) .home-pricing-card-featured:not(:focus-within) .home-pricing-button {
  border-color: var(--home-pricing-button-border);
  color: var(--home-pricing-button-text);
  background: var(--home-pricing-button-background);
  box-shadow: none;
}

.home-pricing-grid:has(.home-pricing-card:hover) .home-pricing-card-featured:not(:hover) .home-pricing-check,
.home-pricing-grid:has(.home-pricing-card:focus-within) .home-pricing-card-featured:not(:focus-within) .home-pricing-check {
  color: var(--home-pricing-feature-check);
}

.home-pricing-badge {
  position: absolute;
  top: -14px;
  left: 50%;
  min-width: 112px;
  max-width: calc(100% - 48px);
  height: 25px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 14px;
  transform: translateX(-50%);
  border-radius: 999px;
  color: var(--theme-white);
  background: linear-gradient(90deg, rgba(24, 184, 215, 1) 0%, rgba(48, 118, 239, 1) 100%);
  box-shadow: 0 8px 20px var(--theme-brand-accent-35);
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.home-pricing-card-title {
  color: var(--home-pricing-card-title);
  font-size: 18px;
  font-weight: 800;
  line-height: 26px;
  overflow: hidden;
  overflow-wrap: anywhere;
  hyphens: auto;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.home-pricing-card-description {
  margin-top: 10px;
  color: var(--home-pricing-card-copy);
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  overflow: hidden;
  overflow-wrap: anywhere;
  hyphens: auto;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.home-pricing-price {
  margin-top: 36px;
  min-height: 42px;
  display: flex;
  align-items: baseline;
  gap: 8px;
  flex-wrap: wrap;
}

.home-pricing-price-image {
  width: auto;
  max-height: 44px;
  object-fit: contain;
}

.home-pricing-price-text {
  display: none;
  align-items: baseline;
  gap: 8px;
}

.home-pricing-price strong {
  color: var(--theme-pricing-price);
  font-size: 36px;
  font-weight: 800;
  line-height: 42px;
}

.home-pricing-price span {
  color: var(--theme-pricing-price-unit);
  font-size: 14px;
  font-weight: 600;
  line-height: 22px;
}

.home-pricing-price del {
  color: var(--theme-pricing-price-original);
  font-size: 14px;
  line-height: 20px;
}

.home-pricing-price-note {
  min-height: 20px;
  margin-top: 3px;
  color: var(--home-pricing-card-copy);
  font-size: 13px;
  font-weight: 400;
  line-height: 20px;
  overflow-wrap: anywhere;
}

:root[data-theme="light"] .home-pricing-price-image {
  display: none;
}

:root[data-theme="light"] .home-pricing-price-text {
  display: inline-flex;
}

.home-pricing-features {
  display: grid;
  gap: 12px;
  margin-top: 28px;
  margin-bottom: 24px;
}

.home-pricing-price-note + .home-pricing-features {
  margin-top: 16px;
}

.home-pricing-feature {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  color: var(--theme-pricing-feature-text);
  font-size: 13px;
  font-weight: 400;
  line-height: 18px;
}
.home-pricing-feature span {
  min-width: 0;
  overflow: hidden;
  overflow-wrap: anywhere;
  hyphens: auto;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.home-pricing-check {
  width: 14px;
  height: 14px;
  flex: 0 0 auto;
  color: var(--home-pricing-feature-check);
  stroke-width: 3;
}

.home-pricing-card-featured .home-pricing-check {
  color: var(--home-pricing-featured-check);
}

.home-pricing-button {
  width: 100%;
  height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: auto;
  border: 1px solid var(--home-pricing-button-border);
  border-radius: 8px;
  color: var(--home-pricing-button-text);
  background-color: var(--home-pricing-button-background);
  font-size: 13px;
  font-weight: 800;
  line-height: 1;
  padding: 0 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  transition:
    border-color 0.28s ease,
    background 0.32s ease,
    color 0.28s ease,
    box-shadow 0.32s ease,
    transform 0.2s ease;
}

.home-pricing-button:hover,
.home-pricing-button:focus {
  transform: translateY(-1px);
}

@media (max-width: 1153px) {
  .home-pricing-section {
    --home-pricing-overlap: 320px;
    min-height: auto;
    margin-top: -320px;
    padding-top: 160px;
    padding-bottom: 72px;
  }

  .home-pricing-grid {
    grid-template-columns: repeat(2, minmax(0, 332px));
  }

}

@media (max-width: 768px) {

  .home-pricing-section {
    --home-pricing-overlap: 0px;
    margin-top: 0;
    padding-top: 80px;
    padding-bottom: 56px;
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
    min-height: 461px;
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
