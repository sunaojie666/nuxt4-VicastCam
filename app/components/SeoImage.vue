<template>
  <!-- 统一图片出口：页面图片优先使用这个组件，保证 alt 有值。 -->
  <img
    :src="src"
    :alt="finalAlt"
    :width="width"
    :height="height"
    :loading="loading"
    :decoding="decoding"
  >
</template>

<script setup>
import { createImageAlt } from '../utils/seo'

// src 是图片地址，必须传入。
const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  // alt 是图片替代文本，建议每张业务图片都显式传入。
  alt: {
    type: String,
    default: '',
  },
  // width 和 height 建议传入，能减少图片加载时的页面抖动。
  width: {
    type: [String, Number],
    default: undefined,
  },
  height: {
    type: [String, Number],
    default: undefined,
  },
  // loading 默认懒加载，首屏主图可以传 eager。
  loading: {
    type: String,
    default: 'lazy',
  },
  // decoding 默认异步解码，减少图片阻塞页面渲染。
  decoding: {
    type: String,
    default: 'async',
  },
})

// finalAlt 是最终写入 img 的替代文本，未传 alt 时从文件名生成兜底文案。
const finalAlt = ref(createImageAlt(props.src, props.alt))
</script>
