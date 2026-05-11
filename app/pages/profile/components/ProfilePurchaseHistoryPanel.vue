<template>
  <section class="profile-content" aria-label="购买记录">
    <section class="profile-panel purchase-history-panel">
      <header class="profile-panel-heading">
        <span class="purchase-heading-icon">
          <Icon name="lucide:clipboard-list" aria-hidden="true" />
        </span>
        <h2>购买记录</h2>
      </header>

      <div class="purchase-tabs">
        <button
          type="button"
          :class="['purchase-tab', { 'purchase-tab-active': activeTab === 'purchase' }]"
          @click="activeTab = 'purchase'"
        >
          <span>购买记录</span>
          <strong>{{ purchaseCount }}</strong>
        </button>

        <button
          type="button"
          :class="['purchase-tab', { 'purchase-tab-active': activeTab === 'redeem' }]"
          @click="activeTab = 'redeem'"
        >
          <span>兑换记录</span>
          <strong>{{ redeemCount }}</strong>
        </button>
      </div>

      <ul class="purchase-record-list">
        <li v-for="record in currentRecords" :key="record.id" class="purchase-record-item">
          <div class="purchase-record-main">
            <Icon name="lucide:clipboard-check" aria-hidden="true" />
            <div>
              <strong>{{ record.title }}</strong>
              <p>
                <Icon name="lucide:calendar" aria-hidden="true" />
                购买日期: {{ record.date }}
              </p>
            </div>
          </div>

          <div class="purchase-record-side">
            <strong>${{ record.price }}</strong>
            <span :class="record.statusClass">{{ record.status }}</span>
          </div>
        </li>
      </ul>

      <div class="purchase-pagination" aria-label="分页">
        <button type="button" class="purchase-page-arrow" aria-label="上一页">
          <Icon name="lucide:chevron-left" aria-hidden="true" />
        </button>

        <button
          v-for="page in pages"
          :key="page"
          type="button"
          :class="['purchase-page-button', { 'purchase-page-button-active': currentPage === page }]"
          @click="currentPage = page"
        >
          {{ page }}
        </button>

        <button type="button" class="purchase-page-arrow" aria-label="下一页">
          <Icon name="lucide:chevron-right" aria-hidden="true" />
        </button>
      </div>
    </section>
  </section>
</template>

<script setup>
const activeTab = ref('purchase')
const currentPage = ref(1)
const pages = [1, 2, 3]
const purchaseCount = 12
const redeemCount = 0

const purchaseRecords = [
  { id: 1, title: '年度会员', date: '2026-12-31', price: '69.99', status: '生效中', statusClass: 'record-status-active' },
  { id: 2, title: '年度会员', date: '2026-12-31', price: '69.99', status: '已过期', statusClass: 'record-status-expired' },
  { id: 3, title: '年度会员', date: '2026-12-31', price: '69.99', status: '已过期', statusClass: 'record-status-expired' },
  { id: 4, title: '年度会员', date: '2026-12-31', price: '69.99', status: '已过期', statusClass: 'record-status-expired' },
  { id: 5, title: '年度会员', date: '2026-12-31', price: '69.99', status: '已过期', statusClass: 'record-status-expired' },
]

const redeemRecords = []

const currentRecords = computed(() => {
  return activeTab.value === 'purchase' ? purchaseRecords : redeemRecords
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
  color: rgba(34, 211, 238, 1);
  background: rgba(34, 211, 238, 0.14);
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
  border: 1px solid rgba(33, 47, 74, 1);
  border-radius: 10px;
  color: rgba(141, 154, 176, 1);
  background: rgba(10, 18, 37, 1);
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
  color: rgba(128, 141, 165, 1);
  background: rgba(24, 34, 57, 1);
  font-size: 13px;
  line-height: 18px;
  font-weight: 500;
}

.purchase-tab-active {
  border-color: rgba(43, 111, 175, 1);
  color: rgba(35, 201, 239, 1);
  background: rgba(16, 53, 90, 1);
}

.purchase-tab-active strong {
  color: rgba(112, 224, 247, 1);
  background: rgba(26, 92, 140, 1);
}

.purchase-record-list {
  display: grid;
  gap: 20px;
  margin-top: 20px;
}

.purchase-record-item {
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 13px;
  border: 1px solid rgba(32, 47, 78, 1);
  border-radius: 10px;
  background: rgba(8, 19, 39, 1);
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
  color: rgba(156, 174, 201, 1);
  flex: 0 0 auto;
}

.purchase-record-main strong {
  display: block;
  color: rgba(244, 248, 255, 1);
  font-size: 16px;
  line-height: 22px;
  font-weight: 700;
}

.purchase-record-main p {
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
  color: rgba(118, 136, 163, 1);
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
  color: rgba(241, 247, 255, 1);
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
  color: rgba(219, 241, 255, 1);
  background: rgba(30, 115, 228, 1);
}

.record-status-expired {
  color: rgba(145, 159, 182, 1);
  background: rgba(36, 51, 80, 1);
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
  color: rgba(117, 135, 163, 1);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.purchase-page-arrow svg {
  width: 16px;
  height: 16px;
}

.purchase-page-button {
  width: 40px;
  height: 36px;
  border: 1px solid rgba(31, 59, 107, 1);
  border-radius: 10px;
  color: rgba(123, 142, 170, 1);
  background: rgba(13, 37, 76, 0.85);
  font-size: 16px;
  line-height: 20px;
  font-weight: 600;
  cursor: pointer;
}

.purchase-page-button-active {
  color: rgba(242, 250, 255, 1);
  border-color: rgba(97, 219, 246, 0.8);
  background: linear-gradient(112.91deg, rgba(36, 207, 237, 1) 0%, rgba(88, 171, 248, 1) 53.06%, rgba(103, 231, 249, 1) 100%);
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
