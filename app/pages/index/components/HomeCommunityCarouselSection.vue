<template>
  <section class="home-community-section" aria-labelledby="home-community-title">
    <div class="home-community-inner">
      <span class="home-community-eyebrow home-section-eyebrow" data-reveal>{{ communitySection.tag }}</span>

      <h2 id="home-community-title" class="home-community-title home-section-title" data-reveal style="--reveal-delay: 80ms">
        <span>{{ communitySection.title_main }}</span>
        <span class="theme-gradient-text">{{ communitySection.title_highlight }}</span>
      </h2>

      <p class="home-community-subtitle home-section-subtitle" data-reveal style="--reveal-delay: 160ms">
        <span>{{ communitySection.desc }}</span>
      </p>
    </div>

    <div class="home-community-carousel" aria-label="全球直播者轮播" data-reveal="scale" style="--reveal-delay: 220ms">
      <div :key="`community-track-${locale}`" class="home-community-track">
        <div
          v-for="loopIndex in 4"
          :key="loopIndex"
          class="home-community-loop"
          :aria-hidden="loopIndex > 1"
        >
          <article
            v-for="(creator, index) in creators"
            :key="`${loopIndex}-${creator.id || creator.name}-${index}`"
            class="home-community-card"
          >
            <img
              v-if="creator.avatar"
              class="home-community-image"
              :src="creator.avatar"
              :alt="creator.name"
              loading="lazy"
            >

            <span class="home-community-live">
              <span></span>
              LIVE
            </span>

            <div class="home-community-card-body">
              <div>
                <h2 class="home-community-card-name" :dir="activeLocaleDir">{{ creator.name }}</h2>
                <p class="home-community-handle" :dir="activeLocaleDir">@{{ creator.username }}</p>
                <p class="home-community-location" :dir="activeLocaleDir">
                  <Icon name="lucide:map-pin" aria-hidden="true" />
                  {{ creator.location }}
                </p>
              </div>

              <p class="home-community-fans">
                <strong>{{ creator.followers }}</strong>
              </p>
            </div>
          </article>
        </div>
      </div>
    </div>

    <div class="home-community-stats" aria-label="VicastCam社区数据" data-reveal style="--reveal-delay: 120ms">
      <div v-for="stat in stats" :key="stat.id" class="home-community-stat">
        <strong>{{ stat.number }}</strong>
        <span>{{ stat.name }}</span>
      </div>
    </div>

    <div class="home-community-platforms" aria-labelledby="home-community-platforms-title" data-reveal style="--reveal-delay: 180ms">
      <span class="home-community-platforms-eyebrow home-section-eyebrow">{{ multiPlatformSection.tag }}</span>

      <h2 id="home-community-platforms-title" class="home-community-platforms-title home-section-title">
        <span>{{ multiPlatformSection.title_main }}</span>
        <span class="theme-gradient-text">{{ multiPlatformSection.title_highlight }}</span>
      </h2>

      <p class="home-community-platforms-subtitle home-section-subtitle">{{ multiPlatformSection.description }}</p>

      <div class="home-community-platforms-marquee" aria-label="支持的直播平台">
        <div
          v-for="(row, rowIndex) in platformRows"
          :key="`platform-row-${locale}-${rowIndex}`"
          :class="['home-community-platforms-track', { 'home-community-platforms-track-reverse': rowIndex % 2 === 1 }]"
        >
          <div
            v-for="loopIndex in 2"
            :key="`platform-loop-${rowIndex}-${loopIndex}`"
            class="home-community-platforms-loop"
            :aria-hidden="loopIndex > 1"
          >
            <article
              v-for="platform in row.items"
              :key="`${rowIndex}-${loopIndex}-${platform.name}`"
              class="home-community-platform-card"
            >
              <img class="home-community-platform-icon" :src="platform.icon" :alt="platform.name">
              <span>{{ platform.name }}</span>
            </article>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { getCommunity, getForm, getStreamers } from '../../../api/request/strapi'

const { locale, locales } = useI18n()
const config = useRuntimeConfig()
const creators = useState('home-community-creators', () => [])

const activeLocaleDir = computed(() => {
  const activeLocale = locales.value.find(item => typeof item !== 'string' && item.code === locale.value)

  return activeLocale?.dir || 'ltr'
})

const communitySection = useState('home-community-section-content', () => ({
  tag: '',
  title_main: '',
  title_highlight: '',
  desc: '',
}))
const multiPlatformSection = useState('home-community-platform-section', () => ({
  tag: '',
  title_main: '',
  title_highlight: '',
  description: '',
}))

const stats = useState('home-community-stats', () => [])
const homeCommunityContentLocale = useState('home-community-content-locale', () => '')
const homeCommunityFormLocale = useState('home-community-form-locale', () => '')
const homeCommunityStreamersLocale = useState('home-community-streamers-locale', () => '')

const platformCatalog = [
  { name: '抖音', icon: 'https://cdn2.douyinggongchang.com/vicastcam-website-media-20260721/images/platforms/platform-douyin.png' },
  { name: '快手', icon: 'https://cdn2.douyinggongchang.com/vicastcam-website-media-20260721/images/platforms/platform-kuaishou.png' },
  { name: '虎牙直播', icon: 'https://cdn2.douyinggongchang.com/vicastcam-website-media-20260721/images/platforms/platform-huya.png' },
  { name: '斗鱼', icon: 'https://cdn2.douyinggongchang.com/vicastcam-website-media-20260721/images/platforms/platform-douyu.png' },
  { name: '哔哩哔哩直播', icon: 'https://cdn2.douyinggongchang.com/vicastcam-website-media-20260721/images/platforms/platform-bilibili.png' },
  { name: '淘宝直播', icon: 'https://cdn2.douyinggongchang.com/vicastcam-website-media-20260721/images/platforms/platform-taobao-live.png' },
  { name: '京东直播', icon: 'https://cdn2.douyinggongchang.com/vicastcam-website-media-20260721/images/platforms/platform-jd-live.png' },
  { name: '小红书直播', icon: 'https://cdn2.douyinggongchang.com/vicastcam-website-media-20260721/images/platforms/platform-xiaohongshu-live.png' },
  { name: '微信视频号', icon: 'https://cdn2.douyinggongchang.com/vicastcam-website-media-20260721/images/platforms/platform-wechat-channels.png' },
  { name: '微博直播', icon: 'https://cdn2.douyinggongchang.com/vicastcam-website-media-20260721/images/platforms/platform-weibo-live.png' },
  { name: 'YY直播', icon: 'https://cdn2.douyinggongchang.com/vicastcam-website-media-20260721/images/platforms/platform-yy-live.png' },
  { name: '花椒直播', icon: 'https://cdn2.douyinggongchang.com/vicastcam-website-media-20260721/images/platforms/platform-huajiao.png' },
  { name: '六间房', icon: 'https://cdn2.douyinggongchang.com/vicastcam-website-media-20260721/images/platforms/platform-liujianfang.png' },
  { name: '映客直播', icon: 'https://cdn2.douyinggongchang.com/vicastcam-website-media-20260721/images/platforms/platform-inke.png' },
  { name: '酷狗直播', icon: 'https://cdn2.douyinggongchang.com/vicastcam-website-media-20260721/images/platforms/platform-kugou-live.png' },
  { name: '酷我聚星', icon: 'https://cdn2.douyinggongchang.com/vicastcam-website-media-20260721/images/platforms/platform-kuwo-juxing.png' },
  { name: '网易CC直播', icon: 'https://cdn2.douyinggongchang.com/vicastcam-website-media-20260721/images/platforms/platform-wangyi-cc.png' },
  { name: 'MOMO直播', icon: 'https://cdn2.douyinggongchang.com/vicastcam-website-media-20260721/images/platforms/platform-momo-live.png' },
  { name: 'AcFun直播', icon: 'https://cdn2.douyinggongchang.com/vicastcam-website-media-20260721/images/platforms/platform-acfun-live.png' },
  { name: 'Twitch', icon: 'https://cdn2.douyinggongchang.com/vicastcam-website-media-20260721/images/platforms/platform-twitch.png' },
  { name: 'YouTube Live', icon: 'https://cdn2.douyinggongchang.com/vicastcam-website-media-20260721/images/platforms/platform-youtube-live.png' },
  { name: 'Facebook Live', icon: 'https://cdn2.douyinggongchang.com/vicastcam-website-media-20260721/images/platforms/platform-facebook-live.png' },
  { name: 'Instagram Live', icon: 'https://cdn2.douyinggongchang.com/vicastcam-website-media-20260721/images/platforms/platform-instagram-live.png' },
  { name: 'TikTok Live', icon: 'https://cdn2.douyinggongchang.com/vicastcam-website-media-20260721/images/platforms/platform-tiktok-live.png' },
  { name: 'X', icon: 'https://cdn2.douyinggongchang.com/vicastcam-website-media-20260721/images/platforms/platform-x-live.png' },
  { name: 'Kick', icon: 'https://cdn2.douyinggongchang.com/vicastcam-website-media-20260721/images/platforms/platform-kick.png' },
  { name: 'Trovo', icon: 'https://cdn2.douyinggongchang.com/vicastcam-website-media-20260721/images/platforms/platform-trovo.png' },
  { name: 'BIGO LIVE', icon: 'https://cdn2.douyinggongchang.com/vicastcam-website-media-20260721/images/platforms/platform-bigo-live.png' },
  { name: 'Nimo TV', icon: 'https://cdn2.douyinggongchang.com/vicastcam-website-media-20260721/images/platforms/platform-nimo-tv.png' },
  { name: 'AfreecaTV', icon: 'https://cdn2.douyinggongchang.com/vicastcam-website-media-20260721/images/platforms/platform-afreecatv.png' },
  { name: 'CHZZK', icon: 'https://cdn2.douyinggongchang.com/vicastcam-website-media-20260721/images/platforms/platform-chzzk.png' },
  { name: 'Rumble', icon: 'https://cdn2.douyinggongchang.com/vicastcam-website-media-20260721/images/platforms/platform-rumble-live.png' },
  { name: 'DLive', icon: 'https://cdn2.douyinggongchang.com/vicastcam-website-media-20260721/images/platforms/platform-dlive.png' },
  { name: 'Steam Broadcast', icon: 'https://cdn2.douyinggongchang.com/vicastcam-website-media-20260721/images/platforms/platform-steam-broadcast.png' },
  { name: 'LinkedIn Live', icon: 'https://cdn2.douyinggongchang.com/vicastcam-website-media-20260721/images/platforms/platform-linkedin-live.png' },
  { name: 'Vimeo Live', icon: 'https://cdn2.douyinggongchang.com/vicastcam-website-media-20260721/images/platforms/platform-vimeo-live.png' },
  { name: 'Dacast', icon: 'https://cdn2.douyinggongchang.com/vicastcam-website-media-20260721/images/platforms/platform-dacast.png' },
  { name: 'Brightcove', icon: 'https://cdn2.douyinggongchang.com/vicastcam-website-media-20260721/images/platforms/platform-brightcove.png' },
  { name: '17LIVE', icon: 'https://cdn2.douyinggongchang.com/vicastcam-website-media-20260721/images/platforms/platform-17live.png' },
  { name: 'OPENREC.tv', icon: 'https://cdn2.douyinggongchang.com/vicastcam-website-media-20260721/images/platforms/platform-openrec.png' },
  { name: 'SOOP', icon: 'https://cdn2.douyinggongchang.com/vicastcam-website-media-20260721/images/platforms/platform-soop.png' },
  { name: 'Arena', icon: 'https://cdn2.douyinggongchang.com/vicastcam-website-media-20260721/images/platforms/platform-arena.png' },
  { name: 'Whatnot', icon: 'https://cdn2.douyinggongchang.com/vicastcam-website-media-20260721/images/platforms/platform-whatnot.png' },
  { name: 'Shopify Live', icon: 'https://cdn2.douyinggongchang.com/vicastcam-website-media-20260721/images/platforms/platform-shopify-live.png' },
  { name: 'Amazon Live', icon: 'https://cdn2.douyinggongchang.com/vicastcam-website-media-20260721/images/platforms/platform-amazon-live.png' },
  { name: 'LiveSpace', icon: 'https://cdn2.douyinggongchang.com/vicastcam-website-media-20260721/images/platforms/platform-livespace.png' },
  { name: 'Restream', icon: 'https://cdn2.douyinggongchang.com/vicastcam-website-media-20260721/images/platforms/platform-restream-live.png' },
  { name: 'StreamYard', icon: 'https://cdn2.douyinggongchang.com/vicastcam-website-media-20260721/images/platforms/platform-streamyard.png' },
  { name: 'Bambuser', icon: 'https://cdn2.douyinggongchang.com/vicastcam-website-media-20260721/images/platforms/platform-bambuser.png' },
  { name: 'BigMarker', icon: 'https://cdn2.douyinggongchang.com/vicastcam-website-media-20260721/images/platforms/platform-bigmarker.png' },
]

const platformRows = computed(() => {
  const rows = [[], [], []]
  platformCatalog.forEach((platform, index) => {
    rows[index % 3].push(platform)
  })
  return rows.map(items => ({ items }))
})

const createStrapiAssetUrl = (url) => {
  if (!url) {
    return ''
  }

  if (/^(https?:)?\/\//.test(url) || url.startsWith('data:')) {
    return url
  }

  return `${String(config.public.mediaUrl || '').replace(/\/+$/, '')}${url}`
}

const getStrapiItemData = (item = {}) => item.attributes || item

const getStrapiCollectionData = (response) => {
  if (Array.isArray(response?.data)) {
    return response.data.map(getStrapiItemData)
  }

  if (Array.isArray(response)) {
    return response.map(getStrapiItemData)
  }

  return []
}

const getStrapiMediaUrl = (media) => {
  if (Array.isArray(media)) {
    return getStrapiMediaUrl(media[0])
  }

  if (Array.isArray(media?.data)) {
    return getStrapiMediaUrl(media.data[0])
  }

  if (media?.data) {
    return getStrapiMediaUrl(media.data)
  }

  const mediaData = media?.attributes || media || {}

  return createStrapiAssetUrl(mediaData.url || '')
}

const getFormContentData = (response) => {
  if (Array.isArray(response?.data)) {
    const firstItem = response.data[0] || {}

    return firstItem.attributes || firstItem
  }

  return response?.data?.attributes || response?.data || response || {}
}

const syncFormContent = (formData = {}) => {
  multiPlatformSection.value = formData.data?.multi_platform_section || formData.multi_platform_section || {
    tag: '',
    title_main: '',
    title_highlight: '',
    description: '',
  }
}

const getCommunityContentData = (response) => {
  if (Array.isArray(response?.data)) {
    const firstItem = response.data[0] || {}

    return firstItem.attributes || firstItem
  }

  return response?.data?.attributes || response?.data || response || {}
}

const syncCommunityContent = (communityData = {}) => {
  const content = communityData.content || communityData.community_section || communityData

  communitySection.value = {
    tag: content.tag || '',
    title_main: content.title_main || '',
    title_highlight: content.title_highlight || '',
    desc: content.desc || '',
  }

  stats.value = Array.isArray(content.data_list)
    ? content.data_list.map((item, index) => ({
        id: item.id || `${index}-${item.name || ''}`,
        number: item.number || '',
        name: item.name || '',
      })).filter(item => item.number || item.name)
    : []
}

const syncStreamers = (streamerItems = []) => {
  creators.value = streamerItems.map((item, index) => ({
    id: item.id || `${index}-${item.name || ''}`,
    name: item.name || '',
    username: item.username || '',
    followers: item.followers || '',
    location: item.location || '',
    avatar: getStrapiMediaUrl(item.avatar),
  })).filter(item => item.name || item.username || item.followers || item.location || item.avatar)
}

useLocalizedAsyncState({
  locale,
  loadedLocale: homeCommunityFormLocale,
  load: currentLocale => getForm(currentLocale),
  sync: response => {
    syncFormContent(getFormContentData(response))
  },
  reset: () => {
    syncFormContent()
  },
})

useLocalizedAsyncState({
  locale,
  loadedLocale: homeCommunityContentLocale,
  load: currentLocale => getCommunity(currentLocale),
  sync: response => {
    syncCommunityContent(getCommunityContentData(response))
  },
  reset: () => {
    syncCommunityContent()
  },
})

useLocalizedAsyncState({
  locale,
  loadedLocale: homeCommunityStreamersLocale,
  load: currentLocale => getStreamers(currentLocale),
  sync: response => {
    syncStreamers(getStrapiCollectionData(response))
  },
  reset: () => {
    syncStreamers()
  },
})
</script>

<style>
.home-community-section {
  width: 100%;
  overflow: hidden;
  padding-top: 80px;
  padding-bottom: 0;
  color: var(--theme-text);
  background-color: var(--theme-community-background, var(--theme-surface-alt));
}

.home-community-inner {
  width: min(100%, var(--page-max-width));
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-left: var(--page-padding-x);
  padding-right: var(--page-padding-x);
}

.home-community-eyebrow {
  max-width: 100%;
  min-width: 90px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 17px;
  border: 1px solid var(--theme-primary-border-muted);
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

.home-community-title {
  max-width: 100%;
  margin-top: 21px;
  color: var(--theme-white);
  font-size: 40px;
  font-weight: 800;
  line-height: 52px;
  text-align: center;
  overflow-wrap: anywhere;
  hyphens: auto;
}

.home-community-title span {
  display: block;
}

.home-community-subtitle {
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

.home-community-carousel {
  width: 100%;
  max-width: 100vw;
  overflow: hidden;
  direction: ltr;
  margin-top: 76px;
}

.home-community-track {
  display: flex;
  direction: ltr;
  align-items: stretch;
  gap: 0;
  width: max-content;
  animation: home-community-marquee 32s linear infinite;
  will-change: transform;
}

.home-community-loop {
  display: flex;
  align-items: stretch;
  gap: var(--home-community-gap, 25px);
  flex: 0 0 auto;
  padding-right: var(--home-community-gap, 25px);
}

.home-community-carousel:hover .home-community-track {
  animation-play-state: paused;
}

@keyframes home-community-marquee {
  from {
    transform: translate3d(0, 0, 0);
  }

  to {
    transform: translate3d(-25%, 0, 0);
  }
}

.home-community-card {
  position: relative;
  overflow: hidden;
  width: 368px;
  height: 498px;
  flex: 0 0 auto;
  border: 1px solid transparent;
  border-radius: 8px;
  background-color: var(--theme-page);
  cursor: pointer;
  opacity: 1;
  transition: transform 0.25s ease;
}

.home-community-image {
  width: 100%;
  height: 382px;
  object-fit: cover;
}

.home-community-live {
  position: absolute;
  top: 22px;
  left: 22px;
  z-index: 2;
  height: 23px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0 9px;
  border-radius: 999px;
  color: var(--theme-white);
  background-color: var(--theme-error-strong);
  font-size: 11px;
  font-weight: 800;
  line-height: 1;
  max-width: calc(100% - 44px);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.home-community-live span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--theme-white);
}

.home-community-card-body {
  position: relative;
  z-index: 1;
  height: 119px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 24px 22px 20px;
  background-color: var(--theme-page);
  direction: ltr;
}

.home-community-card-body > div {
  min-width: 0;
}

.home-community-card-name {
  color: var(--theme-white);
  font-size: 15px;
  font-weight: 800;
  line-height: 20px;
  overflow: hidden;
  overflow-wrap: anywhere;
  hyphens: auto;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.home-community-handle {
  margin-top: 4px;
  color: var(--theme-text-muted);
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.home-community-location {
  display: flex;
  align-items: center;
  gap: 7px;
  min-width: 0;
  margin-top: 10px;
  color: var(--theme-text-muted);
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.home-community-location svg {
  width: 12px;
  height: 12px;
  flex: 0 0 auto;
}

.home-community-fans {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  min-width: 0;
  color: var(--theme-text-muted);
  font-size: 12px;
  line-height: 18px;
}

.home-community-fans strong {
  color: var(--theme-accent-brand);
  font-size: 16px;
  font-weight: 800;
  line-height: 20px;
}

:root[data-theme="light"] .home-community-card {
  border-color: rgba(148, 163, 184, 0.22);
  background-color: var(--theme-white);
  box-shadow: 0 16px 34px rgba(15, 23, 42, 0.08);
}

:root[data-theme="light"] .home-community-card-body {
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(248, 250, 252, 0.98));
}

:root[data-theme="light"] .home-community-card-name {
  color: rgba(17, 24, 39, 1);
}

:root[data-theme="light"] .home-community-handle,
:root[data-theme="light"] .home-community-location,
:root[data-theme="light"] .home-community-fans {
  color: rgba(75, 85, 99, 1);
}

:root[data-theme="light"] .home-community-location svg {
  color: rgba(107, 114, 128, 1);
}

:root[data-theme="light"] .home-community-fans strong {
  color: rgba(6, 182, 212, 1);
}

.home-community-stats {
  width: min(100%, var(--page-max-width));
  height: 118px;
  min-height: 118px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  margin: 100px auto 0;
  overflow: hidden;
  border-radius: 8px;
  background-color: var(--theme-community-stats-background, var(--theme-page));
}

.home-community-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-right: 1px solid var(--theme-community-stats-divider, var(--theme-surface-soft-72));
}

.home-community-stat:last-child {
  border-right: none;
}

.home-community-stat strong {
  color: var(--theme-community-stats-number, var(--theme-accent-brand));
  font-size: 28px;
  font-weight: 800;
  line-height: 34px;
}

.home-community-stat span {
  margin-top: 6px;
  color: var(--theme-community-stats-text, var(--theme-text-muted));
  font-size: 14px;
  font-weight: 400;
  line-height: 18px;
  max-width: 90%;
  overflow: hidden;
  overflow-wrap: anywhere;
  hyphens: auto;
  text-align: center;
}

.home-community-platforms {
  width: 100%;
  margin-top: 160px;
  padding-top: 80px;
  padding-bottom: 199px;
  text-align: center;
  background-color: var(--theme-platforms-background, transparent);
}

.home-community-platforms-eyebrow {
  max-width: 100%;
  min-width: 78px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 12px;
  border: 1px solid var(--theme-primary-border-muted);
  border-radius: 999px;
  color: var(--theme-info-blue);
  background-color: var(--theme-primary-softer);
  font-size: 14px;
  font-weight: 500;
  line-height: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.home-community-platforms-title {
  max-width: 100%;
  margin-top: 21px;
  color: var(--theme-white);
  font-size: 40px;
  font-weight: 800;
  line-height: 52px;
  overflow-wrap: anywhere;
  hyphens: auto;
}

.home-community-platforms-title span {
  display: block;
}

.home-community-platforms-subtitle {
  max-width: 100%;
  margin-top: 20px;
  color: var(--theme-text-muted-alt);
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  overflow-wrap: anywhere;
  hyphens: auto;
}

.home-community-platforms-marquee {
  width: 100%;
  max-width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 28px;
  overflow: hidden;
  direction: ltr;
  margin-top: 74px;
  padding: 6px 0;
}

.home-community-platforms-track {
  --home-platform-gap: 40px;
  display: flex;
  direction: ltr;
  gap: 0;
  width: max-content;
  animation: home-community-platform-marquee 72s linear infinite;
  will-change: transform;
}

.home-community-platforms-loop {
  display: flex;
  gap: var(--home-platform-gap);
  flex: 0 0 auto;
  padding-right: var(--home-platform-gap);
}

.home-community-platforms-track-reverse {
  animation-name: home-community-platform-marquee-reverse;
  animation-duration: 80s;
}

.home-community-platforms-marquee:hover .home-community-platforms-track {
  animation-play-state: paused;
}

.home-community-platform-card {
  width: 171px;
  height: 74px;
  position: relative;
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 0 16px;
  border: 1px solid var(--theme-platform-card-border, var(--theme-extra-46-59-86-1));
  border-radius: 10px;
  background: var(--theme-white-05);
  flex: 0 0 auto;
  cursor: pointer;
  transition: border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
  direction: ltr;
}

.home-community-platform-card:hover,
.home-community-platform-card:focus-within {
  z-index: 2;
  border-color: var(--theme-extra-50-191-241-09);
  background: var(--theme-accent-softer);
  box-shadow: 0 10px 22px var(--theme-extra-18-122-185-024);
  transform: translateY(-1px);
}

.home-community-platform-icon {
  width: 44px;
  height: 44px;
  object-fit: contain;
  flex: 0 0 auto;
}

.home-community-platform-card span {
  display: block;
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--theme-extra-152-162-181-1);
  font-size: 16px;
  line-height: 22px;
  font-weight: 400;
  white-space: nowrap;
}

@keyframes home-community-platform-marquee {
  from {
    transform: translate3d(0, 0, 0);
  }

  to {
    transform: translate3d(-50%, 0, 0);
  }
}

@keyframes home-community-platform-marquee-reverse {
  from {
    transform: translate3d(-50%, 0, 0);
  }

  to {
    transform: translate3d(0, 0, 0);
  }
}

@media (max-width: 768px) {

  .home-community-section {
    padding-top: 54px;
    padding-bottom: 0;
  }

  .home-community-title {
    margin-top: 18px;
    font-size: 32px;
    line-height: 40px;
  }

  .home-community-subtitle {
    margin-top: 20px;
    font-size: 13px;
  }

  .home-community-carousel {
    margin-top: 48px;
  }

  .home-community-track {
    --home-community-gap: 16px;
    width: max-content;
    padding-left: 0;
    padding-right: 0;
    overflow: visible;
    scroll-snap-type: none;
    animation-duration: 24s;
  }

  .home-community-card {
    width: min(70vw, 292px);
    height: 382px;
  }

  .home-community-image {
    height: 286px;
  }

  .home-community-card-body {
    height: 96px;
    padding: 16px 14px 14px;
  }

  .home-community-stats {
    width: min(calc(100% - var(--page-padding-x) * 2), 420px);
    height: auto;
    min-height: 0;
    grid-template-columns: repeat(2, 1fr);
    margin-top: 48px;
  }

  .home-community-stat {
    min-height: 96px;
    padding: 18px 10px;
  }

  .home-community-stat strong {
    font-size: 24px;
    line-height: 30px;
  }

  .home-community-stat span {
    font-size: 13px;
    line-height: 18px;
  }

  .home-community-stat:nth-child(2n) {
    border-right: none;
  }

  .home-community-stat:nth-child(-n + 2) {
    border-bottom: 1px solid var(--theme-community-stats-divider, var(--theme-surface-soft-72));
  }

  .home-community-platforms {
    margin-top: 80px;
    padding-top: 54px;
    padding-bottom: 54px;
  }

  .home-community-platforms-title {
    margin-top: 18px;
    font-size: 32px;
    line-height: 40px;
  }

  .home-community-platforms-subtitle {
    margin-top: 18px;
    padding: 0 var(--page-padding-x);
    font-size: 13px;
    line-height: 20px;
  }

  .home-community-platforms-marquee {
    gap: 18px;
    margin-top: 48px;
  }

  .home-community-platforms-track {
    --home-platform-gap: 16px;
    animation-duration: 60s;
  }

  .home-community-platforms-track-reverse {
    animation-duration: 68s;
  }

  .home-community-platform-card {
    width: 136px;
    height: 58px;
    padding: 0 10px;
    gap: 8px;
  }

  .home-community-platform-icon {
    width: 44px;
    height: 44px;
  }

  .home-community-platform-card span {
    font-size: 15px;
    line-height: 20px;
  }
}
</style>
