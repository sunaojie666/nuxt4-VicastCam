<template>
  <section class="profile-content" aria-label="会员中心">
    <section class="profile-panel profile-membership-panel">
      <header class="profile-panel-heading">
        <span class="membership-heading-icon">
          <Icon name="lucide:crown" aria-hidden="true" />
        </span>
        <h2>会员中心</h2>
      </header>

      <article class="membership-current">
        <div class="membership-current-main">
          <img class="membership-current-badge" :src="currentBadgeImage" alt="会员标识">
          <div class="membership-current-copy">
            <strong>年度会员</strong>
            <p>
              <Icon name="lucide:calendar" aria-hidden="true" />
              到期日期: 2026-12-31
            </p>
          </div>
        </div>
        <span class="membership-current-status">生效中</span>
      </article>

      <div class="membership-grid">
        <article
          v-for="plan in membershipPlans"
          :key="plan.name"
          class="membership-card"
        >
          <header class="membership-card-top" :class="plan.theme">
            <div class="membership-medal">
              <img :src="plan.badgeImage" :alt="plan.name">
            </div>
            <h3>{{ plan.name }}</h3>
            <p>{{ plan.subtitle }}</p>
          </header>

          <div class="membership-card-body">
            <div class="membership-price">
              <strong>{{ plan.price }}</strong>
              <span>{{ plan.unit }}</span>
            </div>

            <ul class="membership-benefits">
              <li v-for="benefit in plan.benefits" :key="benefit">
                {{ benefit }}
              </li>
            </ul>

            <button type="button" class="membership-action" :class="plan.theme">
              {{ plan.cta }}
            </button>
          </div>
        </article>
      </div>
    </section>

    <section class="profile-panel membership-compare-panel">
      <header class="profile-panel-heading">
        <span class="membership-heading-icon">
          <Icon name="lucide:crown" aria-hidden="true" />
        </span>
        <h2>权益对比</h2>
      </header>

      <div class="membership-compare-table-wrap">
        <table class="membership-compare-table">
          <thead>
            <tr>
              <th>功能</th>
              <th>月度会员</th>
              <th>年度会员</th>
              <th>终身会员</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, rowIndex) in compareRows" :key="`${row.feature}-${rowIndex}`">
              <td>{{ row.feature }}</td>
              <td>
                <span v-if="row.month === 'check'" class="compare-icon compare-check">
                  <Icon name="lucide:check" aria-hidden="true" />
                </span>
                <span v-else-if="row.month === 'cross'" class="compare-icon compare-cross">
                  <Icon name="lucide:x" aria-hidden="true" />
                </span>
                <span v-else class="compare-text compare-month">{{ row.month }}</span>
              </td>
              <td>
                <span v-if="row.year === 'check'" class="compare-icon compare-check">
                  <Icon name="lucide:check" aria-hidden="true" />
                </span>
                <span v-else-if="row.year === 'cross'" class="compare-icon compare-cross">
                  <Icon name="lucide:x" aria-hidden="true" />
                </span>
                <span v-else class="compare-text compare-year">{{ row.year }}</span>
              </td>
              <td>
                <span v-if="row.life === 'check'" class="compare-icon compare-life-check">
                  <Icon name="lucide:check" aria-hidden="true" />
                </span>
                <span v-else-if="row.life === 'cross'" class="compare-icon compare-cross">
                  <Icon name="lucide:x" aria-hidden="true" />
                </span>
                <span v-else class="compare-text compare-life">{{ row.life }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

  </section>
</template>

<script setup>
const membershipPlans = [
  {
    name: '月度会员',
    subtitle: '低门槛随心用，全功能按月畅享',
    price: '$9.99',
    unit: '/月',
    cta: '立即购买',
    badgeImage: '/images/profile/month.png',
    theme: 'theme-cyan',
    benefits: ['普通会员特权', '普通会员标识', '普通会员内容', '普通会员支持'],
  },
  {
    name: '年度会员',
    subtitle: '超值特惠，性价比拉满更省钱',
    price: '$69.99',
    unit: '/年',
    cta: '立即续费',
    badgeImage: '/images/profile/year.png',
    theme: 'theme-blue',
    benefits: ['普通会员特权', '普通会员标识', '普通会员内容', '普通会员支持'],
  },
  {
    name: '终身会员',
    subtitle: '一次付费永久畅用，免费更新',
    price: '$99.99',
    unit: '',
    cta: '立即升级',
    badgeImage: '/images/profile/gold.png',
    theme: 'theme-violet',
    benefits: ['普通会员特权', '普通会员标识', '普通会员内容', '普通会员支持'],
  },
]

const currentBadgeImage = '/images/profile/year.png'

const compareRows = [
  { feature: '预设场景', month: '5个', year: '不限', life: '不限' },
  { feature: '控制器', month: 'check', year: 'check', life: 'check' },
  { feature: '推广分成', month: '50%', year: '60%', life: '65%' },
  { feature: '控制器', month: 'check', year: 'check', life: 'check' },
  { feature: '多机位', month: 'check', year: 'check', life: 'check' },
  { feature: '控制器', month: 'check', year: 'check', life: 'check' },
  { feature: '美颜类型', month: 'cross', year: 'check', life: 'check' },
  { feature: '控制器', month: 'check', year: 'check', life: 'check' },
  { feature: '多机位', month: 'check', year: 'check', life: 'check' },
  { feature: '控制器', month: 'check', year: 'check', life: 'check' },
  { feature: '美颜类型', month: 'cross', year: 'check', life: 'check' },
]

</script>

<style scoped>
.profile-membership-panel {
  width: 869px;
  height: 650px;
}

.profile-membership-panel,
.membership-compare-panel {
  padding-top: 0 !important;
}

.profile-membership-panel .profile-panel-heading,
.membership-compare-panel .profile-panel-heading {
  height: 81px;
  min-height: 81px;
  padding-bottom: 0;
}

.membership-heading-icon {
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: rgba(34, 211, 238, 1);
  background: rgba(34, 211, 238, 0.14);
}

.membership-current {
  width: 809px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin-top: 18px;
  padding: 0 20px;
  border: 1px solid rgba(57, 78, 122, 1);
  border-radius: 10px;
  background: linear-gradient(90deg, rgba(47, 166, 221, 1), rgba(49, 128, 235, 1));
}

.membership-current-main {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.membership-current-badge {
  width: 28px;
  height: 28px;
  flex: 0 0 auto;
  object-fit: contain;
}

.membership-current-copy {
  min-width: 0;
}

.membership-current strong {
  display: block;
  color: rgba(255, 255, 255, 1);
  font-size: 15px;
  font-weight: 700;
  line-height: 22px;
}

.membership-current p {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 2px;
  color: rgba(223, 239, 255, 1);
  font-size: 13px;
  line-height: 19px;
}

.membership-current p svg {
  width: 14px;
  height: 14px;
  flex: 0 0 auto;
}

.membership-current-status {
  height: 34px;
  padding: 0 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(111, 187, 255, 0.7);
  border-radius: 999px;
  color: rgba(218, 239, 255, 1);
  background: rgba(31, 113, 226, 1);
  font-size: 13px;
  font-weight: 600;
  flex: 0 0 auto;
}

.membership-grid {
  display: grid;
  grid-template-columns: repeat(3, 256px);
  justify-content: space-between;
  gap: 14px;
  margin-top: 20px;
}

.membership-card {
  width: 256px;
  height: 426px;
  border: 1px solid rgba(50, 64, 96, 1);
  border-radius: 8px;
  background: rgba(15, 24, 42, 1);
  overflow: hidden;
}

.membership-card-top {
  width: 256px;
  height: 146px;
  display: grid;
  justify-items: center;
  align-content: center;
  text-align: center;
  padding: 10px 12px 8px;
}

.membership-card-top h3 {
  margin-top: 6px;
  color: rgba(243, 247, 255, 1);
  font-size: 16px;
  font-weight: 700;
  line-height: 22px;
}

.membership-card-top p {
  margin-top: 4px;
  color: rgba(226, 237, 255, 0.95);
  font-size: 12px;
  line-height: 18px;
}

.membership-medal {
  width: 52px;
  height: 52px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.membership-medal img {
  width: 52px;
  height: 52px;
  object-fit: contain;
}

.membership-card-body {
  min-height: 204px;
  display: grid;
  grid-template-rows: auto auto 1fr;
  padding: 12px 16px 14px;
}

.membership-price {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 2px;
  margin-top: 8px;
}

.membership-price strong {
  color: rgba(61, 180, 255, 1);
  font-size: 36px;
  font-weight: 800;
  line-height: 1;
}

.membership-price span {
  color: rgba(130, 161, 193, 1);
  font-size: 16px;
  line-height: 22px;
}

.membership-benefits {
  margin-top: 20px;
  display: grid;
  justify-items: center;
  gap: 10px;
  color: rgba(148, 164, 187, 1);
  font-size: 13px;
  line-height: 19px;
}

.membership-action {
  width: 216px;
  height: 42px;
  align-self: start;
  justify-self: center;
  margin-top: 31px;
  border-radius: 8px;
  color: rgba(237, 248, 255, 1);
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
}

.theme-cyan {
  background: linear-gradient(90deg, rgba(88, 161, 233, 1), rgba(53, 201, 233, 1));
}

.membership-action.theme-cyan {
  background: linear-gradient(90deg, rgba(47, 196, 235, 1), rgba(93, 204, 235, 1));
}

.theme-blue {
  background: linear-gradient(90deg, rgba(63, 151, 232, 1), rgba(54, 127, 226, 1));
}

.membership-action.theme-blue {
  background: linear-gradient(90deg, rgba(46, 141, 234, 1), rgba(56, 116, 235, 1));
}

.theme-violet {
  background: linear-gradient(90deg, rgba(191, 167, 243, 1), rgba(137, 72, 236, 1));
}

.membership-action.theme-violet {
  background: linear-gradient(90deg, rgba(180, 166, 246, 1), rgba(121, 78, 237, 1));
}

.membership-card:nth-child(3) .membership-price strong {
  color: rgba(182, 129, 255, 1);
}

.membership-compare-panel {
  width: 869px;
  min-height: 0;
  height: 725px;
  padding-bottom: 20px;
}

.membership-compare-table-wrap {
  margin-top: 20px;
  border: 1px solid rgba(44, 56, 84, 1);
  border-radius: 8px;
  overflow: hidden;
  background: rgba(15, 24, 42, 1);
}

.membership-compare-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.membership-compare-table th,
.membership-compare-table td {
  height: 50px;
  padding: 0 10px;
  border-bottom: 1px solid rgba(38, 50, 76, 1);
  text-align: center;
  font-size: 13px;
}

.membership-compare-table thead th {
  background: rgba(17, 25, 39, 1);
  color: rgba(154, 172, 200, 1);
  font-weight: 600;
}

.membership-compare-table tbody tr:nth-child(odd) td {
  background: rgba(26, 34, 53, 1);
}

.membership-compare-table tbody tr:nth-child(even) td {
  background: rgba(30, 38, 57, 1);
}

.membership-compare-table tbody tr:last-child td {
  border-bottom: none;
}

.membership-compare-table th:first-child,
.membership-compare-table td:first-child {
  width: 24%;
  text-align: left;
  padding-left: 14px;
  color: rgba(215, 226, 246, 1);
}

.compare-text {
  font-size: 13px;
  font-weight: 500;
}

.compare-month,
.compare-year {
  color: rgba(34, 211, 238, 1);
}

.compare-life {
  color: rgba(208, 177, 255, 1);
}

.compare-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.compare-icon svg {
  width: 16px;
  height: 16px;
}

.compare-check {
  color: rgba(34, 211, 238, 1);
}

.compare-life-check {
  color: rgba(208, 177, 255, 1);
}

.compare-cross {
  color: rgba(255, 95, 58, 1);
}

@media (max-width: 900px) {
  .profile-membership-panel {
    width: 100%;
    height: auto;
  }

  .membership-compare-panel {
    width: 100%;
    height: auto;
    min-height: 0 !important;
  }

  .membership-grid {
    grid-template-columns: 1fr;
    justify-content: center;
    gap: 16px;
  }

  .membership-card,
  .membership-card-top {
    width: 100%;
    max-width: 100%;
  }

  .membership-card {
    height: auto;
  }

  .membership-current {
    width: 100%;
    height: auto;
    min-height: 92px;
    align-items: flex-start;
    flex-direction: column;
    justify-content: center;
    padding: 12px 16px;
  }

  .membership-action {
    width: 100%;
    max-width: 216px;
  }

  .membership-compare-table-wrap {
    overflow-x: auto;
  }

  .membership-compare-table {
    min-width: 640px;
  }

}
</style>
