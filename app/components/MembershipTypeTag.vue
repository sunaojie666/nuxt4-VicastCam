<template>
  <span
    v-if="typeKey"
    :class="['membership-type-tag', `membership-type-tag-${typeKey}`]"
  >
    <img
      v-if="showIcon && icon"
      class="membership-type-tag-icon"
      :src="icon"
      alt=""
      role="presentation"
    >
    <span>{{ tagLabel }}</span>
  </span>
</template>

<script setup>
import { memberStatusCopy } from '../utils/member-status'

const props = defineProps({
  vipType: {
    type: [String, Number],
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  showIcon: {
    type: Boolean,
    default: true,
  },
})

const mediaUrl = useMediaUrl()
const { locale } = useI18n()

const resolveMembershipTypeKey = (value) => {
  const vipType = String(value || '').trim()
  const normalizedVipType = vipType.toLowerCase()
  const vipTypeCode = vipType.toUpperCase()

  if (!vipType) {
    return 'free'
  }

  if (
    vipTypeCode === 'Y' ||
    normalizedVipType.includes('life') ||
    normalizedVipType.includes('lifetime') ||
    normalizedVipType.includes('permanent') ||
    normalizedVipType.includes('\u7ec8\u8eab') ||
    normalizedVipType.includes('\u6c38\u4e45')
  ) {
    return 'life'
  }

  if (
    vipTypeCode === 'N' ||
    normalizedVipType.includes('year') ||
    normalizedVipType.includes('annual') ||
    normalizedVipType.includes('\u5e74')
  ) {
    return 'year'
  }

  if (
    vipTypeCode === 'M' ||
    normalizedVipType.includes('month') ||
    normalizedVipType.includes('monthly') ||
    normalizedVipType.includes('\u6708')
  ) {
    return 'month'
  }

  return ''
}

const typeKey = computed(() => resolveMembershipTypeKey(props.vipType))

const typeIconMap = {
  life: '/images/profile/gold.png',
  year: '/images/profile/year.png',
  month: '/images/profile/month.png',
}

const icon = computed(() => {
  const path = typeIconMap[typeKey.value]

  return path ? mediaUrl(path) : ''
})

const tagLabel = computed(() => {
  if (props.label) {
    return props.label
  }

  return memberStatusCopy[locale.value]?.[typeKey.value] || ''
})
</script>

<style scoped>
.membership-type-tag {
  min-width: 0;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 0 10px 0 6px;
  box-sizing: border-box;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;
}

.membership-type-tag-icon {
  width: 18px;
  height: 18px;
  flex: 0 0 auto;
  object-fit: contain;
}

.membership-type-tag-life {
  color: var(--theme-extra-234-221-70-1, rgba(234, 221, 70, 1));
  background: rgba(234, 221, 70, 0.16);
  border: 1px solid rgba(234, 221, 70, 0.45);
}

.membership-type-tag-year {
  color: var(--theme-extra-72-156-255-1, rgba(72, 156, 255, 1));
  background: rgba(72, 156, 255, 0.16);
  border: 1px solid rgba(72, 156, 255, 0.4);
}

.membership-type-tag-month {
  color: var(--theme-extra-38-196-245-1, rgba(38, 196, 245, 1));
  background: rgba(38, 196, 245, 0.14);
  border: 1px solid rgba(38, 196, 245, 0.4);
}

.membership-type-tag-free {
  color: var(--theme-extra-154-167-189-1, rgba(154, 167, 189, 1));
  background: rgba(50, 62, 88, 0.8);
  border: 1px solid transparent;
}
</style>
