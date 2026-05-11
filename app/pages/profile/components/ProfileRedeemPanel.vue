<template>
  <section class="profile-content" aria-label="兑换入口">
    <section class="profile-panel membership-activation-panel">
      <header class="profile-panel-heading">
        <span class="membership-heading-icon">
          <Icon name="lucide:ticket" aria-hidden="true" />
        </span>
        <h2>兑换入口</h2>
      </header>

      <p class="membership-activation-tip">使用您购买的CDKEY激活码进行激活</p>

      <div class="membership-activation-row">
        <input
          type="text"
          class="membership-activation-input"
          placeholder="请输入10位数激活码"
        >
        <button type="button" class="membership-activation-button">立即激活</button>
      </div>

      <p class="membership-activation-agreement">
        激活即表示您同意
        <a href="javascript:void(0)">《用户协议》</a>
      </p>
    </section>
  </section>
</template>

<style scoped>
.membership-activation-panel {
  width: 869px;
  min-height: 0 !important;
  height: 277px;
  padding-top: 0 !important;
  padding-bottom: 0;
}

.membership-activation-panel .profile-panel-heading {
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

.membership-activation-tip {
  margin-top: 20px;
  color: rgba(132, 148, 173, 1);
  font-size: 14px;
  line-height: 20px;
}

.membership-activation-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 183px;
  gap: 14px;
  margin-top: 20px;
}

.membership-activation-input {
  height: 60px;
  padding: 0 14px;
  border: 1px solid rgba(35, 47, 75, 1);
  border-radius: 8px;
  color: rgba(232, 242, 255, 1);
  background: rgba(8, 19, 39, 1);
  font-size: 14px;
}

.membership-activation-input::placeholder {
  color: rgba(108, 125, 153, 1);
}

.membership-activation-button {
  height: 60px;
  border-radius: 8px;
  color: rgba(235, 246, 255, 1);
  background: linear-gradient(90deg, rgba(64, 184, 239, 1), rgba(56, 118, 233, 1));
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
}

.membership-activation-agreement {
  margin-top: 20px;
  color: rgba(97, 113, 140, 1);
  font-size: 12px;
  line-height: 18px;
}

.membership-activation-agreement a {
  color: rgba(34, 211, 238, 1);
}

@media (max-width: 900px) {
  .membership-activation-panel {
    width: 100%;
    height: auto;
    min-height: 0 !important;
  }

  .membership-activation-row {
    grid-template-columns: 1fr;
  }

  .membership-activation-button {
    width: 100%;
  }
}
</style>
