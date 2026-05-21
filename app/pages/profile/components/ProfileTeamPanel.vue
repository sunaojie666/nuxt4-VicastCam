<template>
  <section class="profile-content" :aria-label="teamText.ariaLabel">
    <section class="profile-panel team-panel">
      <header class="profile-panel-heading team-panel-heading">
        <span>
          <Icon name="lucide:users-round" aria-hidden="true" />
        </span>
        <h2>{{ teamText.title }}</h2>
      </header>

      <article class="team-referrer-card">
        <div class="team-referrer-main">
          <span class="team-referrer-avatar">{{ referrerInitial }}</span>
          <div>
            <p>{{ teamText.referrerLabel }}</p>
            <strong>{{ referrerName }}</strong>
          </div>
        </div>
        <button type="button" class="team-referrer-action">{{ teamText.parentButton }}</button>
      </article>

      <div class="team-toolbar">
        <div class="team-level-tabs">
          <button
            type="button"
            :class="['team-level-tab', { 'team-level-tab-active': selectedLevel === '1' }]"
            @click="selectedLevel = '1'"
          >
            {{ teamText.levelOne }}
            <span>{{ levelTotals[1] }}</span>
          </button>
          <button
            type="button"
            :class="['team-level-tab', { 'team-level-tab-active': selectedLevel === '2' }]"
            @click="selectedLevel = '2'"
          >
            {{ teamText.levelTwo }}
            <span>{{ levelTotals[2] }}</span>
          </button>
        </div>

        <div ref="monthFilter" class="team-month-filter">
          <button
            type="button"
            :class="['team-month-button', { 'team-month-button-active': isMonthPickerOpen }]"
            :aria-label="commonText.monthSelectLabel"
            @click="toggleMonthPicker"
          >
            <Icon name="lucide:calendar-days" aria-hidden="true" />
          </button>

          <div v-if="isMonthPickerOpen" class="team-month-popover">
            <header class="team-month-popover-header">
              <button type="button" class="team-month-year-button" @click="pickerYear--">
                <Icon name="lucide:chevron-left" aria-hidden="true" />
              </button>
              <strong>{{ pickerYear }}{{ commonText.yearSuffix }}</strong>
              <button
                type="button"
                class="team-month-year-button"
                :disabled="pickerYear >= currentYear"
                @click="pickerYear++"
              >
                <Icon name="lucide:chevron-right" aria-hidden="true" />
              </button>
            </header>

            <div class="team-month-grid">
              <button
                v-for="month in monthOptions"
                :key="month.value"
                type="button"
                :class="['team-month-option', { 'team-month-option-active': selectedMonth === createMonthValue(pickerYear, month.value) }]"
                :disabled="isFutureMonth(pickerYear, month.value)"
                @click="selectMonth(pickerYear, month.value)"
              >
                {{ month.label }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="team-table-wrap">
        <table class="team-table">
          <thead>
            <tr>
              <th>{{ teamText.tableHeaders?.name }}</th>
              <th>{{ teamText.tableHeaders?.status }}</th>
              <th>{{ teamText.tableHeaders?.joinedAt }}</th>
            </tr>
          </thead>
          <tbody v-if="!isLoadingTeam && pagedRows.length">
            <tr v-for="row in pagedRows" :key="row.id">
              <td class="team-member-name">{{ row.name }}</td>
              <td>
                <span :class="['team-member-status', row.statusClass]">{{ row.status }}</span>
              </td>
              <td>{{ row.joinedAt }}</td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="3" class="team-empty-cell">{{ teamTableMessage }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="team-pagination">
        <button
          type="button"
          :disabled="currentPage === 1"
          class="team-page-arrow"
          @click="currentPage--"
        >
          <Icon name="lucide:chevron-left" aria-hidden="true" />
        </button>
        <button
          v-for="page in totalPages"
          :key="page"
          type="button"
          :class="['team-page-number', { 'team-page-number-active': currentPage === page }]"
          @click="currentPage = page"
        >
          {{ page }}
        </button>
        <button
          type="button"
          :disabled="currentPage === totalPages"
          class="team-page-arrow"
          @click="currentPage++"
        >
          <Icon name="lucide:chevron-right" aria-hidden="true" />
        </button>
      </div>
    </section>
  </section>
</template>

<script setup>
import { getTeamList } from '../../../api/request/auth'

const { authUser } = useAuth()
const { requestLoadingText } = useSiteToast()
const { profileBox } = useProfileText()
const selectedLevel = ref('1')
const selectedMonth = ref('')
const isMonthPickerOpen = ref(false)
const pickerYear = ref(new Date().getFullYear())
const monthFilter = ref(null)
const currentPage = ref(1)
const pageSize = 10
const teamRows = ref([])
const referrer = ref(null)
const levelTotals = reactive({
  1: 0,
  2: 0,
})
const isLoadingTeam = ref(false)
const teamLoadError = ref('')

const commonText = computed(() => profileBox.value?.common || {})
const teamText = computed(() => profileBox.value?.team || {})
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

selectedMonth.value = currentMonth.value

const pickTeamValue = (...values) => {
  return values.find(value => value !== undefined && value !== null && value !== '')
}

const getResponseData = (response) => {
  return response?.data || response || {}
}

const getTeamItems = (response) => {
  const data = getResponseData(response)
  const items = data.list || data.rows || data.items || data.records || data.team_list || data.teamList || response?.list || response?.rows || []

  return Array.isArray(items) ? items : []
}

const getTeamTotal = (response, fallbackLength) => {
  const data = getResponseData(response)
  const total = pickTeamValue(data.total, data.count, data.total_count, data.totalCount, response?.total, response?.count)

  return Number(total) || fallbackLength
}

const getTeamReferrer = (response) => {
  const data = getResponseData(response)
  const referrerValue = data.parent || data.referrer || data.recommender || data.inviter || data.parent_user || data.parentUser || response?.parent || response?.referrer

  return referrerValue && typeof referrerValue === 'object' ? referrerValue : null
}

const createMemberStatus = (member = {}) => {
  const rawStatus = String(pickTeamValue(member.vip_type, member.vipType, member.vip_level, member.vipLevel, member.member_type, member.memberType, member.status, '') || '')
  const normalized = rawStatus.toLowerCase()

  if (normalized.includes('life') || rawStatus.includes('终身')) {
    return { status: teamText.value.memberStatus?.life || '', statusClass: 'status-life' }
  }

  if (normalized.includes('year') || rawStatus.includes('年')) {
    return { status: teamText.value.memberStatus?.year || '', statusClass: 'status-year' }
  }

  if (normalized.includes('month') || rawStatus.includes('月')) {
    return { status: teamText.value.memberStatus?.month || '', statusClass: 'status-month' }
  }

  return {
    status: rawStatus || teamText.value.memberStatus?.free || '',
    statusClass: rawStatus ? 'status-month' : 'status-free',
  }
}

const createTeamRow = (member = {}, index) => {
  const memberStatus = createMemberStatus(member)

  return {
    id: pickTeamValue(member.user_id, member.uid, member.id, member.email, `${selectedLevel.value}-${currentPage.value}-${index}`),
    name: String(pickTeamValue(member.nickname, member.nick_name, member.name, member.username, member.email, member.mobile, teamText.value.emptyMemberName || '')),
    joinedAt: String(pickTeamValue(member.created_at, member.createdAt, member.joined_at, member.joinedAt, member.create_time, member.createTime, '-')),
    ...memberStatus,
  }
}

const totalPages = computed(() => Math.max(1, Math.ceil((levelTotals[selectedLevel.value] || 0) / pageSize)))
const pagedRows = computed(() => teamRows.value)
const referrerName = computed(() => {
  return pickTeamValue(referrer.value?.nickname, referrer.value?.nick_name, referrer.value?.name, referrer.value?.username, referrer.value?.email, referrer.value?.mobile, teamText.value.emptyReferrer || '')
})
const referrerInitial = computed(() => {
  return String(referrerName.value || '-').trim().slice(0, 1).toUpperCase() || '-'
})
const teamTableMessage = computed(() => {
  if (isLoadingTeam.value) {
    return requestLoadingText.value
  }

  if (teamLoadError.value) {
    return teamLoadError.value
  }

  return teamText.value.emptyTeam || ''
})

const loadTeamList = () => {
  const userId = authUser.value?.user_id

  if (!userId) {
    teamRows.value = []
    levelTotals[selectedLevel.value] = 0
    teamLoadError.value = commonText.value.userMissing || ''
    return
  }

  isLoadingTeam.value = true
  teamLoadError.value = ''

  getTeamList({
    user_id: userId,
    level: selectedLevel.value,
    month: selectedMonth.value,
    page_index: currentPage.value,
    page_size: pageSize,
  }).then(
    response => {
      const items = getTeamItems(response)

      referrer.value = getTeamReferrer(response)
      teamRows.value = items.map(createTeamRow)
      levelTotals[selectedLevel.value] = getTeamTotal(response, items.length)
      isLoadingTeam.value = false
    },
    () => {
      teamRows.value = []
      levelTotals[selectedLevel.value] = 0
      teamLoadError.value = teamText.value.errors?.loadFail || ''
      isLoadingTeam.value = false
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

watch([selectedLevel, selectedMonth], () => {
  if (currentPage.value !== 1) {
    currentPage.value = 1
    return
  }

  currentPage.value = 1
  loadTeamList()
})

watch(currentPage, () => {
  loadTeamList()
})

watch(selectedMonth, (month) => {
  pickerYear.value = Number(String(month || currentMonth.value).slice(0, 4)) || currentYear.value
})

watch(totalPages, () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value
  }
})

onMounted(() => {
  loadTeamList()
  document.addEventListener('click', closeMonthPickerOnOutsideClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', closeMonthPickerOnOutsideClick)
})
</script>

<style scoped>
.team-panel {
  min-height: 883px !important;
  height: 883px !important;
  padding-top: 0 !important;
  padding-bottom: 30px;
  display: grid;
  grid-template-rows: auto auto auto minmax(0, 1fr) auto;
  align-content: start;
  gap: 0;
}

.team-panel-heading {
  min-height: 81px;
  height: 81px;
  padding-bottom: 0;
}

.team-referrer-card {
  min-height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
  padding: 0 14px;
  border: 1px solid rgba(46, 58, 84, 1);
  border-radius: 10px;
  background: rgba(31, 44, 67, 0.55);
}

.team-referrer-main {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.team-referrer-avatar {
  width: 30px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  color: rgba(237, 247, 255, 1);
  background: rgba(52, 189, 255, 1);
  font-size: 16px;
  font-weight: 700;
}

.team-referrer-main p {
  color: rgba(145, 161, 189, 1);
  font-size: 12px;
  line-height: 16px;
}

.team-referrer-main strong {
  display: block;
  margin-top: 2px;
  color: rgba(236, 244, 255, 1);
  font-size: 16px;
  line-height: 22px;
  font-weight: 700;
}

.team-referrer-action {
  width: 84px;
  height: 34px;
  border-radius: 999px;
  color: rgba(27, 213, 244, 1);
  background: rgba(25, 126, 159, 0.35);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.team-level-tabs {
  display: flex;
  align-items: center;
  gap: 16px;
}

.team-toolbar {
  position: relative;
  z-index: 6;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-top: 20px;
}

.team-level-tab {
  min-width: 94px;
  height: 34px;
  padding: 0 12px;
  border: 1px solid rgba(45, 58, 86, 1);
  border-radius: 10px;
  color: rgba(146, 162, 189, 1);
  background: rgba(18, 30, 51, 1);
  font-size: 14px;
  line-height: 20px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.team-level-tab span {
  color: rgba(132, 149, 178, 1);
}

.team-level-tab-active {
  color: rgba(209, 237, 255, 1);
  border-color: rgba(38, 130, 176, 1);
  background: rgba(20, 101, 145, 0.35);
}

.team-level-tab-active span {
  color: rgba(38, 196, 245, 1);
}

.team-month-filter {
  position: relative;
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.team-month-button {
  width: 34px;
  height: 34px;
  border: 1px solid rgba(45, 58, 86, 1);
  border-radius: 9px;
  color: rgba(148, 163, 184, 1);
  background: rgba(31, 41, 61, 1);
  cursor: pointer;
}

.team-month-button svg {
  width: 17px;
  height: 17px;
}

.team-month-button:hover,
.team-month-button:focus,
.team-month-button-active {
  color: rgba(209, 237, 255, 1);
  border-color: rgba(62, 91, 135, 1);
}

.team-month-popover {
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

.team-month-popover-header {
  height: 32px;
  display: grid;
  grid-template-columns: 32px minmax(0, 1fr) 32px;
  align-items: center;
  gap: 8px;
  color: rgba(232, 242, 255, 1);
}

.team-month-popover-header strong {
  font-size: 14px;
  line-height: 20px;
  text-align: center;
}

.team-month-year-button {
  width: 32px;
  height: 32px;
  border: 1px solid rgba(45, 58, 86, 1);
  border-radius: 8px;
  color: rgba(148, 163, 184, 1);
  background: rgba(18, 30, 51, 1);
  cursor: pointer;
}

.team-month-year-button:disabled {
  opacity: 0.38;
  cursor: not-allowed;
}

.team-month-year-button svg {
  width: 16px;
  height: 16px;
}

.team-month-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-top: 12px;
}

.team-month-option {
  height: 34px;
  border: 1px solid rgba(45, 58, 86, 1);
  border-radius: 8px;
  color: rgba(148, 163, 184, 1);
  background: rgba(18, 30, 51, 1);
  font-size: 13px;
  line-height: 18px;
  cursor: pointer;
}

.team-month-option:hover,
.team-month-option:focus {
  color: rgba(209, 237, 255, 1);
  border-color: rgba(38, 130, 176, 1);
}

.team-month-option-active {
  color: rgba(221, 244, 255, 1);
  border-color: rgba(38, 130, 176, 1);
  background: rgba(20, 101, 145, 0.6);
}

.team-month-option:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.team-table-wrap {
  margin-top: 20px;
  align-self: start;
  border: 1px solid rgba(44, 56, 84, 1);
  border-radius: 8px;
  overflow: hidden;
  background: rgba(15, 24, 42, 1);
}

.team-table {
  width: 100%;
  border-collapse: collapse;
}

.team-table th,
.team-table td {
  height: 50px;
  padding: 0 10px;
  border-bottom: 1px solid rgba(38, 50, 76, 1);
  color: rgba(215, 226, 246, 1);
  font-size: 14px;
  text-align: center;
}

.team-table thead th {
  background: rgba(17, 25, 39, 1);
  color: rgba(154, 172, 200, 1);
  font-size: 14px;
  font-weight: 600;
}

.team-table tbody tr:nth-child(odd) td {
  background: rgba(26, 34, 53, 1);
}

.team-table tbody tr:nth-child(even) td {
  background: rgba(30, 38, 57, 1);
}

.team-table tbody tr:last-child td {
  border-bottom: none;
}

.team-table th:first-child,
.team-table td:first-child {
  text-align: left;
  padding-left: 14px;
}

.team-member-name {
  color: rgba(242, 247, 255, 1) !important;
  font-size: 16px !important;
  line-height: 22px;
  font-weight: 700;
}

.team-member-status {
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
}

.team-table tbody td:nth-child(3) {
  color: rgba(149, 156, 168, 1);
}

.team-empty-cell {
  height: 120px !important;
  color: rgba(149, 156, 168, 1) !important;
  text-align: center !important;
}

.status-free {
  min-width: 84px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  color: rgba(154, 167, 189, 1);
  background: rgba(50, 62, 88, 1);
}

.status-life {
  color: rgba(34, 211, 238, 1);
}

.status-month {
  color: rgba(72, 156, 255, 1);
}

.status-year {
  color: rgba(234, 221, 70, 1);
}

.team-pagination {
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
}

.team-page-arrow,
.team-page-number {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  color: rgba(130, 147, 175, 1);
  font-size: 14px;
  cursor: pointer;
}

.team-page-arrow:disabled {
  opacity: 0.35;
  cursor: default;
}

.team-page-number-active {
  color: rgba(221, 244, 255, 1);
  background: rgba(13, 113, 175, 1);
}

@media (max-width: 900px) {
  .team-panel {
    min-height: 0 !important;
    height: auto !important;
  }

  .team-table-wrap {
    overflow-x: auto;
  }

  .team-table {
    min-width: 640px;
  }

  .team-toolbar {
    align-items: center;
    flex-direction: row;
  }

  .team-month-filter {
    flex: 0 0 auto;
  }
}
</style>
