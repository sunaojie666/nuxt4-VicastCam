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
  color: rgba(248, 250, 252, 1);
  background:
    linear-gradient(90deg, rgba(15, 23, 42, 0.98), rgba(12, 34, 52, 0.98)),
    rgba(15, 23, 42, 0.98);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.38), 0 0 24px rgba(34, 211, 238, 0.16);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  pointer-events: auto;
  animation: site-toast-pop 0.22s cubic-bezier(0.2, 0.9, 0.24, 1.18) both;
}

.site-toast-item::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(115deg, transparent 0%, rgba(255, 255, 255, 0.1) 42%, transparent 72%);
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
  background: linear-gradient(90deg, rgba(34, 211, 238, 1), rgba(59, 130, 246, 1));
  transform-origin: left center;
  animation: site-toast-progress 2.6s linear both;
}

.site-toast-item-success {
  background:
    linear-gradient(90deg, rgba(9, 32, 45, 0.98), rgba(10, 58, 72, 0.98)),
    rgba(15, 23, 42, 0.98);
}

.site-toast-item-error {
  background:
    linear-gradient(90deg, rgba(44, 18, 25, 0.98), rgba(70, 24, 31, 0.98)),
    rgba(15, 23, 42, 0.98);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.38), 0 0 24px rgba(248, 113, 113, 0.18);
}

.site-toast-item-error::after {
  background: linear-gradient(90deg, rgba(248, 113, 113, 1), rgba(251, 146, 60, 1));
}

.site-toast-icon {
  width: 20px;
  height: 20px;
  color: rgba(34, 211, 238, 1);
  filter: drop-shadow(0 0 10px rgba(34, 211, 238, 0.55));
  animation: site-toast-icon-pop 0.34s ease both;
}

.site-toast-item-error .site-toast-icon {
  color: rgba(248, 113, 113, 1);
  filter: drop-shadow(0 0 10px rgba(248, 113, 113, 0.5));
}

.site-toast-message {
  min-width: 0;
  color: rgba(248, 250, 252, 1);
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
  color: rgba(148, 163, 184, 1);
  cursor: pointer;
}

.site-toast-close:hover,
.site-toast-close:focus {
  color: rgba(248, 250, 252, 1);
  background: rgba(255, 255, 255, 0.08);
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
