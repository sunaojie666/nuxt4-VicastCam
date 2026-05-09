<template>
  <section class="profile-content" aria-label="账号信息">
    <section class="profile-panel">
      <header class="profile-panel-heading">
        <span>
          <Icon name="lucide:user-round" aria-hidden="true" />
        </span>
        <h2>个人资料</h2>
      </header>

      <div class="profile-info-list">
        <article
          v-for="item in profileFields"
          :key="item.label"
          class="profile-info-row"
        >
          <Icon class="profile-info-icon" :name="item.icon" aria-hidden="true" />
          <div>
            <span>{{ item.label }}</span>
            <strong>{{ item.value }}</strong>
          </div>
          <button type="button">修改</button>
        </article>
      </div>
    </section>

    <section class="profile-panel profile-invite-panel">
      <header class="profile-panel-heading">
        <span>
          <Icon name="lucide:link" aria-hidden="true" />
        </span>
        <h2>邀请链接</h2>
      </header>

      <p class="profile-invite-text">分享你的邀请链接，壮大团队，获得佣金收益。</p>

      <div class="profile-invite-link">
        <Icon name="lucide:external-link" aria-hidden="true" />
        <span>vicastcam.com/invite/VICAST-88888888</span>
        <button type="button" aria-label="复制邀请链接">
          <Icon name="lucide:copy" aria-hidden="true" />
        </button>
      </div>
    </section>
  </section>
</template>

<script setup>
const profileFields = [
  { label: '用户名', value: 'Marcus Johnson', icon: 'lucide:user-round' },
  { label: '邮箱', value: 'alex@example.com', icon: 'lucide:mail' },
  { label: '密码', value: '••••••••••••', icon: 'lucide:lock-keyhole' },
]
</script>
