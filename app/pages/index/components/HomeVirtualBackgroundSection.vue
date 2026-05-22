<template>
  <section class="home-virtual-section" aria-labelledby="home-virtual-title">
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
            class="home-virtual-video"
            :src="virtualVideoSrc"
            autoplay
            muted
            loop
            playsinline
            preload="metadata"
            aria-label="手机连接电脑作为虚拟相机演示"
          />
        </div>

        <div class="home-virtual-reflection" aria-hidden="true">
          <video
            class="home-virtual-reflection-video"
            :src="virtualVideoSrc"
            autoplay
            muted
            loop
            playsinline
            preload="metadata"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { getVirtual } from '../../../api/request/strapi'

const { locale } = useI18n()
const config = useRuntimeConfig()
const virtualVideoSrc = ref('')
const virtualSection = ref({
  tag: '',
  title_main: '',
  title_highlight: '',
  description: '',
})

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

  return `${String(config.public.strapiUrl || '').replace(/\/+$/, '')}${url}`
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

const loadVirtualContent = () => {
  getVirtual(locale.value).then(
    response => {
      syncVirtualContent(getVirtualContentData(response))
    },
    () => {
      syncVirtualContent()
    }
  )
}

onMounted(() => {
  loadVirtualContent()
})

watch(locale, () => {
  loadVirtualContent()
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
  background: url("/images/Layer.png") center / 100% 100% no-repeat;
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
  aspect-ratio: 887 / 385;
  margin: 0 auto;
  background: url("/images/layer2.png") center top / 100% 100% no-repeat;
}

.home-virtual-reflection-video {
  position: absolute;
  left: 2.8%;
  top: 4.2%;
  width: 94.4%;
  height: 91.6%;
  object-fit: cover;
  transform: rotate(180deg);
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
