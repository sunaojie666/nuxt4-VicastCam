<template>
  <div class="page-shell checkout-route-shell">
    <SiteHeader />

    <main class="checkout-page" aria-labelledby="checkout-title">
      <div class="checkout-shell">
        <section class="checkout-panel checkout-payment-panel" aria-labelledby="checkout-title">
          <header class="checkout-panel-header">
            <h1 id="checkout-title">{{ checkoutContent.title }}</h1>
          </header>

          <form
            class="checkout-detail-card"
            aria-labelledby="checkout-payment-status-title"
            @submit.prevent
          >
            <section class="checkout-provider-widget" aria-labelledby="checkout-payment-status-title">
              <header class="checkout-provider-header">
                <span class="checkout-provider-logo" aria-hidden="true">
                  <Icon name="lucide:lock-keyhole" />
                </span>
                <div>
                  <h3 id="checkout-payment-status-title">{{ checkoutContent.payment.providerName }}</h3>
                  <p>{{ checkoutContent.payment.providerDescription }}</p>
                </div>
              </header>

              <div class="checkout-payment-status-body">
                <div class="checkout-payment-status is-unavailable" role="status" aria-live="polite">
                  <Icon name="lucide:construction" aria-hidden="true" />
                  <span>{{ checkoutContent.payment.unavailableTitle }}</span>
                </div>

                <p class="checkout-unavailable-copy">
                  {{ checkoutContent.payment.unavailableDescription }}
                </p>

                <ul v-if="checkoutContent.payment.unavailableItems.length" class="checkout-unavailable-list">
                  <li v-for="item in checkoutContent.payment.unavailableItems" :key="item">
                    <Icon name="lucide:check" aria-hidden="true" />
                    <span>{{ item }}</span>
                  </li>
                </ul>
              </div>
            </section>

            <p v-if="checkoutContent.payment.feedback" class="checkout-provider-feedback" aria-live="polite">
              <Icon name="lucide:info" aria-hidden="true" />
              <span>{{ checkoutContent.payment.feedback }}</span>
            </p>
          </form>
        </section>

        <aside class="checkout-panel checkout-summary-panel" aria-labelledby="checkout-summary-title">
          <h2 id="checkout-summary-title">{{ checkoutContent.summary.title }}</h2>

          <div class="checkout-summary-product">
            <div>
              <strong>{{ orderSummary.productName }}</strong>
              <p>{{ orderSummary.description }}</p>
            </div>
          </div>

          <dl class="checkout-summary-list">
            <div>
              <dt>{{ checkoutContent.summary.periodLabel }}</dt>
              <dd>{{ orderSummary.period }}</dd>
            </div>
            <div>
              <dt>{{ checkoutContent.summary.paymentMethodLabel }}</dt>
              <dd>{{ orderSummary.paymentMethod }}</dd>
            </div>
          </dl>

          <div class="checkout-summary-total">
            <span>{{ checkoutContent.summary.amountLabel }}</span>
            <strong>{{ orderSummary.amount }}</strong>
          </div>

          <button class="checkout-submit-button" type="button" disabled aria-disabled="true">{{ orderSummary.submitLabel }}</button>

          <p class="checkout-summary-note">
            {{ checkoutContent.summary.note }}
          </p>
        </aside>
      </div>
    </main>

    <SiteFooter />
  </div>
</template>

<script setup>
import SiteHeader from '../../components/SiteHeader.vue'
import SiteFooter from '../../components/SiteFooter.vue'
import { getCheckouts } from '../../api/request/strapi'

const route = useRoute()
const { locale } = useI18n()
const { vipPlans, loadVipTypes } = useVipTypes()
const checkoutContentLocale = useState('checkout-page-content-locale', () => '')

const createDefaultCheckoutContent = () => ({
  title: '',
  payment: {
    providerName: '',
    providerDescription: '',
    unavailableTitle: '',
    unavailableDescription: '',
    unavailableItems: [],
    feedback: '',
  },
  summary: {
    title: '',
    periodLabel: '',
    paymentMethodLabel: '',
    amountLabel: '',
    submitLabel: '',
    note: '',
    unavailablePaymentMethod: '',
    fallbackProductName: '',
    fallbackProductDescription: '',
    periodMonth: '',
    periodYear: '',
    periodLife: '',
    emptyValue: '',
  },
  seo: {
    title: '',
    description: '',
  },
  plans: [],
})

const checkoutContent = useState('checkout-page-content', createDefaultCheckoutContent)

const normalizeCheckoutValue = (value, fallback = '') => {
  const sourceValue = Array.isArray(value) ? value[0] : value
  const text = String(sourceValue || '').trim()

  return text || fallback
}

const normalizeCheckoutArray = (value, fallback = []) => {
  if (Array.isArray(value)) {
    const items = value.map(item => normalizeCheckoutValue(item)).filter(Boolean)

    return items.length ? items : fallback
  }

  const text = normalizeCheckoutValue(value)

  return text ? [text] : fallback
}

const normalizePlanType = (value) => {
  const text = normalizeCheckoutValue(value).toLowerCase()

  if (['month', 'monthly', 'm', 'monthly-plan'].includes(text) || text.includes('月')) {
    return 'month'
  }

  if (['year', 'yearly', 'annual', 'y', 'yearly-plan'].includes(text) || text.includes('年')) {
    return 'year'
  }

  if (
    ['life', 'lifetime', 'permanent', 'l', 'lifetime-plan'].includes(text) ||
    text.includes('终身') ||
    text.includes('永久')
  ) {
    return 'life'
  }

  return text
}

const normalizeCheckoutPlans = (value) => {
  if (Array.isArray(value)) {
    return value.map((plan = {}) => ({
      id: normalizeCheckoutValue(plan.id || plan.productId || plan.product_id),
      type: normalizePlanType(plan.type || plan.planType || plan.plan_type || plan.key),
      name: normalizeCheckoutValue(plan.name || plan.title),
      description: normalizeCheckoutValue(plan.description || plan.subtitle),
    })).filter(plan => plan.id || plan.type || plan.name || plan.description)
  }

  if (value && typeof value === 'object') {
    return Object.entries(value).map(([key, plan = {}]) => ({
      id: normalizeCheckoutValue(plan.id || plan.productId || plan.product_id),
      type: normalizePlanType(plan.type || plan.planType || plan.plan_type || key),
      name: normalizeCheckoutValue(plan.name || plan.title),
      description: normalizeCheckoutValue(plan.description || plan.subtitle),
    })).filter(plan => plan.id || plan.type || plan.name || plan.description)
  }

  return []
}

const parseStrapiJsonField = (value) => {
  if (typeof value !== 'string') {
    return value
  }

  try {
    return JSON.parse(value)
  } catch {
    return {}
  }
}

const normalizeStrapiRecord = (record) => {
  if (!record || typeof record !== 'object') {
    return {}
  }

  const recordData = record.checkouts ||
    record.checkout ||
    record.attributes?.checkouts ||
    record.attributes?.checkout ||
    record.attributes ||
    record

  return {
    ...recordData,
    ...(recordData.attributes || {}),
  }
}

const getCheckoutContentData = (response) => {
  const responseData = response?.data
  const firstRecord = Array.isArray(responseData)
    ? responseData[0]
    : responseData
  const record = normalizeStrapiRecord(firstRecord || {})
  const fieldValue = record.data
  const parsedValue = parseStrapiJsonField(fieldValue)

  return parsedValue?.checkout ||
    parsedValue?.data?.checkout ||
    parsedValue?.data ||
    parsedValue ||
    {}
}

const createCheckoutContent = (content = {}) => {
  const source = content.checkout || content.checkoutBox || content.checkout_box || content
  const payment = source.payment || source.paymentBox || source.payment_box || {}
  const summary = source.summary || source.orderSummary || source.order_summary || {}
  const seo = source.seo || {}
  const plans = source.plans || source.planTranslations || source.plan_translations || source.products || []

  return {
    title: normalizeCheckoutValue(source.title),
    payment: {
      providerName: normalizeCheckoutValue(payment.providerName || payment.provider_name || payment.title),
      providerDescription: normalizeCheckoutValue(payment.providerDescription || payment.provider_description || payment.description),
      unavailableTitle: normalizeCheckoutValue(payment.unavailableTitle || payment.unavailable_title || payment.statusTitle),
      unavailableDescription: normalizeCheckoutValue(payment.unavailableDescription || payment.unavailable_description || payment.statusDescription),
      unavailableItems: normalizeCheckoutArray(payment.unavailableItems || payment.unavailable_items || payment.statusItems),
      feedback: normalizeCheckoutValue(payment.feedback || payment.notice),
    },
    summary: {
      title: normalizeCheckoutValue(summary.title),
      periodLabel: normalizeCheckoutValue(summary.periodLabel || summary.period_label),
      paymentMethodLabel: normalizeCheckoutValue(summary.paymentMethodLabel || summary.payment_method_label),
      amountLabel: normalizeCheckoutValue(summary.amountLabel || summary.amount_label),
      submitLabel: normalizeCheckoutValue(summary.submitLabel || summary.submit_label),
      note: normalizeCheckoutValue(summary.note),
      unavailablePaymentMethod: normalizeCheckoutValue(summary.unavailablePaymentMethod || summary.unavailable_payment_method),
      fallbackProductName: normalizeCheckoutValue(summary.fallbackProductName || summary.fallback_product_name),
      fallbackProductDescription: normalizeCheckoutValue(summary.fallbackProductDescription || summary.fallback_product_description),
      periodMonth: normalizeCheckoutValue(summary.periodMonth || summary.period_month),
      periodYear: normalizeCheckoutValue(summary.periodYear || summary.period_year),
      periodLife: normalizeCheckoutValue(summary.periodLife || summary.period_life),
      emptyValue: normalizeCheckoutValue(summary.emptyValue || summary.empty_value),
    },
    seo: {
      title: normalizeCheckoutValue(seo.title),
      description: normalizeCheckoutValue(seo.description),
    },
    plans: normalizeCheckoutPlans(plans),
  }
}

const syncCheckoutContent = (content = {}) => {
  checkoutContent.value = createCheckoutContent(content)
}

syncCheckoutContent(checkoutContent.value)

useLocalizedAsyncState({
  locale,
  loadedLocale: checkoutContentLocale,
  load: currentLocale => getCheckouts(currentLocale),
  sync: response => {
    syncCheckoutContent(getCheckoutContentData(response))
  },
  reset: () => {
    syncCheckoutContent()
  },
})

const checkoutProductId = computed(() => normalizeCheckoutValue(route.query.productId))

const queryPlan = computed(() => {
  return {
    id: checkoutProductId.value,
    type: normalizeCheckoutValue(route.query.productType),
    name: normalizeCheckoutValue(route.query.productName),
    description: normalizeCheckoutValue(route.query.productDescription),
    price: normalizeCheckoutValue(route.query.productPrice),
    unit: normalizeCheckoutValue(route.query.productUnit),
  }
})

const sourcePlan = computed(() => {
  const plans = Array.isArray(vipPlans.value) ? vipPlans.value : []
  const productId = checkoutProductId.value

  if (productId) {
    return plans.find(plan => {
      return normalizeCheckoutValue(plan.id) === productId || normalizeCheckoutValue(plan.productId) === productId
    }) || null
  }

  return plans.find(plan => plan.featured) || plans[0] || null
})

const checkoutPlanTranslation = computed(() => {
  const plan = queryPlan.value
  const fallbackPlan = sourcePlan.value || {}
  const planType = normalizePlanType(
    plan.type ||
    fallbackPlan.type ||
    fallbackPlan.planType ||
    fallbackPlan.productType ||
    fallbackPlan.termType ||
    fallbackPlan.id ||
    fallbackPlan.name ||
    fallbackPlan.unit
  )
  const planId = normalizeCheckoutValue(plan.id || fallbackPlan.id || fallbackPlan.productId)
  const plans = Array.isArray(checkoutContent.value.plans) ? checkoutContent.value.plans : []

  return plans.find(item => {
    const itemId = normalizeCheckoutValue(item.id)
    const itemType = normalizePlanType(item.type)

    return (itemId && itemId === planId) || (itemType && itemType === planType)
  }) || {}
})

const currentPlan = computed(() => {
  const plan = queryPlan.value
  const fallbackPlan = sourcePlan.value || {}
  const translation = checkoutPlanTranslation.value
  const fallbackType = normalizePlanType(
    fallbackPlan.type ||
    fallbackPlan.planType ||
    fallbackPlan.productType ||
    fallbackPlan.termType ||
    fallbackPlan.id ||
    fallbackPlan.name ||
    fallbackPlan.unit
  )

  return {
    id: plan.id || normalizeCheckoutValue(fallbackPlan.id),
    type: normalizePlanType(plan.type || fallbackType),
    name: translation.name || plan.name || normalizeCheckoutValue(fallbackPlan.name, checkoutContent.value.summary.fallbackProductName),
    description: translation.description || plan.description || normalizeCheckoutValue(fallbackPlan.description || fallbackPlan.subtitle, checkoutContent.value.summary.fallbackProductDescription),
    price: plan.price || normalizeCheckoutValue(fallbackPlan.price, checkoutContent.value.summary.emptyValue),
    unit: plan.unit || normalizeCheckoutValue(fallbackPlan.unit),
  }
})

const currentPlanPeriod = computed(() => {
  const plan = currentPlan.value
  const planType = normalizePlanType(plan.type || plan.name || plan.unit)
  const unit = normalizeCheckoutValue(plan.unit).replace(/^\//, '')

  if (planType === 'month') {
    return checkoutContent.value.summary.periodMonth
  }

  if (planType === 'year') {
    return checkoutContent.value.summary.periodYear
  }

  if (planType === 'life') {
    return checkoutContent.value.summary.periodLife
  }

  if (unit === '月') {
    return checkoutContent.value.summary.periodMonth
  }

  if (unit === '年') {
    return checkoutContent.value.summary.periodYear
  }

  return unit || checkoutContent.value.summary.emptyValue
})

const orderSummary = computed(() => {
  return {
    productName: currentPlan.value.name,
    description: currentPlan.value.description,
    period: currentPlanPeriod.value,
    paymentMethod: checkoutContent.value.summary.unavailablePaymentMethod,
    amount: currentPlan.value.price,
    submitLabel: checkoutContent.value.summary.submitLabel,
  }
})

onMounted(() => {
  loadVipTypes()
})

const seoTitle = computed(() => checkoutContent.value.seo.title)
const seoDescription = computed(() => checkoutContent.value.seo.description)

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  robots: 'noindex, nofollow, noarchive',
})
</script>

<style scoped>
.checkout-route-shell {
  background: var(--checkout-route-background, #070b13);
}

.checkout-page {
  --checkout-route-background: #070b13;
  --checkout-background: #070b13;
  --checkout-panel: #111827;
  --checkout-panel-soft: #172033;
  --checkout-control: #0f172a;
  --checkout-icon-background: rgba(56, 189, 248, 0.12);
  --checkout-message-border: rgba(56, 189, 248, 0.24);
  --checkout-border: #273449;
  --checkout-border-soft: #203047;
  --checkout-text: #f8fafc;
  --checkout-muted: #94a3b8;
  --checkout-muted-strong: #cbd5e1;
  --checkout-accent: #38bdf8;
  --checkout-accent-strong: #2563eb;
  --checkout-focus: rgba(56, 189, 248, 0.38);
  --checkout-page-gradient: linear-gradient(180deg, rgba(15, 23, 42, 0.72) 0%, rgba(7, 11, 19, 0) 240px);
  --checkout-panel-shadow: 0 22px 56px rgba(0, 0, 0, 0.24);
  --checkout-submit-shadow: rgba(37, 99, 235, 0.3);
  --checkout-amount: #22d3ee;

  width: 100%;
  min-height: 0;
  display: flex;
  justify-content: center;
  padding: 72px 20px;
  color: var(--checkout-text);
  background:
    var(--checkout-page-gradient),
    var(--checkout-background);
  overflow-x: hidden;
}

:root[data-theme="light"] .checkout-route-shell {
  --checkout-route-background: #f8fafc;
}

:root[data-theme="light"] .checkout-page {
  --checkout-background: #f8fafc;
  --checkout-panel: #ffffff;
  --checkout-panel-soft: #f0f9ff;
  --checkout-control: #ffffff;
  --checkout-icon-background: rgba(14, 165, 233, 0.12);
  --checkout-message-border: rgba(14, 165, 233, 0.24);
  --checkout-border: #dbe4ef;
  --checkout-border-soft: #e5edf6;
  --checkout-text: #0f172a;
  --checkout-muted: #64748b;
  --checkout-muted-strong: #334155;
  --checkout-accent: #0284c7;
  --checkout-accent-strong: #2563eb;
  --checkout-focus: rgba(14, 165, 233, 0.18);
  --checkout-page-gradient: linear-gradient(180deg, rgba(239, 248, 255, 0.96) 0%, rgba(248, 250, 252, 0) 260px);
  --checkout-panel-shadow: 0 20px 46px rgba(15, 23, 42, 0.08);
  --checkout-submit-shadow: rgba(37, 99, 235, 0.2);
  --checkout-amount: #0284c7;
}

.checkout-page,
.checkout-page * {
  box-sizing: border-box;
}

.checkout-shell {
  width: min(100%, 960px);
  max-width: calc(100vw - 40px);
  display: grid;
  grid-template-columns: minmax(0, 610px) minmax(284px, 300px);
  align-items: start;
  gap: 18px;
}

.checkout-panel {
  width: 100%;
  min-width: 0;
  border: 1px solid var(--checkout-border);
  border-radius: 8px;
  background: var(--checkout-panel);
  box-shadow: var(--checkout-panel-shadow);
}

.checkout-payment-panel {
  padding: 20px;
}

.checkout-panel-header h1,
.checkout-summary-panel h2 {
  color: var(--checkout-text);
  font-size: 20px;
  font-weight: 800;
  line-height: 28px;
}

.checkout-detail-card {
  display: grid;
  gap: 22px;
  margin-top: 12px;
  padding: 18px;
  border: 1px solid var(--checkout-border);
  border-radius: 8px;
  background: color-mix(in srgb, var(--checkout-panel) 94%, var(--checkout-control));
}

.checkout-provider-widget {
  min-width: 0;
  display: grid;
  gap: 18px;
}

.checkout-provider-header {
  min-width: 0;
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr);
  align-items: center;
  gap: 12px;
}

.checkout-provider-logo {
  width: 42px;
  height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: var(--checkout-accent);
  background: var(--checkout-icon-background);
}

.checkout-provider-logo :deep(svg) {
  width: 21px;
  height: 21px;
}

.checkout-provider-header h3 {
  color: var(--checkout-text);
  font-size: 15px;
  font-weight: 800;
  line-height: 21px;
}

.checkout-provider-header p {
  margin-top: 2px;
  color: var(--checkout-muted);
  font-size: 12px;
  line-height: 17px;
}

.checkout-payment-status-body {
  min-width: 0;
  display: grid;
  gap: 10px;
}

.checkout-payment-status {
  min-height: 44px;
  display: grid;
  grid-template-columns: 18px minmax(0, 1fr);
  align-items: center;
  gap: 10px;
  padding: 11px 12px;
  border: 1px solid var(--checkout-message-border);
  border-radius: 7px;
  color: var(--checkout-muted-strong);
  background: var(--checkout-control);
  font-size: 12px;
  line-height: 18px;
}

.checkout-payment-status :deep(svg) {
  width: 18px;
  height: 18px;
  color: var(--checkout-accent);
}

.checkout-payment-status.is-unavailable {
  border-color: color-mix(in srgb, var(--checkout-accent) 44%, var(--checkout-border));
}

.checkout-unavailable-copy {
  margin: 0;
  color: var(--checkout-muted);
  font-size: 13px;
  line-height: 20px;
}

.checkout-unavailable-list {
  display: grid;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.checkout-unavailable-list li {
  min-width: 0;
  display: grid;
  grid-template-columns: 17px minmax(0, 1fr);
  align-items: start;
  gap: 9px;
  color: var(--checkout-muted-strong);
  font-size: 12px;
  line-height: 18px;
}

.checkout-unavailable-list :deep(svg) {
  width: 17px;
  height: 17px;
  color: var(--checkout-accent);
}

.checkout-provider-feedback {
  min-height: 40px;
  display: grid;
  grid-template-columns: 17px minmax(0, 1fr);
  align-items: center;
  gap: 10px;
  margin-top: -6px;
  padding: 10px 12px;
  border: 1px solid var(--checkout-message-border);
  border-radius: 7px;
  color: var(--checkout-muted-strong);
  background: var(--checkout-panel-soft);
  font-size: 12px;
  line-height: 18px;
}

.checkout-provider-feedback :deep(svg) {
  width: 17px;
  height: 17px;
  color: var(--checkout-accent);
}

.checkout-provider-feedback span {
  min-width: 0;
  overflow-wrap: anywhere;
}

.checkout-summary-panel {
  align-self: start;
  position: static;
  padding: 20px;
}

.checkout-summary-product {
  display: block;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--checkout-border-soft);
}

.checkout-summary-product strong {
  display: block;
  color: var(--checkout-text);
  font-size: 16px;
  font-weight: 800;
  line-height: 22px;
}

.checkout-summary-product p {
  margin-top: 6px;
  color: var(--checkout-muted);
  font-size: 13px;
  line-height: 19px;
}

.checkout-summary-list {
  display: grid;
  gap: 14px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid var(--checkout-border-soft);
}

.checkout-summary-list div,
.checkout-summary-total {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.checkout-summary-list dt,
.checkout-summary-total span {
  color: var(--checkout-muted);
  font-size: 13px;
  line-height: 20px;
}

.checkout-summary-list dd {
  min-width: 0;
  color: var(--checkout-text);
  font-size: 13px;
  font-weight: 700;
  line-height: 20px;
  text-align: right;
  overflow-wrap: anywhere;
}

.checkout-summary-total {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--checkout-border-soft);
}

.checkout-summary-total strong {
  color: var(--checkout-amount);
  font-size: 38px;
  font-weight: 900;
  line-height: 44px;
}

.checkout-submit-button {
  width: 100%;
  height: 46px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 18px;
  padding: 0 16px;
  border-radius: 7px;
  color: #ffffff;
  background: linear-gradient(90deg, #0ea5e9 0%, var(--checkout-accent-strong) 100%);
  font-size: 14px;
  font-weight: 800;
  line-height: 1;
  cursor: pointer;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.checkout-submit-button:hover,
.checkout-submit-button:focus {
  box-shadow: 0 12px 26px var(--checkout-submit-shadow);
  transform: translateY(-1px);
}

.checkout-submit-button:disabled,
.checkout-submit-button[aria-disabled="true"] {
  color: var(--checkout-muted-strong);
  background: var(--checkout-control);
  box-shadow: none;
  cursor: not-allowed;
  opacity: 0.72;
}

.checkout-submit-button:disabled:hover,
.checkout-submit-button:disabled:focus,
.checkout-submit-button[aria-disabled="true"]:hover,
.checkout-submit-button[aria-disabled="true"]:focus {
  box-shadow: none;
  transform: none;
}

.checkout-summary-note {
  margin-top: 18px;
  padding: 14px;
  border-radius: 7px;
  color: var(--checkout-muted);
  background: var(--checkout-panel-soft);
  font-size: 12px;
  line-height: 19px;
}

@media (max-width: 900px) {
  .checkout-page {
    padding: 40px 16px;
  }

  .checkout-shell {
    grid-template-columns: 1fr;
  }

  .checkout-summary-panel {
    position: static;
  }
}

@media (max-width: 620px) {
  .checkout-page {
    padding: 24px 14px;
  }

  .checkout-payment-panel,
  .checkout-summary-panel {
    padding: 20px;
  }

  .checkout-shell {
    max-width: calc(100vw - 28px);
  }

}
</style>
