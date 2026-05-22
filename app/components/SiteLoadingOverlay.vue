<template>
  <Teleport to="body">
    <Transition name="site-loading-fade">
      <div v-if="isVisible" class="site-loading-overlay" role="status" aria-live="polite" :aria-label="requestLoadingText || undefined">
        <div :class="['site-loading-indicator', { 'site-loading-indicator-icon-only': !requestLoadingText }]">
          <span class="site-loading-spinner" aria-hidden="true"></span>
          <span v-if="requestLoadingText">{{ requestLoadingText }}</span>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { siteLoadingEndEvent, siteLoadingStartEvent } from '../utils/site-loading'

const activeLoadingIds = new Set()
const isVisible = ref(false)
const { requestLoadingText } = useSiteToast()
let showTimer = null

const clearShowTimer = () => {
  if (!showTimer) {
    return
  }

  window.clearTimeout(showTimer)
  showTimer = null
}

const scheduleShow = () => {
  if (isVisible.value || showTimer) {
    return
  }

  showTimer = window.setTimeout(() => {
    showTimer = null

    if (activeLoadingIds.size > 0) {
      isVisible.value = true
    }
  }, 180)
}

const hideIfIdle = () => {
  if (activeLoadingIds.size > 0) {
    return
  }

  clearShowTimer()
  isVisible.value = false
}

const handleLoadingStart = (event) => {
  const id = event.detail?.id

  if (!id) {
    return
  }

  activeLoadingIds.add(id)
  scheduleShow()
}

const handleLoadingEnd = (event) => {
  const id = event.detail?.id

  if (!id) {
    return
  }

  activeLoadingIds.delete(id)
  hideIfIdle()
}

onMounted(() => {
  window.addEventListener(siteLoadingStartEvent, handleLoadingStart)
  window.addEventListener(siteLoadingEndEvent, handleLoadingEnd)
})

onBeforeUnmount(() => {
  window.removeEventListener(siteLoadingStartEvent, handleLoadingStart)
  window.removeEventListener(siteLoadingEndEvent, handleLoadingEnd)
  activeLoadingIds.clear()
  clearShowTimer()
})
</script>

<style scoped>
.site-loading-overlay {
  position: fixed;
  inset: 0;
  z-index: 9998;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: var(--theme-page-46);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.site-loading-indicator {
  min-width: 142px;
  height: 52px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 0 18px;
  border-radius: 10px;
  color: var(--theme-text);
  background: var(--theme-surface-94);
  box-shadow: 0 18px 42px var(--theme-black-36);
  font-size: 14px;
  line-height: 20px;
}

.site-loading-indicator-icon-only {
  min-width: 52px;
  width: 52px;
  padding: 0;
}

.site-loading-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid var(--theme-extra-148-163-184-032);
  border-top-color: var(--theme-accent);
  border-radius: 50%;
  animation: site-loading-spin 0.78s linear infinite;
}

.site-loading-fade-enter-active,
.site-loading-fade-leave-active {
  transition: opacity 0.18s ease;
}

.site-loading-fade-enter-from,
.site-loading-fade-leave-to {
  opacity: 0;
}

@keyframes site-loading-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .site-loading-spinner {
    animation: none;
  }

  .site-loading-fade-enter-active,
  .site-loading-fade-leave-active {
    transition: none;
  }
}
</style>
