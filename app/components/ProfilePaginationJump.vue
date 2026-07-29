<template>
  <div class="profile-pagination-jump">
    <span class="profile-pagination-jump-label">{{ displayLabel }}</span>
    <input
      v-model="pageValue"
      type="text"
      inputmode="numeric"
      pattern="[0-9]*"
      class="profile-pagination-jump-input"
      :disabled="isDisabled"
      :aria-label="displayAriaLabel"
      @blur="syncInput"
      @keyup.enter.prevent="submitPage"
    >
    <span v-if="displayUnit" class="profile-pagination-jump-unit">{{ displayUnit }}</span>
    <button
      type="button"
      class="profile-pagination-jump-button"
      :disabled="isDisabled"
      :aria-label="displayButtonLabel"
      @click="submitPage"
    >
      <Icon name="lucide:arrow-right" aria-hidden="true" />
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  currentPage: {
    type: [Number, String],
    default: 1,
  },
  maxPage: {
    type: Number,
    default: 1,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['jump'])
const { profileBox } = useProfileText()
const pageValue = ref('')

const isDisabled = computed(() => props.disabled || props.maxPage <= 1)
const paginationJumpText = computed(() => profileBox.value?.common?.paginationJump || {})
const displayLabel = computed(() => paginationJumpText.value.label || '')
const displayUnit = computed(() => paginationJumpText.value.unit || '')
const displayAriaLabel = computed(() => paginationJumpText.value.ariaLabel || '')
const displayButtonLabel = computed(() => paginationJumpText.value.buttonLabel || '')

const syncInput = () => {
  const nextValue = Number.parseInt(String(pageValue.value || ''), 10)

  if (!Number.isFinite(nextValue)) {
    pageValue.value = String(props.currentPage || 1)
    return
  }

  const nextPage = Math.min(Math.max(nextValue, 1), props.maxPage)
  pageValue.value = String(nextPage)
}

const submitPage = () => {
  if (isDisabled.value) {
    return
  }

  const nextValue = Number.parseInt(String(pageValue.value || ''), 10)

  if (!Number.isFinite(nextValue)) {
    syncInput()
    return
  }

  const nextPage = Math.min(Math.max(nextValue, 1), props.maxPage)
  pageValue.value = String(nextPage)
  emit('jump', nextPage)
}

watch(
  () => [props.currentPage, props.maxPage],
  () => {
    pageValue.value = String(props.currentPage || 1)
  },
  { immediate: true }
)
</script>

<style scoped>
.profile-pagination-jump {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex: 0 0 auto;
}

.profile-pagination-jump-label,
.profile-pagination-jump-unit {
  color: var(--theme-extra-123-142-170-1);
  font-size: 12px;
  line-height: 16px;
  white-space: nowrap;
}

.profile-pagination-jump-input {
  width: 66px;
  height: 30px;
  padding: 0 10px;
  border: 1px solid var(--theme-extra-31-59-107-1);
  border-radius: 8px;
  color: var(--theme-extra-241-247-255-1);
  background: var(--theme-extra-13-37-76-085);
  font-size: 14px;
  line-height: 20px;
  text-align: center;
}

.profile-pagination-jump-input:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.profile-pagination-jump-button {
  width: 30px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--theme-extra-31-59-107-1);
  border-radius: 8px;
  color: var(--theme-extra-123-142-170-1);
  background: var(--theme-extra-13-37-76-085);
  cursor: pointer;
}

.profile-pagination-jump-button svg {
  width: 16px;
  height: 16px;
}

.profile-pagination-jump-button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
</style>
