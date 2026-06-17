<template>
  <div class="page-shell checkout-route-shell">
    <SiteHeader />

    <main class="checkout-page" aria-labelledby="checkout-title">
      <div class="checkout-shell">
        <section class="checkout-panel checkout-payment-panel" aria-labelledby="checkout-title">
          <header class="checkout-panel-header">
            <h1 id="checkout-title">PayPal 安全付款</h1>
          </header>

          <form
            class="checkout-detail-card"
            aria-labelledby="paypal-payment-title"
            @submit.prevent
          >
            <section class="checkout-provider-widget checkout-paypal-widget" aria-labelledby="paypal-payment-title">
              <header class="checkout-provider-header">
                <span class="checkout-provider-logo checkout-provider-logo-paypal" aria-hidden="true">P</span>
                <div>
                  <h3 id="paypal-payment-title">PayPal</h3>
                  <p>通过 PayPal 官方组件安全付款</p>
                </div>
              </header>

              <div class="checkout-paypal-official">
                <div ref="paypalContainer" class="checkout-paypal-sdk-container" />
                <div
                  v-if="paypalSdkMessage"
                  class="checkout-paypal-sdk-state"
                  :class="`is-${paypalSdkStatus}`"
                  aria-live="polite"
                >
                  <Icon :name="paypalSdkStatus === 'error' ? 'lucide:circle-alert' : 'lucide:loader-circle'" aria-hidden="true" />
                  <span>{{ paypalSdkMessage }}</span>
                </div>
              </div>
            </section>

            <p v-if="paymentActionMessage" class="checkout-provider-feedback" aria-live="polite">
              <Icon name="lucide:info" aria-hidden="true" />
              <span>{{ paymentActionMessage }}</span>
            </p>
          </form>
        </section>

        <aside class="checkout-panel checkout-summary-panel" aria-labelledby="checkout-summary-title">
          <h2 id="checkout-summary-title">订单摘要</h2>

          <div class="checkout-summary-product">
            <div>
              <strong>{{ orderSummary.productName }}</strong>
              <p>{{ orderSummary.description }}</p>
            </div>
          </div>

          <dl class="checkout-summary-list">
            <div>
              <dt>会员周期</dt>
              <dd>{{ orderSummary.period }}</dd>
            </div>
            <div>
              <dt>支付方式</dt>
              <dd>{{ orderSummary.paymentMethod }}</dd>
            </div>
          </dl>

          <div class="checkout-summary-total">
            <span>应付金额</span>
            <strong>{{ orderSummary.amount }}</strong>
          </div>

          <button class="checkout-submit-button" type="button" @click="handleOrderSubmit">{{ orderSummary.submitLabel }}</button>

          <p class="checkout-summary-note">
            点击订阅即表示你同意服务条款和隐私政策，订单信息提交前仍可修改。
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

const route = useRoute()
const runtimeConfig = useRuntimeConfig()
const { vipPlans, loadVipTypes } = useVipTypes()

const paymentMethods = [
  {
    id: 'card',
    label: '银行卡/信用卡',
    description: '使用银行卡或信用卡支付',
    icon: 'lucide:credit-card',
  },
  {
    id: 'paypal',
    label: 'PayPal',
    description: '使用 PayPal 支付',
    icon: 'lucide:wallet-cards',
  },
]

const selectedPayment = ref('paypal')
const paymentActionMessage = ref('')
const paypalContainer = ref(null)
const paypalSdkStatus = ref('idle')
const paypalSdkMessage = ref('')
let paypalScriptRequest = null
let paypalRenderSignature = ''

const activePayment = computed(() => {
  return paymentMethods.find(method => method.id === selectedPayment.value) || paymentMethods[0]
})

const selectPayment = (paymentId) => {
  selectedPayment.value = paymentId
  paymentActionMessage.value = ''
}

const handleOrderSubmit = () => {
  paymentActionMessage.value = selectedPayment.value === 'paypal'
    ? '请使用 PayPal 官方组件完成付款。'
    : '请在银行卡安全支付组件中完成付款。'
}

const normalizeCheckoutValue = (value, fallback = '') => {
  const sourceValue = Array.isArray(value) ? value[0] : value
  const text = String(sourceValue || '').trim()

  return text || fallback
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

const currentPlan = computed(() => {
  const plan = queryPlan.value
  const fallbackPlan = sourcePlan.value || {}
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
    name: plan.name || normalizeCheckoutValue(fallbackPlan.name, '未选择套餐'),
    description: plan.description || normalizeCheckoutValue(fallbackPlan.description || fallbackPlan.subtitle, '请返回首页选择一个会员套餐。'),
    price: plan.price || normalizeCheckoutValue(fallbackPlan.price, '-'),
    unit: plan.unit || normalizeCheckoutValue(fallbackPlan.unit),
  }
})

const currentPlanPeriod = computed(() => {
  const plan = currentPlan.value
  const planType = normalizePlanType(plan.type || plan.name || plan.unit)
  const unit = normalizeCheckoutValue(plan.unit).replace(/^\//, '')

  if (planType === 'month') {
    return '1个月'
  }

  if (planType === 'year') {
    return '1年'
  }

  if (planType === 'life') {
    return '终身'
  }

  if (unit === '月') {
    return '1个月'
  }

  if (unit === '年') {
    return '1年'
  }

  return unit || '-'
})

const orderSummary = computed(() => {
  return {
    productName: currentPlan.value.name,
    description: currentPlan.value.description,
    period: currentPlanPeriod.value,
    paymentMethod: activePayment.value.label,
    amount: currentPlan.value.price,
    submitLabel: '订阅',
  }
})

const paypalClientId = computed(() => {
  return normalizeCheckoutValue(runtimeConfig.public.paypalClientId)
})

const paypalCurrency = computed(() => {
  return normalizeCheckoutValue(runtimeConfig.public.paypalCurrency, 'USD').toUpperCase()
})

const paypalAmountValue = computed(() => {
  const amountText = normalizeCheckoutValue(currentPlan.value.price).replace(/[^0-9.]/g, '')
  const amountNumber = Number.parseFloat(amountText)

  if (!Number.isFinite(amountNumber) || amountNumber <= 0) {
    return '0.01'
  }

  return amountNumber.toFixed(2)
})

const createPaypalSdkUrl = () => {
  const params = new URLSearchParams({
    'client-id': paypalClientId.value,
    currency: paypalCurrency.value,
    components: 'buttons',
    intent: 'capture',
  })

  return `https://www.paypal.com/sdk/js?${params.toString()}`
}

const loadPaypalSdk = () => {
  if (!process.client) {
    return Promise.reject(new Error('PayPal SDK only loads in browser.'))
  }

  if (window.paypal?.Buttons) {
    return Promise.resolve(window.paypal)
  }

  if (paypalScriptRequest) {
    return paypalScriptRequest
  }

  const existingScript = document.querySelector('script[data-vicast-paypal-sdk="true"]')

  if (existingScript) {
    paypalScriptRequest = new Promise((resolve, reject) => {
      existingScript.addEventListener('load', () => resolve(window.paypal), { once: true })
      existingScript.addEventListener('error', reject, { once: true })
    })

    return paypalScriptRequest
  }

  paypalScriptRequest = new Promise((resolve, reject) => {
    const script = document.createElement('script')

    script.src = createPaypalSdkUrl()
    script.async = true
    script.dataset.vicastPaypalSdk = 'true'
    script.addEventListener('load', () => resolve(window.paypal), { once: true })
    script.addEventListener('error', reject, { once: true })
    document.head.appendChild(script)
  })

  return paypalScriptRequest
}

const renderPaypalOfficialComponent = async () => {
  if (!process.client || selectedPayment.value !== 'paypal') {
    return
  }

  await nextTick()

  if (!paypalContainer.value) {
    return
  }

  if (!paypalClientId.value) {
    paypalSdkStatus.value = 'error'
    paypalSdkMessage.value = 'PayPal Client ID 未配置。'
    paypalContainer.value.innerHTML = ''
    paypalRenderSignature = ''
    return
  }

  const renderSignature = [
    paypalClientId.value,
    paypalCurrency.value,
    paypalAmountValue.value,
    currentPlan.value.id,
  ].join('|')

  if (paypalRenderSignature === renderSignature && paypalContainer.value.childElementCount) {
    return
  }

  paypalContainer.value.innerHTML = ''
  paypalSdkStatus.value = 'loading'
  paypalSdkMessage.value = '正在加载 PayPal 官方组件...'

  try {
    const paypal = await loadPaypalSdk()
    const buttons = paypal.Buttons({
      style: {
        layout: 'vertical',
        color: 'gold',
        shape: 'rect',
        label: 'paypal',
        height: 45,
      },
      createOrder(data, actions) {
        paymentActionMessage.value = 'PayPal 订单已创建，付款确认仍需接入后端接口。'

        return actions.order.create({
          purchase_units: [
            {
              description: currentPlan.value.name,
              amount: {
                currency_code: paypalCurrency.value,
                value: paypalAmountValue.value,
              },
            },
          ],
        })
      },
      onApprove() {
        paymentActionMessage.value = 'PayPal 已授权，后续需要后端确认订单并开通会员。'
      },
      onCancel() {
        paymentActionMessage.value = 'PayPal 付款已取消。'
      },
      onError() {
        paypalSdkStatus.value = 'error'
        paypalSdkMessage.value = 'PayPal 官方组件加载失败，请稍后重试。'
      },
    })

    if (buttons.isEligible && !buttons.isEligible()) {
      paypalSdkStatus.value = 'error'
      paypalSdkMessage.value = '当前环境不支持 PayPal 官方组件。'
      return
    }

    await buttons.render(paypalContainer.value)
    paypalRenderSignature = renderSignature
    paypalSdkStatus.value = 'ready'
    paypalSdkMessage.value = ''
  } catch (error) {
    paypalSdkStatus.value = 'error'
    paypalSdkMessage.value = 'PayPal 官方组件加载失败，请检查网络或 Client ID。'
  }
}

onMounted(() => {
  loadVipTypes()
  renderPaypalOfficialComponent()
})

watch([selectedPayment, paypalAmountValue, paypalCurrency], () => {
  renderPaypalOfficialComponent()
}, { flush: 'post' })

useSeoMeta({
  title: '订阅结算',
  description: 'VicastCam 订阅结算页面。',
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
  --checkout-method-background: #0d1424;
  --checkout-method-active-background: #0c2030;
  --checkout-icon-background: rgba(56, 189, 248, 0.12);
  --checkout-message-border: rgba(56, 189, 248, 0.24);
  --checkout-radio-border: #4b5d78;
  --checkout-placeholder: #64748b;
  --checkout-product-icon: #facc15;
  --checkout-product-icon-background: rgba(250, 204, 21, 0.12);
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
  --checkout-method-background: #ffffff;
  --checkout-method-active-background: #eef8ff;
  --checkout-icon-background: rgba(14, 165, 233, 0.12);
  --checkout-message-border: rgba(14, 165, 233, 0.24);
  --checkout-radio-border: #cbd5e1;
  --checkout-placeholder: #94a3b8;
  --checkout-product-icon: #ca8a04;
  --checkout-product-icon-background: rgba(250, 204, 21, 0.18);
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
.checkout-form-heading h2,
.checkout-billing-form h2,
.checkout-summary-panel h2 {
  color: var(--checkout-text);
  font-size: 20px;
  font-weight: 800;
  line-height: 28px;
}

.checkout-method-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-top: 20px;
}

.checkout-method {
  position: relative;
  min-width: 0;
  min-height: 84px;
  display: grid;
  grid-template-columns: 40px minmax(0, 1fr) 16px;
  align-items: center;
  gap: 13px;
  padding: 16px;
  border: 1px solid var(--checkout-border);
  border-radius: 8px;
  color: var(--checkout-text);
  background: var(--checkout-method-background);
  text-align: left;
  cursor: pointer;
  transition: border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.checkout-method:hover,
.checkout-method:focus {
  border-color: rgba(56, 189, 248, 0.56);
  box-shadow: 0 0 0 3px var(--checkout-focus);
  transform: translateY(-1px);
}

.checkout-method.is-active {
  border-color: var(--checkout-accent);
  background: var(--checkout-method-active-background);
  box-shadow: inset 0 0 0 1px var(--checkout-accent);
}

.checkout-method-icon {
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: var(--checkout-accent);
  background: var(--checkout-icon-background);
  flex: 0 0 40px;
}

.checkout-paypal-mark {
  width: 20px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 21px;
  font-weight: 900;
  font-style: italic;
  line-height: 24px;
  transform: translateY(1px);
}

.checkout-method-icon.is-paypal {
  background: #2b65d9;
}

.checkout-method-icon :deep(svg) {
  width: 20px;
  height: 20px;
}

.checkout-method-copy {
  min-width: 0;
  display: grid;
  gap: 4px;
  align-content: center;
}

.checkout-method-copy strong,
.checkout-method-copy small {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.checkout-method-copy strong {
  font-size: 15px;
  font-weight: 800;
  line-height: 21px;
}

.checkout-method-copy small {
  color: var(--checkout-muted);
  font-size: 12px;
  line-height: 17px;
}

.checkout-radio {
  width: 14px;
  height: 14px;
  justify-self: end;
  border: 1px solid var(--checkout-radio-border);
  border-radius: 50%;
}

.checkout-method.is-active .checkout-radio {
  border: 4px solid var(--checkout-accent);
  background: var(--checkout-panel);
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

.checkout-provider-logo-paypal {
  color: #ffffff;
  background: #2b65d9;
  font-size: 24px;
  font-weight: 900;
  font-style: italic;
  line-height: 1;
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

.checkout-paypal-official {
  min-width: 0;
  display: grid;
  gap: 10px;
}

.checkout-paypal-sdk-container {
  min-width: 0;
  min-height: 45px;
}

.checkout-paypal-sdk-state {
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

.checkout-paypal-sdk-state :deep(svg) {
  width: 18px;
  height: 18px;
  color: var(--checkout-accent);
}

.checkout-paypal-sdk-state.is-loading :deep(svg) {
  animation: checkout-spin 0.9s linear infinite;
}

.checkout-paypal-sdk-state.is-error {
  border-color: color-mix(in srgb, #ef4444 42%, var(--checkout-border));
  color: var(--checkout-muted-strong);
}

.checkout-paypal-sdk-state.is-error :deep(svg) {
  color: #ef4444;
}

.checkout-card-element {
  min-width: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  padding: 14px;
  border: 1px solid var(--checkout-border);
  border-radius: 8px;
  background: var(--checkout-control);
}

.checkout-card-row {
  min-width: 0;
  min-height: 46px;
  display: grid;
  align-content: center;
  gap: 3px;
  padding: 9px 12px;
  border: 1px solid var(--checkout-border-soft);
  border-radius: 7px;
  background: color-mix(in srgb, var(--checkout-panel) 76%, var(--checkout-control));
}

.checkout-card-row-wide {
  grid-column: 1 / -1;
  grid-template-columns: minmax(0, 1fr) 18px;
  align-items: center;
}

.checkout-card-row span {
  color: var(--checkout-muted);
  font-size: 11px;
  line-height: 15px;
}

.checkout-card-row strong {
  min-width: 0;
  color: var(--checkout-muted-strong);
  font-size: 13px;
  font-weight: 700;
  line-height: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.checkout-card-row-wide span,
.checkout-card-row-wide strong {
  grid-column: 1;
}

.checkout-card-row-wide :deep(svg) {
  grid-column: 2;
  grid-row: 1 / span 2;
  width: 17px;
  height: 17px;
  justify-self: end;
  color: var(--checkout-muted);
}

.checkout-card-brands {
  grid-column: 1 / -1;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.checkout-card-brands span {
  height: 24px;
  display: inline-flex;
  align-items: center;
  padding: 0 8px;
  border: 1px solid var(--checkout-border-soft);
  border-radius: 5px;
  color: var(--checkout-muted);
  background: color-mix(in srgb, var(--checkout-panel) 70%, transparent);
  font-size: 10px;
  font-weight: 800;
  line-height: 1;
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

@keyframes checkout-spin {
  to {
    transform: rotate(360deg);
  }
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

  .checkout-method-grid {
    grid-template-columns: 1fr;
  }

  .checkout-method {
    min-height: 76px;
  }
}
</style>
