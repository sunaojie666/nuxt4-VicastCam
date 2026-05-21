<template>
  <section class="profile-content" :aria-label="earningsText.ariaLabel">
    <section class="profile-panel earnings-overview-panel">
      <header class="profile-panel-heading">
        <span>
          <Icon name="lucide:coins" aria-hidden="true" />
        </span>
        <h2>{{ earningsText.title }}</h2>
      </header>

      <div class="earnings-cards">
        <article
          v-for="card in summaryCards"
          :key="card.title"
          class="earnings-card"
          :class="card.theme"
        >
          <div class="earnings-card-icon">
            <Icon :name="card.icon" aria-hidden="true" />
          </div>

          <p class="earnings-card-title">{{ card.title }}</p>
          <strong class="earnings-card-value">{{ card.value }}</strong>
          <p class="earnings-card-desc">{{ card.desc }}</p>

          <button v-if="card.action" type="button" class="earnings-withdraw-button" @click="openWithdrawModal">
            {{ card.action }}
          </button>
        </article>
      </div>
    </section>

    <section class="profile-panel earnings-record-panel">
      <header class="earnings-record-header">
        <div class="earnings-record-title">
          <span>
            <Icon name="lucide:badge-check" aria-hidden="true" />
          </span>
          <h2>{{ earningsText.commissionTitle }}</h2>
        </div>

        <div ref="monthFilter" class="earnings-month-filter">
          <button
            type="button"
            :class="['earnings-month-button', { 'earnings-month-button-active': isMonthPickerOpen }]"
            :aria-label="commonText.monthSelectLabel"
            @click="toggleMonthPicker"
          >
            <Icon name="lucide:calendar-days" aria-hidden="true" />
          </button>

          <div v-if="isMonthPickerOpen" class="earnings-month-popover">
            <header class="earnings-month-popover-header">
              <button type="button" class="earnings-month-year-button" @click="pickerYear--">
                <Icon name="lucide:chevron-left" aria-hidden="true" />
              </button>
              <strong>{{ pickerYear }}{{ commonText.yearSuffix }}</strong>
              <button
                type="button"
                class="earnings-month-year-button"
                :disabled="pickerYear >= currentYear"
                @click="pickerYear++"
              >
                <Icon name="lucide:chevron-right" aria-hidden="true" />
              </button>
            </header>

            <div class="earnings-month-grid">
              <button
                v-for="month in monthOptions"
                :key="month.value"
                type="button"
                :class="['earnings-month-option', { 'earnings-month-option-active': selectedMonth === createMonthValue(pickerYear, month.value) }]"
                :disabled="isFutureMonth(pickerYear, month.value)"
                @click="selectMonth(pickerYear, month.value)"
              >
                {{ month.label }}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div class="earnings-table-wrap">
        <table class="earnings-table">
          <thead>
            <tr>
              <th>{{ earningsText.commissionHeaders?.mobile }}</th>
              <th>{{ earningsText.commissionHeaders?.saleTime }}</th>
              <th>{{ earningsText.commissionHeaders?.goodsInfo }}</th>
              <th>{{ earningsText.commissionHeaders?.commission }}</th>
            </tr>
          </thead>
          <tbody v-if="!isLoadingCommission && commissionRows.length">
            <tr v-for="row in commissionRows" :key="row.id">
              <td>{{ row.mobile }}</td>
              <td>{{ row.saleTime }}</td>
              <td>{{ row.goodsInfo }}</td>
              <td>{{ row.commission }}</td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="4" class="earnings-empty-cell">{{ commissionTableMessage }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="earnings-pagination">
        <button
          type="button"
          :disabled="currentPage === 1 || isLoadingCommission"
          class="earnings-page-arrow"
          @click="currentPage--"
        >
          <Icon name="lucide:chevron-left" aria-hidden="true" />
        </button>
        <button
          v-for="page in pages"
          :key="page"
          type="button"
          :class="['earnings-page-number', { 'earnings-page-number-active': currentPage === page }]"
          :disabled="isLoadingCommission"
          @click="currentPage = page"
        >
          {{ page }}
        </button>
        <button
          type="button"
          :disabled="currentPage === totalPages || isLoadingCommission"
          class="earnings-page-arrow"
          @click="currentPage++"
        >
          <Icon name="lucide:chevron-right" aria-hidden="true" />
        </button>
      </div>
    </section>

    <Teleport to="body">
      <div v-if="showWithdrawModal" class="earnings-withdraw-overlay" @click.self="closeWithdrawModal">
        <section class="earnings-withdraw-modal" role="dialog" aria-modal="true" :aria-label="withdrawText.ariaLabel">
          <header class="earnings-withdraw-header">
            <div class="earnings-withdraw-title">
              <span>
                <Icon name="lucide:wallet" aria-hidden="true" />
              </span>
              <h2>{{ withdrawText.title }}</h2>
            </div>
            <button type="button" class="earnings-withdraw-close" :aria-label="withdrawText.closeLabel" @click="closeWithdrawModal">
              <Icon name="lucide:x" aria-hidden="true" />
            </button>
          </header>

          <article class="earnings-withdraw-balance">
            <div>
              <Icon name="lucide:wallet" aria-hidden="true" />
              <strong>{{ withdrawText.balanceLabel }}</strong>
            </div>
            <strong>$23,560.00</strong>
          </article>

          <div class="earnings-withdraw-field">
            <label>{{ withdrawText.amountLabel }}</label>
            <div class="earnings-withdraw-amount-row">
              <input v-model="withdrawForm.amount" type="text" :placeholder="withdrawText.amountPlaceholder">
              <button type="button" @click="setAllAmount">{{ withdrawText.allButton }}</button>
            </div>
            <p>{{ withdrawText.amountTip }}</p>
          </div>

          <div class="earnings-withdraw-field">
            <label>{{ withdrawText.methodLabel }}</label>
            <div class="earnings-withdraw-methods">
              <button
                v-for="method in withdrawMethods"
                :key="method"
                type="button"
                :class="['earnings-withdraw-method', { 'earnings-withdraw-method-active': withdrawForm.method === method }]"
                @click="withdrawForm.method = method"
              >
                {{ method }}
              </button>
            </div>
          </div>

          <div class="earnings-withdraw-form-panel">
            <div class="earnings-withdraw-field">
              <label>{{ withdrawText.nameLabel }}</label>
              <input v-model="withdrawForm.name" type="text" :placeholder="withdrawText.namePlaceholder">
            </div>
            <div class="earnings-withdraw-field">
              <label>{{ withdrawText.bankCardLabel }}</label>
              <input v-model="withdrawForm.bankCard" type="text" :placeholder="withdrawText.bankCardPlaceholder">
            </div>
            <div class="earnings-withdraw-field">
              <label>{{ withdrawText.remarkLabel }}</label>
              <textarea v-model="withdrawForm.remark" :placeholder="withdrawText.remarkPlaceholder"></textarea>
            </div>
          </div>

          <p class="earnings-withdraw-note">
            <Icon name="lucide:info" aria-hidden="true" />
            {{ withdrawText.note }}
          </p>

          <footer class="earnings-withdraw-actions">
            <button type="button" class="earnings-withdraw-cancel" @click="closeWithdrawModal">
              {{ withdrawText.cancelButton }}
            </button>
            <button type="button" class="earnings-withdraw-submit" @click="submitWithdraw">
              {{ withdrawText.submitButton }}
            </button>
          </footer>
        </section>
      </div>
    </Teleport>
  </section>
</template>

<script setup>
import { getCommissionList } from '../../../api/request/auth'

const createMoneyText = (value) => {
  return `$ ${String(value || '0.00')}`
}

const { profileBox } = useProfileText()
const commonText = computed(() => profileBox.value?.common || {})
const earningsText = computed(() => profileBox.value?.earnings || {})
const withdrawText = computed(() => earningsText.value.withdraw || {})
const getSummaryText = (key) => {
  return (earningsText.value.summaryCards || []).find(item => item.key === key) || {}
}

const summaryCards = computed(() => [
  {
    title: getSummaryText('total').title || '',
    value: createMoneyText(totalCommission.value),
    desc: getSummaryText('total').desc || '',
    icon: 'lucide:briefcase-business',
    theme: 'card-blue',
  },
  {
    title: getSummaryText('month').title || '',
    value: createMoneyText(monthCommission.value),
    desc: getSummaryText('month').desc || '',
    icon: 'lucide:clock-3',
    theme: 'card-amber',
  },
  {
    title: getSummaryText('settling').title || '',
    value: '$ 1,560.00',
    desc: getSummaryText('settling').desc || '',
    icon: 'lucide:info',
    theme: 'card-violet',
  },
  {
    title: getSummaryText('withdrawable').title || '',
    value: createMoneyText(monthCommission.value),
    desc: getSummaryText('withdrawable').desc || '',
    icon: 'lucide:wallet',
    theme: 'card-emerald',
    action: getSummaryText('withdrawable').action || '',
  },
])

const { authUser } = useAuth()
const { requestLoadingText } = useSiteToast()
const selectedMonth = ref('')
const isMonthPickerOpen = ref(false)
const pickerYear = ref(new Date().getFullYear())
const monthFilter = ref(null)
const currentPage = ref(1)
const pageSize = 10
const commissionRows = ref([])
const totalCommission = ref('0.00')
const monthCommission = ref('0.00')
const commissionTotal = ref(0)
const isLoadingCommission = ref(false)
const commissionLoadError = ref('')
const showWithdrawModal = ref(false)
const withdrawMethods = computed(() => Array.isArray(withdrawText.value.methods) ? withdrawText.value.methods : [])
const withdrawForm = reactive({
  amount: '',
  method: 'PayPal',
  name: 'Marcus Johnson',
  bankCard: '',
  remark: '',
})

const currentMonth = computed(() => {
  const date = new Date()
  const month = String(date.getMonth() + 1).padStart(2, '0')

  return `${date.getFullYear()}-${month}`
})
const currentYear = computed(() => Number(currentMonth.value.slice(0, 4)))
const currentMonthNumber = computed(() => Number(currentMonth.value.slice(5, 7)))
const monthOptions = computed(() => Array.from({ length: 12 }, (_, index) => {
  const value = index + 1

  return {
    value,
    label: `${value}${commonText.value.monthSuffix || ''}`,
  }
}))
const totalPages = computed(() => Math.max(1, Math.ceil((commissionTotal.value || commissionRows.value.length) / pageSize)))
const pages = computed(() => {
  const pageWindowSize = 5
  const halfWindow = Math.floor(pageWindowSize / 2)
  const startPage = Math.max(1, Math.min(currentPage.value - halfWindow, totalPages.value - pageWindowSize + 1))
  const endPage = Math.min(totalPages.value, startPage + pageWindowSize - 1)

  return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index)
})
const commissionTableMessage = computed(() => {
  if (isLoadingCommission.value) {
    return requestLoadingText.value
  }

  if (commissionLoadError.value) {
    return commissionLoadError.value
  }

  return earningsText.value.emptyCommission || ''
})

selectedMonth.value = currentMonth.value

const pickCommissionValue = (...values) => {
  return values.find(value => value !== undefined && value !== null && value !== '')
}

const createCommissionText = (...values) => {
  const value = pickCommissionValue(...values)

  return value === undefined ? '' : String(value)
}

const getCommissionData = (response) => {
  return response?.data || response || {}
}

const getCommissionItems = (response) => {
  const data = getCommissionData(response)
  const items = data.list || data.rows || data.items || data.records || []

  return Array.isArray(items) ? items : []
}

const createCommissionRow = (item = {}, index) => {
  return {
    id: createCommissionText(item.id, item.mobile, item.sale_time, `${selectedMonth.value}-${currentPage.value}-${index}`),
    mobile: createCommissionText(item.mobile, '-'),
    saleTime: createCommissionText(item.sale_time, item.saleTime, '-'),
    goodsInfo: createCommissionText(item.goods_info, item.goodsInfo, '-'),
    commission: createCommissionText(item.commission, '0.00'),
  }
}

const loadCommissionList = () => {
  const userId = authUser.value?.user_id

  if (!userId) {
    commissionRows.value = []
    commissionTotal.value = 0
    commissionLoadError.value = commonText.value.userMissing || ''
    return
  }

  isLoadingCommission.value = true
  commissionLoadError.value = ''

  getCommissionList({
    user_id: userId,
    month: selectedMonth.value,
    page_index: currentPage.value,
    page_size: pageSize,
  }).then(
    response => {
      const data = getCommissionData(response)
      const items = getCommissionItems(response)

      totalCommission.value = createCommissionText(data.total_commission, totalCommission.value)
      monthCommission.value = createCommissionText(data.month_commission, monthCommission.value)
      commissionTotal.value = Number(data.total || data.count || items.length) || items.length
      commissionRows.value = items.map(createCommissionRow)
      isLoadingCommission.value = false
    },
    () => {
      commissionRows.value = []
      commissionTotal.value = 0
      commissionLoadError.value = earningsText.value.errors?.loadFail || ''
      isLoadingCommission.value = false
    }
  )
}

const createMonthValue = (year, month) => {
  return `${year}-${String(month).padStart(2, '0')}`
}

const isFutureMonth = (year, month) => {
  return year > currentYear.value || (year === currentYear.value && month > currentMonthNumber.value)
}

const toggleMonthPicker = () => {
  isMonthPickerOpen.value = !isMonthPickerOpen.value
}

const selectMonth = (year, month) => {
  if (isFutureMonth(year, month)) {
    return
  }

  selectedMonth.value = createMonthValue(year, month)
  isMonthPickerOpen.value = false
}

const closeMonthPickerOnOutsideClick = (event) => {
  if (!isMonthPickerOpen.value || monthFilter.value?.contains(event.target)) {
    return
  }

  isMonthPickerOpen.value = false
}

watch(totalPages, () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value
  }
})

watch(selectedMonth, (month) => {
  pickerYear.value = Number(String(month || currentMonth.value).slice(0, 4)) || currentYear.value

  if (currentPage.value !== 1) {
    currentPage.value = 1
    return
  }

  loadCommissionList()
})

watch(currentPage, () => {
  loadCommissionList()
})

const openWithdrawModal = () => {
  showWithdrawModal.value = true
}

const closeWithdrawModal = () => {
  showWithdrawModal.value = false
}

const setAllAmount = () => {
  withdrawForm.amount = '23560'
}

const submitWithdraw = () => {
  showWithdrawModal.value = false
}

onMounted(() => {
  loadCommissionList()
  document.addEventListener('click', closeMonthPickerOnOutsideClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', closeMonthPickerOnOutsideClick)
})
</script>

<style scoped>
.earnings-overview-panel {
  min-height: 297px !important;
  height: 297px !important;
  padding-bottom: 22px;
}

.earnings-cards {
  display: grid;
  grid-template-columns: repeat(4, 194px);
  justify-content: space-between;
  gap: 0;
  margin-top: 18px;
}

.earnings-card {
  width: 194px;
  height: 165px;
  position: relative;
  border: 1px solid rgba(48, 63, 97, 1);
  border-radius: 10px;
  padding: 0 12px 10px;
}

.earnings-card-icon {
  width: 47px;
  height: 47px;
  margin-top: 17px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
}

.earnings-card-icon :deep(svg),
.earnings-card-icon :deep(.iconify) {
  width: 23px;
  height: 23px;
  font-size: 23px;
}

.earnings-card-title {
  margin-top: 13px;
  color: rgba(128, 146, 174, 1);
  font-size: 12px;
  line-height: 16px;
}

.earnings-card-value {
  display: block;
  margin-top: 2px;
  font-size: 20px;
  font-weight: 700;
  line-height: 30px;
}

.earnings-card-desc {
  margin-top: 6px;
  color: rgba(106, 123, 149, 1);
  font-size: 12px;
  line-height: 16px;
}

.earnings-withdraw-button {
  position: absolute;
  top: 26px;
  right: 12px;
  width: 70px;
  height: 28px;
  border-radius: 999px;
  color: rgba(233, 248, 255, 1);
  background: linear-gradient(90deg, rgba(59, 198, 239, 1), rgba(74, 144, 255, 1));
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.card-blue {
  background: rgba(24, 47, 81, 0.45);
}

.card-blue .earnings-card-icon {
  color: rgba(34, 211, 238, 1);
  background: rgba(24, 126, 180, 0.22);
}

.card-blue .earnings-card-value {
  color: rgba(58, 161, 255, 1);
}

.card-amber {
  background: rgba(44, 38, 34, 0.45);
}

.card-amber .earnings-card-icon {
  color: rgba(255, 169, 45, 1);
  background: rgba(155, 97, 34, 0.28);
}

.card-amber .earnings-card-value {
  color: rgba(255, 167, 53, 1);
}

.card-violet {
  background: rgba(47, 35, 79, 0.45);
}

.card-violet .earnings-card-icon {
  color: rgba(182, 129, 255, 1);
  background: rgba(95, 58, 177, 0.3);
}

.card-violet .earnings-card-value {
  color: rgba(157, 104, 255, 1);
}

.card-emerald {
  background: rgba(30, 65, 51, 0.42);
}

.card-emerald .earnings-card-icon {
  color: rgba(52, 222, 146, 1);
  background: rgba(23, 130, 102, 0.32);
}

.card-emerald .earnings-card-value {
  color: rgba(45, 223, 174, 1);
}

.earnings-record-panel {
  min-height: 734px !important;
  height: 734px !important;
  padding-bottom: 16px;
}

.earnings-record-header {
  min-height: 54px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 18px;
  border-bottom: 1px solid rgba(37, 48, 70, 1);
}

.earnings-record-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.earnings-record-title > span {
  width: 30px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 7px;
  color: rgba(34, 211, 238, 1);
  background: rgba(34, 211, 238, 0.14);
}

.earnings-record-title h2 {
  font-size: 16px;
  font-weight: 700;
  line-height: 22px;
}

.earnings-month-filter {
  position: relative;
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.earnings-month-button {
  width: 34px;
  height: 34px;
  border: 1px solid rgba(45, 58, 86, 1);
  border-radius: 9px;
  color: rgba(148, 163, 184, 1);
  background: rgba(31, 41, 61, 1);
  cursor: pointer;
}

.earnings-month-button svg {
  width: 17px;
  height: 17px;
}

.earnings-month-button:hover,
.earnings-month-button:focus,
.earnings-month-button-active {
  color: rgba(209, 237, 255, 1);
  border-color: rgba(62, 91, 135, 1);
}

.earnings-month-popover {
  position: absolute;
  top: 44px;
  right: 0;
  z-index: 30;
  width: 248px;
  padding: 12px;
  border: 1px solid rgba(50, 64, 96, 1);
  border-radius: 10px;
  background: rgba(15, 24, 42, 1);
  box-shadow: 0 18px 42px rgba(0, 0, 0, 0.34);
}

.earnings-month-popover-header {
  height: 32px;
  display: grid;
  grid-template-columns: 32px minmax(0, 1fr) 32px;
  align-items: center;
  gap: 8px;
  color: rgba(232, 242, 255, 1);
}

.earnings-month-popover-header strong {
  font-size: 14px;
  line-height: 20px;
  text-align: center;
}

.earnings-month-year-button {
  width: 32px;
  height: 32px;
  border: 1px solid rgba(45, 58, 86, 1);
  border-radius: 8px;
  color: rgba(148, 163, 184, 1);
  background: rgba(18, 30, 51, 1);
  cursor: pointer;
}

.earnings-month-year-button:disabled {
  opacity: 0.38;
  cursor: not-allowed;
}

.earnings-month-year-button svg {
  width: 16px;
  height: 16px;
}

.earnings-month-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-top: 12px;
}

.earnings-month-option {
  height: 34px;
  border: 1px solid rgba(45, 58, 86, 1);
  border-radius: 8px;
  color: rgba(148, 163, 184, 1);
  background: rgba(18, 30, 51, 1);
  font-size: 13px;
  line-height: 18px;
  cursor: pointer;
}

.earnings-month-option:hover,
.earnings-month-option:focus {
  color: rgba(209, 237, 255, 1);
  border-color: rgba(38, 130, 176, 1);
}

.earnings-month-option-active {
  color: rgba(221, 244, 255, 1);
  border-color: rgba(38, 130, 176, 1);
  background: rgba(20, 101, 145, 0.6);
}

.earnings-month-option:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.earnings-table-wrap {
  margin-top: 20px;
  border: 1px solid rgba(44, 56, 84, 1);
  border-radius: 8px;
  overflow: hidden;
  background: rgba(15, 24, 42, 1);
}

.earnings-table {
  width: 100%;
  border-collapse: collapse;
}

.earnings-table th,
.earnings-table td {
  height: 50px;
  padding: 0 10px;
  border-bottom: 1px solid rgba(38, 50, 76, 1);
  color: rgba(215, 226, 246, 1);
  font-size: 13px;
  text-align: center;
}

.earnings-table thead th {
  background: rgba(17, 25, 39, 1);
  color: rgba(154, 172, 200, 1);
  font-weight: 600;
}

.earnings-table tbody tr:nth-child(odd) td {
  background: rgba(26, 34, 53, 1);
}

.earnings-table tbody tr:nth-child(even) td {
  background: rgba(30, 38, 57, 1);
}

.earnings-table tbody tr:last-child td {
  border-bottom: none;
}

.earnings-table th:last-child,
.earnings-table td:last-child {
  width: 96px;
}

.earnings-table th:first-child,
.earnings-table td:first-child {
  text-align: left;
  padding-left: 14px;
}

.earnings-empty-cell {
  height: 120px !important;
  color: rgba(149, 156, 168, 1) !important;
  text-align: center !important;
}

.earnings-pagination {
  margin-top: 14px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
}

.earnings-page-arrow,
.earnings-page-number {
  width: 26px;
  height: 26px;
  border-radius: 7px;
  color: rgba(130, 147, 175, 1);
  font-size: 14px;
  cursor: pointer;
}

.earnings-page-arrow:disabled,
.earnings-page-number:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.earnings-page-number-active {
  color: rgba(221, 244, 255, 1);
  background: rgba(13, 113, 175, 1);
}

.earnings-withdraw-overlay {
  position: fixed;
  inset: 0;
  z-index: 70;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(3, 7, 18, 0.65);
  backdrop-filter: blur(6px);
}

.earnings-withdraw-modal {
  width: 477px;
  height: 745px;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(38, 49, 75, 1);
  border-radius: 12px;
  padding: 12px;
  background: rgba(27, 38, 62, 1);
  overflow: hidden;
}

.earnings-withdraw-header {
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(40, 53, 81, 1);
}

.earnings-withdraw-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.earnings-withdraw-title > span {
  width: 24px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  color: rgba(34, 211, 238, 1);
  background: rgba(34, 211, 238, 0.14);
}

.earnings-withdraw-title h2 {
  font-size: 16px;
  line-height: 22px;
  font-weight: 700;
  color: rgba(239, 245, 255, 1);
}

.earnings-withdraw-close {
  width: 24px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: rgba(147, 160, 183, 1);
  cursor: pointer;
}

.earnings-withdraw-close :deep(svg) {
  width: 16px;
  height: 16px;
}

.earnings-withdraw-balance {
  height: 56px;
  margin-top: 14px;
  padding: 0 14px;
  border: 1px solid rgba(48, 93, 78, 1);
  border-radius: 10px;
  background: rgba(30, 60, 58, 0.45);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.earnings-withdraw-balance > div {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.earnings-withdraw-balance > div :deep(svg) {
  width: 16px;
  height: 16px;
  color: rgba(52, 222, 146, 1);
}

.earnings-withdraw-balance strong {
  font-size: 14px;
  line-height: 20px;
  color: rgba(236, 244, 255, 1);
  font-weight: 700;
}

.earnings-withdraw-field {
  margin-top: 12px;
}

.earnings-withdraw-field label {
  display: block;
  color: rgba(149, 156, 168, 1);
  font-size: 12px;
  line-height: 18px;
  margin-bottom: 8px;
}

.earnings-withdraw-amount-row {
  height: 46px;
  border: 1px solid rgba(43, 56, 82, 1);
  border-radius: 8px;
  background: rgba(9, 21, 44, 1);
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  padding: 0 12px;
}

.earnings-withdraw-amount-row input {
  color: rgba(232, 241, 255, 1);
  font-size: 14px;
}

.earnings-withdraw-amount-row input::placeholder {
  color: rgba(108, 125, 153, 1);
}

.earnings-withdraw-amount-row button {
  color: rgba(34, 211, 238, 1);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.earnings-withdraw-field p {
  margin-top: 8px;
  color: rgba(124, 139, 163, 1);
  font-size: 12px;
  line-height: 18px;
}

.earnings-withdraw-methods {
  height: 46px;
  border: 1px solid rgba(43, 56, 82, 1);
  border-radius: 8px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  overflow: hidden;
  background: rgba(9, 21, 44, 1);
}

.earnings-withdraw-method {
  color: rgba(146, 163, 191, 1);
  font-size: 14px;
  cursor: pointer;
}

.earnings-withdraw-method-active {
  color: rgba(236, 246, 255, 1);
  background: linear-gradient(90deg, rgba(58, 184, 238, 1), rgba(94, 204, 238, 1));
}

.earnings-withdraw-form-panel {
  margin-top: 12px;
  padding: 10px 12px 12px;
  border: 1px solid rgba(43, 56, 82, 1);
  border-radius: 10px;
  background: rgba(15, 28, 52, 0.7);
}

.earnings-withdraw-form-panel input,
.earnings-withdraw-form-panel textarea {
  width: 100%;
  border: 1px solid rgba(82, 101, 129, 1);
  border-radius: 8px;
  background: rgba(10, 22, 42, 1);
  color: rgba(230, 238, 250, 1);
  font-size: 14px;
  padding: 0 12px;
}

.earnings-withdraw-form-panel input {
  height: 44px;
}

.earnings-withdraw-form-panel textarea {
  height: 74px;
  padding-top: 10px;
  resize: none;
}

.earnings-withdraw-form-panel input::placeholder,
.earnings-withdraw-form-panel textarea::placeholder {
  color: rgba(108, 125, 153, 1);
}

.earnings-withdraw-note {
  margin-top: 12px;
  color: rgba(121, 136, 159, 1);
  font-size: 12px;
  line-height: 18px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.earnings-withdraw-note :deep(svg) {
  width: 14px;
  height: 14px;
  flex: 0 0 auto;
}

.earnings-withdraw-actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
  margin-top: auto;
  padding-top: 16px;
}

.earnings-withdraw-cancel,
.earnings-withdraw-submit {
  height: 36px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.earnings-withdraw-cancel {
  color: rgba(220, 229, 244, 1);
  background: rgba(35, 47, 73, 1);
}

.earnings-withdraw-submit {
  color: rgba(255, 255, 255, 1);
  background: linear-gradient(90deg, rgba(58, 199, 239, 1), rgba(75, 204, 233, 1));
}

@media (max-width: 900px) {
  .earnings-overview-panel,
  .earnings-record-panel {
    width: 100%;
    height: auto !important;
    min-height: 0 !important;
  }

  .earnings-cards {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
    justify-content: stretch;
  }

  .earnings-card {
    width: 100%;
    max-width: none;
  }
}

@media (max-width: 520px) {
  .earnings-cards {
    grid-template-columns: 1fr;
    justify-items: stretch;
  }

  .earnings-record-header {
    flex-wrap: wrap;
    gap: 10px;
  }

  .earnings-month-filter {
    margin-left: auto;
  }

  .earnings-table-wrap {
    overflow-x: auto;
  }

  .earnings-table {
    min-width: 560px;
  }

  .earnings-withdraw-overlay {
    padding: 0;
  }

  .earnings-withdraw-modal {
    width: 100%;
    height: 100dvh;
    border-radius: 0;
    overflow-y: auto;
  }
}
</style>
