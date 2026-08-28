<template>
  <!-- NuxtPage 用来渲染 app/pages 目录下匹配到的页面。 -->
  <NuxtPage />
  <SiteToast />
</template>

<script setup>
import { isValidThemeCode, themeStorageKey } from './utils/theme'

const siteName = 'VicastCam'
const mediaUrl = useMediaUrl()
const { locale, locales } = useI18n()
const route = useRoute()
const themeCookie = useCookie(themeStorageKey)

const activeLocaleConfig = computed(() => {
  return locales.value.find(item => typeof item !== 'string' && item.code === locale.value) || {}
})

const activeTheme = computed(() => {
  const routeName = String(route.name || '').split('___')[0]

  if (routeName === 'login') {
    return 'dark'
  }

  return isValidThemeCode(themeCookie.value) ? themeCookie.value : 'dark'
})

useHead(() => ({
  htmlAttrs: {
    lang: activeLocaleConfig.value.language || locale.value,
    dir: activeLocaleConfig.value.dir || 'ltr',
    'data-theme': activeTheme.value,
    style: {
      'color-scheme': activeTheme.value === 'light' ? 'light' : 'dark',
      '--media-images-common-light-page-hero-bg-png': `url(${mediaUrl('/images/common/light-page-hero-bg.png')})`,
      '--media-images-home-features-card-bg-png': `url(${mediaUrl('/images/home/features/card-bg.png')})`,
      '--media-images-home-footer-hero-rings-png': `url(${mediaUrl('/images/home/footer-hero-rings.png')})`,
      '--media-images-home-virtual-camera-frame-png': `url(${mediaUrl('/images/home/virtual/camera-frame.png')})`,
      '--media-images-login-background-png': `url(${mediaUrl('/images/login/background.png')})`,
      '--media-images-login-captcha-bg-1-png': `url(${mediaUrl('/images/login/captcha-bg-1.png')})`,
      '--media-images-login-qr-panel-bg-png': `url(${mediaUrl('/images/login/qr-panel-bg.png')})`,
      '--media-images-team-partner-plan-hero-bg-png': `url(${mediaUrl('/images/team/partner-plan-hero-bg.png')})`,
      '--media-images-news-news-hero-bg-png': `url(${mediaUrl('/images/news/news-hero-bg.png')})`,
    },
  },
  titleTemplate: (titleChunk) => {
    if (!titleChunk) {
      return siteName
    }

    if (titleChunk === siteName || titleChunk.includes(siteName)) {
      return titleChunk
    }

    return `${siteName} | ${titleChunk}`
  },
}))

</script>
