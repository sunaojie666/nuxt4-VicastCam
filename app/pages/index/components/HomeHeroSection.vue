<template>
  <section id="home-download" class="home-hero-section" aria-labelledby="home-hero-title">
    <video
      v-if="heroVideoSrc"
      :key="heroVideoSrc"
      class="home-hero-video"
      :src="heroVideoSrc"
      autoplay
      muted
      loop
      playsinline
      preload="metadata"
      aria-hidden="true"
    />

    <div class="home-hero-overlay"></div>

    <div class="home-hero-inner">
      <div v-if="heroBadgeText" :key="heroBadgeText" class="home-hero-eyebrow">
        <img src="/images/common/badge-star.png" alt="" aria-hidden="true">
        <b>{{ heroBadgeText }}</b>
      </div>

      <h1 id="home-hero-title" class="home-hero-title">
        <span>{{ heroTitle }}</span>
        <span class="theme-gradient-text">
          {{ heroSubtitle }}
          <img class="home-hero-title-line" src="/images/common/title-underline.png" alt="" aria-hidden="true">
        </span>
      </h1>

      <p class="home-hero-subtitle">
        <span>{{ heroDescription1 }}</span>
        <span>{{ heroDescription2 }}</span>
      </p>

      <div class="home-hero-actions" aria-label="下载VicastCam">
        <a href="#" class="home-hero-download home-hero-download-light">
          <span class="home-hero-download-icon-wrap" aria-hidden="true">
            <img class="home-hero-download-icon-default" src="/images/home/download-buttons/apple-default.svg" alt="">
            <img class="home-hero-download-icon-active" src="/images/home/download-buttons/apple-active.svg" alt="">
          </span>
          <span>{{ appStoreUrl }}</span>
        </a>

        <a href="#" class="home-hero-download home-hero-download-light">
          <span class="home-hero-download-icon-wrap" aria-hidden="true">
            <img class="home-hero-download-icon-default" src="/images/home/download-buttons/android-default.svg" alt="">
            <img class="home-hero-download-icon-active" src="/images/home/download-buttons/android-active.svg" alt="">
          </span>
          <span>{{ googlePlayUrl }}</span>
        </a>

        <a href="#" class="home-hero-download home-hero-download-primary">
          <span class="home-hero-download-icon-wrap" aria-hidden="true">
            <img class="home-hero-download-icon-default" src="/images/home/download-buttons/windows-default.svg" alt="">
            <img class="home-hero-download-icon-active" src="/images/home/download-buttons/windows-active.svg" alt="">
          </span>
          <span>{{ desktopClientUrl }}</span>
        </a>
      </div>

      <div class="home-hero-metrics" aria-label="VicastCam数据">
        <div class="home-hero-metric">
          <span class="home-hero-avatars">
            <span></span>
            <span></span>
            <span></span>
          </span>
          <strong>50万+</strong>
          <span>{{ userCountLabel }}</span>
        </div>

        <div class="home-hero-metric">
          <span class="home-hero-score-icons" aria-hidden="true">
            <img v-for="star in 5" :key="star" src="/images/common/rating-star.png" alt="">
          </span>
          <strong>4.9</strong>
          <span>{{ ratingLabel }}</span>
        </div>

        <div class="home-hero-metric">
          <img class="home-hero-download-icon" src="/images/common/download-metric.png" alt="" aria-hidden="true">
          <strong>10万+</strong>
          <span>{{ downloadCountLabel }}</span>
        </div>
      </div>

      <a class="home-hero-scroll-cue" href="#home-features" aria-label="向下滚动查看功能特色">
        <span class="home-hero-scroll-arrows" aria-hidden="true">
          <span class="home-hero-scroll-arrow">
            <Icon name="lucide:chevron-down" />
          </span>
          <span class="home-hero-scroll-arrow">
            <Icon name="lucide:chevron-down" />
          </span>
          <span class="home-hero-scroll-arrow">
            <Icon name="lucide:chevron-down" />
          </span>
        </span>
      </a>
    </div>
  </section>
</template>

<script setup>
import { getHomes } from '../../../api/request/strapi'

const config = useRuntimeConfig()
const { locale } = useI18n()
const heroVideoSrc = ref('')
const topBadge = ref('')
const heroTitle = ref('')
const heroSubtitle = ref('')
const heroDescription1 = ref('')
const heroDescription2 = ref('')
const userCountLabel = ref('')
const ratingLabel = ref('')
const downloadCountLabel = ref('')
const appStoreUrl = ref('')
const googlePlayUrl = ref('')
const desktopClientUrl = ref('')
const { setToastText } = useSiteToast()
const heroBadgeText = computed(() => String(topBadge.value || '').trim())

// Strapi 本地上传文件返回 /uploads/...，前端播放时需要补上 Strapi 服务地址。
const createStrapiAssetUrl = (url) => {
  if (!url) {
    return ''
  }

  return url.startsWith('http') ? url : `${config.public.strapiUrl.replace(/\/+$/, '')}${url}`
}

const syncHomeHero = (homeData = {}) => {
  const videoUrl = homeData.bgVideo?.[0]?.url

  topBadge.value = homeData.topBadge || ''
  heroTitle.value = homeData.heroTitle || ''
  heroSubtitle.value = homeData.heroSubtitle || ''
  heroDescription1.value = homeData.heroDescription1 || ''
  heroDescription2.value = homeData.heroDescription2 || ''
  userCountLabel.value = homeData.userCountLabel || ''
  ratingLabel.value = homeData.ratingLabel || ''
  downloadCountLabel.value = homeData.downloadCountLabel || ''
  appStoreUrl.value = homeData.appStoreUrl || ''
  googlePlayUrl.value = homeData.googlePlayUrl || ''
  desktopClientUrl.value = homeData.desktopClientUrl || ''
  heroVideoSrc.value = createStrapiAssetUrl(videoUrl)
  setToastText({
    requestLoading: homeData.requestLoading || '',
    requestSuccess: homeData.requestSuccess || '',
    requestFail: homeData.requestFail || '',
  })
}

// 客户端通过封装好的 axios 请求 Strapi 首页背景视频。
const loadHomeHero = () => {
  getHomes(locale.value).then(
    homeContent => {
      syncHomeHero(homeContent?.data?.[0] || {})
    },
    () => {
      syncHomeHero()
    }
  )
}

onMounted(() => {
  loadHomeHero()
})

watch(locale, () => {
  loadHomeHero()
})
</script>

<style>
@media (prefers-reduced-motion: reduce) {

  .home-hero-eyebrow,
  .home-hero-title,
  .home-hero-subtitle,
  .home-hero-actions,
  .home-hero-metrics,
  .home-hero-scroll-cue,
  .home-hero-scroll-arrow {
    animation: none;
  }
}
.home-hero-section {
  position: relative;
  width: 100%;
  min-height: 929px;
  height: auto;
  display: flex;
  justify-content: center;
  overflow: hidden;
  color: var(--theme-white);
  background:
    linear-gradient(180deg, var(--theme-surface-start) 0%, var(--theme-page) 100%),
    radial-gradient(circle at 50% 20%, var(--theme-primary-softer), transparent 58%);
}
.home-hero-video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.8;
}
.home-hero-overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, var(--theme-page-36) 0%, var(--theme-page-62) 58%, var(--theme-page-96) 100%),
    radial-gradient(circle at 50% 26%, var(--theme-extra-15-23-42-004) 0%, var(--theme-page-72) 72%);
}
.home-hero-inner {
  position: relative;
  z-index: 1;
  width: min(100%, var(--page-max-width));
  min-height: 929px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 172px var(--page-padding-x) 72px;
  text-align: center;
}
.home-hero-eyebrow {
  max-width: 100%;
  width: fit-content;
  min-width: 0;
  min-height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 4px 18px;
  border: 1px solid var(--theme-accent-border);
  border-radius: 999px;
  color: var(--theme-accent-text);
  background-color: var(--theme-cyan-panel);
  box-shadow: inset 0 0 18px var(--theme-accent-soft);
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  overflow: visible;
  animation: home-hero-enter 0.7s ease both;
}
.home-hero-eyebrow img {
  width: 14px;
  height: 14px;
  flex: 0 0 auto;
  object-fit: contain;
}
.home-hero-eyebrow b {
  min-width: 0;
  display: block;
  font: inherit;
  line-height: 20px;
  overflow-wrap: anywhere;
}
.home-hero-title {
  max-width: min(100%, 980px);
  margin-top: 22px;
  font-size: clamp(44px, 4.35vw, 58px);
  font-weight: 900;
  line-height: 1.17;
  text-align: center;
  overflow-wrap: anywhere;
  hyphens: auto;
  animation: home-hero-enter 0.75s ease 0.08s both;
}
.home-hero-title span {
  display: block;
  white-space: normal;
}
.home-hero-title span:last-child {
  position: relative;
  display: inline-block;
  max-width: 100%;
}
.home-hero-title-line {
  position: absolute;
  left: 50%;
  bottom: -13px;
  width: 222px;
  height: auto;
  transform: translateX(-50%);
}
.home-hero-subtitle {
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 28px;
  color: var(--theme-text-soft);
  font-size: 20px;
  font-weight: 400;
  line-height: 30px;
  overflow-wrap: anywhere;
  animation: home-hero-enter 0.75s ease 0.16s both;
}
.home-hero-actions {
  max-width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 26px;
  margin-top: 37px;
  animation: home-hero-enter 0.75s ease 0.24s both;
}
.home-hero-download {
  width: auto;
  min-width: 172px;
  max-width: min(100%, 300px);
  height: 64px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  padding: 0 18px;
  border-radius: 15px;
  font-size: 14px;
  font-weight: 800;
  line-height: 20px;
  text-align: center;
  overflow: hidden;
  transition: color 0.2s ease, background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}
.home-hero-download span {
  min-width: 0;
  overflow: hidden;
  overflow-wrap: anywhere;
  hyphens: auto;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.home-hero-download > img {
  width: 20px;
  height: 20px;
  flex: 0 0 auto;
  object-fit: contain;
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
.home-hero-download-light {
  color: var(--theme-text-on-white);
  background-color: var(--theme-white);
}
.home-hero-download-light strong {
  color: var(--theme-black);
}
.home-hero-download-primary {
  color: var(--theme-text-on-white);
  background: var(--theme-white);
  box-shadow: none;
}

.home-hero-download:hover,
.home-hero-download:focus {
  color: var(--theme-white);
  background: linear-gradient(124.24deg, var(--theme-brand-accent) 0%, var(--theme-primary-end) 100%);
  box-shadow: 0 0 18px var(--theme-extra-14-165-233-036);
  transform: translateY(-1px);
}

.home-hero-download:hover strong,
.home-hero-download:focus strong {
  color: var(--theme-white);
}

.home-hero-download:hover .home-hero-download-icon-wrap,
.home-hero-download:focus .home-hero-download-icon-wrap {
  color: var(--theme-white);
  transform: scale(1.06);
}
.home-hero-metrics {
  max-width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 86px;
  margin-top: 45px;
  color: var(--theme-text-muted);
  font-size: 16px;
  line-height: 24px;
  animation: home-hero-enter 0.75s ease 0.32s both;
}
.home-hero-scroll-cue {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 112px;
  height: 112px;
  margin-top: 94px;
  color: var(--theme-extra-226-232-240-078);
  line-height: 1;
  animation: home-hero-enter 0.75s ease 0.42s both;
}
.home-hero-scroll-arrows {
  position: relative;
  z-index: 1;
  display: grid;
  justify-items: center;
  gap: 0;
  color: var(--theme-accent-text);
}
.home-hero-scroll-arrow {
  width: 112px;
  height: 56px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--theme-accent-text);
  filter: drop-shadow(0 0 34px var(--theme-extra-34-211-238-086));
  transform-origin: center;
  animation: home-hero-scroll-arrow 1.9s ease-in-out infinite;
}
.home-hero-scroll-arrow + .home-hero-scroll-arrow {
  margin-top: -30px;
}
.home-hero-scroll-arrow:nth-child(2) {
  animation-delay: 0.2s;
}
.home-hero-scroll-arrow:nth-child(3) {
  animation-delay: 0.4s;
}
.home-hero-scroll-arrow svg {
  width: 520px;
  height: 520px;
  min-width: 520px;
  min-height: 520px;
  stroke-width: 1.45;
}
@keyframes home-hero-enter {
  from {
    opacity: 0;
    transform: translate3d(0, 24px, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}
@keyframes home-hero-scroll-arrow {
  0% {
    opacity: 0;
    transform: scale(0.42);
  }

  32% {
    opacity: 1;
    transform: scale(1.18);
  }

  58% {
    opacity: 0.92;
    transform: scale(1);
  }

  100% {
    opacity: 0;
    transform: scale(1.34);
  }
}
.home-hero-metric {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  min-width: 0;
  white-space: nowrap;
}
.home-hero-metric > span:last-child {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}
.home-hero-metric strong {
  color: var(--theme-white);
  font-size: 16px;
  font-weight: 900;
}
.home-hero-score-icons {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  flex: 0 0 auto;
}
.home-hero-score-icons img {
  width: 15px;
  height: 15px;
  object-fit: contain;
}
.home-hero-download-icon {
  width: 24px;
  height: 24px;
  flex: 0 0 auto;
  object-fit: contain;
}
.home-hero-avatars {
  position: relative;
  width: 20px;
  height: 20px;
  display: inline-flex;
  flex: 0 0 20px;
  overflow: hidden;
}
.home-hero-avatars span {
  position: absolute;
  top: 0;
  width: 20px;
  height: 20px;
  border: 2px solid var(--theme-surface);
  border-radius: 50%;
  background: linear-gradient(135deg, var(--theme-extra-253-186-116-1), var(--theme-primary));
}
.home-hero-avatars span:nth-child(1) {
  left: 0;
}
.home-hero-avatars span:nth-child(2) {
  left: 7px;
  background: linear-gradient(135deg, var(--theme-extra-165-180-252-1), var(--theme-extra-14-165-233-1));
}
.home-hero-avatars span:nth-child(3) {
  left: 14px;
  background: linear-gradient(135deg, var(--theme-extra-254-240-138-1), var(--theme-extra-244-114-182-1));
}
@media (max-width: 768px) {

  .home-hero-section {
    height: auto;
    min-height: 720px;
  }

  .home-hero-inner {
    min-height: 720px;
    padding-top: 62px;
    padding-bottom: 58px;
  }

  .home-hero-title {
    margin-top: 22px;
    font-size: 36px;
    line-height: 44px;
  }

  .home-hero-title span {
    white-space: normal;
  }

  .home-hero-title span:last-child::after {
    bottom: -8px;
    width: 158px;
  }

  .home-hero-subtitle {
    margin-top: 26px;
    font-size: 13px;
    line-height: 22px;
  }

  .home-hero-subtitle span {
    display: inline;
  }

  .home-hero-actions {
    width: min(100%, 360px);
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 14px;
    margin-top: 32px;
  }

  .home-hero-download {
    width: auto;
    min-width: 172px;
    max-width: min(100%, 300px);
  }

  .home-hero-metrics {
    width: min(100%, 360px);
    flex-direction: column;
    gap: 14px;
    margin-top: 34px;
  }

  .home-hero-scroll-cue {
    margin-top: 42px;
    width: 84px;
    height: 84px;
  }

  .home-hero-scroll-arrow {
    width: 84px;
    height: 42px;
  }

  .home-hero-scroll-arrow + .home-hero-scroll-arrow {
    margin-top: -23px;
  }

  .home-hero-scroll-arrow svg {
    width: 360px;
    height: 360px;
    min-width: 360px;
    min-height: 360px;
  }
}
</style>
