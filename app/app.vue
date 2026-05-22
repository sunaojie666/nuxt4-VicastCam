<template>
  <SiteLoadingOverlay />
  <!-- NuxtPage 用来渲染 app/pages 目录下匹配到的页面。 -->
  <NuxtPage />
  <SiteToast />
</template>

<script setup>
const siteName = 'VicastCam'
const { locale, locales } = useI18n()

const activeLocaleConfig = computed(() => {
  return locales.value.find(item => typeof item !== 'string' && item.code === locale.value) || {}
})

useHead(() => ({
  htmlAttrs: {
    lang: activeLocaleConfig.value.language || locale.value,
    dir: activeLocaleConfig.value.dir || 'ltr',
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
