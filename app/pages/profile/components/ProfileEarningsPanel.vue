<template>
  <section class="profile-content" aria-label="我的收益">
    <section class="profile-panel earnings-overview-panel">
      <header class="profile-panel-heading">
        <span>
          <Icon name="lucide:coins" aria-hidden="true" />
        </span>
        <h2>我的收益</h2>
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
          <h2>权益对比</h2>
        </div>

        <select v-model="selectedStatus" class="earnings-status-filter">
          <option value="all">全部状态</option>
          <option value="paid">已到账</option>
          <option value="review">审核中</option>
        </select>
      </header>

      <div class="earnings-table-wrap">
        <table class="earnings-table">
          <thead>
            <tr>
              <th>申请时间</th>
              <th>提现方式</th>
              <th>提现金额</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in pagedRows" :key="row.id">
              <td>{{ row.time }}</td>
              <td>{{ row.method }}</td>
              <td>${{ row.amount }}</td>
              <td>
                <span :class="['earnings-status', row.statusClass]">{{ row.statusLabel }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="earnings-pagination">
        <button
          type="button"
          :disabled="currentPage === 1"
          class="earnings-page-arrow"
          @click="currentPage--"
        >
          <Icon name="lucide:chevron-left" aria-hidden="true" />
        </button>
        <button
          v-for="page in totalPages"
          :key="page"
          type="button"
          :class="['earnings-page-number', { 'earnings-page-number-active': currentPage === page }]"
          @click="currentPage = page"
        >
          {{ page }}
        </button>
        <button
          type="button"
          :disabled="currentPage === totalPages"
          class="earnings-page-arrow"
          @click="currentPage++"
        >
          <Icon name="lucide:chevron-right" aria-hidden="true" />
        </button>
      </div>
    </section>

    <Teleport to="body">
      <div v-if="showWithdrawModal" class="earnings-withdraw-overlay" @click.self="closeWithdrawModal">
        <section class="earnings-withdraw-modal" role="dialog" aria-modal="true" aria-label="申请提现">
          <header class="earnings-withdraw-header">
            <div class="earnings-withdraw-title">
              <span>
                <Icon name="lucide:wallet" aria-hidden="true" />
              </span>
              <h2>申请提现</h2>
            </div>
            <button type="button" class="earnings-withdraw-close" aria-label="关闭" @click="closeWithdrawModal">
              <Icon name="lucide:x" aria-hidden="true" />
            </button>
          </header>

          <article class="earnings-withdraw-balance">
            <div>
              <Icon name="lucide:wallet" aria-hidden="true" />
              <strong>可提现</strong>
            </div>
            <strong>$23,560.00</strong>
          </article>

          <div class="earnings-withdraw-field">
            <label>提现金额</label>
            <div class="earnings-withdraw-amount-row">
              <input v-model="withdrawForm.amount" type="text" placeholder="请输入提现金额">
              <button type="button" @click="setAllAmount">全部</button>
            </div>
            <p>单笔提现限额$9,999,最低提现金额$50</p>
          </div>

          <div class="earnings-withdraw-field">
            <label>提现方式</label>
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
              <label>收款人姓名</label>
              <input v-model="withdrawForm.name" type="text" placeholder="请输入姓名">
            </div>
            <div class="earnings-withdraw-field">
              <label>银行卡号</label>
              <input v-model="withdrawForm.bankCard" type="text" placeholder="请输入卡号">
            </div>
            <div class="earnings-withdraw-field">
              <label>备注（可选）</label>
              <textarea v-model="withdrawForm.remark" placeholder="填写补充说明..."></textarea>
            </div>
          </div>

          <p class="earnings-withdraw-note">
            <Icon name="lucide:info" aria-hidden="true" />
            提现将在7个工作日内处理，请务必确认账户信息准确无误。
          </p>

          <footer class="earnings-withdraw-actions">
            <button type="button" class="earnings-withdraw-cancel" @click="closeWithdrawModal">
              取消
            </button>
            <button type="button" class="earnings-withdraw-submit" @click="submitWithdraw">
              确认提现
            </button>
          </footer>
        </section>
      </div>
    </Teleport>
  </section>
</template>

<script setup>
const summaryCards = [
  {
    title: '总收益',
    value: '$ 28,560.00',
    desc: '累计获得收益',
    icon: 'lucide:briefcase-business',
    theme: 'card-blue',
  },
  {
    title: '待结算',
    value: '$ 560.00',
    desc: '预计结算周期内可结算',
    icon: 'lucide:clock-3',
    theme: 'card-amber',
  },
  {
    title: '结算中',
    value: '$ 1,560.00',
    desc: '预计结算周期内可结算',
    icon: 'lucide:info',
    theme: 'card-violet',
  },
  {
    title: '可提现',
    value: '$ 560.00',
    desc: '预计结算周期内可结算',
    icon: 'lucide:wallet',
    theme: 'card-emerald',
    action: '提现',
  },
]

const allRows = Array.from({ length: 30 }, (_, index) => {
  const isPaid = index % 2 === 0
  return {
    id: `row-${index + 1}`,
    time: '2026-06-01 14:30:22',
    method: isPaid ? 'PayPal' : 'Bank Transfer',
    amount: '560',
    statusLabel: isPaid ? '已到账' : '审核中',
    statusClass: isPaid ? 'status-paid' : 'status-review',
    statusValue: isPaid ? 'paid' : 'review',
  }
})

const selectedStatus = ref('all')
const currentPage = ref(1)
const pageSize = 10
const showWithdrawModal = ref(false)
const withdrawMethods = ['PayPal', '银行转账', 'USDT']
const withdrawForm = reactive({
  amount: '',
  method: 'PayPal',
  name: 'Marcus Johnson',
  bankCard: '',
  remark: '',
})

const filteredRows = computed(() => {
  if (selectedStatus.value === 'all') {
    return allRows
  }
  return allRows.filter((row) => row.statusValue === selectedStatus.value)
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredRows.value.length / pageSize)))

const pagedRows = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredRows.value.slice(start, start + pageSize)
})

watch(selectedStatus, () => {
  currentPage.value = 1
})

watch(totalPages, () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value
  }
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

.earnings-status-filter {
  height: 34px;
  min-width: 98px;
  padding: 0 10px;
  border: 1px solid rgba(45, 58, 86, 1);
  border-radius: 10px;
  color: rgba(146, 163, 192, 1);
  background: rgba(22, 34, 58, 1);
  font-size: 12px;
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

.earnings-status {
  font-weight: 600;
}

.status-paid {
  color: rgba(45, 222, 137, 1);
}

.status-review {
  color: rgba(235, 209, 42, 1);
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

.earnings-page-arrow:disabled {
  opacity: 0.35;
  cursor: default;
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

  .earnings-status-filter {
    width: 100%;
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
