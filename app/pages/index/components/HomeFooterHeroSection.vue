<template>
  <section v-if="hasHeroContent" class="home-footer-hero-section" aria-labelledby="home-footer-hero-title">
    <div class="page-container home-footer-hero-inner">
      <span v-if="footerHero.tag" class="home-footer-hero-eyebrow">
        <img src="/images/star.png" alt="" aria-hidden="true">
        {{ footerHero.tag }}
      </span>

      <h2 id="home-footer-hero-title" class="home-footer-hero-title">
        <span>{{ footerHero.title_main }}</span>
        <span class="theme-gradient-text">
          {{ footerHero.title_highlight }}
          <img class="home-footer-hero-line" src="/images/path.png" alt="" aria-hidden="true">
        </span>
      </h2>

      <p v-if="footerHero.description" class="home-footer-hero-copy">
        {{ footerHero.description }}
      </p>

      <div v-if="footerHeroButtons.length" class="home-hero-actions" aria-label="下载VicastCam">
        <a
          v-for="button in footerHeroButtons"
          :key="button.key"
          href="#"
          :class="['home-hero-download', button.buttonClass]"
        >
          <span class="home-hero-download-icon-wrap" aria-hidden="true">
            <img class="home-hero-download-icon-default" :src="button.icon" alt="">
            <img class="home-hero-download-icon-active" :src="button.activeIcon" alt="">
          </span>
          <span>{{ button.label }}</span>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup>
import { getFooter, getHomes } from '../../../api/request/strapi'

const { locale } = useI18n()
const footerHero = ref({
  tag: '',
  title_main: '',
  title_highlight: '',
  description: '',
})
const homeDownloads = ref({
  appStoreUrl: '',
  googlePlayUrl: '',
  desktopClientUrl: '',
})

const footerHeroButtons = computed(() => {
  return [
    {
      key: 'app-store',
      label: homeDownloads.value.appStoreUrl,
      icon: '/images/download-icons/apple-default.svg',
      activeIcon: '/images/download-icons/apple-active.svg',
      buttonClass: 'home-hero-download-light',
    },
    {
      key: 'android',
      label: homeDownloads.value.googlePlayUrl,
      icon: '/images/download-icons/android-default.svg',
      activeIcon: '/images/download-icons/android-active.svg',
      buttonClass: 'home-hero-download-light',
    },
    {
      key: 'windows',
      label: homeDownloads.value.desktopClientUrl,
      icon: '/images/download-icons/windows-default.svg',
      activeIcon: '/images/download-icons/windows-active.svg',
      buttonClass: 'home-hero-download-primary',
    },
  ].filter(button => String(button.label || '').trim())
})

const hasHeroContent = computed(() => {
  return Boolean(
    footerHero.value.tag ||
    footerHero.value.title_main ||
    footerHero.value.title_highlight ||
    footerHero.value.description ||
    footerHeroButtons.value.length
  )
})

const getFooterContentData = (response) => {
  if (Array.isArray(response?.data)) {
    const firstItem = response.data[0] || {}

    return firstItem.attributes || firstItem
  }

  return response?.data?.attributes || response?.data || response || {}
}

const syncFooterHeroContent = (footerData = {}) => {
  const footerObject = footerData.footerobj || footerData
  const heroSection = footerObject.hero_section || footerObject.cta || {}

  footerHero.value = {
    tag: heroSection.tag || '',
    title_main: heroSection.title_main || '',
    title_highlight: heroSection.title_highlight || '',
    description: heroSection.description || '',
  }
}

const syncHomeDownloadContent = (homeData = {}) => {
  homeDownloads.value = {
    appStoreUrl: homeData.appStoreUrl || '',
    googlePlayUrl: homeData.googlePlayUrl || '',
    desktopClientUrl: homeData.desktopClientUrl || '',
  }
}

const loadFooterHeroContent = () => {
  getFooter(locale.value).then(
    response => {
      syncFooterHeroContent(getFooterContentData(response))
    },
    () => {
      syncFooterHeroContent()
    }
  )
}

const loadHomeDownloadContent = () => {
  getHomes(locale.value).then(
    response => {
      syncHomeDownloadContent(response?.data?.[0] || {})
    },
    () => {
      syncHomeDownloadContent()
    }
  )
}

onMounted(() => {
  loadFooterHeroContent()
  loadHomeDownloadContent()
})

watch(locale, () => {
  loadFooterHeroContent()
  loadHomeDownloadContent()
})
</script>

<style scoped>
.home-footer-hero-section {
  position: relative;
  width: 100%;
  overflow: hidden;
  padding-top: 96px;
  padding-bottom: 76px;
  color: var(--theme-text);
  background: var(--theme-footer-hero-background, var(--theme-surface-alt));
}

.home-footer-hero-section::before {
  content: "";
  position: absolute;
  top: -220px;
  left: 50%;
  z-index: 0;
  width: 1350px;
  height: 840px;
  background: url("/images/Circle.png") center / contain no-repeat;
  transform: translateX(-50%);
  pointer-events: none;
}

.home-footer-hero-inner {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.home-footer-hero-eyebrow {
  max-width: 100%;
  min-width: 242px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 0 18px;
  border: 1px solid var(--theme-footer-hero-eyebrow-border, var(--theme-accent-border));
  border-radius: 999px;
  color: var(--theme-footer-hero-eyebrow-text, var(--theme-accent-text));
  background-color: var(--theme-footer-hero-eyebrow-background, var(--theme-cyan-panel));
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.home-footer-hero-eyebrow img {
  width: 14px;
  height: 14px;
  flex: 0 0 auto;
  object-fit: contain;
}

.home-footer-hero-title {
  width: auto;
  max-width: min(100%, 980px);
  margin-top: 22px;
  color: var(--theme-footer-hero-title, var(--theme-white));
  font-size: 58px;
  font-weight: 900;
  line-height: 68px;
  overflow-wrap: anywhere;
  hyphens: auto;
}

.home-footer-hero-title span {
  display: block;
}

.home-footer-hero-title > span:first-child {
  white-space: normal;
}

.home-footer-hero-title span:last-child {
  position: relative;
  display: inline-block;
  max-width: 100%;
}

.home-footer-hero-line {
  position: absolute;
  left: 50%;
  bottom: -13px;
  width: 222px;
  height: auto;
  transform: translateX(-50%);
}

.home-footer-hero-copy {
  max-width: 760px;
  margin-top: 28px;
  color: var(--theme-footer-hero-copy, var(--theme-text-soft));
  font-size: 20px;
  font-weight: 400;
  line-height: 30px;
  overflow-wrap: anywhere;
}

.home-hero-download-primary {
  color: var(--theme-text-on-white);
  background: var(--theme-white);
  box-shadow: none;
}

.home-hero-download {
  transition: color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.home-hero-download-icon-wrap {
  width: 22px;
  height: 22px;
  flex: 0 0 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  color: var(--theme-primary);
  background: transparent;
  transition: color 0.2s ease, transform 0.2s ease;
}

.home-hero-download-icon-wrap img {
  position: absolute;
  width: 22px;
  height: 22px;
  object-fit: contain;
  transition: opacity 0.2s ease;
}

.home-hero-download-icon-active {
  opacity: 0;
}

.home-hero-download:hover .home-hero-download-icon-default,
.home-hero-download:focus .home-hero-download-icon-default {
  opacity: 0;
}

.home-hero-download:hover .home-hero-download-icon-active,
.home-hero-download:focus .home-hero-download-icon-active {
  opacity: 1;
}

.home-hero-download:hover,
.home-hero-download:focus {
  color: var(--theme-white);
  background: linear-gradient(124.24deg, var(--theme-brand-accent) 0%, var(--theme-primary-end) 100%);
  box-shadow: 0 0 18px var(--theme-extra-14-165-233-036);
  transform: translateY(-1px);
}

.home-hero-download:hover .home-hero-download-icon-wrap,
.home-hero-download:focus .home-hero-download-icon-wrap {
  color: var(--theme-white);
  transform: scale(1.06);
}

@media (max-width: 768px) {

  .home-footer-hero-section {
    padding-top: 72px;
    padding-bottom: 64px;
  }

  .home-footer-hero-title {
    width: auto;
    font-size: 32px;
    line-height: 40px;
  }

  .home-footer-hero-title > span:first-child {
    white-space: normal;
  }

  .home-footer-hero-copy {
    font-size: 14px;
    line-height: 24px;
  }

}
</style>
