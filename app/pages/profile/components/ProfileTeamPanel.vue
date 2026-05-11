<template>
  <section class="profile-content" aria-label="我的团队">
    <section class="profile-panel team-panel">
      <header class="profile-panel-heading team-panel-heading">
        <span>
          <Icon name="lucide:users-round" aria-hidden="true" />
        </span>
        <h2>我的团队</h2>
      </header>

      <article class="team-referrer-card">
        <div class="team-referrer-main">
          <span class="team-referrer-avatar">D</span>
          <div>
            <p>推荐人</p>
            <strong>alex@example.com</strong>
          </div>
        </div>
        <button type="button" class="team-referrer-action">上级</button>
      </article>

      <div class="team-level-tabs">
        <button
          type="button"
          :class="['team-level-tab', { 'team-level-tab-active': selectedLevel === 'level1' }]"
          @click="selectedLevel = 'level1'"
        >
          一级会员
          <span>{{ levelTotals.level1 }}</span>
        </button>
        <button
          type="button"
          :class="['team-level-tab', { 'team-level-tab-active': selectedLevel === 'level2' }]"
          @click="selectedLevel = 'level2'"
        >
          二级会员
          <span>{{ levelTotals.level2 }}</span>
        </button>
      </div>

      <div class="team-table-wrap">
        <table class="team-table">
          <thead>
            <tr>
              <th>成员名称</th>
              <th>会员状态</th>
              <th>加入时间</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in pagedRows" :key="row.id">
              <td class="team-member-name">{{ row.name }}</td>
              <td>
                <span :class="['team-member-status', row.statusClass]">{{ row.status }}</span>
              </td>
              <td>{{ row.joinedAt }}</td>
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
const levelTotals = {
  level1: 12,
  level2: 0,
}

const teamRows = [
  { id: 1, level: 'level1', name: 'Marcus Johnson', status: '免费用户', statusClass: 'status-free', joinedAt: '2026-05-06 17:10:36' },
  { id: 2, level: 'level1', name: 'Marcus Johnson', status: '终身会员', statusClass: 'status-life', joinedAt: '2026-05-06 17:10:36' },
  { id: 3, level: 'level1', name: 'Marcus Johnson', status: '月卡会员', statusClass: 'status-month', joinedAt: '2026-05-06 17:10:36' },
  { id: 4, level: 'level1', name: 'Marcus Johnson', status: '年卡会员', statusClass: 'status-year', joinedAt: '2026-05-06 17:10:36' },
  { id: 5, level: 'level1', name: 'Marcus Johnson', status: '免费用户', statusClass: 'status-free', joinedAt: '2026-05-06 17:10:36' },
  { id: 6, level: 'level1', name: 'Marcus Johnson', status: '终身会员', statusClass: 'status-life', joinedAt: '2026-05-06 17:10:36' },
  { id: 7, level: 'level1', name: 'Marcus Johnson', status: '月卡会员', statusClass: 'status-month', joinedAt: '2026-05-06 17:10:36' },
  { id: 8, level: 'level1', name: 'Marcus Johnson', status: '年卡会员', statusClass: 'status-year', joinedAt: '2026-05-06 17:10:36' },
  { id: 9, level: 'level1', name: 'Marcus Johnson', status: '免费用户', statusClass: 'status-free', joinedAt: '2026-05-06 17:10:36' },
  { id: 10, level: 'level1', name: 'Marcus Johnson', status: '年卡会员', statusClass: 'status-year', joinedAt: '2026-05-06 17:10:36' },
  { id: 11, level: 'level1', name: 'Marcus Johnson', status: '免费用户', statusClass: 'status-free', joinedAt: '2026-05-06 17:10:36' },
  { id: 12, level: 'level1', name: 'Marcus Johnson', status: '月卡会员', statusClass: 'status-month', joinedAt: '2026-05-06 17:10:36' },
]

const selectedLevel = ref('level1')
const currentPage = ref(1)
const pageSize = 10

const filteredRows = computed(() => teamRows.filter((row) => row.level === selectedLevel.value))
const totalPages = computed(() => Math.max(1, Math.ceil(filteredRows.value.length / pageSize)))
const pagedRows = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredRows.value.slice(start, start + pageSize)
})

watch(selectedLevel, () => {
  currentPage.value = 1
})

watch(totalPages, () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value
  }
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
}
</style>
