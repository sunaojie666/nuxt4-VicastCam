<template>
  <div class="download-page-shell">
    <SiteHeader />

    <main class="download-page-main">
      <section class="download-hero">
        <div class="page-container download-hero-inner">
          <span class="download-eyebrow">{{ downloadBox.hero.eyebrow }}</span>
          <h1>{{ downloadBox.hero.title }}</h1>
        </div>
      </section>

      <section class="download-platform-section">
        <div class="page-container download-platform-inner">
          <header class="download-section-heading">
            <h2>{{ downloadBox.platform.title }}</h2>
            <p>{{ downloadBox.platform.description }}</p>
          </header>

          <div class="download-card-grid">
            <article
              v-for="platform in platforms"
              :key="platform.key"
              :class="[
                'download-card',
                `download-card-${platform.key}`,
                { 'download-card-qr-open': activeQrPlatform === platform.key },
              ]"
              :style="{
                '--download-desktop-bg': `url(${platform.image})`,
                '--download-mobile-bg': `url(${platform.mobileBackground})`,
              }"
            >
              <span class="download-platform-icon" aria-hidden="true">
                <img :src="platform.mobileIcon" alt="">
              </span>

              <div class="download-card-title">
                <h3>{{ platform.name }}</h3>
                <p>{{ platform.subtitle }}</p>
              </div>

              <button
                type="button"
                class="download-card-icon-button"
                :aria-label="`${platform.name}${downloadBox.platform.downloadAriaSuffix}`"
                @click="handleDownload(platform)"
              >
                <Icon name="lucide:download" aria-hidden="true" />
              </button>

              <dl class="download-card-info">
                <div>
                  <dt>{{ downloadBox.platform.versionLabel }}</dt>
                  <dd>{{ platform.version }}</dd>
                </div>
                <div>
                  <dt>{{ downloadBox.platform.updatedAtLabel }}</dt>
                  <dd>{{ platform.updatedAt }}</dd>
                </div>
                <div>
                  <dt>{{ downloadBox.platform.sizeLabel }}</dt>
                  <dd>{{ platform.size }}</dd>
                </div>
              </dl>

              <button
                type="button"
                class="download-primary-button"
                @click="handleDownload(platform)"
              >
                <img class="download-desktop-action-icon" :src="platform.desktopActionIcon" alt="" aria-hidden="true">
                <img class="download-mobile-action-icon" :src="platform.actionIcon" alt="" aria-hidden="true">
                <span>{{ platform.actionLabel }}</span>
              </button>

              <p class="download-card-footnote">{{ platform.system }}</p>

              <Transition name="download-qr-pop">
                <div v-if="activeQrPlatform === platform.key" class="download-qr-panel">
                  <button
                    type="button"
                    class="download-qr-close"
                    :aria-label="`${downloadBox.platform.closeQrAriaPrefix}${platform.name}${downloadBox.platform.closeQrAriaSuffix}`"
                    @click="closeDownloadQr"
                  >
                    <Icon name="lucide:x" aria-hidden="true" />
                  </button>

                  <div class="download-qr-code" aria-hidden="true">
                    <img :src="platform.qrImage" alt="">
                  </div>

                  <strong>{{ platform.qrTitle }}</strong>
                  <span>{{ platform.qrDescription }}</span>
                </div>
              </Transition>
            </article>
          </div>

          <section class="download-reasons" aria-labelledby="download-reasons-title">
            <h2 id="download-reasons-title">{{ downloadBox.reasons.title }}</h2>

            <div class="download-reason-grid">
              <article
                v-for="reason in reasonCards"
                :key="reason.title"
                class="download-reason-card"
              >
                <span class="download-reason-icon">
                  <img :src="reason.image" :alt="reason.title">
                </span>
                <h3>{{ reason.title }}</h3>
                <p>{{ reason.text }}</p>
              </article>
            </div>

          </section>
        </div>
      </section>
    </main>

    <SiteFooter />
  </div>
</template>

<script setup>
import SiteFooter from '../../components/SiteFooter.vue'
import SiteHeader from '../../components/SiteHeader.vue'
import { getDownloads } from '../../api/request/strapi'
import { setupPageSeo } from '../../utils/seo'

const { locale } = useI18n()
let downloadRequestId = 0

const emptyDownloadBox = {
  hero: {
    eyebrow: '',
    title: '',
  },
  platform: {
    title: '',
    description: '',
    versionLabel: '',
    updatedAtLabel: '',
    sizeLabel: '',
    downloadAriaSuffix: '',
    closeQrAriaPrefix: '',
    closeQrAriaSuffix: '',
    items: [],
  },
  reasons: {
    title: '',
    items: [],
  },
  seo: {
    title: '',
    description: '',
  },
}

const platformAssets = [
  {
    key: 'android',
    image: '/images/download/win.png',
    actionIcon: '/images/download/action-download.png',
    desktopActionIcon: '/images/download/action-qr-green.png',
    mobileBackground: '/images/download/mobile-android-bg.png',
    mobileIcon: '/images/download/mobile-android-icon.png',
    qrImage: '/images/download/action-qr-green.png',
  },
  {
    key: 'ios',
    image: '/images/download/ios.png',
    actionIcon: '/images/download/action-download.png',
    desktopActionIcon: '/images/download/action-qr-purple.png',
    mobileBackground: '/images/download/mobile-ios-bg.png',
    mobileIcon: '/images/download/mobile-ios-icon.png',
    qrImage: '/images/download/action-qr-purple.png',
  },
  {
    key: 'windows',
    image: '/images/download/android.png',
    actionIcon: '/images/download/action-download.png',
    desktopActionIcon: '/images/download/action-download.png',
    mobileBackground: '/images/download/mobile-windows-bg.png',
    mobileIcon: '/images/download/mobile-windows-icon.png',
    qrImage: '',
  },
]

const reasonAssets = [
  {
    key: 'secure',
    image: '/images/download/reason-fast.png',
  },
  {
    key: 'updates',
    image: '/images/download/reason-secure.png',
  },
  {
    key: 'support',
    image: '/images/download/reason-cross-platform.png',
  },
  {
    key: 'tutorial',
    image: '/images/download/reason-support.png',
  },
]

const createEmptyDownloadBox = () => ({
  hero: { ...emptyDownloadBox.hero },
  platform: { ...emptyDownloadBox.platform, items: [] },
  reasons: { ...emptyDownloadBox.reasons, items: [] },
  seo: { ...emptyDownloadBox.seo },
})

const downloadBox = ref(createEmptyDownloadBox())

const normalizeList = (items) => {
  return Array.isArray(items) ? items.filter(Boolean) : []
}

const normalizeDownloadBox = (box = {}) => {
  const source = box || {}

  return {
    hero: {
      ...emptyDownloadBox.hero,
      ...(source.hero || {}),
    },
    platform: {
      ...emptyDownloadBox.platform,
      ...(source.platform || {}),
      items: normalizeList(source.platform?.items),
    },
    reasons: {
      ...emptyDownloadBox.reasons,
      ...(source.reasons || {}),
      items: normalizeList(source.reasons?.items),
    },
    seo: {
      ...emptyDownloadBox.seo,
      ...(source.seo || {}),
    },
  }
}

const getDownloadBoxFromResponse = (response) => {
  const records = response?.data
  const firstRecord = Array.isArray(records) ? records[0] : records
  const record = firstRecord?.attributes || firstRecord || {}
  const data = record.data || {}

  return normalizeDownloadBox(data.downloadBox || data)
}

const platforms = computed(() => {
  return normalizeList(downloadBox.value.platform.items).map(item => {
    const asset = platformAssets.find(platform => platform.key === item.key) || {}

    return {
      ...asset,
      ...item,
      key: item.key || asset.key || '',
    }
  }).filter(item => item.key)
})

const reasonCards = computed(() => {
  return normalizeList(downloadBox.value.reasons.items).map(item => {
    const asset = reasonAssets.find(reason => reason.key === item.key) || {}

    return {
      ...asset,
      ...item,
      key: item.key || asset.key || item.title || '',
    }
  })
})

const loadDownloadBox = () => {
  const requestId = ++downloadRequestId
  const currentLocale = locale.value

  getDownloads(currentLocale).then(response => {
    if (requestId !== downloadRequestId || currentLocale !== locale.value) {
      return
    }

    downloadBox.value = getDownloadBoxFromResponse(response)
    closeDownloadQr()
  })
}

const handleDownload = (platform) => {
  if (!process.client) {
    return
  }

  if (platform.key === 'android' || platform.key === 'ios') {
    activeQrPlatform.value = activeQrPlatform.value === platform.key ? '' : platform.key
  }
}

const activeQrPlatform = ref('')

const closeDownloadQr = () => {
  activeQrPlatform.value = ''
}

onMounted(() => {
  loadDownloadBox()
})

watch(locale, () => {
  loadDownloadBox()
})

setupPageSeo('download', () => downloadBox.value.seo)
</script>

<style scoped>
.download-page-shell {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-x: clip;
  padding-top: var(--page-header-height);
  color: var(--theme-text);
  background: var(--theme-route-page-background, var(--page-route-background));
}

.download-page-main {
  width: 100%;
  flex: 1;
  background: var(--theme-route-page-background, var(--page-route-background));
}

.download-hero {
  height: 298px;
  display: flex;
  align-items: center;
  background:
    radial-gradient(circle at 45% 0%, var(--theme-extra-58-44-131-042), transparent 34%),
    radial-gradient(circle at 12% 0%, var(--theme-extra-37-99-235-026), transparent 30%),
    linear-gradient(180deg, var(--theme-surface-start), var(--theme-surface-deeper));
}

@media (min-width: 901px) {
  :root[data-theme="light"] .download-hero {
    background: url("/images/common/light-page-hero-bg.png") center / cover no-repeat;
  }
}

.download-hero-inner {
  display: grid;
  justify-items: center;
  padding-top: 20px;
  padding-bottom: 22px;
  text-align: center;
}

.download-eyebrow {
  min-width: 76px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 15px;
  border: 1px solid var(--theme-info-border);
  border-radius: 999px;
  color: var(--theme-info-blue-strong);
  background: var(--theme-info-panel);
  font-size: 14px;
  line-height: 28px;
}

:root[data-theme="light"] .download-eyebrow {
  color: rgba(96, 165, 250, 1);
  background: rgba(59, 130, 246, 0.1);
}

.download-hero h1 {
  margin-top: 14px;
  color: var(--theme-white);
  font-size: 58px;
  font-weight: 800;
  line-height: 1.08;
}

:root[data-theme="light"] .download-hero h1 {
  color: rgba(40, 115, 253, 1);
}

.download-platform-section {
  padding: 40px 0 60px;
  background: var(--page-route-background);
}

.download-platform-inner {
  display: grid;
  justify-items: center;
}

.download-section-heading {
  display: grid;
  justify-items: center;
  text-align: center;
}

.download-section-heading h2 {
  color: var(--theme-download-reason-title, var(--theme-white));
  font-size: clamp(26px, 3vw, 36px);
  font-weight: 800;
  line-height: 1.2;
}

.download-section-heading p {
  margin-top: 12px;
  color: var(--theme-download-reason-text, var(--theme-text-muted-alt));
  font-size: 14px;
  line-height: 22px;
}

.download-card-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 338px);
  justify-content: space-between;
  gap: 20px;
  margin-top: 26px;
}

.download-reasons h2 {
  color: var(--theme-download-reason-title, var(--theme-white));
  font-size: 24px;
  font-weight: 800;
  line-height: 34px;
}

.download-reasons {
  width: 100%;
  margin-top: 40px;
}

.download-reasons h2 {
  font-size: 34px;
  line-height: 48px;
  text-align: center;
}

.download-reason-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;
  margin-top: 18px;
}

.download-reason-card {
  min-height: 181px;
  padding: 36px 32px 24px;
  border-radius: 8px;
  border: 1px solid var(--theme-download-reason-card-border, transparent);
  background: var(--theme-download-reason-card-background, var(--theme-panel-card));
}

.download-reason-icon {
  width: 100px;
  height: 100px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: var(--theme-accent);
  background: var(--theme-download-reason-icon-background, var(--theme-extra-42-52-76-1));
}

:root[data-theme="light"] .download-reason-card:nth-child(1) .download-reason-icon {
  background: rgba(224, 235, 255, 1);
}

:root[data-theme="light"] .download-reason-card:nth-child(2) .download-reason-icon {
  background: rgba(246, 242, 255, 1);
}

:root[data-theme="light"] .download-reason-card:nth-child(3) .download-reason-icon {
  background: rgba(232, 255, 241, 1);
}

:root[data-theme="light"] .download-reason-card:nth-child(4) .download-reason-icon {
  background: rgba(255, 231, 214, 1);
}

.download-reason-icon img {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.download-reason-card h3 {
  margin-top: 18px;
  color: var(--theme-download-reason-title, var(--theme-white));
  font-size: 24px;
  font-weight: 800;
  line-height: 34px;
}

.download-reason-card p {
  margin-top: 9px;
  color: var(--theme-download-reason-text, var(--theme-text-muted-alt));
  font-size: 16px;
  line-height: 24px;
}

.download-card {
  position: relative;
  width: 338px;
  height: 389px;
  overflow: hidden;
  border-radius: 13px;
  background-image: var(--download-desktop-bg);
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}

.download-card::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 1;
  opacity: 0;
  background: linear-gradient(180deg, var(--theme-black-36), rgba(0, 0, 0, 0.64));
  pointer-events: none;
  transition: opacity 0.26s ease;
}

.download-card-qr-open::before {
  opacity: 1;
}

.download-card-title {
  position: absolute;
  top: 80px;
  left: 197px;
  width: 118px;
  z-index: 2;
}

.download-card-title h3 {
  color: var(--theme-white);
  font-size: 18px;
  font-weight: 800;
  line-height: 25px;
}

.download-card-title p {
  margin-top: 6px;
  color: var(--theme-extra-168-178-197-1);
  font-size: 12px;
  line-height: 17px;
}

.download-card-icon-button {
  position: absolute;
  top: 19px;
  right: 19px;
  z-index: 2;
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: var(--theme-extra-214-230-255-1);
  background: var(--theme-white-14);
  cursor: pointer;
}

.download-card-icon-button svg {
  width: 15px;
  height: 15px;
}

.download-card-info {
  position: absolute;
  left: 24px;
  right: 24px;
  bottom: 111px;
  z-index: 2;
  display: grid;
  gap: 5px;
  padding: 12px 14px 11px;
  border-radius: 8px;
  background: var(--theme-white-08);
}

.download-card-info div {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
}

.download-card-info dt {
  color: var(--theme-text-faint);
  font-size: 11px;
  line-height: 16px;
}

.download-card-info dd {
  color: var(--theme-white);
  font-size: 11px;
  font-weight: 800;
  line-height: 16px;
}

.download-primary-button {
  position: absolute;
  left: 24px;
  right: 24px;
  bottom: 49px;
  z-index: 2;
  height: 47px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border-radius: 8px;
  color: var(--theme-extra-30-25-82-1);
  background: var(--theme-white);
  font-size: 12px;
  font-weight: 800;
  line-height: 18px;
  cursor: pointer;
}

.download-primary-button img {
  width: 15px;
  height: 15px;
  object-fit: contain;
}

.download-mobile-action-icon {
  display: none;
}

.download-card-android .download-primary-button {
  color: var(--theme-extra-20-89-80-1);
}

.download-card-ios .download-primary-button {
  color: var(--theme-extra-39-20-89-1);
}

.download-card-windows .download-primary-button {
  color: var(--theme-extra-2-112-254-1);
}

.download-card-footnote {
  position: absolute;
  left: 24px;
  right: 24px;
  bottom: 18px;
  z-index: 2;
  color: var(--theme-white-86);
  font-size: 11px;
  font-weight: 700;
  line-height: 16px;
  text-align: center;
}

.download-platform-icon {
  display: none;
}

.download-qr-panel {
  position: absolute;
  left: 24px;
  right: 24px;
  bottom: 24px;
  z-index: 5;
  min-height: 240px;
  display: grid;
  justify-items: center;
  align-content: center;
  padding: 26px 18px 24px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 12px;
  color: var(--theme-white);
  background: rgba(15, 23, 42, 0.92);
  box-shadow: 0 22px 48px var(--theme-black-36);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

.download-qr-close {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: var(--theme-white-86);
  background: var(--theme-white-10);
  cursor: pointer;
}

.download-qr-close svg {
  width: 15px;
  height: 15px;
}

.download-qr-code {
  width: 118px;
  height: 118px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  border-radius: 14px;
  background: var(--theme-white);
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.08);
}

.download-qr-code img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.download-qr-panel strong {
  margin-top: 18px;
  color: var(--theme-white);
  font-size: 16px;
  font-weight: 800;
  line-height: 22px;
  text-align: center;
}

.download-qr-panel span {
  margin-top: 6px;
  color: var(--theme-text-muted);
  font-size: 12px;
  line-height: 18px;
  text-align: center;
}

.download-qr-pop-enter-active,
.download-qr-pop-leave-active {
  transition: opacity 0.24s ease, transform 0.28s cubic-bezier(0.22, 1, 0.36, 1), filter 0.24s ease;
  transform-origin: center bottom;
}

.download-qr-pop-enter-from,
.download-qr-pop-leave-to {
  opacity: 0;
  filter: blur(5px);
  transform: translateY(28px) scale(0.72);
}

.download-qr-pop-enter-to,
.download-qr-pop-leave-from {
  opacity: 1;
  filter: blur(0);
  transform: translateY(0) scale(1);
}

@media (min-width: 1180px) {
  .download-card-grid {
    gap: 20px;
  }
}

@media (max-width: 900px) {
  .download-page-shell {
    padding-top: 0;
  }

  .download-page-shell :deep(.page-header),
  .download-page-shell :deep(.site-footer) {
    display: none;
  }

  .download-page-main {
    min-height: 100vh;
    background:
      radial-gradient(circle at 74% 0%, var(--theme-extra-69-45-137-048), transparent 35%),
      radial-gradient(circle at 22% 0%, var(--theme-extra-28-93-188-028), transparent 34%),
      var(--theme-extra-8-15-29-1);
  }

  :root[data-theme="light"] .download-page-main {
    background: var(--theme-route-page-background, var(--page-route-background));
  }

  .download-hero {
    height: auto;
    padding-top: 18px;
    background: transparent;
  }

  .download-hero-inner {
    padding-left: 16px;
    padding-right: 16px;
    padding-top: 0;
    padding-bottom: 0;
  }

  .download-eyebrow {
    min-width: 48px;
    height: 16px;
    padding: 0 9px;
    font-size: 7px;
    line-height: 16px;
  }

  .download-hero h1 {
    margin-top: 16px;
    font-size: clamp(22px, 6.6667vw, 72px);
    line-height: 1.12;
  }

  .download-section-heading,
  .download-reasons {
    display: none;
  }

  .download-platform-section {
    padding: 24px 0 52px;
    background: transparent;
  }

  .download-platform-inner {
    padding-left: 16px;
    padding-right: 16px;
  }

  .download-card-grid {
    width: min(88.8889vw, 960px);
    grid-template-columns: 1fr;
    justify-content: center;
    gap: clamp(10px, 2.7778vw, 30px);
    margin-top: 0;
  }

  .download-card {
    width: 100%;
    height: auto;
    aspect-ratio: 960 / 222;
    display: grid;
    grid-template-columns: min(11.1111vw, 120px) minmax(0, 1fr) min(23.3333vw, 252px);
    grid-template-rows: 1fr auto min(1.5741vw, 17px) auto 1fr;
    align-items: center;
    column-gap: min(3.3333vw, 36px);
    padding: min(3.3333vw, 36px) min(3.7037vw, 40px);
    border: none;
    border-radius: min(1.3889vw, 15px);
    background-image: var(--download-mobile-bg);
    background-position: center;
    background-size: cover;
  }

  .download-card-title {
    position: static;
    width: auto;
    min-width: 0;
    grid-column: 2;
    grid-row: 1 / -1;
    align-self: center;
    transform: translateY(max(-2.037vw, -22px));
  }

  .download-platform-icon {
    width: min(11.1111vw, 120px);
    height: min(11.1111vw, 120px);
    grid-column: 1;
    grid-row: 1 / -1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: min(2.2222vw, 24px);
    z-index: 2;
  }

  .download-platform-icon img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .download-card-title h3 {
    font-size: clamp(12px, 3.3333vw, 36px);
    line-height: 1.25;
  }

  .download-qr-panel {
    left: auto;
    right: min(3.7037vw, 40px);
    bottom: 50%;
    width: min(23.3333vw, 252px);
    min-height: min(17.7778vw, 192px);
    padding: min(2.2222vw, 24px) min(1.6667vw, 18px);
    border-radius: min(1.3889vw, 15px);
    transform: translateY(50%);
  }

  .download-qr-code {
    width: min(10.3704vw, 112px);
    height: min(10.3704vw, 112px);
    padding: min(2.2222vw, 24px);
    border-radius: min(1.2963vw, 14px);
  }

  .download-qr-close {
    top: min(0.9259vw, 10px);
    right: min(0.9259vw, 10px);
    width: min(2.5926vw, 28px);
    height: min(2.5926vw, 28px);
  }

  .download-qr-close svg {
    width: min(1.3889vw, 15px);
    height: min(1.3889vw, 15px);
  }

  .download-qr-panel strong {
    margin-top: min(1.1111vw, 12px);
    font-size: clamp(6px, 1.6667vw, 18px);
    line-height: 1.2;
  }

  .download-qr-panel span {
    margin-top: min(0.5556vw, 6px);
    font-size: clamp(5px, 1.2037vw, 13px);
    line-height: 1.2;
  }

  .download-qr-pop-enter-active,
  .download-qr-pop-leave-active {
    transform-origin: right center;
  }

  .download-qr-pop-enter-from,
  .download-qr-pop-leave-to {
    transform: translateY(50%) scale(0.72);
  }

  .download-qr-pop-enter-to,
  .download-qr-pop-leave-from {
    transform: translateY(50%) scale(1);
  }

  .download-card-title p {
    margin-top: min(0.5556vw, 6px);
    font-size: clamp(8px, 2.2222vw, 24px);
    line-height: 1.25;
  }

  .download-card-info {
    position: static;
    grid-column: 2;
    grid-row: 1 / -1;
    align-self: center;
    display: flex;
    gap: min(2.2222vw, 24px);
    margin-top: 0;
    padding: 0;
    border-radius: 0;
    background: transparent;
    transform: translateY(min(4.6296vw, 50px));
  }

  .download-card-info div {
    display: inline-flex;
    gap: min(0.3704vw, 4px);
  }

  .download-primary-button {
    position: static;
    width: min(23.3333vw, 252px);
    max-width: 252px;
    height: auto;
    aspect-ratio: 252 / 80;
    grid-column: 3;
    grid-row: 2;
    align-self: end;
    justify-self: end;
    gap: min(0.9259vw, 10px);
    border-radius: min(1.3889vw, 15px);
    font-size: clamp(6px, 1.6667vw, 18px);
    font-weight: 700;
    line-height: 1.2;
    white-space: nowrap;
  }

  .download-primary-button img {
    width: min(1.8519vw, 20px);
    height: min(1.8519vw, 20px);
    object-fit: contain;
  }

  .download-desktop-action-icon {
    display: none;
  }

  .download-mobile-action-icon {
    display: inline-block;
  }

  .download-card-android .download-primary-button {
    color: var(--theme-extra-20-89-80-1);
  }

  .download-card-ios .download-primary-button {
    color: var(--theme-extra-39-20-89-1);
  }

  .download-card-windows .download-primary-button {
    color: var(--theme-extra-2-112-254-1);
  }

  .download-card-icon-button {
    display: none;
  }

  .download-card-info dt,
  .download-card-info dd,
  .download-card-footnote {
    font-size: clamp(6px, 1.2963vw, 14px);
    line-height: 1.2;
  }

  .download-card-info dt::after {
    content: ":";
  }

  .download-card-info dd {
    font-weight: 400;
  }

  .download-card-info div:nth-child(2) {
    display: none;
  }

  .download-card-footnote {
    position: static;
    left: auto;
    right: auto;
    bottom: auto;
    width: min(23.3333vw, 252px);
    max-width: 252px;
    grid-column: 3;
    grid-row: 4;
    align-self: start;
    justify-self: end;
    margin-bottom: 0;
    color: var(--theme-white-86);
    text-align: center;
    font-weight: 400;
    overflow: visible;
    text-overflow: clip;
    white-space: nowrap;
  }

  .download-card-footnote {
    font-size: clamp(6px, 1.6667vw, 18px);
  }

  .download-card::after {
    content: "";
    width: 0;
    height: 0;
  }

}

@media (max-width: 520px) {
  .download-reasons h2 {
    font-size: 28px;
    line-height: 38px;
  }

  .download-reason-grid {
    grid-template-columns: 1fr;
  }
}
</style>
