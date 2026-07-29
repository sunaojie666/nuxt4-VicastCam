<template>
  <section class="profile-content" :aria-label="purchaseText.ariaLabel">
    <section class="profile-panel purchase-history-panel">
      <header class="profile-panel-heading">
        <span class="purchase-heading-icon">
          <Icon name="lucide:clipboard-list" aria-hidden="true" />
        </span>
        <h2>{{ purchaseText.title }}</h2>
      </header>

      <div class="purchase-tabs">
        <button
          type="button"
          :class="['purchase-tab', { 'purchase-tab-active': activeRecordTab === 'purchase' }]"
          @click="activeRecordTab = 'purchase'"
        >
          <span>{{ purchaseText.tabTitle }}</span>
          <strong>{{ purchaseCount }}</strong>
        </button>
        <button
          type="button"
          :class="['purchase-tab', { 'purchase-tab-active': activeRecordTab === 'exchange' }]"
          @click="activeRecordTab = 'exchange'"
        >
          <span>{{ purchaseText.exchangeTabTitle }}</span>
          <strong>{{ exchangeCount }}</strong>
        </button>
      </div>

      <div class="purchase-table-wrap">
        <table class="purchase-table">
          <thead>
            <tr>
              <th>{{ tableHeaderText.title }}</th>
              <th>{{ dateHeaderLabel }}</th>
              <th>{{ priceHeaderLabel }}</th>
              <th v-if="!isExchangeTab">{{ paymentMethodHeaderLabel }}</th>
              <th v-if="!isExchangeTab">{{ tableHeaderText.status }}</th>
            </tr>
          </thead>
          <tbody v-if="currentRecords.length">
            <tr v-for="record in currentRecords" :key="record.id">
              <td>
                <span class="purchase-record-title">
                  <span>{{ record.title }}</span>
                </span>
              </td>
              <td>{{ record.date }}</td>
              <td class="purchase-record-price">
                <span v-if="record.hasPrice" class="purchase-record-price-value">
                  <span class="purchase-record-price-amount">{{ record.priceAmount }}</span>
                  <span v-if="record.priceCurrency" class="purchase-record-price-currency">{{ record.priceCurrency }}</span>
                </span>
                <span v-else-if="isExchangeTab" class="purchase-record-secret">
                  <span>{{ getExchangeRecordSecretText(record) }}</span>
                  <button
                    v-if="record.hasSecret"
                    type="button"
                    class="purchase-record-secret-toggle"
                    :aria-label="isExchangeRecordSecretVisible(record) ? secretLabelText.hide : secretLabelText.show"
                    @click="toggleExchangeRecordSecret(record)"
                  >
                    <Icon :name="isExchangeRecordSecretVisible(record) ? 'lucide:eye-off' : 'lucide:eye'" aria-hidden="true" />
                  </button>
                </span>
                <span v-else>{{ record.priceDisplay }}</span>
              </td>
              <td v-if="!isExchangeTab">{{ record.paymentMethod }}</td>
              <td v-if="!isExchangeTab">
                <span :class="['purchase-record-status', record.statusClass]">{{ record.status }}</span>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td :colspan="emptyColumnSpan" class="purchase-empty-cell">
                {{ emptyMessage }}
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="isLoading" class="purchase-table-loading" aria-hidden="true">
          <span class="purchase-table-loading-spinner"></span>
        </div>
      </div>

      <div v-if="currentRecords.length" class="purchase-pagination" :aria-label="commonText.paginationLabel">
        <button
          type="button"
          class="purchase-page-arrow"
          :aria-label="commonText.previousPageLabel"
          :disabled="currentPage <= 1 || isLoading"
          @click="goToPage(currentPage - 1)"
        >
          <Icon name="lucide:chevron-left" aria-hidden="true" />
        </button>

        <button
          v-for="page in pages"
          :key="page"
          type="button"
          :class="['purchase-page-button', { 'purchase-page-button-active': currentPage === page }]"
          :disabled="isLoading"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>

        <button
          type="button"
          class="purchase-page-arrow"
          :aria-label="commonText.nextPageLabel"
          :disabled="currentPage >= totalPages || isLoading"
          @click="goToPage(currentPage + 1)"
        >
          <Icon name="lucide:chevron-right" aria-hidden="true" />
        </button>

        <ProfilePaginationJump
          :current-page="currentPage"
          :max-page="totalPages"
          :disabled="isLoading"
          @jump="goToPage"
        />
      </div>
    </section>
  </section>
</template>

<script setup>
import { getActivatedCardList, getBuyRecords } from '../../../api/request/auth'

const currentPage = ref(1)
const activeRecordTab = ref('purchase')
const pageSize = 10
const purchaseTotal = ref(0)
const exchangeTotal = ref(0)
const isLoading = ref(false)
const purchaseRawRecords = ref([])
const exchangeRawRecords = ref([])
const visibleExchangeRecordSecrets = ref(new Set())
const { authUser } = useAuth()
const { profileBox } = useProfileText()
const commonText = computed(() => profileBox.value?.common || {})
const purchaseText = computed(() => profileBox.value?.purchaseHistory || {})
const tableHeaderText = computed(() => purchaseText.value.tableHeaders || {})
const cardTypeText = computed(() => purchaseText.value.cardTypes || purchaseText.value.cardTypeLabels || {})
const orderStatusText = computed(() => purchaseText.value.orderStatuses || purchaseText.value.orderStatus || {})
const paymentMethodText = computed(() => purchaseText.value.paymentMethods || purchaseText.value.paymentMethodLabels || {})
const secretLabelText = computed(() => purchaseText.value.secretLabels || {})
const emptyText = computed(() => purchaseText.value.emptyText || '')
const exchangeEmptyText = computed(() => purchaseText.value.exchangeEmptyText || '')
const isExchangeTab = computed(() => activeRecordTab.value === 'exchange')
const emptyMessage = computed(() => {
  if (isLoading.value) {
    return ''
  }

  return isExchangeTab.value ? exchangeEmptyText.value : emptyText.value
})
const emptyValue = computed(() => purchaseText.value.emptyValue || '')
const purchaseCount = computed(() => purchaseTotal.value)
const exchangeCount = computed(() => exchangeTotal.value)
const emptyColumnSpan = computed(() => isExchangeTab.value ? 3 : 5)
const dateHeaderLabel = computed(() => {
  if (!isExchangeTab.value) {
    return tableHeaderText.value.date || ''
  }

  return purchaseText.value.exchangeTableHeaders?.date
    || tableHeaderText.value.exchangeDate
    || purchaseText.value.exchangeDateHeader
    || ''
})
const priceHeaderLabel = computed(() => {
  if (!isExchangeTab.value) {
    return tableHeaderText.value.price || ''
  }

  return purchaseText.value.exchangeTableHeaders?.code
    || tableHeaderText.value.exchangeCode
    || purchaseText.value.exchangeCodeHeader
    || ''
})
const paymentMethodHeaderLabel = computed(() => {
  return tableHeaderText.value.paymentMethod
    || tableHeaderText.value.payMethod
    || ''
})

const activeTotal = computed(() => isExchangeTab.value ? exchangeTotal.value : purchaseTotal.value)
const totalPages = computed(() => Math.max(1, Math.ceil(activeTotal.value / pageSize)))
const pages = computed(() => {
  const pageWindowSize = 5
  const halfWindow = Math.floor(pageWindowSize / 2)
  const startPage = Math.max(1, Math.min(currentPage.value - halfWindow, totalPages.value - pageWindowSize + 1))
  const endPage = Math.min(totalPages.value, startPage + pageWindowSize - 1)

  return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index)
})

const currentRecords = computed(() => {
  if (isExchangeTab.value) {
    return normalizeExchangeRecords(exchangeRawRecords.value)
  }

  return normalizeBuyRecords(purchaseRawRecords.value)
})

const pickRecordValue = (...values) => {
  return values.find(value => value !== undefined && value !== null && value !== '')
}

const createRecordText = (...values) => {
  const value = pickRecordValue(...values)

  return value === undefined ? '' : String(value)
}

const createPriceValue = (record = {}, ...amountValues) => {
  const amount = createRecordText(...amountValues)
  const currency = createRecordText(record.currency)

  return {
    hasPrice: Boolean(amount),
    priceAmount: amount,
    priceCurrency: currency,
    priceDisplay: `${amount}${currency}`,
  }
}

const createRecordStatus = (record = {}) => {
  const statusValue = pickRecordValue(record.status, record.order_status, record.orderStatus)
  const status = Number(statusValue)
  const statusMap = {
    0: {
      text: orderStatusText.value.pending || '',
      className: 'record-status-pending',
    },
    1: {
      text: orderStatusText.value.paid || '',
      className: 'record-status-paid',
    },
    2: {
      text: orderStatusText.value.closed || '',
      className: 'record-status-closed',
    },
    3: {
      text: orderStatusText.value.refunded || '',
      className: 'record-status-refunded',
    },
  }

  if (statusMap[status]) {
    return statusMap[status]
  }

  return {
    text: statusValue === undefined ? emptyValue.value : String(statusValue),
    className: 'record-status-unknown',
  }
}

const createCardTypeTitle = (value) => {
  const cardType = createRecordText(value).toUpperCase()

  if (cardType === 'M') {
    return cardTypeText.value.month || ''
  }

  if (cardType === 'N') {
    return cardTypeText.value.year || ''
  }

  if (cardType === 'Y') {
    return cardTypeText.value.life || ''
  }

  if (cardType === 'L') {
    return cardTypeText.value.life || ''
  }

  return ''
}

const createRecordTitle = (record = {}) => {
  const cardType = createRecordText(record.card_type, record.cardType, record.vip_type, record.vipType)
  const cardTitle = createCardTypeTitle(cardType)

  return cardTitle || cardType || ''
}

const createExchangeRecordTitle = (record = {}) => {
  const cardType = createRecordText(record.card_type, record.cardType)
  const cardTitle = createCardTypeTitle(cardType)

  return cardTitle || cardType || createRecordTitle(record)
}

const normalizeLookupKey = (value) => {
  return String(value || '').trim().toLowerCase().replace(/[\s_-]+/g, '')
}

const translatePaymentMethod = (...values) => {
  const rawValue = createRecordText(...values)

  if (!rawValue) {
    return emptyValue.value
  }

  const lookupKey = normalizeLookupKey(rawValue)
  return paymentMethodText.value[lookupKey] || paymentMethodText.value[rawValue] || rawValue
}

const normalizeBuyRecords = (list = []) => {
  return list.map((record, index) => {
    const status = createRecordStatus(record)
    const price = createRecordText(record.total_amount)

    return {
      id: createRecordText(record.id, record.out_trade_no, record.trade_no, `buy-record-${index}`),
      title: createRecordTitle(record),
      date: createRecordText(record.pay_time),
      ...createPriceValue(record, price),
      paymentMethod: translatePaymentMethod(record.pay_method, record.payMethod),
      status: status.text,
      statusClass: status.className,
    }
  })
}

const normalizeExchangeRecords = (list = []) => {
  return list.map((record, index) => {
    const cardCode = createRecordText(
      record.password,
      record.card_no,
      record.cardNo,
      record.card_pwd,
      record.cardPwd,
      record.card_id,
      record.cardId,
      record.code,
      ''
    )
    return {
      id: createRecordText(record.id, record.card_no, record.card_pwd, record.card_id, `exchange-record-${index}`),
      title: createExchangeRecordTitle(record),
      date: createRecordText(record.active_time, record.activate_time, record.activated_at, record.create_time),
      hasPrice: false,
      priceAmount: '',
      priceCurrency: '',
      priceDisplay: cardCode,
      hasSecret: Boolean(cardCode),
    }
  })
}

const isExchangeRecordSecretVisible = (record = {}) => {
  return visibleExchangeRecordSecrets.value.has(record.id)
}

const getExchangeRecordSecretText = (record = {}) => {
  if (!record.hasSecret || isExchangeRecordSecretVisible(record)) {
    return record.priceDisplay
  }

  return purchaseText.value.secretMask || ''
}

const toggleExchangeRecordSecret = (record = {}) => {
  if (!record.hasSecret) {
    return
  }

  const nextVisibleRecords = new Set(visibleExchangeRecordSecrets.value)

  if (nextVisibleRecords.has(record.id)) {
    nextVisibleRecords.delete(record.id)
  } else {
    nextVisibleRecords.add(record.id)
  }

  visibleExchangeRecordSecrets.value = nextVisibleRecords
}

const getRecordPayloadData = (response) => {
  return response?.data || response || {}
}

const getRecordList = (data = {}) => {
  return Array.isArray(data.list)
    ? data.list
    : Array.isArray(data.rows)
      ? data.rows
      : Array.isArray(data.data)
        ? data.data
        : []
}

const getRecordTotal = (data = {}, list = []) => {
  return Number(
    pickRecordValue(data.total, data.count, data.total_count, data.totalCount, list.length)
  ) || 0
}

const loadPurchaseRecords = () => {
  const userId = authUser.value?.user_id

  if (!userId) {
    return
  }

  isLoading.value = true

  getBuyRecords({
    user_id: userId,
    page: currentPage.value,
    limit: pageSize,
  }).then((response) => {
    const data = getRecordPayloadData(response)
    const list = getRecordList(data)
    purchaseTotal.value = getRecordTotal(data, list)
    purchaseRawRecords.value = list
  }).finally(() => {
    isLoading.value = false
  })
}

const loadExchangeRecords = () => {
  const userId = authUser.value?.user_id

  if (!userId) {
    return
  }

  isLoading.value = true
  visibleExchangeRecordSecrets.value = new Set()

  getActivatedCardList({
    user_id: userId,
    page: currentPage.value,
    limit: pageSize,
  }).then((response) => {
    const data = getRecordPayloadData(response)
    const list = getRecordList(data)
    exchangeTotal.value = getRecordTotal(data, list)
    exchangeRawRecords.value = list
  }).finally(() => {
    isLoading.value = false
  })
}

const loadActiveTabRecords = () => {
  if (isExchangeTab.value) {
    loadExchangeRecords()
    return
  }

  loadPurchaseRecords()
}

const goToPage = (page) => {
  const nextPage = Math.min(Math.max(Number(page) || 1, 1), totalPages.value)

  if (nextPage === currentPage.value) {
    return
  }

  currentPage.value = nextPage
}

watch(currentPage, () => {
  loadActiveTabRecords()
})

watch(activeRecordTab, () => {
  if (currentPage.value === 1) {
    loadActiveTabRecords()
    return
  }

  currentPage.value = 1
})

onMounted(() => {
  loadPurchaseRecords()
})
</script>

<style scoped>
.purchase-history-panel {
  width: 869px;
  min-height: 812px !important;
  height: auto;
  padding-top: 0 !important;
  padding-bottom: 28px;
}

.purchase-history-panel .profile-panel-heading {
  height: 81px;
  min-height: 81px;
  padding-bottom: 0;
}

.purchase-heading-icon {
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: var(--theme-accent);
  background: var(--theme-accent-soft);
}

.purchase-tabs {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-top: 20px;
}

.purchase-tab {
  height: 38px;
  min-width: 112px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 14px;
  border: 1px solid var(--theme-profile-tab-border, var(--theme-extra-33-47-74-1));
  border-radius: 10px;
  color: var(--theme-profile-tab-text, var(--theme-extra-141-154-176-1));
  background: var(--theme-profile-tab-background, var(--theme-extra-10-18-37-1));
  font-size: 14px;
  cursor: pointer;
}

.purchase-tab span {
  font-size: 14px;
  line-height: 20px;
}

.purchase-tab strong {
  min-width: 20px;
  height: 22px;
  padding: 0 7px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: var(--theme-profile-tab-count-text, var(--theme-extra-128-141-165-1));
  background: var(--theme-profile-tab-count-background, var(--theme-extra-24-34-57-1));
  font-size: 13px;
  line-height: 18px;
  font-weight: 500;
}

.purchase-tab-active {
  border-color: var(--theme-profile-tab-active-border, var(--theme-extra-43-111-175-1));
  color: var(--theme-profile-tab-active-text, var(--theme-extra-35-201-239-1));
  background: var(--theme-profile-tab-active-background, var(--theme-extra-16-53-90-1));
}

.purchase-tab-active strong {
  color: var(--theme-profile-tab-count-active-text, var(--theme-extra-112-224-247-1));
  background: var(--theme-profile-tab-count-active-background, var(--theme-extra-26-92-140-1));
}

.purchase-table-wrap {
  position: relative;
  margin-top: 20px;
  border: 1px solid var(--theme-profile-table-border, var(--theme-border-code));
  border-radius: 8px;
  overflow: hidden;
  background: var(--theme-profile-table-background, var(--theme-panel-code));
}

.purchase-table-loading {
  position: absolute;
  inset: 50px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--theme-profile-table-loading-background, rgba(8, 16, 32, 0.34));
  pointer-events: none;
}

.purchase-table-loading-spinner {
  width: 28px;
  height: 28px;
  border: 3px solid var(--theme-extra-97-219-246-025, rgba(97, 219, 246, 0.25));
  border-top-color: var(--theme-accent);
  border-radius: 50%;
  animation: purchase-table-loading-spin 0.8s linear infinite;
}

@keyframes purchase-table-loading-spin {
  to {
    transform: rotate(360deg);
  }
}

.purchase-table {
  width: 100%;
  border-collapse: collapse;
}

.purchase-table th,
.purchase-table td {
  height: 50px;
  padding: 0 10px;
  border-bottom: 1px solid var(--theme-profile-table-border, var(--theme-border-table));
  color: var(--theme-profile-table-text, var(--theme-text-table));
  font-size: 14px;
  text-align: center;
}

.purchase-table thead th {
  background: var(--theme-profile-table-head-background, var(--theme-extra-17-25-39-1));
  color: var(--theme-profile-table-head-text, var(--theme-text-slate));
  font-weight: 600;
}

.purchase-table tbody tr:nth-child(odd) td {
  background: var(--theme-profile-table-row-background, var(--theme-panel));
}

.purchase-table tbody tr:nth-child(even) td {
  background: var(--theme-profile-table-row-alt-background, var(--theme-panel-row));
}

.purchase-table tbody tr:last-child td {
  border-bottom: none;
}

.purchase-table th:first-child,
.purchase-table td:first-child {
  text-align: left;
  padding-left: 14px;
}

.purchase-record-title {
  min-width: 0;
  display: block;
  color: var(--theme-team-member-name, var(--theme-extra-242-247-255-1)) !important;
  font-size: 14px !important;
  line-height: 20px;
  font-weight: 400;
}

.purchase-record-title span {
  min-width: 0;
  overflow-wrap: anywhere;
}

.purchase-record-price {
  color: var(--theme-extra-241-247-255-1) !important;
  font-weight: 400;
}

.purchase-record-price-value {
  display: inline-flex;
  align-items: baseline;
  justify-content: center;
  gap: 4px;
  white-space: nowrap;
}

.purchase-record-price-amount {
  color: var(--theme-extra-241-247-255-1);
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
}

.purchase-record-price-currency {
  color: var(--theme-extra-123-142-170-1);
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  letter-spacing: 0;
}

.purchase-record-secret {
  min-width: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.purchase-record-secret span {
  min-width: 0;
  overflow-wrap: anywhere;
}

.purchase-record-secret-toggle {
  width: 24px;
  height: 24px;
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 7px;
  color: var(--theme-extra-123-142-170-1);
  cursor: pointer;
}

.purchase-record-secret-toggle:hover,
.purchase-record-secret-toggle:focus-visible {
  color: var(--theme-profile-field-action, var(--theme-text-info));
  background: var(--theme-profile-field-action, var(--theme-extra-25-126-159-035));
}

.purchase-record-secret-toggle :deep(svg) {
  width: 16px;
  height: 16px;
}

.purchase-record-status {
  min-width: 62px;
  height: 24px;
  padding: 0 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  font-size: 12px;
  line-height: 18px;
  font-weight: 600;
  white-space: nowrap;
}

.record-status-pending {
  color: #f7c66f;
  background: rgba(247, 198, 111, 0.14);
  border: 1px solid rgba(247, 198, 111, 0.28);
}

.record-status-paid {
  color: #65d6a1;
  background: rgba(101, 214, 161, 0.14);
  border: 1px solid rgba(101, 214, 161, 0.28);
}

.record-status-closed {
  color: var(--theme-extra-145-159-182-1);
  background: rgba(145, 159, 182, 0.12);
  border: 1px solid rgba(145, 159, 182, 0.24);
}

.record-status-refunded {
  color: #8fb7ff;
  background: rgba(143, 183, 255, 0.14);
  border: 1px solid rgba(143, 183, 255, 0.28);
}

.record-status-unknown {
  color: var(--theme-extra-145-159-182-1);
  background: var(--theme-extra-36-51-80-1);
  border: 1px solid rgba(145, 159, 182, 0.18);
}

.purchase-empty-cell {
  height: 120px !important;
  color: var(--theme-text-muted-alt) !important;
  text-align: center !important;
}

.purchase-pagination {
  margin-top: 18px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px 12px;
  flex-wrap: wrap;
}

.purchase-page-arrow {
  width: 16px;
  height: 16px;
  color: var(--theme-extra-117-135-163-1);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.purchase-page-arrow:disabled,
.purchase-page-button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.purchase-page-arrow svg {
  width: 16px;
  height: 16px;
}

.purchase-page-button {
  width: 40px;
  height: 36px;
  border: 1px solid var(--theme-extra-31-59-107-1);
  border-radius: 10px;
  color: var(--theme-extra-123-142-170-1);
  background: var(--theme-extra-13-37-76-085);
  font-size: 16px;
  line-height: 20px;
  font-weight: 600;
  cursor: pointer;
}

.purchase-page-button-active {
  color: var(--theme-extra-242-250-255-1);
  border-color: var(--theme-extra-97-219-246-08);
  background: linear-gradient(112.91deg, var(--theme-cyan-alt) 0%, var(--theme-gradient-mid) 53.06%, var(--theme-gradient-end) 100%);
}

@media (max-width: 900px) {
  .purchase-history-panel {
    width: 100%;
    height: auto;
    min-height: 0 !important;
    padding-bottom: 20px;
  }

  .purchase-tabs {
    gap: 10px;
    flex-wrap: wrap;
  }

  .purchase-table-wrap {
    overflow-x: auto;
  }

  .purchase-table {
    min-width: 640px;
  }

  .purchase-pagination {
    margin-top: 20px;
  }
}
</style>
