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
          <span :class="['team-referrer-avatar', { 'team-referrer-avatar-image': referrerAvatar }]">
            <img v-if="referrerAvatar" :src="referrerAvatar" :alt="referrerName">
            <span v-else>{{ referrerInitial }}</span>
          </span>
          <div>
            <p>{{ teamText.referrerLabel }}</p>
            <strong>{{ referrerName }}</strong>
          </div>
        </div>
      </article>

      <div class="team-toolbar">
        <div class="team-level-tabs">
          <button
            type="button"
            :class="['team-level-tab', { 'team-level-tab-active': selectedLevel === '1' }]"
            @click="selectedLevel = '1'"
          >
            {{ teamText.levelOne }}
            <span>{{ teamDisplayTotals[1] }}</span>
          </button>
          <button
            type="button"
            :class="['team-level-tab', { 'team-level-tab-active': selectedLevel === '2' }]"
            @click="selectedLevel = '2'"
          >
            {{ teamText.levelTwo }}
            <span>{{ teamDisplayTotals[2] }}</span>
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
        <div v-if="isLoadingTeam" class="team-table-loading" aria-hidden="true">
          <span class="team-table-loading-spinner"></span>
        </div>
      </div>

      <div v-if="!isLoadingTeam && pagedRows.length" class="team-pagination">
        <button
          type="button"
          :disabled="currentPage === 1"
          class="team-page-arrow"
          @click="goToPage(currentPage - 1)"
        >
          <Icon name="lucide:chevron-left" aria-hidden="true" />
        </button>
        <button
          v-for="page in pages"
          :key="page"
          type="button"
          :class="['team-page-number', { 'team-page-number-active': currentPage === page }]"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
        <button
          type="button"
          :disabled="currentPage === totalPages"
          class="team-page-arrow"
          @click="goToPage(currentPage + 1)"
        >
          <Icon name="lucide:chevron-right" aria-hidden="true" />
        </button>
        <ProfilePaginationJump
          :current-page="currentPage"
          :max-page="totalPages"
          :disabled="isLoadingTeam"
          @jump="goToPage"
        />
      </div>
    </section>
  </section>
</template>

<script setup>
import { getTeamInfo, getTeamList } from '../../../api/request/auth'

const { authUser } = useAuth()
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
const referrerDefaultAvatar = ref('')
const levelTotals = reactive({
  1: 0,
  2: 0,
})
const teamInfoTotals = reactive({
  1: null,
  2: null,
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

const getTeamTotal = (response, itemCount) => {
  const data = getResponseData(response)
  const total = pickTeamValue(data.total, data.count, data.total_count, data.totalCount, response?.total, response?.count)

  return Number(total) || itemCount
}

const createTeamInfoCount = (value) => {
  const count = Number(value)

  return Number.isFinite(count) && count >= 0 ? count : 0
}

const applyTeamInfoTotals = (response) => {
  const data = getResponseData(response)

  teamInfoTotals[1] = createTeamInfoCount(pickTeamValue(data.first_count, data.firstCount))
  teamInfoTotals[2] = createTeamInfoCount(pickTeamValue(data.second_count, data.secondCount))
  referrerDefaultAvatar.value = String(data.default_avatar || '').trim()
}

const getTeamReferrer = (response) => {
  const data = getResponseData(response)
  const referrerValue = pickTeamValue(
    data.superior,
    response?.superior,
    data.parent,
    data.referrer,
    data.recommender,
    data.inviter,
    data.parent_user,
    data.parentUser,
    response?.parent,
    response?.referrer
  )

  return referrerValue || null
}

const getTeamMemberStatusText = (key) => {
  return teamText.value.memberStatus?.[key] || ''
}

const createMemberStatus = (member = {}) => {
  const isVip = Number(pickTeamValue(member.is_vip, member.isVip, 0))

  return {
    status: getTeamMemberStatusText(isVip === 1 ? 'vip' : 'free'),
    statusClass: isVip === 1 ? 'status-vip' : 'status-free',
  }
}

const createTeamRow = (member = {}, index) => {
  const memberStatus = createMemberStatus(member)

  return {
    id: pickTeamValue(member.user_id, member.uid, member.id, member.email, `${selectedLevel.value}-${currentPage.value}-${index}`),
    name: String(pickTeamValue(member.user_name, member.userName, teamText.value.emptyMemberName || '')),
    joinedAt: String(pickTeamValue(member.created_at, member.createdAt, member.joined_at, member.joinedAt, member.create_time, member.createTime, '')),
    ...memberStatus,
  }
}

const totalPages = computed(() => Math.max(1, Math.ceil((levelTotals[selectedLevel.value] || 0) / pageSize)))
const pages = computed(() => {
  const pageWindowSize = 5
  const halfWindow = Math.floor(pageWindowSize / 2)
  const startPage = Math.max(1, Math.min(currentPage.value - halfWindow, totalPages.value - pageWindowSize + 1))
  const endPage = Math.min(totalPages.value, startPage + pageWindowSize - 1)

  return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index)
})
const teamDisplayTotals = computed(() => ({
  1: teamInfoTotals[1] ?? levelTotals[1],
  2: teamInfoTotals[2] ?? levelTotals[2],
}))
const pagedRows = computed(() => teamRows.value)
const referrerName = computed(() => {
  if (typeof referrer.value !== 'object') {
    return String(pickTeamValue(referrer.value, teamText.value.emptyReferrer || ''))
  }

  return pickTeamValue(referrer.value?.nickname, referrer.value?.nick_name, referrer.value?.name, referrer.value?.username, referrer.value?.email, referrer.value?.mobile, teamText.value.emptyReferrer || '')
})
const referrerAvatar = computed(() => {
  return referrerDefaultAvatar.value
})
const referrerInitial = computed(() => {
  return String(referrerName.value || '').trim().slice(0, 1).toUpperCase()
})
const teamTableMessage = computed(() => {
  if (isLoadingTeam.value) {
    return ''
  }

  if (teamLoadError.value) {
    return teamLoadError.value
  }

  return teamText.value.emptyTeam || ''
})

const loadTeamInfo = () => {
  const userId = authUser.value?.user_id

  if (!userId) {
    teamInfoTotals[1] = null
    teamInfoTotals[2] = null
    referrerDefaultAvatar.value = ''
    return
  }

  getTeamInfo({
    user_id: userId,
  }).then(
    response => {
      applyTeamInfoTotals(response)
    },
    () => {
      teamInfoTotals[1] = null
      teamInfoTotals[2] = null
      referrerDefaultAvatar.value = ''
    }
  )
}

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
      const nextReferrer = getTeamReferrer(response)

      if (nextReferrer) {
        referrer.value = nextReferrer
      }
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

const goToPage = (page) => {
  const nextPage = Math.min(Math.max(Number(page) || 1, 1), totalPages.value)

  if (nextPage === currentPage.value) {
    return
  }

  currentPage.value = nextPage
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
  loadTeamInfo()
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
  align-items: center;
  justify-content: flex-start;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}

.team-referrer-card {
  min-height: 72px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: 20px;
  padding: 0 14px;
  border: 1px solid var(--theme-team-referrer-border, var(--theme-extra-46-58-84-1));
  border-radius: 10px;
  background: var(--theme-team-referrer-background, var(--theme-extra-31-44-67-055));
}

.team-referrer-main {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.team-referrer-avatar {
  width: 45px;
  height: 45px;
  flex: 0 0 45px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  color: var(--theme-extra-237-247-255-1);
  background: var(--theme-extra-52-189-255-1);
  font-size: 18px;
  font-weight: 700;
}

.team-referrer-avatar-image {
  background: transparent;
}

.team-referrer-avatar img {
  width: 100%;
  height: 100%;
  display: block;
  border-radius: inherit;
  object-fit: cover;
}

.team-referrer-main p {
  color: var(--theme-team-referrer-label, var(--theme-extra-145-161-189-1));
  font-size: 12px;
  line-height: 16px;
}

.team-referrer-main strong {
  display: block;
  margin-top: 2px;
  color: var(--theme-team-referrer-name, var(--theme-text-strong));
  font-size: 16px;
  line-height: 22px;
  font-weight: 700;
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
  border: 1px solid var(--theme-team-tab-border, var(--theme-border-control-soft));
  border-radius: 10px;
  color: var(--theme-team-tab-text, var(--theme-extra-146-162-189-1));
  background: var(--theme-team-tab-background, var(--theme-extra-18-30-51-1));
  font-size: 14px;
  line-height: 20px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.team-level-tab span {
  color: var(--theme-extra-132-149-178-1);
}

.team-level-tab-active {
  color: var(--theme-team-tab-active-text, var(--theme-text-info));
  border-color: var(--theme-team-tab-active-border, var(--theme-cyan-hover));
  background: var(--theme-team-tab-active-background, var(--theme-extra-20-101-145-035));
}

.team-level-tab-active span {
  color: var(--theme-team-tab-active-text, var(--theme-extra-38-196-245-1));
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
  border: 1px solid var(--theme-profile-field-border, var(--theme-border-control-soft));
  border-radius: 9px;
  color: var(--theme-profile-field-muted, var(--theme-text-muted));
  background: var(--theme-profile-field-background, var(--theme-panel-medium));
  cursor: pointer;
}

.team-month-button svg {
  width: 17px;
  height: 17px;
}

.team-month-button:hover,
.team-month-button:focus,
.team-month-button-active {
  color: var(--theme-profile-field-action, var(--theme-text-info));
  border-color: var(--theme-profile-field-action, var(--theme-extra-62-91-135-1));
}

.team-month-popover {
  position: absolute;
  top: 44px;
  right: 0;
  z-index: 30;
  width: 248px;
  padding: 12px;
  border: 1px solid var(--theme-profile-table-border, var(--theme-border-card));
  border-radius: 10px;
  background: var(--theme-profile-table-background, var(--theme-panel-code));
  box-shadow: var(--theme-route-card-shadow, 0 18px 42px var(--theme-black-34));
}

.team-month-popover-header {
  height: 32px;
  display: grid;
  grid-template-columns: 32px minmax(0, 1fr) 32px;
  align-items: center;
  gap: 8px;
  color: var(--theme-profile-section-title, var(--theme-text-title));
}

.team-month-popover-header strong {
  font-size: 14px;
  line-height: 20px;
  text-align: center;
}

.team-month-year-button {
  width: 32px;
  height: 32px;
  border: 1px solid var(--theme-profile-field-border, var(--theme-border-control-soft));
  border-radius: 8px;
  color: var(--theme-profile-field-muted, var(--theme-text-muted));
  background: var(--theme-profile-field-background, var(--theme-extra-18-30-51-1));
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
  border: 1px solid var(--theme-profile-field-border, var(--theme-border-control-soft));
  border-radius: 8px;
  color: var(--theme-profile-field-muted, var(--theme-text-muted));
  background: var(--theme-profile-field-background, var(--theme-extra-18-30-51-1));
  font-size: 13px;
  line-height: 18px;
  cursor: pointer;
}

.team-month-option:hover,
.team-month-option:focus {
  color: var(--theme-profile-field-action, var(--theme-text-info));
  border-color: var(--theme-profile-field-action, var(--theme-cyan-hover));
}

.team-month-option-active {
  color: var(--theme-white);
  border-color: transparent;
  background: linear-gradient(135deg, var(--theme-profile-field-action, var(--theme-cyan)) 0%, var(--theme-primary, var(--theme-gradient-mid)) 100%);
  box-shadow: 0 8px 18px rgba(40, 115, 253, 0.24);
  font-weight: 700;
}

.team-month-option:disabled {
  opacity: 0.48;
  cursor: not-allowed;
}

.team-table-wrap {
  position: relative;
  margin-top: 20px;
  align-self: start;
  border: 1px solid var(--theme-profile-table-border, var(--theme-border-code));
  border-radius: 8px;
  overflow: hidden;
  background: var(--theme-profile-table-background, var(--theme-panel-code));
}

.team-table-loading {
  position: absolute;
  inset: 50px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--theme-profile-table-loading-background, rgba(8, 16, 32, 0.34));
  pointer-events: none;
}

.team-table-loading-spinner {
  width: 28px;
  height: 28px;
  border: 3px solid var(--theme-extra-97-219-246-025, rgba(97, 219, 246, 0.25));
  border-top-color: var(--theme-accent);
  border-radius: 50%;
  animation: team-table-loading-spin 0.8s linear infinite;
}

@keyframes team-table-loading-spin {
  to {
    transform: rotate(360deg);
  }
}

.team-table {
  width: 100%;
  border-collapse: collapse;
}

.team-table th,
.team-table td {
  height: 50px;
  padding: 0 10px;
  border-bottom: 1px solid var(--theme-profile-table-border, var(--theme-border-table));
  color: var(--theme-profile-table-text, var(--theme-text-table));
  font-size: 14px;
  text-align: center;
}

.team-table thead th {
  background: var(--theme-profile-table-head-background, var(--theme-extra-17-25-39-1));
  color: var(--theme-profile-table-head-text, var(--theme-text-slate));
  font-size: 14px;
  font-weight: 600;
}

.team-table tbody tr:nth-child(odd) td {
  background: var(--theme-profile-table-row-background, var(--theme-panel));
}

.team-table tbody tr:nth-child(even) td {
  background: var(--theme-profile-table-row-alt-background, var(--theme-panel-row));
}

.team-table tbody tr:last-child td {
  border-bottom: none;
}

.team-table th:first-child,
.team-table td:first-child {
  text-align: left;
  padding-left: 14px;
}

.team-member-status {
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
}

.team-table tbody td:nth-child(3) {
  color: var(--theme-text-muted-alt);
}

.team-empty-cell {
  height: 120px !important;
  color: var(--theme-text-muted-alt) !important;
  text-align: center !important;
}

.status-free {
  min-width: 84px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  color: var(--theme-team-status-free-text, var(--theme-extra-154-167-189-1));
  background: var(--theme-team-status-free-background, var(--theme-extra-50-62-88-1));
  border: 1px solid var(--theme-profile-field-border, transparent);
}

.status-vip {
  min-width: 84px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  color: var(--theme-team-tab-active-text, var(--theme-extra-38-196-245-1));
  background: var(--theme-team-tab-active-background, var(--theme-extra-20-101-145-035));
  border: 1px solid var(--theme-team-tab-active-border, var(--theme-cyan-hover));
}

.status-life {
  color: var(--theme-accent);
}

.status-month {
  color: var(--theme-extra-72-156-255-1);
}

.status-year {
  color: var(--theme-extra-234-221-70-1);
}

.team-pagination {
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px 10px;
  flex-wrap: wrap;
}

.team-page-arrow,
.team-page-number {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  color: var(--theme-extra-130-147-175-1);
  font-size: 14px;
  cursor: pointer;
}

.team-page-arrow:disabled {
  opacity: 0.35;
  cursor: default;
}

.team-page-number-active {
  color: var(--theme-text-button);
  background: var(--theme-profile-field-action, var(--theme-extra-13-113-175-1));
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
