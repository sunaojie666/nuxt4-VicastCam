<template>
  <section class="auth-brand-panel" aria-labelledby="auth-brand-title">
    <NuxtLink :to="localePath('/')" class="auth-logo">
      <img src="/images/logo.png" alt="" aria-hidden="true">
      <span>Vicast<span>Cam</span></span>
    </NuxtLink>

    <div class="auth-brand-copy">
      <h1 id="auth-brand-title">
        <span>{{ loginCopy.title1 }}</span>
        <span class="theme-gradient-text">{{ loginCopy.title2 }}</span>
      </h1>
      <p>
        <span>{{ loginCopy.description1 }}</span>
        <span>{{ loginCopy.description2 }}</span>
      </p>
    </div>

    <div v-if="visibleFeatures.length" class="auth-feature-list" aria-label="VicastCam特色">
      <div v-for="feature in visibleFeatures" :key="feature.key" class="auth-feature">
        <span>
          <img :src="feature.icon" alt="" aria-hidden="true">
        </span>
        <strong>{{ feature.title }}</strong>
        <small>{{ feature.description }}</small>
      </div>
    </div>
  </section>
</template>

<script setup>
const localePath = useLocalePath()

const props = defineProps({
  loginData: {
    type: Object,
    default: () => ({}),
  },
})

const loginCopy = reactive({
  title1: '',
  title2: '',
  description1: '',
  description2: '',
})

const features = reactive([
  { key: 'feature-1', icon: '/images/loginIcon1.png', title: '', description: '' },
  { key: 'feature-2', icon: '/images/loginIcon2.png', title: '', description: '' },
  { key: 'feature-3', icon: '/images/loginIcon3.png', title: '', description: '' },
])

const visibleFeatures = computed(() => {
  return features.filter(feature => feature.title || feature.description)
})

const syncLoginFeature = (index, loginData = {}) => {
  const feature = features[index]
  const fieldIndex = index + 1

  feature.title = loginData[`featureTitle${fieldIndex}`] || ''
  feature.description = loginData[`featureSubTitle${fieldIndex}`] || ''
}

const syncLoginCopy = (loginData = {}) => {
  loginCopy.title1 = loginData.loginTitle1 || ''
  loginCopy.title2 = loginData.loginTitle2 || ''
  loginCopy.description1 = loginData.loginDes1 || loginData.loginDes || ''
  loginCopy.description2 = loginData.loginDes2 || ''
  syncLoginFeature(0, loginData)
  syncLoginFeature(1, loginData)
  syncLoginFeature(2, loginData)
}

watch(() => props.loginData, (loginData) => {
  syncLoginCopy(loginData || {})
}, {
  immediate: true,
  deep: true,
})
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
  flex-wrap: wrap;
  gap: clamp(28px, 3.02vw, 58px);
  margin-top: 190px;
  min-width: 0;
}

.auth-feature {
  width: max-content;
  min-width: 68px;
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
  font-size: 16px;
  font-weight: 700;
  line-height: 22px;
  overflow-wrap: normal;
  white-space: nowrap;
}

.auth-feature small {
  max-width: 100%;
  margin-top: 0;
  color: rgba(148, 163, 184, 1);
  font-size: 14px;
  line-height: 20px;
  overflow-wrap: normal;
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
