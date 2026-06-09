<template>
  <section class="profile-content" :aria-label="membershipText.ariaLabel">
    <section class="profile-panel profile-membership-panel">
      <header class="profile-panel-heading">
        <span class="membership-heading-icon">
          <Icon name="lucide:crown" aria-hidden="true" />
        </span>
        <h2>{{ membershipText.title }}</h2>
      </header>

      <article class="membership-current">
        <div class="membership-current-main">
          <img class="membership-current-badge" :src="currentMembershipBadgeImage" :alt="membershipText.badgeAlt">
          <div class="membership-current-copy">
            <strong>{{ currentVipName }}</strong>
            <p>
              <Icon name="lucide:calendar" aria-hidden="true" />
              {{ currentVipExpireText }}
            </p>
          </div>
        </div>
        <span class="membership-current-status">{{ currentVipStatusText }}</span>
      </article>

      <div class="membership-grid">
        <article
          v-for="plan in membershipPlans"
          :key="plan.id"
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
            <div v-if="plan.originalPrice" class="membership-original-price">{{ plan.originalPrice }}</div>

            <ul class="membership-benefits">
              <li v-for="benefit in plan.benefits" :key="benefit">
                <Icon class="membership-benefit-icon" name="lucide:check" aria-hidden="true" />
                <span>{{ benefit }}</span>
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
        <h2>{{ membershipText.compareTitle }}</h2>
      </header>

      <div class="membership-compare-table-wrap">
        <table class="membership-compare-table">
          <thead>
            <tr>
              <th>{{ membershipText.compareHeaders?.feature }}</th>
              <th>{{ membershipText.compareHeaders?.month }}</th>
              <th>{{ membershipText.compareHeaders?.year }}</th>
              <th>{{ membershipText.compareHeaders?.life }}</th>
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
const { authUser } = useAuth()
const { vipPlans, loadVipTypes } = useVipTypes()
const { profileBox } = useProfileText()

const membershipText = computed(() => profileBox.value?.membership || {})

const normalizePlanText = value => String(value || '').trim()
const normalizePriceValue = value => normalizePlanText(value).replace(/[,¥￥$]/g, '').trim()
const normalizePlanType = value => {
  const type = normalizePlanText(value).toLowerCase()

  if (['month', 'monthly', 'm', 'monthly-plan'].includes(type)) {
    return 'month'
  }

  if (['year', 'yearly', 'annual', 'y', 'yearly-plan'].includes(type)) {
    return 'year'
  }

  if (['life', 'lifetime', 'permanent', 'l', 'lifetime-plan'].includes(type)) {
    return 'life'
  }

  return type
}

const membershipPlanMeta = {
  month: {
    theme: 'theme-cyan',
    badgeImage: '/images/profile/month.png',
  },
  year: {
    theme: 'theme-blue',
    badgeImage: '/images/profile/year.png',
  },
  life: {
    theme: 'theme-violet',
    badgeImage: '/images/profile/gold.png',
  },
}

const normalizeMembershipPlan = (plan = {}, index = 0) => {
  const type = normalizePlanType(plan.type || plan.id)
  const meta = membershipPlanMeta[type] || membershipPlanMeta.month

  return {
    id: normalizePlanText(plan.id || `${type || 'membership'}-plan-${index}`),
    productId: normalizePlanText(plan.productId),
    type,
    name: normalizePlanText(plan.name),
    subtitle: normalizePlanText(plan.subtitle || plan.description),
    price: normalizePlanText(plan.price),
    originalPrice: normalizePlanText(plan.originalPrice),
    unit: normalizePlanText(plan.unit),
    cta: normalizePlanText(plan.cta),
    theme: meta.theme,
    badgeImage: meta.badgeImage,
    benefits: Array.isArray(plan.benefits) ? plan.benefits.map(normalizePlanText).filter(Boolean) : [],
  }
}

const isMatchingSourcePlan = (source = {}, type = '') => {
  const text = [
    source.id,
    source.name,
    source.description,
    source.subtitle,
    source.unit,
    source.price,
  ].map(normalizePlanText).join(' ')
  const normalizedText = text.toLowerCase()
  const code = normalizePlanText(source.name || source.id).toUpperCase()
  const price = normalizePriceValue(source.price)

  if (type === 'life') {
    return code === 'L' || normalizedText.includes('life') || normalizedText.includes('lifetime') || text.includes('\u7ec8\u8eab') || text.includes('\u6c38\u4e45') || /89\.99|99\.99/.test(price)
  }

  if (type === 'year') {
    return code === 'Y' || normalizedText.includes('year') || normalizedText.includes('annual') || text.includes('\u5e74') || price.includes('69.99')
  }

  if (type === 'month') {
    return code === 'M' || normalizedText.includes('month') || text.includes('\u6708') || price.includes('9.99')
  }

  return false
}

const findSourcePlan = (type) => {
  const sourcePlans = Array.isArray(vipPlans.value) ? vipPlans.value : []

  return sourcePlans.find(plan => isMatchingSourcePlan(plan, type)) || null
}
const resolveVipBadgeImage = (value) => {
  const vipType = String(value || '').trim()
  const normalizedVipType = vipType.toLowerCase()
  const vipTypeCode = vipType.toUpperCase()

  if (
    vipTypeCode === 'L' ||
    normalizedVipType.includes('life') ||
    normalizedVipType.includes('lifetime') ||
    normalizedVipType.includes('permanent') ||
    normalizedVipType.includes('\u7ec8\u8eab') ||
    normalizedVipType.includes('\u6c38\u4e45')
  ) {
    return '/images/profile/gold.png'
  }

  if (
    vipTypeCode === 'Y' ||
    normalizedVipType.includes('year') ||
    normalizedVipType.includes('annual') ||
    normalizedVipType.includes('\u5e74')
  ) {
    return '/images/profile/year.png'
  }

  if (
    vipTypeCode === 'M' ||
    normalizedVipType.includes('month') ||
    normalizedVipType.includes('monthly') ||
    normalizedVipType.includes('\u6708')
  ) {
    return '/images/profile/month.png'
  }

  return '/images/profile/year.png'
}

const membershipPlans = computed(() => {
  const plans = Array.isArray(membershipText.value.plans) ? membershipText.value.plans : []

  return plans
    .map(normalizeMembershipPlan)
    .filter(plan => plan.name || plan.price || plan.benefits.length)
    .map(plan => ({
      ...plan,
      id: plan.productId || findSourcePlan(plan.type)?.id || plan.id,
    }))
})

const currentVipName = computed(() => {
  return authUser.value?.vip_type ? 'VIP' : membershipText.value.defaultVipName || ''
})

const currentVipExpireText = computed(() => {
  return authUser.value?.vip_endtime
    ? `${membershipText.value.expirePrefix || ''} ${authUser.value.vip_endtime}`.trim()
    : `${membershipText.value.expirePrefix || ''} ${membershipText.value.emptyExpireDate || ''}`.trim()
})

const currentVipStatusText = computed(() => {
  return authUser.value?.vip_type
    ? membershipText.value.activeStatus || ''
    : membershipText.value.inactiveStatus || ''
})

const currentMembershipBadgeImage = computed(() => {
  return resolveVipBadgeImage(authUser.value?.vip_type)
})

const compareRows = computed(() => Array.isArray(membershipText.value.compareRows) ? membershipText.value.compareRows : [])

onMounted(() => {
  loadVipTypes()
})

</script>

<style scoped>
.profile-membership-panel {
  width: 869px;
  min-height: 650px;
  height: auto;
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
  color: var(--theme-accent);
  background: var(--theme-accent-soft);
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
  border: none;
  border-radius: 10px;
  background: linear-gradient(90deg, var(--theme-extra-47-166-221-1), var(--theme-extra-49-128-235-1));
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
  color: var(--theme-white);
  font-size: 15px;
  font-weight: 700;
  line-height: 22px;
}

.membership-current p {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 2px;
  color: var(--theme-extra-223-239-255-1);
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
  border: 1px solid var(--theme-extra-111-187-255-07);
  border-radius: 999px;
  color: var(--theme-extra-218-239-255-1);
  background: var(--theme-extra-31-113-226-1);
  font-size: 13px;
  font-weight: 600;
  flex: 0 0 auto;
}

.membership-grid {
  display: grid;
  grid-template-columns: repeat(3, 256px);
  justify-content: space-between;
  align-items: stretch;
  gap: 14px;
  margin-top: 20px;
}

.membership-card {
  width: 256px;
  min-height: 426px;
  display: grid;
  grid-template-rows: 132px minmax(0, 1fr);
  border: 1px solid var(--theme-membership-card-border, var(--theme-border-card));
  border-radius: 8px;
  background: var(--theme-membership-card-background, var(--theme-panel-code));
  overflow: hidden;
}

.membership-card-top {
  width: 256px;
  height: 132px;
  display: grid;
  justify-items: center;
  align-content: center;
  text-align: center;
  padding: 8px 12px 7px;
}

.membership-card-top h3 {
  margin-top: 6px;
  color: var(--theme-extra-243-247-255-1);
  font-size: 16px;
  font-weight: 700;
  line-height: 22px;
  max-width: 100%;
  overflow: hidden;
  overflow-wrap: anywhere;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.membership-card-top p {
  margin-top: 4px;
  color: var(--theme-extra-226-237-255-095);
  font-size: 12px;
  line-height: 18px;
  max-width: 100%;
  overflow: hidden;
  overflow-wrap: anywhere;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.membership-medal {
  width: 44px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.membership-medal img {
  width: 44px;
  height: 44px;
  object-fit: contain;
}

.membership-card-body {
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding: 14px 20px 20px;
}

.membership-price {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 2px;
  margin-top: 0;
}

.membership-price strong {
  color: var(--theme-extra-61-180-255-1);
  font-size: 34px;
  font-weight: 800;
  line-height: 1;
}

.membership-price span {
  color: var(--theme-extra-130-161-193-1);
  font-size: 16px;
  line-height: 22px;
}

.membership-original-price {
  margin-top: 6px;
  color: var(--theme-text-subtle);
  font-size: 13px;
  line-height: 18px;
  text-align: center;
  text-decoration: line-through;
}

.membership-benefits {
  min-height: 0;
  flex: 1 1 auto;
  margin-top: 18px;
  display: grid;
  justify-items: stretch;
  align-content: start;
  gap: 9px;
  overflow: hidden;
  color: var(--theme-membership-card-body-text, var(--theme-extra-148-164-187-1));
  font-size: 13px;
  line-height: 18px;
}

.membership-benefits li {
  max-width: 100%;
  min-width: 0;
  display: grid;
  grid-template-columns: 14px minmax(0, 1fr);
  align-items: start;
  gap: 8px;
  overflow: hidden;
  text-align: left;
}

.membership-benefit-icon {
  width: 14px;
  height: 14px;
  margin-top: 2px;
  color: var(--theme-extra-61-180-255-1);
  stroke-width: 3;
}

.membership-card:nth-child(2) .membership-benefit-icon {
  color: var(--theme-extra-46-141-234-1);
}

.membership-card:nth-child(3) .membership-benefit-icon {
  color: var(--theme-purple-light);
}

.membership-benefits span {
  min-width: 0;
  overflow: hidden;
  overflow-wrap: anywhere;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.membership-action {
  width: 100%;
  height: 42px;
  align-self: end;
  justify-self: center;
  margin-top: 18px;
  border-radius: 8px;
  color: var(--theme-extra-237-248-255-1);
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
}

.theme-cyan {
  background: linear-gradient(90deg, var(--theme-extra-88-161-233-1), var(--theme-extra-53-201-233-1));
}

.membership-action.theme-cyan {
  background: linear-gradient(90deg, var(--theme-extra-47-196-235-1), var(--theme-extra-93-204-235-1));
}

.theme-blue {
  background: linear-gradient(90deg, var(--theme-extra-63-151-232-1), var(--theme-extra-54-127-226-1));
}

.membership-action.theme-blue {
  background: linear-gradient(90deg, var(--theme-extra-46-141-234-1), var(--theme-extra-56-116-235-1));
}

.theme-violet {
  background: linear-gradient(90deg, var(--theme-extra-191-167-243-1), var(--theme-extra-137-72-236-1));
}

.membership-action.theme-violet {
  background: linear-gradient(90deg, var(--theme-extra-180-166-246-1), var(--theme-extra-121-78-237-1));
}

.membership-card:nth-child(3) .membership-price strong {
  color: var(--theme-purple-light);
}

.membership-compare-panel {
  width: 869px;
  min-height: 0;
  height: 725px;
  padding-bottom: 20px;
}

.membership-compare-table-wrap {
  margin-top: 20px;
  border: 1px solid var(--theme-profile-table-border, var(--theme-border-code));
  border-radius: 8px;
  overflow: hidden;
  background: var(--theme-profile-table-background, var(--theme-panel-code));
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
  border-bottom: 1px solid var(--theme-profile-table-border, var(--theme-border-table));
  color: var(--theme-profile-table-text, var(--theme-text-table));
  text-align: center;
  font-size: 13px;
}

.membership-compare-table thead th {
  background: var(--theme-profile-table-head-background, var(--theme-extra-17-25-39-1));
  color: var(--theme-profile-table-head-text, var(--theme-text-slate));
  font-weight: 600;
}

.membership-compare-table tbody tr:nth-child(odd) td {
  background: var(--theme-profile-table-row-background, var(--theme-panel));
}

.membership-compare-table tbody tr:nth-child(even) td {
  background: var(--theme-profile-table-row-alt-background, var(--theme-panel-row));
}

.membership-compare-table tbody tr:last-child td {
  border-bottom: none;
}

.membership-compare-table th:first-child,
.membership-compare-table td:first-child {
  width: 24%;
  text-align: left;
  padding-left: 14px;
  color: var(--theme-profile-table-text, var(--theme-text-table));
}

.compare-text {
  font-size: 13px;
  font-weight: 500;
}

.compare-month,
.compare-year {
  color: var(--theme-accent);
}

.compare-life {
  color: var(--theme-extra-208-177-255-1);
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
  color: var(--theme-accent);
}

.compare-life-check {
  color: var(--theme-extra-208-177-255-1);
}

.compare-cross {
  color: var(--theme-extra-255-95-58-1);
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
    min-height: 0;
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
