<template>
  <!-- NuxtPage 用来渲染 app/pages 目录下匹配到的页面。 -->
  <NuxtPage />
  <SiteToast />
</template>

<script setup>
import { isValidThemeCode, themeStorageKey } from './utils/theme'

const siteName = 'VicastCam'
const { locale, locales } = useI18n()
const themeCookie = useCookie(themeStorageKey)

const activeLocaleConfig = computed(() => {
  return locales.value.find(item => typeof item !== 'string' && item.code === locale.value) || {}
})

const activeTheme = computed(() => {
  return isValidThemeCode(themeCookie.value) ? themeCookie.value : 'dark'
})

useHead(() => ({
  htmlAttrs: {
    lang: activeLocaleConfig.value.language || locale.value,
    dir: activeLocaleConfig.value.dir || 'ltr',
    'data-theme': activeTheme.value,
    style: {
      'color-scheme': activeTheme.value === 'light' ? 'light' : 'dark',
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
