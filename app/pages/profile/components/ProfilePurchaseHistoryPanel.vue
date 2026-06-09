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
              <th>{{ purchaseText.tableHeaders?.title }}</th>
              <th>{{ purchaseText.tableHeaders?.date }}</th>
              <th>{{ purchaseText.tableHeaders?.price }}</th>
              <th>{{ purchaseText.tableHeaders?.status }}</th>
            </tr>
          </thead>
          <tbody v-if="activeRecordTab === 'purchase' && currentRecords.length">
            <tr v-for="record in currentRecords" :key="record.id">
              <td>
                <span class="purchase-record-title">
                  <span class="purchase-record-icon">
                    <Icon name="lucide:clipboard-check" aria-hidden="true" />
                  </span>
                  <strong>{{ record.title }}</strong>
                </span>
              </td>
              <td>{{ record.date }}</td>
              <td class="purchase-record-price">${{ record.price }}</td>
              <td>
                <span :class="['purchase-record-status', record.statusClass]">{{ record.status }}</span>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="4" class="purchase-empty-cell">
                {{ activeRecordTab === 'exchange' ? purchaseText.exchangeEmptyText || purchaseText.emptyText : purchaseText.emptyText }}
              </td>
            </tr>
          </tbody>
        </table>
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

.purchase-table-wrap {
  margin-top: 20px;
  border: 1px solid var(--theme-profile-table-border, var(--theme-border-code));
  border-radius: 8px;
  overflow: hidden;
  background: var(--theme-profile-table-background, var(--theme-panel-code));
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
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--theme-team-member-name, var(--theme-extra-242-247-255-1)) !important;
  font-size: 16px !important;
  line-height: 22px;
  font-weight: 700;
}

.purchase-record-title strong {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.purchase-record-icon {
  width: 18px;
  height: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--theme-extra-156-174-201-1);
  flex: 0 0 auto;
}

.purchase-record-icon :deep(svg) {
  width: 16px;
  height: 16px;
}

.purchase-record-price {
  color: var(--theme-extra-241-247-255-1) !important;
  font-weight: 700;
}

.purchase-record-status {
  min-width: 62px;
  height: 24px;
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
