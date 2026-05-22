<template>
  <Teleport to="body">
    <div v-if="toastItems.length" class="site-toast-viewport" aria-live="polite" aria-atomic="false">
      <TransitionGroup name="site-toast" tag="div" class="site-toast-list">
        <div
          v-for="item in toastItems"
          :key="item.id"
          :class="['site-toast-item', `site-toast-item-${item.type}`]"
          role="status"
        >
          <Icon class="site-toast-icon" :name="getToastIcon(item.type)" aria-hidden="true" />
          <span class="site-toast-message">{{ item.message }}</span>
          <button type="button" class="site-toast-close" :aria-label="toastText.closeToastLabel" @click="removeToast(item.id)">
            <Icon name="lucide:x" aria-hidden="true" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
const { toastItems, toastText, removeToast } = useSiteToast()

const getToastIcon = (type) => {
  if (type === 'success') {
    return 'lucide:circle-check'
  }

  if (type === 'error') {
    return 'lucide:circle-alert'
  }

  return 'lucide:info'
}
</script>

<style scoped>
.site-toast-viewport {
  position: fixed;
  top: max(18px, calc(env(safe-area-inset-top) + 14px));
  left: 0;
  z-index: 9999;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0 16px;
  pointer-events: none;
}

.site-toast-list {
  width: min(100%, 420px);
  display: grid;
  gap: 10px;
}

.site-toast-item {
  position: relative;
  min-height: 48px;
  display: grid;
  grid-template-columns: 20px minmax(0, 1fr) 24px;
  align-items: center;
  gap: 10px;
  overflow: hidden;
  padding: 12px 14px;
  border-radius: 8px;
  color: var(--theme-text);
  background:
    linear-gradient(90deg, var(--theme-surface-98), var(--theme-extra-12-34-52-098)),
    var(--theme-surface-98);
  box-shadow: 0 18px 40px var(--theme-black-38), 0 0 24px var(--theme-accent-action);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  pointer-events: auto;
  animation: site-toast-pop 0.22s cubic-bezier(0.2, 0.9, 0.24, 1.18) both;
}

.site-toast-item::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(115deg, transparent 0%, var(--theme-white-10) 42%, transparent 72%);
  opacity: 0;
  transform: translateX(-70%);
  animation: site-toast-sheen 1.15s ease 0.08s both;
  pointer-events: none;
}

.site-toast-item::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--theme-accent), var(--theme-primary));
  transform-origin: left center;
  animation: site-toast-progress 2.6s linear both;
}

.site-toast-item-success {
  background:
    linear-gradient(90deg, var(--theme-extra-9-32-45-098), var(--theme-extra-10-58-72-098)),
    var(--theme-surface-98);
}

.site-toast-item-error {
  background:
    linear-gradient(90deg, var(--theme-extra-44-18-25-098), var(--theme-extra-70-24-31-098)),
    var(--theme-surface-98);
  box-shadow: 0 18px 40px var(--theme-black-38), 0 0 24px var(--theme-extra-248-113-113-018);
}

.site-toast-item-error::after {
  background: linear-gradient(90deg, var(--theme-error), var(--theme-warning));
}

.site-toast-icon {
  width: 20px;
  height: 20px;
  color: var(--theme-accent);
  filter: drop-shadow(0 0 10px var(--theme-extra-34-211-238-055));
  animation: site-toast-icon-pop 0.34s ease both;
}

.site-toast-item-error .site-toast-icon {
  color: var(--theme-error);
  filter: drop-shadow(0 0 10px var(--theme-extra-248-113-113-05));
}

.site-toast-message {
  min-width: 0;
  color: var(--theme-text);
  font-size: 14px;
  line-height: 20px;
  overflow-wrap: anywhere;
}

.site-toast-close {
  width: 24px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  color: var(--theme-text-muted);
  cursor: pointer;
}

.site-toast-close:hover,
.site-toast-close:focus {
  color: var(--theme-text);
  background: var(--theme-white-08);
}

.site-toast-close svg {
  width: 16px;
  height: 16px;
}

.site-toast-enter-active,
.site-toast-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease, filter 0.2s ease;
}

.site-toast-enter-from,
.site-toast-leave-to {
  opacity: 0;
  filter: blur(3px);
  transform: translateY(-12px) scale(0.96);
}

@keyframes site-toast-pop {
  from {
    opacity: 0;
    transform: translateY(-12px) scale(0.96);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes site-toast-icon-pop {
  0% {
    opacity: 0;
    transform: scale(0.72);
  }

  68% {
    opacity: 1;
    transform: scale(1.14);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes site-toast-sheen {
  0% {
    opacity: 0;
    transform: translateX(-70%);
  }

  28% {
    opacity: 1;
  }

  100% {
    opacity: 0;
    transform: translateX(70%);
  }
}

@keyframes site-toast-progress {
  from {
    transform: scaleX(1);
  }

  to {
    transform: scaleX(0);
  }
}

@media (max-width: 520px) {
  .site-toast-viewport {
    top: max(12px, calc(env(safe-area-inset-top) + 10px));
    padding: 0 12px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .site-toast-item,
  .site-toast-item::before,
  .site-toast-item::after,
  .site-toast-icon,
  .site-toast-enter-active,
  .site-toast-leave-active {
    animation: none;
    transition: none;
  }
}
</style>
