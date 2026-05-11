<template>
  <section class="auth-brand-panel" aria-labelledby="auth-brand-title">
    <NuxtLink :to="localePath('/')" class="auth-logo">
      <img src="/images/logo.png" alt="" aria-hidden="true">
      <span>Vicast<span>Cam</span></span>
    </NuxtLink>

    <div class="auth-brand-copy">
      <h1 id="auth-brand-title">
        <span>一键更换虚拟背景</span>
        <span class="theme-gradient-text">直播更精彩</span>
      </h1>
      <p>
        <span>先进的抠图技术，创造真实自然的虚拟场景</span>
        <span>让每一次直播都专业出彩</span>
      </p>
    </div>

    <div class="auth-feature-list" aria-label="VicastCam特色">
      <div v-for="(feature, index) in features" :key="feature.title" class="auth-feature">
        <span>
          <img v-if="index === 0" src="/images/loginIcon1.png" alt="" aria-hidden="true">
          <img v-else-if="index === 1" src="/images/loginIcon2.png" alt="" aria-hidden="true">
          <img v-else src="/images/loginIcon3.png" alt="" aria-hidden="true">
        </span>
        <strong>{{ feature.title }}</strong>
        <small>{{ feature.description }}</small>
      </div>
    </div>
  </section>
</template>

<script setup>
const localePath = useLocalePath()

const features = [
  { title: '智能抠图', description: '精准识别' },
  { title: '海量模板', description: '随心切换' },
  { title: '虚拟相机', description: '专业直播' },
]
</script>

<style scoped>
.auth-brand-panel {
  position: relative;
  z-index: 1;
}

.auth-logo {
  max-width: 100%;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: rgba(255, 255, 255, 1);
  font-size: 24px;
  font-weight: 900;
  min-width: 0;
}

.auth-logo img {
  width: 44px;
  height: 44px;
  border-radius: 4px;
}

.auth-logo span span {
  color: rgba(20, 198, 239, 1);
}

.auth-logo > span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.auth-brand-copy {
  margin-top: 34px;
}

.auth-brand-copy h1 {
  font-size: 48px;
  font-weight: 900;
  line-height: 62px;
  overflow-wrap: anywhere;
}

.auth-brand-copy h1 span {
  display: block;
}

.auth-brand-copy h1 span:last-child {
  position: relative;
  width: fit-content;
}

.auth-brand-copy h1 span:last-child::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -13px;
  width: 198px;
  height: 10px;
  border-bottom: 2px solid rgba(103, 232, 249, 1);
  border-radius: 50%;
}

.auth-brand-copy p {
  display: flex;
  flex-direction: column;
  margin-top: 40px;
  color: rgba(226, 232, 240, 1);
  font-size: 20px;
  line-height: 30px;
  overflow-wrap: anywhere;
}

.auth-feature-list {
  display: flex;
  gap: clamp(28px, 3.02vw, 58px);
  margin-top: 190px;
  min-width: 0;
}

.auth-feature {
  width: 68px;
  min-width: 0;
  display: grid;
  justify-items: center;
  color: rgba(203, 213, 225, 1);
  text-align: center;
}

.auth-feature > span {
  width: 68px;
  height: 68px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(20, 198, 239, 0.36);
  border-radius: 50%;
  color: rgba(20, 198, 239, 1);
  background-color: rgba(15, 23, 42, 0.76);
}

.auth-feature img {
  width: 30px;
  height: 30px;
  display: block;
  object-fit: contain;
}

.auth-feature strong {
  max-width: 100%;
  margin-top: 16px;
  color: rgba(255, 255, 255, 1);
  font-size: 10px;
  font-weight: 700;
  line-height: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.auth-feature small {
  max-width: 100%;
  margin-top: 14px;
  color: rgba(148, 163, 184, 1);
  font-size: 9px;
  line-height: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 900px) {
  .auth-feature-list {
    margin-top: 54px;
  }
}

@media (max-width: 520px) {
  .auth-brand-copy h1 {
    font-size: 26px;
    line-height: 36px;
  }

  .auth-brand-copy p {
    font-size: 12px;
  }

  .auth-feature-list {
    justify-content: space-between;
    gap: 16px;
  }
}
</style>
