<template>
  <!-- NuxtPage 用来渲染 app/pages 目录下匹配到的页面。 -->
  <NuxtPage />
</template>

<script setup>
import { createThemeContext } from './utils/theme'

// 全局初始化皮肤，保证任何页面都能读取并应用用户上次选择的主题。
const { initTheme } = createThemeContext()

// onMounted 只在浏览器运行，避免服务端渲染阶段访问 localStorage。
onMounted(() => {
  initTheme()
})
</script>
