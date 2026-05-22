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
          <span>{{ purchaseText.exchangeTabTitle || '兑换记录' }}</span>
          <strong>{{ exchangeCount }}</strong>
        </button>
      </div>

      <ul v-if="activeRecordTab === 'purchase'" class="purchase-record-list">
        <li v-for="record in currentRecords" :key="record.id" class="purchase-record-item">
          <div class="purchase-record-main">
            <Icon name="lucide:clipboard-check" aria-hidden="true" />
            <div>
              <strong>{{ record.title }}</strong>
              <p>
                <Icon name="lucide:calendar" aria-hidden="true" />
                {{ purchaseText.datePrefix }} {{ record.date }}
              </p>
            </div>
          </div>

          <div class="purchase-record-side">
            <strong>${{ record.price }}</strong>
            <span :class="record.statusClass">{{ record.status }}</span>
          </div>
        </li>
      </ul>
      <div v-if="!currentRecords.length" class="purchase-empty-state">
        {{ activeRecordTab === 'exchange' ? purchaseText.exchangeEmptyText || purchaseText.emptyText : purchaseText.emptyText }}
      </div>

      <div class="purchase-pagination" :aria-label="commonText.paginationLabel">
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
      </div>
    </section>
  </section>
</template>

<script setup>
import { getBuyRecords } from '../../../api/request/auth'

const currentPage = ref(1)
const activeRecordTab = ref('purchase')
const pageSize = 5
const purchaseTotal = ref(0)
const exchangeTotal = ref(0)
const isLoading = ref(false)
const purchaseRecords = ref([])
const { authUser } = useAuth()
const { profileBox } = useProfileText()

const commonText = computed(() => profileBox.value?.common || {})
const purchaseText = computed(() => profileBox.value?.purchaseHistory || {})
const purchaseCount = computed(() => purchaseTotal.value)
const exchangeCount = computed(() => exchangeTotal.value)

const activeTotal = computed(() => activeRecordTab.value === 'exchange' ? exchangeTotal.value : purchaseTotal.value)
const totalPages = computed(() => Math.max(1, Math.ceil(activeTotal.value / pageSize)))
const pages = computed(() => {
  const pageWindowSize = 5
  const halfWindow = Math.floor(pageWindowSize / 2)
  const startPage = Math.max(1, Math.min(currentPage.value - halfWindow, totalPages.value - pageWindowSize + 1))
  const endPage = Math.min(totalPages.value, startPage + pageWindowSize - 1)

  return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index)
})

const currentRecords = computed(() => {
  if (activeRecordTab.value === 'exchange') {
    return []
  }

  return purchaseRecords.value
})

const pickRecordValue = (...values) => {
  return values.find(value => value !== undefined && value !== null && value !== '')
}

const createRecordText = (...values) => {
  const value = pickRecordValue(...values)

  return value === undefined ? '' : String(value)
}

const createRecordStatus = (record = {}) => {
  const status = Number(record.status)

  if (status === 0) {
    return {
      text: purchaseText.value.status?.active || '',
      className: 'record-status-active',
    }
  }

  return {
    text: purchaseText.value.status?.expired || '',
    className: 'record-status-expired',
  }
}

const createRecordTitle = (record = {}) => {
  const vipType = createRecordText(record.vip_type, record.vipType)
  const vipTypes = purchaseText.value.vipTypes || {}

  if (vipType === 'M') {
    return vipTypes.month || ''
  }

  if (vipType === 'Y') {
    return vipTypes.year || ''
  }

  if (vipType === 'L') {
    return vipTypes.life || ''
  }

  return vipType || vipTypes.default || ''
}

const normalizeBuyRecords = (list = []) => {
  return list.map((record, index) => {
    const status = createRecordStatus(record)

    return {
      id: createRecordText(record.id, record.out_trade_no, record.trade_no, `buy-record-${index}`),
      title: createRecordTitle(record),
      date: createRecordText(record.create_time, record.pay_time),
      price: createRecordText(record.total_amount, '0.00'),
      status: status.text,
      statusClass: status.className,
    }
  })
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
    const data = response?.data || {}
    purchaseTotal.value = Number(data.total) || 0
    purchaseRecords.value = normalizeBuyRecords(Array.isArray(data.list) ? data.list : [])
  }).finally(() => {
    isLoading.value = false
  })
}

const goToPage = (page) => {
  const nextPage = Math.min(Math.max(Number(page) || 1, 1), totalPages.value)

  if (nextPage === currentPage.value) {
    return
  }

  currentPage.value = nextPage
}

watch(currentPage, () => {
  if (activeRecordTab.value !== 'purchase') {
    return
  }

  loadPurchaseRecords()
})

watch(activeRecordTab, () => {
  currentPage.value = 1
})

onMounted(() => {
  loadPurchaseRecords()
})
</script>

<style scoped>
.purchase-history-panel {
  width: 869px;
  min-height: 0 !important;
  height: 690px;
  padding-top: 0 !important;
  padding-bottom: 0;
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

.purchase-record-list {
  display: grid;
  gap: 20px;
  margin-top: 20px;
}

.purchase-empty-state {
  min-height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--theme-extra-118-136-163-1);
  font-size: 14px;
}

.purchase-record-item {
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 13px;
  border: 1px solid var(--theme-extra-32-47-78-1);
  border-radius: 10px;
  background: var(--theme-extra-8-19-39-1);
}

.purchase-record-main {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 13px;
}

.purchase-record-main > svg {
  width: 16px;
  height: 16px;
  color: var(--theme-extra-156-174-201-1);
  flex: 0 0 auto;
}

.purchase-record-main strong {
  display: block;
  color: var(--theme-extra-244-248-255-1);
  font-size: 16px;
  line-height: 22px;
  font-weight: 700;
}

.purchase-record-main p {
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--theme-extra-118-136-163-1);
  font-size: 14px;
  line-height: 20px;
}

.purchase-record-main p svg {
  width: 13px;
  height: 13px;
}

.purchase-record-side {
  flex: 0 0 auto;
  text-align: right;
}

.purchase-record-side strong {
  display: block;
  color: var(--theme-extra-241-247-255-1);
  font-size: 16px;
  line-height: 22px;
  font-weight: 700;
}

.purchase-record-side span {
  margin-top: 6px;
  min-width: 62px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  font-size: 12px;
  line-height: 18px;
}

.record-status-active {
  color: var(--theme-extra-219-241-255-1);
  background: var(--theme-extra-30-115-228-1);
}

.record-status-expired {
  color: var(--theme-extra-145-159-182-1);
  background: var(--theme-extra-36-51-80-1);
}

.purchase-pagination {
  margin-top: 18px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
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

  .purchase-record-item {
    height: auto;
    min-height: 72px;
  }

  .purchase-tabs {
    gap: 10px;
    flex-wrap: wrap;
  }

  .purchase-pagination {
    margin-top: 20px;
  }
}
</style>
