<template>
  <div class="page-shell checkout-route-shell">
    <SiteHeader />

    <main class="checkout-page" aria-labelledby="checkout-title">
      <div v-if="isCheckoutSelectionReady" class="checkout-shell">
        <section class="checkout-panel checkout-payment-panel" aria-labelledby="checkout-title">
          <header class="checkout-panel-header">
            <h1 id="checkout-title">{{ checkoutContent.title }}</h1>
            <span class="checkout-secure-badge">
              <Icon name="lucide:lock-keyhole" aria-hidden="true" />
              <span>{{ checkoutContent.payment.secureBadge }}</span>
            </span>
          </header>

          <div class="checkout-detail-card">
            <section class="checkout-method-list" :aria-label="paymentText.methodLabel">
              <label class="checkout-method is-active">
                <input type="radio" name="checkout-payment-method" value="paypal" checked>
                <span class="checkout-method-mark" aria-hidden="true"></span>
                <span class="checkout-method-body">
                  <span class="checkout-method-brand">
                    <span class="checkout-paypal-logo" aria-hidden="true">
                      <i>Pay</i><i>Pal</i>
                    </span>
                  </span>
                  <span class="checkout-method-copy">{{ paymentText.providerDescription }}</span>
                </span>
              </label>
            </section>

            <section class="checkout-provider-widget" aria-labelledby="checkout-payment-status-title">
              <h3 id="checkout-payment-status-title" class="checkout-sr-only">
                {{ paymentText.providerName }}
              </h3>

              <div v-if="checkoutAccountEmail" class="checkout-account-row">
                <Icon name="lucide:user-round" aria-hidden="true" />
                <span>{{ paymentText.accountLabel }}</span>
                <strong>{{ checkoutAccountEmail }}</strong>
              </div>

              <div v-if="isCheckoutSignedIn" class="checkout-paypal-official">
                <button
                  class="checkout-paypal-redirect-button"
                  type="button"
                  :disabled="isPaypalRedirecting || hasPendingPaypalOrder"
                  @click="redirectToPaypal"
                >
                  <Icon v-if="isPaypalRedirecting" name="lucide:loader-circle" aria-hidden="true" />
                  <span>{{ paypalButtonText }}</span>
                </button>

              </div>

              <div v-else class="checkout-signin-notice" role="status">
                <Icon name="lucide:log-in" aria-hidden="true" />
                <div>
                  <p>{{ paymentText.signInRequired }}</p>
                  <NuxtLink :to="localePath('/login')" class="checkout-signin-link">
                    {{ paymentText.signInAction }}
                  </NuxtLink>
                </div>
              </div>
            </section>

            <ul v-if="paymentText.trustItems.length" class="checkout-trust-list">
              <li v-for="item in paymentText.trustItems" :key="item">
                <Icon name="lucide:shield-check" aria-hidden="true" />
                <span>{{ item }}</span>
              </li>
            </ul>

            <p v-if="paymentFeedback" :class="['checkout-provider-feedback', `is-${paymentFeedbackType}`]" aria-live="polite">
              <Icon :name="paymentFeedbackIcon" aria-hidden="true" />
              <span>{{ paymentFeedback }}</span>
            </p>
          </div>
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

          <p class="checkout-summary-hint">
            <Icon name="lucide:arrow-left" aria-hidden="true" />
            <span>{{ checkoutContent.payment.summaryHint }}</span>
          </p>

          <p class="checkout-summary-note">
            {{ checkoutContent.summary.note }}
          </p>
        </aside>
      </div>
    </main>

    <div v-if="isPaymentResultChecking" class="checkout-result-loading" role="status" aria-live="polite">
      <div class="checkout-result-loading-card">
        <span class="checkout-result-loading-spinner" aria-hidden="true"></span>
        <span>{{ paymentResultCheckingText }}</span>
      </div>
    </div>

    <div
      v-if="paymentResult"
      class="checkout-result-backdrop"
      @click.self="dismissPaymentResult"
    >
      <section
        class="checkout-result-modal"
        :class="`is-${paymentResult.status}`"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="paymentResult.status === 'success' ? 'checkout-payment-success-title' : 'checkout-payment-failure-title'"
      >
        <button
          type="button"
          class="checkout-result-close"
          :aria-label="paymentResultCopy.closeLabel"
          @click="dismissPaymentResult"
        >
          <Icon name="lucide:x" aria-hidden="true" />
        </button>

        <img
          class="checkout-result-icon"
          :src="paymentResult.image"
          :alt="paymentResultCopy.iconAlt"
        >

        <h2 :id="paymentResult.status === 'success' ? 'checkout-payment-success-title' : 'checkout-payment-failure-title'">
          {{ paymentResultCopy.titlePrefix }}<span>{{ paymentResultCopy.titleHighlight }}</span>
        </h2>
        <p class="checkout-result-description">{{ paymentResultCopy.description }}</p>

        <dl class="checkout-result-details">
          <div class="checkout-result-row">
            <dt><Icon name="lucide:file-text" aria-hidden="true" />{{ paymentResultCopy.orderNumber }}</dt>
            <dd>
              <span>{{ paymentResult.orderNo || paymentResultCopy.emptyValue }}</span>
              <button
                v-if="paymentResult.orderNo"
                type="button"
                class="checkout-result-copy"
                :aria-label="paymentResultCopy.copyOrderNumber"
                :title="paymentResultCopied ? paymentResultCopy.copied : paymentResultCopy.copyOrderNumber"
                @click="copyPaymentOrderNumber"
              >
                <Icon :name="paymentResultCopied ? 'lucide:check' : 'lucide:copy'" aria-hidden="true" />
              </button>
            </dd>
          </div>
          <div class="checkout-result-row">
            <dt><Icon name="lucide:badge" aria-hidden="true" />{{ paymentResultCopy.membershipType }}</dt>
            <dd>{{ paymentResult.planName || paymentResultCopy.emptyValue }}</dd>
          </div>
          <div class="checkout-result-row">
            <dt><Icon name="lucide:calendar-days" aria-hidden="true" />{{ paymentResultCopy.expiry }}</dt>
            <dd>{{ paymentResult.expiry || paymentResultCopy.emptyValue }}</dd>
          </div>
          <div class="checkout-result-row">
            <dt><Icon name="lucide:clipboard-check" aria-hidden="true" />{{ paymentResultCopy.orderStatus }}</dt>
            <dd>
              <span class="checkout-result-status">{{ paymentResultCopy.status }}</span>
            </dd>
          </div>
        </dl>

        <div class="checkout-result-actions">
          <button
            v-if="paymentResult.status === 'success'"
            type="button"
            class="checkout-result-primary"
            @click="goToMembershipCenter"
          >
            {{ paymentResultCopy.primaryAction }}
          </button>
          <button
            v-else
            type="button"
            class="checkout-result-primary"
            @click="retryPayment"
          >
            {{ paymentResultCopy.primaryAction }}
          </button>
          <button type="button" class="checkout-result-secondary" @click="dismissPaymentResult">
            {{ paymentResultCopy.secondaryAction }}
          </button>
        </div>
      </section>
    </div>

    <SiteFooter />
  </div>
</template>

<script setup>
import SiteHeader from '../../components/SiteHeader.vue'
import SiteFooter from '../../components/SiteFooter.vue'
import { getCheckouts } from '../../api/request/strapi'
import { createPaypalOrder, getPaypalOrderStatus, resolvePaypalProductId } from '../../api/request/paypal'
import { isLoggedInUser } from '../../utils/auth-session'
import { loadCheckoutSelection } from '../../utils/checkout-selection'

const route = useRoute()
const router = useRouter()
const localePath = useLocalePath()
const { locale } = useI18n()
const profileTabCookie = useCookie('profile-active-tab', { sameSite: 'lax' })
const { authUser, refreshVipInfo } = useAuth()
const { showErrorToast } = useSiteToast()
const checkoutContentLocale = useState('checkout-page-content-locale', () => '')

const createEmptyCheckoutContent = () => ({
  title: '',
  payment: {
    providerName: '',
    providerDescription: '',
    secureBadge: '',
    methodLabel: '',
    accountLabel: '',
    signInRequired: '',
    signInAction: '',
    summaryHint: '',
    trustItems: [],
    buttonPay: '',
    buttonPending: '',
    buttonCreating: '',
    sdkLoading: '',
    sdkError: '',
    sdkIneligible: '',
    sdkMissingConfig: '',
    orderCreating: '',
    orderCreateFailed: '',
    orderProcessing: '',
    orderSuccess: '',
    orderFailed: '',
    orderPending: '',
    orderExpired: '',
    statusQueryFailed: '',
    invalidPlan: '',
    popupBlocked: '',
    popupOpened: '',
    popupClosedChecking: '',
    popupClosedFailed: '',
  },
  summary: {
    title: '',
    periodLabel: '',
    paymentMethodLabel: '',
    amountLabel: '',
    paymentMethod: '',
    note: '',
    periodMonth: '',
    periodYear: '',
    periodLife: '',
    emptyValue: '',
  },
  result: {
    checking: '',
    closeLabel: '',
    iconAlt: '',
    titlePrefix: '',
    successTitleHighlight: '',
    failureTitleHighlight: '',
    successDescription: '',
    failureDescription: '',
    orderNumber: '',
    membershipType: '',
    expiry: '',
    orderStatus: '',
    successStatus: '',
    failureStatus: '',
    successPrimaryAction: '',
    failurePrimaryAction: '',
    successSecondaryAction: '',
    failureSecondaryAction: '',
    copyOrderNumber: '',
    copied: '',
    emptyValue: '',
  },
  seo: {
    title: '',
    description: '',
  },
  plans: [],
})

const checkoutContent = useState('checkout-page-content', createEmptyCheckoutContent)

const normalizeCheckoutValue = (value, fallback = '') => {
  const sourceValue = Array.isArray(value) ? value[0] : value
  const text = String(sourceValue || '').trim()

  return text || fallback
}

const normalizeCheckoutArray = (value) => {
  if (Array.isArray(value)) {
    const items = value.map(item => normalizeCheckoutValue(item)).filter(Boolean)

    return items
  }

  const text = normalizeCheckoutValue(value)

  return text ? [text] : []
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
      period: normalizeCheckoutValue(plan.period || plan.validity || plan.term),
    })).filter(plan => plan.id || plan.type || plan.name || plan.description || plan.period)
  }

  if (value && typeof value === 'object') {
    return Object.entries(value).map(([key, plan = {}]) => ({
      id: normalizeCheckoutValue(plan.id || plan.productId || plan.product_id),
      type: normalizePlanType(plan.type || plan.planType || plan.plan_type || key),
      name: normalizeCheckoutValue(plan.name || plan.title),
      description: normalizeCheckoutValue(plan.description || plan.subtitle),
      period: normalizeCheckoutValue(plan.period || plan.validity || plan.term),
    })).filter(plan => plan.id || plan.type || plan.name || plan.description || plan.period)
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
  const result = source.result || source.paymentResult || source.payment_result || {}
  const seo = source.seo || {}
  const plans = source.plans || source.planTranslations || source.plan_translations || source.products || []

  return {
    title: normalizeCheckoutValue(source.title),
    payment: {
      providerName: normalizeCheckoutValue(payment.providerName || payment.provider_name || payment.title),
      providerDescription: normalizeCheckoutValue(payment.providerDescription || payment.provider_description || payment.description),
      secureBadge: normalizeCheckoutValue(payment.secureBadge || payment.secure_badge),
      methodLabel: normalizeCheckoutValue(payment.methodLabel || payment.method_label),
      accountLabel: normalizeCheckoutValue(payment.accountLabel || payment.account_label),
      signInRequired: normalizeCheckoutValue(payment.signInRequired || payment.sign_in_required),
      signInAction: normalizeCheckoutValue(payment.signInAction || payment.sign_in_action),
      summaryHint: normalizeCheckoutValue(payment.summaryHint || payment.summary_hint),
      trustItems: normalizeCheckoutArray(payment.trustItems || payment.trust_items),
      buttonPay: normalizeCheckoutValue(payment.buttonPay || payment.button_pay),
      buttonPending: normalizeCheckoutValue(payment.buttonPending || payment.button_pending),
      buttonCreating: normalizeCheckoutValue(payment.buttonCreating || payment.button_creating),
      sdkLoading: normalizeCheckoutValue(payment.sdkLoading || payment.sdk_loading),
      sdkError: normalizeCheckoutValue(payment.sdkError || payment.sdk_error),
      sdkIneligible: normalizeCheckoutValue(payment.sdkIneligible || payment.sdk_ineligible),
      sdkMissingConfig: normalizeCheckoutValue(payment.sdkMissingConfig || payment.sdk_missing_config),
      orderCreating: normalizeCheckoutValue(payment.orderCreating || payment.order_creating),
      orderCreateFailed: normalizeCheckoutValue(payment.orderCreateFailed || payment.order_create_failed),
      orderProcessing: normalizeCheckoutValue(payment.orderProcessing || payment.order_processing),
      orderSuccess: normalizeCheckoutValue(payment.orderSuccess || payment.order_success),
      orderFailed: normalizeCheckoutValue(payment.orderFailed || payment.order_failed),
      orderPending: normalizeCheckoutValue(payment.orderPending || payment.order_pending),
      orderExpired: normalizeCheckoutValue(payment.orderExpired || payment.order_expired),
      statusQueryFailed: normalizeCheckoutValue(payment.statusQueryFailed || payment.status_query_failed),
      invalidPlan: normalizeCheckoutValue(payment.invalidPlan || payment.invalid_plan),
      popupBlocked: normalizeCheckoutValue(payment.popupBlocked || payment.popup_blocked),
      popupOpened: normalizeCheckoutValue(payment.popupOpened || payment.popup_opened),
      popupClosedChecking: normalizeCheckoutValue(payment.popupClosedChecking || payment.popup_closed_checking),
      popupClosedFailed: normalizeCheckoutValue(payment.popupClosedFailed || payment.popup_closed_failed),
    },
    summary: {
      title: normalizeCheckoutValue(summary.title),
      periodLabel: normalizeCheckoutValue(summary.periodLabel || summary.period_label),
      paymentMethodLabel: normalizeCheckoutValue(summary.paymentMethodLabel || summary.payment_method_label),
      amountLabel: normalizeCheckoutValue(summary.amountLabel || summary.amount_label),
      paymentMethod: normalizeCheckoutValue(summary.paymentMethod || summary.payment_method),
      note: normalizeCheckoutValue(summary.note),
      periodMonth: normalizeCheckoutValue(summary.periodMonth || summary.period_month),
      periodYear: normalizeCheckoutValue(summary.periodYear || summary.period_year),
      periodLife: normalizeCheckoutValue(summary.periodLife || summary.period_life),
      emptyValue: normalizeCheckoutValue(summary.emptyValue || summary.empty_value),
    },
    result: {
      checking: normalizeCheckoutValue(result.checking),
      closeLabel: normalizeCheckoutValue(result.closeLabel || result.close_label),
      iconAlt: normalizeCheckoutValue(result.iconAlt || result.icon_alt),
      titlePrefix: normalizeCheckoutValue(result.titlePrefix || result.title_prefix),
      successTitleHighlight: normalizeCheckoutValue(result.successTitleHighlight || result.success_title_highlight),
      failureTitleHighlight: normalizeCheckoutValue(result.failureTitleHighlight || result.failure_title_highlight),
      successDescription: normalizeCheckoutValue(result.successDescription || result.success_description),
      failureDescription: normalizeCheckoutValue(result.failureDescription || result.failure_description),
      orderNumber: normalizeCheckoutValue(result.orderNumber || result.order_number),
      membershipType: normalizeCheckoutValue(result.membershipType || result.membership_type),
      expiry: normalizeCheckoutValue(result.expiry),
      orderStatus: normalizeCheckoutValue(result.orderStatus || result.order_status),
      successStatus: normalizeCheckoutValue(result.successStatus || result.success_status),
      failureStatus: normalizeCheckoutValue(result.failureStatus || result.failure_status),
      successPrimaryAction: normalizeCheckoutValue(result.successPrimaryAction || result.success_primary_action),
      failurePrimaryAction: normalizeCheckoutValue(result.failurePrimaryAction || result.failure_primary_action),
      successSecondaryAction: normalizeCheckoutValue(result.successSecondaryAction || result.success_secondary_action),
      failureSecondaryAction: normalizeCheckoutValue(result.failureSecondaryAction || result.failure_secondary_action),
      copyOrderNumber: normalizeCheckoutValue(result.copyOrderNumber || result.copy_order_number),
      copied: normalizeCheckoutValue(result.copied),
      emptyValue: normalizeCheckoutValue(result.emptyValue || result.empty_value),
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

const checkoutSelection = ref({})
const isCheckoutSelectionReady = ref(false)
const checkoutProductId = computed(() => {
  return normalizeCheckoutValue(checkoutSelection.value.id || route.query.productId)
})

const queryPlan = computed(() => {
  const selection = checkoutSelection.value

  return {
    id: checkoutProductId.value,
    type: normalizeCheckoutValue(selection.type || route.query.productType),
    name: normalizeCheckoutValue(selection.name || route.query.productName),
    description: normalizeCheckoutValue(selection.description || route.query.productDescription),
    price: normalizeCheckoutValue(selection.price || route.query.productPrice),
    unit: normalizeCheckoutValue(selection.unit || route.query.productUnit),
  }
})

const checkoutPlanTranslation = computed(() => {
  const plan = queryPlan.value
  const planType = normalizePlanType(
    plan.type ||
    plan.id ||
    plan.name ||
    plan.unit
  )
  const planId = normalizeCheckoutValue(plan.id)
  const plans = Array.isArray(checkoutContent.value.plans) ? checkoutContent.value.plans : []

  return plans.find(item => {
    const itemId = normalizeCheckoutValue(item.id)
    const itemType = normalizePlanType(item.type)

    return (itemId && itemId === planId) || (itemType && itemType === planType)
  }) || {}
})

const currentPlan = computed(() => {
  const plan = queryPlan.value
  const translation = checkoutPlanTranslation.value

  return {
    id: plan.id,
    type: normalizePlanType(plan.type || plan.id || plan.name || plan.unit),
    name: translation.name,
    description: translation.description,
    price: plan.price,
    unit: plan.unit,
    period: translation.period,
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
    period: currentPlan.value.period || currentPlanPeriod.value,
    paymentMethod: checkoutContent.value.summary.paymentMethod,
    amount: currentPlan.value.price,
  }
})

const paymentText = computed(() => {
  return checkoutContent.value.payment
})

const isCheckoutSignedIn = computed(() => isLoggedInUser(authUser.value))
const checkoutAccountEmail = computed(() => normalizeCheckoutValue(authUser.value?.email))

const paymentFeedback = ref('')
const paymentFeedbackType = ref('info')
const paymentResult = ref(null)
const paymentResultCopied = ref(false)
const isPaymentResultChecking = ref(false)

const paymentResultCheckingText = computed(() => {
  return checkoutContent.value.result.checking
})

const paymentResultCopy = computed(() => {
  const resultStatus = paymentResult.value?.status
  const isSuccess = resultStatus === 'success'

  return {
    closeLabel: checkoutContent.value.result.closeLabel,
    iconAlt: checkoutContent.value.result.iconAlt,
    titlePrefix: checkoutContent.value.result.titlePrefix,
    titleHighlight: isSuccess
      ? checkoutContent.value.result.successTitleHighlight
      : checkoutContent.value.result.failureTitleHighlight,
    description: isSuccess
      ? checkoutContent.value.result.successDescription
      : checkoutContent.value.result.failureDescription,
    orderNumber: checkoutContent.value.result.orderNumber,
    membershipType: checkoutContent.value.result.membershipType,
    expiry: checkoutContent.value.result.expiry,
    orderStatus: checkoutContent.value.result.orderStatus,
    status: isSuccess
      ? checkoutContent.value.result.successStatus
      : checkoutContent.value.result.failureStatus,
    primaryAction: isSuccess
      ? checkoutContent.value.result.successPrimaryAction
      : checkoutContent.value.result.failurePrimaryAction,
    secondaryAction: isSuccess
      ? checkoutContent.value.result.successSecondaryAction
      : checkoutContent.value.result.failureSecondaryAction,
    copyOrderNumber: checkoutContent.value.result.copyOrderNumber,
    copied: checkoutContent.value.result.copied,
    emptyValue: checkoutContent.value.result.emptyValue,
  }
})

const paymentFeedbackIcon = computed(() => {
  if (paymentFeedbackType.value === 'success') {
    return 'lucide:circle-check'
  }

  return paymentFeedbackType.value === 'error'
    ? 'lucide:circle-alert'
    : 'lucide:info'
})

const setPaymentFeedback = (message, type = 'info') => {
  paymentFeedback.value = normalizeCheckoutValue(message)
  paymentFeedbackType.value = type
}

const showPaymentResult = (status, orderNo = '') => {
  paymentResultCopied.value = false
  paymentResult.value = {
    status,
    image: status === 'success'
      ? '/images/checkout/payment-success.png'
      : '/images/checkout/payment-failure.png',
    orderNo: normalizeCheckoutValue(orderNo),
    planName: normalizeCheckoutValue(currentPlan.value.name || currentPlan.value.type),
    expiry: status === 'success' ? normalizeCheckoutValue(authUser.value?.vip_endtime) : '',
  }
}

const dismissPaymentResult = () => {
  paymentResult.value = null
  paymentResultCopied.value = false
}

const copyPaymentOrderNumber = async () => {
  const orderNo = normalizeCheckoutValue(paymentResult.value?.orderNo)

  if (!orderNo || !process.client) {
    return
  }

  try {
    await navigator.clipboard.writeText(orderNo)
    paymentResultCopied.value = true
    window.setTimeout(() => {
      paymentResultCopied.value = false
    }, 1600)
  } catch {
    const textArea = document.createElement('textarea')
    textArea.value = orderNo
    textArea.setAttribute('readonly', '')
    textArea.style.position = 'fixed'
    textArea.style.opacity = '0'
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    textArea.remove()
    paymentResultCopied.value = true
  }
}

const goToMembershipCenter = () => {
  profileTabCookie.value = 'membership'
  dismissPaymentResult()
  router.push(localePath('/profile'))
}

const retryPayment = () => {
  dismissPaymentResult()
  setPaymentFeedback('', 'info')
}

// 后端只认固定的三个 product_id，套餐类型和 URL 上带的 productId 都归一到这里。
const paypalProductId = computed(() => {
  return resolvePaypalProductId(currentPlan.value.type) ||
    resolvePaypalProductId(currentPlan.value.id)
})

const extractPaypalApprovalUrl = (response) => {
  const candidates = [
    response?.data?.paypalLinks?.href,
    response?.data?.paypalLinks?.url,
    response?.data?.paypal_links?.href,
    response?.data?.paypal_links?.url,
    response?.paypalLinks?.href,
    response?.paypalLinks?.url,
  ]

  return candidates.map(value => normalizeCheckoutValue(value)).find(Boolean) || ''
}

const extractOutTradeNo = (response) => {
  const candidates = [
    response?.data?.outTradeNo,
    response?.data?.out_trade_no,
    response?.outTradeNo,
    response?.out_trade_no,
  ]

  return candidates.map(value => normalizeCheckoutValue(value)).find(Boolean) || ''
}

const PAYPAL_PENDING_ORDER_KEY = 'vicast_paypal_pending_order'
const PAYPAL_PENDING_ORDER_TTL = 15 * 60 * 1000
const PAYPAL_POLLING_DURATION = PAYPAL_PENDING_ORDER_TTL
const FAILED_STATUSES = new Set(['FAILED', 'FAILURE', 'CANCELLED', 'CANCELED', 'EXPIRED', 'VOIDED', 'DENIED'])

const resolvePaypalOrderState = (response) => {
  const status = normalizeCheckoutValue(
    response?.data?.status ||
    response?.data?.data?.status ||
    response?.data?.result?.status ||
    response?.result?.status ||
    response?.status ||
    response?.data?.orderStatus ||
    response?.data?.order_status
  ).toUpperCase()

  if (status === 'COMPLETED') {
    return 'paid'
  }

  if (status === 'CLOSED') {
    return 'failed'
  }

  if (FAILED_STATUSES.has(status)) {
    return 'failed'
  }

  return 'pending'
}

const clearPendingPaypalOrder = () => {
  if (process.client) {
    window.sessionStorage.removeItem(PAYPAL_PENDING_ORDER_KEY)
  }
}

const getPendingPaypalOrder = () => {
  if (!process.client) {
    return null
  }

  try {
    const order = JSON.parse(window.sessionStorage.getItem(PAYPAL_PENDING_ORDER_KEY) || '')
    const outTradeNo = normalizeCheckoutValue(order?.outTradeNo)
    const userId = normalizeCheckoutValue(order?.userId)
    const currentUserId = normalizeCheckoutValue(authUser.value?.user_id)
    const expiresAt = Number(order?.expiresAt)

    if (!outTradeNo || !userId || userId !== currentUserId || !expiresAt || expiresAt <= Date.now()) {
      clearPendingPaypalOrder()
      return null
    }

    return {
      outTradeNo,
      userId,
      productId: normalizeCheckoutValue(order?.productId),
      createdAt: Number(order?.createdAt) || 0,
      expiresAt,
    }
  } catch {
    clearPendingPaypalOrder()
    return null
  }
}

const savePendingPaypalOrder = (outTradeNo) => {
  if (!process.client || !outTradeNo) {
    return null
  }

  const createdAt = Date.now()
  const order = {
    outTradeNo,
    userId: normalizeCheckoutValue(authUser.value?.user_id),
    productId: paypalProductId.value,
    createdAt,
    expiresAt: createdAt + PAYPAL_PENDING_ORDER_TTL,
  }

  window.sessionStorage.setItem(PAYPAL_PENDING_ORDER_KEY, JSON.stringify(order))
  return order
}

const isPaypalRedirecting = ref(false)
const isPaypalStatusChecking = ref(false)
const pendingOutTradeNo = ref('')
const hasPendingPaypalOrder = computed(() => Boolean(pendingOutTradeNo.value))
const paypalButtonText = computed(() => {
  if (isPaypalRedirecting.value) {
    return paymentText.value.buttonCreating
  }

  return hasPendingPaypalOrder.value
    ? paymentText.value.buttonPending
    : paymentText.value.buttonPay
})
let paypalPopup = null
let paypalPopupTimer = null
let paypalStatusTimer = null
let paypalPollingTimeout = null
let paypalPendingOrderExpiryTimer = null
const paypalDelayedChecks = new Set()

const clearPaypalPopupTimer = () => {
  if (paypalPopupTimer) {
    window.clearInterval(paypalPopupTimer)
    paypalPopupTimer = null
  }
}

const clearPaypalStatusTimer = () => {
  if (paypalStatusTimer) {
    window.clearInterval(paypalStatusTimer)
    paypalStatusTimer = null
  }

  if (paypalPollingTimeout) {
    window.clearTimeout(paypalPollingTimeout)
    paypalPollingTimeout = null
  }
}

const clearPaypalDelayedChecks = () => {
  paypalDelayedChecks.forEach(timer => window.clearTimeout(timer))
  paypalDelayedChecks.clear()
}

const clearPaypalPendingOrderExpiryTimer = () => {
  if (paypalPendingOrderExpiryTimer) {
    window.clearTimeout(paypalPendingOrderExpiryTimer)
    paypalPendingOrderExpiryTimer = null
  }
}

const schedulePendingOrderExpiry = (expiresAt) => {
  clearPaypalPendingOrderExpiryTimer()
  paypalPendingOrderExpiryTimer = window.setTimeout(() => {
    if (pendingOutTradeNo.value) {
      finishPaypalPayment(paymentText.value.orderExpired, 'error', { clearOrder: true })
    }
  }, Math.max(0, Number(expiresAt) - Date.now()))
}

const schedulePaypalCheck = (callback, delay) => {
  const timer = window.setTimeout(() => {
    paypalDelayedChecks.delete(timer)
    callback()
  }, delay)

  paypalDelayedChecks.add(timer)
  return timer
}

const closePaypalPopup = () => {
  if (paypalPopup && !paypalPopup.closed) {
    paypalPopup.close()
  }

  paypalPopup = null
  clearPaypalPopupTimer()
}

const finishPaypalPayment = async (message, type, { clearOrder = false } = {}) => {
  const resultOrderNo = pendingOutTradeNo.value
  clearPaypalStatusTimer()
  clearPaypalDelayedChecks()
  isPaypalRedirecting.value = false
  setPaymentFeedback(message, type)

  if (clearOrder) {
    clearPaypalPendingOrderExpiryTimer()
    pendingOutTradeNo.value = ''
    clearPendingPaypalOrder()
    closePaypalPopup()
  }

  if (type === 'success') {
    await refreshVipInfo().catch(() => null)
  }

  isPaymentResultChecking.value = false

  if (type === 'success' || type === 'error') {
    showPaymentResult(type, resultOrderNo)
  }
}

const checkPaypalOrderStatus = async ({ showError = false, showPending = false } = {}) => {
  const outTradeNo = pendingOutTradeNo.value

  if (!outTradeNo) {
    return 'pending'
  }

  if (isPaypalStatusChecking.value) {
    return 'checking'
  }

  isPaypalStatusChecking.value = true

  try {
    const response = await getPaypalOrderStatus({ out_trade_no: outTradeNo })

    if (pendingOutTradeNo.value !== outTradeNo) {
      return 'stale'
    }

    const state = resolvePaypalOrderState(response)

    if (state === 'paid') {
      await finishPaypalPayment(paymentText.value.orderSuccess, 'success', { clearOrder: true })
    } else if (state === 'failed') {
      await finishPaypalPayment(paymentText.value.orderFailed, 'error', { clearOrder: true })
    } else if (showPending && pendingOutTradeNo.value === outTradeNo) {
      setPaymentFeedback(paymentText.value.orderPending, 'info')
    }

    return state
  } catch {
    if (showError) {
      showErrorToast(paymentText.value.statusQueryFailed)
    }
    return 'pending'
  } finally {
    isPaypalStatusChecking.value = false
  }
}

const startPaypalStatusPolling = () => {
  clearPaypalStatusTimer()
  checkPaypalOrderStatus()
  paypalStatusTimer = window.setInterval(checkPaypalOrderStatus, 2000)
  paypalPollingTimeout = window.setTimeout(() => {
    clearPaypalStatusTimer()
    isPaypalRedirecting.value = false

    if (pendingOutTradeNo.value) {
      setPaymentFeedback(paymentText.value.orderProcessing, 'info')
    }
  }, PAYPAL_POLLING_DURATION)
}

const checkPaypalOrderAfterPopupClosed = async (attempt = 1) => {
  const state = await checkPaypalOrderStatus()

  if ((state !== 'pending' && state !== 'checking') || !pendingOutTradeNo.value) {
    return
  }

  if (attempt >= 4) {
    if (pendingOutTradeNo.value) {
      await finishPaypalPayment(paymentText.value.popupClosedFailed, 'error', { clearOrder: true })
    }
    return
  }

  schedulePaypalCheck(() => checkPaypalOrderAfterPopupClosed(attempt + 1), 1000)
}

const openPaypalPopup = () => {
  const width = Math.min(520, window.screen.availWidth)
  const height = Math.min(720, window.screen.availHeight)
  const left = Math.max(0, Math.round(window.screenX + (window.outerWidth - width) / 2))
  const top = Math.max(0, Math.round(window.screenY + (window.outerHeight - height) / 2))
  const features = [
    'popup=yes',
    `width=${width}`,
    `height=${height}`,
    `left=${left}`,
    `top=${top}`,
    'resizable=yes',
    'scrollbars=yes',
  ].join(',')

  return window.open('', 'vicast-paypal-checkout', features)
}

const redirectToPaypal = async () => {
  if (isPaypalRedirecting.value || hasPendingPaypalOrder.value) {
    return
  }

  if (!isCheckoutSignedIn.value) {
    await router.push(localePath('/login'))
    return
  }

  if (!paypalProductId.value) {
    setPaymentFeedback(paymentText.value.invalidPlan, 'error')
    return
  }

  paypalPopup = openPaypalPopup()

  if (!paypalPopup) {
    setPaymentFeedback(paymentText.value.popupBlocked, 'error')
    return
  }

  isPaypalRedirecting.value = true
  setPaymentFeedback(paymentText.value.orderCreating, 'info')

  try {
    const response = await createPaypalOrder({
      user_id: authUser.value?.user_id,
      product_id: paypalProductId.value,
    })
    const responseCode = Number(response?.code || response?.data?.code)
    const approvalUrl = extractPaypalApprovalUrl(response)
    const outTradeNo = extractOutTradeNo(response)

    if (responseCode && responseCode !== 200001) {
      throw new Error(response?.message || 'paypalOrderCreateFailed')
    }

    if (!approvalUrl) {
      throw new Error('missingPaypalApprovalUrl')
    }

    if (!outTradeNo) {
      throw new Error('missingOutTradeNo')
    }

    const pendingOrder = savePendingPaypalOrder(outTradeNo)
    pendingOutTradeNo.value = outTradeNo
    schedulePendingOrderExpiry(pendingOrder.expiresAt)

    paypalPopup.location.replace(approvalUrl)
    paypalPopup.focus()
    isPaypalRedirecting.value = false
    setPaymentFeedback(paymentText.value.popupOpened, 'info')
    startPaypalStatusPolling()

    clearPaypalPopupTimer()
    paypalPopupTimer = window.setInterval(() => {
      if (paypalPopup?.closed) {
        clearPaypalPopupTimer()
        paypalPopup = null
        clearPaypalStatusTimer()
        isPaymentResultChecking.value = true
        setPaymentFeedback(paymentText.value.popupClosedChecking, 'info')
        schedulePaypalCheck(() => checkPaypalOrderAfterPopupClosed(), 250)
      }
    }, 500)
  } catch {
    if (paypalPopup && !paypalPopup.closed) {
      paypalPopup.close()
    }

    paypalPopup = null
    isPaypalRedirecting.value = false
    setPaymentFeedback(paymentText.value.orderCreateFailed, 'error')
    showErrorToast(paymentText.value.orderCreateFailed)
  }
}

onMounted(async () => {
  checkoutSelection.value = loadCheckoutSelection() || {}

  if (!paypalProductId.value) {
    await router.replace({ path: localePath('/'), hash: '#home-pricing' })
    return
  }

  isCheckoutSelectionReady.value = true
  const pendingOrder = getPendingPaypalOrder()
  pendingOutTradeNo.value = pendingOrder?.outTradeNo || ''

  if (pendingOutTradeNo.value) {
    schedulePendingOrderExpiry(pendingOrder.expiresAt)
    isPaymentResultChecking.value = true
    schedulePaypalCheck(() => checkPaypalOrderAfterPopupClosed(), 500)
  }
})

onBeforeUnmount(() => {
  clearPaypalPopupTimer()
  clearPaypalStatusTimer()
  clearPaypalDelayedChecks()
  clearPaypalPendingOrderExpiryTimer()
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

.checkout-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.checkout-panel-header h1,
.checkout-summary-panel h2 {
  color: var(--checkout-text);
  font-size: 20px;
  font-weight: 800;
  line-height: 28px;
}

.checkout-secure-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  border: 1px solid var(--checkout-message-border);
  border-radius: 999px;
  color: var(--checkout-accent);
  background: var(--checkout-icon-background);
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;
}

.checkout-secure-badge :deep(svg) {
  width: 13px;
  height: 13px;
}

.checkout-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
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

.checkout-method-list {
  display: grid;
  gap: 10px;
}

.checkout-method {
  position: relative;
  min-width: 0;
  display: grid;
  grid-template-columns: 18px minmax(0, 1fr);
  align-items: center;
  gap: 12px;
  padding: 14px;
  border: 1px solid var(--checkout-border);
  border-radius: 8px;
  background: var(--checkout-control);
  cursor: pointer;
  transition: border-color 0.2s ease, background 0.2s ease;
}

.checkout-method.is-active {
  border-color: color-mix(in srgb, var(--checkout-accent) 52%, var(--checkout-border));
  background: var(--checkout-panel-soft);
}

.checkout-method input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.checkout-method-mark {
  width: 18px;
  height: 18px;
  border: 2px solid var(--checkout-radio-border, #4b5d78);
  border-radius: 50%;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.checkout-method.is-active .checkout-method-mark {
  border-color: var(--checkout-accent);
  box-shadow: inset 0 0 0 4px var(--checkout-accent);
}

.checkout-method input:focus-visible + .checkout-method-mark {
  outline: 2px solid var(--checkout-focus);
  outline-offset: 2px;
}

.checkout-method-body {
  min-width: 0;
  display: grid;
  gap: 4px;
}

.checkout-paypal-logo {
  display: inline-flex;
  align-items: baseline;
  font-family: Verdana, Geneva, sans-serif;
  font-size: 17px;
  font-weight: 700;
  font-style: italic;
  line-height: 1;
  letter-spacing: -0.4px;
}

.checkout-paypal-logo i:first-child {
  color: #009cde;
}

.checkout-paypal-logo i:last-child {
  color: #012169;
}

:root[data-theme="dark"] .checkout-paypal-logo i:last-child,
.checkout-page .checkout-paypal-logo i:last-child {
  color: #4a90d9;
}

:root[data-theme="light"] .checkout-page .checkout-paypal-logo i:last-child {
  color: #012169;
}

.checkout-method-copy {
  min-width: 0;
  color: var(--checkout-muted);
  font-size: 12px;
  line-height: 17px;
  overflow-wrap: anywhere;
}

.checkout-account-row {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  padding: 11px 12px;
  border: 1px solid var(--checkout-border);
  border-radius: 7px;
  background: var(--checkout-control);
  font-size: 12px;
  line-height: 18px;
}

.checkout-account-row :deep(svg) {
  width: 15px;
  height: 15px;
  flex: 0 0 auto;
  color: var(--checkout-accent);
}

.checkout-account-row span {
  color: var(--checkout-muted);
}

.checkout-account-row strong {
  min-width: 0;
  color: var(--checkout-text);
  font-weight: 700;
  overflow-wrap: anywhere;
}

.checkout-paypal-official {
  min-width: 0;
  display: grid;
  gap: 10px;
}

.checkout-paypal-redirect-button {
  width: 100%;
  min-height: 45px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 16px;
  border: 0;
  border-radius: 4px;
  color: #012169;
  background: #ffc439;
  font-family: Verdana, Geneva, sans-serif;
  font-size: 16px;
  font-style: italic;
  font-weight: 800;
  line-height: 1;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.checkout-paypal-redirect-button:hover,
.checkout-paypal-redirect-button:focus-visible {
  background: #ffb900;
  transform: translateY(-1px);
}

.checkout-paypal-redirect-button:disabled {
  cursor: wait;
  opacity: 0.72;
  transform: none;
}

.checkout-paypal-redirect-button :deep(svg) {
  width: 17px;
  height: 17px;
  animation: checkout-spin 0.9s linear infinite;
}

@keyframes checkout-spin {
  to {
    transform: rotate(360deg);
  }
}

.checkout-signin-notice {
  min-width: 0;
  display: grid;
  grid-template-columns: 18px minmax(0, 1fr);
  align-items: start;
  gap: 10px;
  padding: 14px;
  border: 1px solid var(--checkout-message-border);
  border-radius: 7px;
  background: var(--checkout-panel-soft);
}

.checkout-signin-notice :deep(svg) {
  width: 18px;
  height: 18px;
  color: var(--checkout-accent);
}

.checkout-signin-notice p {
  color: var(--checkout-muted-strong);
  font-size: 13px;
  line-height: 19px;
}

.checkout-signin-link {
  display: inline-flex;
  margin-top: 8px;
  color: var(--checkout-accent);
  font-size: 13px;
  font-weight: 700;
  line-height: 1;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.checkout-trust-list {
  display: grid;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.checkout-trust-list li {
  min-width: 0;
  display: grid;
  grid-template-columns: 15px minmax(0, 1fr);
  align-items: center;
  gap: 9px;
  color: var(--checkout-muted-strong);
  font-size: 12px;
  line-height: 18px;
}

.checkout-trust-list :deep(svg) {
  width: 15px;
  height: 15px;
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

.checkout-provider-feedback.is-success {
  border-color: color-mix(in srgb, #22c55e 44%, var(--checkout-border));
}

.checkout-provider-feedback.is-success :deep(svg) {
  color: #22c55e;
}

.checkout-provider-feedback.is-error {
  border-color: color-mix(in srgb, #ef4444 44%, var(--checkout-border));
}

.checkout-provider-feedback.is-error :deep(svg) {
  color: #ef4444;
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

.checkout-summary-hint {
  min-width: 0;
  display: grid;
  grid-template-columns: 16px minmax(0, 1fr);
  align-items: center;
  gap: 8px;
  margin-top: 18px;
  color: var(--checkout-muted);
  font-size: 12px;
  line-height: 18px;
}

.checkout-summary-hint :deep(svg) {
  width: 16px;
  height: 16px;
  color: var(--checkout-accent);
}

.checkout-summary-hint span {
  min-width: 0;
  overflow-wrap: anywhere;
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

.checkout-result-loading {
  position: fixed;
  inset: 0;
  z-index: 1150;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(2, 8, 18, 0.72);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.checkout-result-loading-card {
  min-width: 190px;
  height: 56px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 0 20px;
  border: 1px solid #244363;
  border-radius: 8px;
  color: #f7fbff;
  background: #0b1b32;
  box-shadow: 0 18px 42px rgba(0, 0, 0, 0.38);
  font-size: 14px;
  line-height: 20px;
}

.checkout-result-loading-spinner {
  width: 18px;
  height: 18px;
  flex: 0 0 auto;
  border: 2px solid rgba(148, 163, 184, 0.32);
  border-top-color: #38bdf8;
  border-radius: 50%;
  animation: checkout-result-loading-spin 0.78s linear infinite;
}

@keyframes checkout-result-loading-spin {
  to {
    transform: rotate(360deg);
  }
}

.checkout-result-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1200;
  display: grid;
  place-items: center;
  padding: 20px;
  overflow-y: auto;
  background: rgba(2, 8, 18, 0.76);
  backdrop-filter: blur(4px);
}

.checkout-result-modal {
  --checkout-result-accent: #2fd07f;
  --checkout-result-status-background: rgba(47, 208, 127, 0.72);
  position: relative;
  width: min(456px, calc(100vw - 32px));
  min-height: 478px;
  padding: 24px 26px 25px;
  border: 1px solid #244363;
  border-radius: 14px;
  color: #f7fbff;
  background: #0b1b32;
  box-shadow: 0 26px 70px rgba(0, 0, 0, 0.46);
  text-align: center;
}

.checkout-result-modal.is-error {
  --checkout-result-accent: #ff5263;
  --checkout-result-status-background: rgba(204, 67, 82, 0.72);
}

.checkout-result-close {
  position: absolute;
  top: 13px;
  right: 13px;
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  color: #8493a8;
  cursor: pointer;
  transition: color 0.18s ease, background-color 0.18s ease;
}

.checkout-result-close:hover,
.checkout-result-close:focus-visible {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.08);
}

.checkout-result-close :deep(svg) {
  width: 18px;
  height: 18px;
}

.checkout-result-icon {
  width: 88px;
  height: 88px;
  display: block;
  margin: 0 auto 4px;
  object-fit: contain;
}

.checkout-result-modal h2 {
  margin: 0;
  color: #f8fbff;
  font-size: 25px;
  font-weight: 800;
  line-height: 34px;
  letter-spacing: 0;
}

.checkout-result-modal h2 span {
  color: var(--checkout-result-accent);
}

.checkout-result-description {
  margin-top: 7px;
  color: #8290a5;
  font-size: 13px;
  line-height: 20px;
}

.checkout-result-details {
  width: 100%;
  margin-top: 23px;
  padding: 0 20px;
  border: 1px solid #233b58;
  border-radius: 10px;
  background: #12223a;
}

.checkout-result-row {
  min-height: 42px;
  display: grid;
  grid-template-columns: minmax(112px, 0.8fr) minmax(0, 1.2fr);
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid rgba(48, 72, 101, 0.5);
}

.checkout-result-row:last-child {
  border-bottom: 0;
}

.checkout-result-row dt {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #8290a5;
  font-size: 13px;
  line-height: 20px;
  text-align: left;
}

.checkout-result-row dt :deep(svg) {
  width: 17px;
  height: 17px;
  flex: 0 0 auto;
}

.checkout-result-row dd {
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 7px;
  color: #edf4fd;
  font-size: 13px;
  line-height: 20px;
  text-align: right;
}

.checkout-result-row dd > span:not(.checkout-result-status) {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.checkout-result-copy {
  width: 26px;
  height: 26px;
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  color: #16c9ec;
  background: rgba(22, 201, 236, 0.12);
  cursor: pointer;
}

.checkout-result-copy:hover,
.checkout-result-copy:focus-visible {
  background: rgba(22, 201, 236, 0.22);
}

.checkout-result-copy :deep(svg) {
  width: 15px;
  height: 15px;
}

.checkout-result-status {
  min-width: 58px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 11px;
  border-radius: 999px;
  color: #50e59b;
  background: var(--checkout-result-status-background);
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
}

.checkout-result-modal.is-error .checkout-result-status {
  color: #ff7180;
}

.checkout-result-actions {
  display: grid;
  justify-items: center;
  gap: 11px;
  margin-top: 23px;
}

.checkout-result-primary {
  width: min(246px, 100%);
  height: 42px;
  border-radius: 9px;
  color: #ffffff;
  background: linear-gradient(90deg, #11b7d8 0%, #2871ed 100%);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: filter 0.18s ease, transform 0.18s ease;
}

.checkout-result-primary:hover,
.checkout-result-primary:focus-visible {
  filter: brightness(1.08);
  transform: translateY(-1px);
}

.checkout-result-secondary {
  height: 26px;
  padding: 0 10px;
  color: #8290a5;
  font-size: 13px;
  cursor: pointer;
}

.checkout-result-secondary:hover,
.checkout-result-secondary:focus-visible {
  color: #c6d2e2;
}

:root[data-theme="light"] .checkout-result-modal {
  border-color: #cbd9e8;
  color: #13243a;
  background: #ffffff;
  box-shadow: 0 24px 64px rgba(15, 23, 42, 0.22);
}

:root[data-theme="light"] .checkout-result-modal h2 {
  color: #102238;
}

:root[data-theme="light"] .checkout-result-description,
:root[data-theme="light"] .checkout-result-row dt,
:root[data-theme="light"] .checkout-result-secondary {
  color: #65758a;
}

:root[data-theme="light"] .checkout-result-details {
  border-color: #d9e4ef;
  background: #f4f8fc;
}

:root[data-theme="light"] .checkout-result-row {
  border-color: #dfe8f1;
}

:root[data-theme="light"] .checkout-result-row dd {
  color: #1d2e43;
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

  /* 窄屏摘要堆到支付区下方，向左指的引导箭头失去意义。 */
  .checkout-summary-hint {
    display: none;
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

  .checkout-result-backdrop {
    align-items: start;
    padding: 14px 8px;
  }

  .checkout-result-modal {
    width: min(456px, calc(100vw - 16px));
    min-height: 0;
    padding: 22px 18px 23px;
  }

  .checkout-result-details {
    padding: 0 14px;
  }

  .checkout-result-row {
    grid-template-columns: minmax(96px, 0.8fr) minmax(0, 1.2fr);
    gap: 8px;
  }

}
</style>
