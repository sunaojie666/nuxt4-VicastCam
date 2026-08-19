<template>
  <section ref="sectionElement" class="home-virtual-section" aria-labelledby="home-virtual-title">
    <div class="home-virtual-inner">
      <span class="home-virtual-eyebrow home-section-eyebrow" data-reveal>{{ virtualSection.tag }}</span>

      <h2 id="home-virtual-title" class="home-virtual-title home-section-title" data-reveal style="--reveal-delay: 80ms">
        <span>{{ virtualSection.title_main }}</span>
        <span class="theme-gradient-text">{{ virtualSection.title_highlight }}</span>
      </h2>

      <p class="home-virtual-subtitle home-section-subtitle" data-reveal style="--reveal-delay: 160ms">
        <span>{{ virtualSection.description }}</span>
      </p>

      <div v-if="virtualVideoSrc" class="home-virtual-media" data-reveal="scale" style="--reveal-delay: 240ms">
        <div class="home-virtual-frame">
          <video
            ref="videoElement"
            class="home-virtual-video"
            :src="activeVideoSrc || undefined"
            :poster="mediaUrl('/images/login/background.png')"
            autoplay
            muted
            loop
            playsinline
            preload="none"
            @loadeddata="drawReflectionFrame"
            @play="startReflectionLoop"
            @pause="stopReflectionLoop"
            @emptied="clearReflection"
            aria-label="手机连接电脑作为虚拟相机演示"
          />
        </div>

        <div class="home-virtual-reflection" aria-hidden="true">
          <canvas ref="reflectionCanvas" class="home-virtual-reflection-canvas"></canvas>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { getVirtual } from '../../../api/request/strapi'
const mediaUrl = useMediaUrl()

const { locale } = useI18n()
const config = useRuntimeConfig()
const sectionElement = ref(null)
const videoElement = ref(null)
const reflectionCanvas = ref(null)
const shouldLoadVideo = ref(false)
const virtualVideoSrc = useState('home-virtual-video-src', () => '')
const virtualSection = useState('home-virtual-section', () => ({
  tag: '',
  title_main: '',
  title_highlight: '',
  description: '',
}))
const homeVirtualLocale = useState('home-virtual-locale', () => '')
const activeVideoSrc = computed(() => shouldLoadVideo.value ? virtualVideoSrc.value : '')

let visibilityObserver = null
let reflectionResizeObserver = null
let videoFrameRequestId = null
let animationFrameRequestId = null

const clearReflection = () => {
  const canvas = reflectionCanvas.value
  const context = canvas?.getContext('2d')

  if (canvas && context) {
    context.clearRect(0, 0, canvas.width, canvas.height)
  }
}

const drawReflectionFrame = () => {
  const video = videoElement.value
  const canvas = reflectionCanvas.value

  if (!video || !canvas || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
    return
  }

  const displayWidth = canvas.clientWidth
  const displayHeight = canvas.clientHeight
  const videoWidth = video.videoWidth
  const videoHeight = video.videoHeight

  if (!displayWidth || !displayHeight || !videoWidth || !videoHeight) {
    return
  }

  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
  const canvasWidth = Math.round(displayWidth * pixelRatio)
  const canvasHeight = Math.round(displayHeight * pixelRatio)

  if (canvas.width !== canvasWidth || canvas.height !== canvasHeight) {
    canvas.width = canvasWidth
    canvas.height = canvasHeight
  }

  const targetRatio = canvasWidth / canvasHeight
  const videoRatio = videoWidth / videoHeight
  let sourceX = 0
  let sourceY = 0
  let sourceWidth = videoWidth
  let sourceHeight = videoHeight

  if (videoRatio > targetRatio) {
    sourceWidth = videoHeight * targetRatio
    sourceX = (videoWidth - sourceWidth) / 2
  } else {
    sourceHeight = videoWidth / targetRatio
    sourceY = (videoHeight - sourceHeight) / 2
  }

  const context = canvas.getContext('2d', { alpha: true })
  context?.drawImage(
    video,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    0,
    0,
    canvasWidth,
    canvasHeight,
  )
}

const stopReflectionLoop = () => {
  const video = videoElement.value

  if (videoFrameRequestId !== null && typeof video?.cancelVideoFrameCallback === 'function') {
    video.cancelVideoFrameCallback(videoFrameRequestId)
  }

  if (animationFrameRequestId !== null) {
    window.cancelAnimationFrame(animationFrameRequestId)
  }

  videoFrameRequestId = null
  animationFrameRequestId = null
}

const queueReflectionFrame = () => {
  const video = videoElement.value

  if (!video || video.paused || video.ended) {
    return
  }

  if (typeof video.requestVideoFrameCallback === 'function') {
    videoFrameRequestId = video.requestVideoFrameCallback(() => {
      videoFrameRequestId = null
      drawReflectionFrame()
      queueReflectionFrame()
    })
    return
  }

  animationFrameRequestId = window.requestAnimationFrame(() => {
    animationFrameRequestId = null
    drawReflectionFrame()
    queueReflectionFrame()
  })
}

const startReflectionLoop = () => {
  stopReflectionLoop()
  drawReflectionFrame()
  queueReflectionFrame()
}

const getVirtualContentData = (response) => {
  if (Array.isArray(response?.data)) {
    const firstItem = response.data[0] || {}

    return firstItem.attributes || firstItem
  }

  return response?.data?.attributes || response?.data || response || {}
}

const createStrapiAssetURL = (url) => {
  if (!url) {
    return ''
  }

  if (/^https?:\/\//.test(url)) {
    return url
  }

  return `${String(config.public.mediaUrl || '').replace(/\/+$/, '')}${url}`
}

const getVirtualVideoURL = (virtualData = {}) => {
  const media = Array.isArray(virtualData.bgVideo)
    ? virtualData.bgVideo[0]
    : virtualData.bgVideo

  return createStrapiAssetURL(media?.url || '')
}

const syncVirtualContent = (virtualData = {}) => {
  virtualSection.value = virtualData.data || virtualData.virtual_section || virtualData
  virtualVideoSrc.value = getVirtualVideoURL(virtualData)
}

const { loadContent: loadVirtualContent } = useLocalizedAsyncState({
  locale,
  loadedLocale: homeVirtualLocale,
  load: currentLocale => getVirtual(currentLocale),
  sync: response => {
    syncVirtualContent(getVirtualContentData(response))
  },
  reset: () => {
    syncVirtualContent()
  },
})

onMounted(() => {
  if ('IntersectionObserver' in window && sectionElement.value) {
    visibilityObserver = new IntersectionObserver((entries) => {
      if (!entries.some(entry => entry.isIntersecting)) {
        return
      }

      shouldLoadVideo.value = true
      visibilityObserver?.disconnect()
      visibilityObserver = null
    }, {
      rootMargin: '400px 0px',
      threshold: 0.01,
    })
    visibilityObserver.observe(sectionElement.value)
  } else {
    shouldLoadVideo.value = true
  }

  if ('ResizeObserver' in window && reflectionCanvas.value) {
    reflectionResizeObserver = new ResizeObserver(drawReflectionFrame)
    reflectionResizeObserver.observe(reflectionCanvas.value)
  }
})

onBeforeUnmount(() => {
  visibilityObserver?.disconnect()
  reflectionResizeObserver?.disconnect()
  stopReflectionLoop()
})
</script>

<style>
.home-virtual-section {
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: 80px;
  padding-bottom: 0;
  color: var(--theme-text);
  background-color: var(--theme-virtual-background, var(--theme-page));
}

.home-virtual-inner {
  position: relative;
  width: min(100%, var(--page-max-width));
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-left: var(--page-padding-x);
  padding-right: var(--page-padding-x);
}

.home-virtual-eyebrow {
  max-width: 100%;
  min-width: 66px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  border: 1px solid var(--theme-primary-border);
  border-radius: 999px;
  color: var(--theme-info-blue);
  background-color: var(--theme-primary-softer);
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.home-virtual-title {
  max-width: 100%;
  margin-top: 18px;
  color: var(--theme-white);
  font-size: 40px;
  font-weight: 900;
  line-height: 48px;
  text-align: center;
  overflow-wrap: anywhere;
  hyphens: auto;
}

.home-virtual-title span {
  display: block;
}

.home-virtual-subtitle {
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  color: var(--theme-text-muted-alt);
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  text-align: center;
  overflow-wrap: anywhere;
  hyphens: auto;
}

.home-virtual-media {
  position: relative;
  width: min(100%, 887px);
  margin-top: 72px;
}

.home-virtual-frame {
  position: relative;
  z-index: 2;
  overflow: hidden;
  width: 100%;
  aspect-ratio: 887 / 582;
  background: var(--media-images-home-virtual-camera-frame-png) center / 100% 100% no-repeat;
}

.home-virtual-video {
  position: absolute;
  left: 2.8%;
  top: 4.2%;
  width: 94.4%;
  height: 91.6%;
  object-fit: cover;
  border-radius: 22px;
  background-color: var(--theme-surface);
}

.home-virtual-reflection {
  position: relative;
  z-index: 1;
  overflow: hidden;
  width: 100%;
  aspect-ratio: 888 / 388;
  margin: 0 auto;
}

.home-virtual-reflection::after {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  background: url("/images/home/virtual/camera-reflection-bg.png") center / 100% 100% no-repeat;
  content: "";
}

.home-virtual-reflection-canvas {
  position: absolute;
  z-index: 1;
  left: 3.15%;
  top: 8.25%;
  width: 93.92%;
  height: 91.75%;
  object-fit: cover;
  transform: scaleY(-1);
  opacity: 0.42;
}

@media (max-width: 768px) {

  .home-virtual-section {
    padding-top: 56px;
  }

  .home-virtual-title {
    font-size: 28px;
    line-height: 36px;
  }

  .home-virtual-subtitle {
    font-size: 11px;
  }

  .home-virtual-subtitle span {
    display: inline;
  }

  .home-virtual-media {
    width: min(100%, 520px);
    margin-top: 44px;
  }

  .home-virtual-video {
    border-radius: 14px;
  }

}
</style>
