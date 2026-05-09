<template>
  <div class="auth-scan-panel">
    <div class="auth-scan-code">
      <img src="/images/Generated.png" alt="VicastCam APP扫码登录二维码">
    </div>

    <p class="auth-scan-tip">
      <img src="/images/scanCode.png" alt="" aria-hidden="true">
      <span>请使用</span>
      <strong>VicastCam APP</strong>
      <span>扫码登录</span>
    </p>

    <p class="auth-switch-copy auth-scan-switch">
      没有账号？
      <button type="button" @click="$emit('register')">立即注册</button>
    </p>

    <p class="auth-scan-agreement">
      登录即代表已阅读并同意
      <a href="#">《隐私政策》</a>
      和
      <a href="#">《用户协议》</a>
    </p>
  </div>
</template>

<script setup>
defineEmits(['register'])
</script>

<style scoped>
.auth-scan-panel {
  display: grid;
  justify-items: center;
  margin-top: 82px;
}

.auth-scan-code {
  width: 222px;
  height: 222px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 1);
}

.auth-scan-code img {
  width: 191px;
  height: 191px;
  object-fit: contain;
}

.auth-scan-tip {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  max-width: 100%;
  margin-top: 17px;
  color: rgba(149, 156, 168, 1);
  font-size: 14px;
  line-height: 20px;
  overflow-wrap: anywhere;
}

.auth-scan-tip img {
  width: 19px;
  height: 19px;
  flex: 0 0 auto;
  object-fit: contain;
}

.auth-scan-tip strong {
  color: rgba(34, 211, 238, 1);
  font-weight: 400;
}

.auth-switch-copy {
  color: rgba(148, 163, 184, 1);
  font-size: 16px;
  line-height: 22px;
  text-align: center;
  overflow-wrap: anywhere;
}

.auth-switch-copy button {
  color: rgba(20, 198, 239, 1);
  cursor: pointer;
}

.auth-scan-switch {
  margin-top: 72px;
}

.auth-scan-agreement {
  max-width: 100%;
  margin-top: 23px;
  color: rgba(149, 156, 168, 1);
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  overflow-wrap: anywhere;
}

.auth-scan-agreement a {
  color: rgba(34, 211, 238, 1);
}

@media (max-width: 520px) {
  .auth-scan-panel {
    margin-top: 58px;
  }

  .auth-scan-switch {
    margin-top: 52px;
  }
}
</style>
