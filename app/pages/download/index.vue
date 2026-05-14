<template>
  <div class="download-page-shell">
    <SiteHeader />

    <main class="download-page-main">
      <section class="download-hero">
        <div class="page-container download-hero-inner">
          <span class="download-eyebrow">下载中心</span>
          <h1>下载VicastCam</h1>
          <p>支持iOS、Android和Windows，选择你的平台，几分钟内即可开播。</p>

          <dl class="download-meta" aria-label="版本信息">
            <div>
              <dt>开发者：</dt>
              <dd>VICAST INTERNATIONAL LIMITED</dd>
            </div>
            <div class="download-policy-links">
              <button type="button">应用权限</button>
              <button type="button">隐私政策</button>
              <button type="button">用户协议</button>
            </div>
            <div class="download-meta-break">
              <div>
                <dt>版本号：</dt>
                <dd>3.0.2</dd>
              </div>
              <div>
                <dt>更新时间：</dt>
                <dd>2026-05-15</dd>
              </div>
            </div>
          </dl>
        </div>
      </section>

      <section class="download-platform-section">
        <div class="page-container download-platform-inner">
          <header class="download-section-heading">
            <h2>选择您的平台</h2>
            <p>VicastCam支持Windows、iOS、Android三大平台，开启专业直播</p>
          </header>

          <div class="download-card-grid">
            <article
              v-for="platform in platforms"
              :key="platform.key"
              class="download-card"
              :style="{ backgroundImage: `url(${platform.image})` }"
            >
              <div class="download-card-title">
                <h3>{{ platform.name }}</h3>
                <p>{{ platform.subtitle }}</p>
              </div>

              <button
                type="button"
                class="download-card-icon-button"
                :aria-label="`${platform.name}下载`"
                @click="handleDownload(platform)"
              >
                <Icon name="lucide:download" aria-hidden="true" />
              </button>

              <dl class="download-card-info">
                <div>
                  <dt>版本号</dt>
                  <dd>{{ platform.version }}</dd>
                </div>
                <div>
                  <dt>更新时间</dt>
                  <dd>{{ platform.updatedAt }}</dd>
                </div>
                <div>
                  <dt>安装包大小</dt>
                  <dd>{{ platform.size }}</dd>
                </div>
              </dl>

              <button
                type="button"
                class="download-primary-button"
                @click="handleDownload(platform)"
              >
                <Icon :name="platform.actionIcon" aria-hidden="true" />
                <span>{{ platform.actionLabel }}</span>
              </button>

              <p class="download-card-footnote">{{ platform.system }}</p>
            </article>
          </div>

          <section class="download-version-panel" aria-labelledby="download-version-title">
            <h2 id="download-version-title">版本更新记录</h2>

            <div class="download-version-layout">
              <ol class="download-version-list" aria-label="版本列表">
                <li
                  v-for="version in versionRecords"
                  :key="version.id"
                  :class="['download-version-item', { 'download-version-item-active': version.active }]"
                >
                  <span class="download-version-dot"></span>
                  <strong>{{ version.version }}</strong>
                  <time>{{ version.date }}</time>
                </li>
              </ol>

              <div class="download-version-detail">
                <ul
                  v-for="record in versionRecords"
                  :key="record.id"
                >
                  <li v-for="item in record.notes" :key="item">{{ item }}</li>
                </ul>
              </div>
            </div>

            <button type="button" class="download-history-button">
              <span>查看更多历史版本</span>
              <Icon name="lucide:chevrons-down" aria-hidden="true" />
            </button>
          </section>

          <section class="download-reasons" aria-labelledby="download-reasons-title">
            <h2 id="download-reasons-title">为什么选择VicastCam</h2>

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
import { setupPageSeo } from '../../utils/seo'

const platforms = [
  {
    key: 'android',
    name: 'Android',
    subtitle: 'Android 8.0+',
    version: 'v3.2.0',
    updatedAt: '2026-05-13',
    size: '115MB',
    system: '支持Android 8.0及以上系统',
    image: '/images/download/win.png',
    actionLabel: '扫码下载',
    actionIcon: 'lucide:scan-line',
  },
  {
    key: 'ios',
    name: 'IOS',
    subtitle: 'iPhone / iPad',
    version: 'v3.2.0',
    updatedAt: '2026-05-13',
    size: '115MB',
    system: '支持iOS 13.0及以上系统',
    image: '/images/download/ios.png',
    actionLabel: '扫码下载',
    actionIcon: 'lucide:scan-line',
  },
  {
    key: 'windows',
    name: 'Windows',
    subtitle: 'Windows 10/11 64-bit',
    version: 'v3.2.0',
    updatedAt: '2026-05-13',
    size: '115MB',
    system: '适用 Windows 10及以上系统',
    image: '/images/download/android.png',
    actionLabel: '立即下载',
    actionIcon: 'lucide:download',
  },
]

const versionRecords = [
  {
    id: '3.2.1',
    version: 'v3.2.1',
    date: '2026-06-06',
    active: true,
    notes: [
      '更新说明更新说明更新说明',
      '更新说明更',
      '更新说明更新说明更新说明更新说明更新说明',
    ],
  },
  {
    id: '3.2.0-a',
    version: 'v3.2.0',
    date: '2026-04-06',
    notes: [
      '更新说明更新说明',
      '更新说明更新说明更新',
      '更新说明更新说明更新',
    ],
  },
  {
    id: '3.2.0-b',
    version: 'v3.2.0',
    date: '2026-04-06',
    notes: [
      '更新说明更新说明',
      '更新说明更新说明更新',
      '更新说明更新说明更新',
    ],
  },
]

const reasonCards = [
  {
    title: '安全可靠',
    text: '多重安全防护机制，保障您的数据与账号安全',
    image: '/images/download/dsc1.png',
  },
  {
    title: '持续更新',
    text: '我们持续优化产品，为您带来更稳定的使用体验',
    image: '/images/download/dsc2.png',
  },
  {
    title: '专业支持',
    text: '7×24 小时技术支持，快速响应您的问题',
    image: '/images/download/dsc3.png',
  },
  {
    title: '使用教程',
    text: '详细的视频教程与功能说明，帮助您快速上手',
    image: '/images/download/dsc4.png',
  },
]

const handleDownload = (platform) => {
  if (!process.client) {
    return
  }

  console.log(`download:${platform.key}`)
}

setupPageSeo('download')
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
  background: rgba(3, 7, 18, 1);
}

.download-page-main {
  width: 100%;
  flex: 1;
  background: rgba(3, 7, 18, 1);
}

.download-hero {
  height: 298px;
  display: flex;
  align-items: center;
  background:
    radial-gradient(circle at 45% 0%, rgba(58, 44, 131, 0.42), transparent 34%),
    radial-gradient(circle at 12% 0%, rgba(37, 99, 235, 0.26), transparent 30%),
    linear-gradient(180deg, rgba(10, 17, 31, 1), rgba(9, 15, 28, 1));
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
  border: 1px solid rgba(37, 99, 235, 0.56);
  border-radius: 999px;
  color: rgba(93, 176, 255, 1);
  background: rgba(22, 39, 76, 0.52);
  font-size: 14px;
  line-height: 28px;
}

.download-hero h1 {
  margin-top: 14px;
  color: rgba(255, 255, 255, 1);
  font-size: 58px;
  font-weight: 800;
  line-height: 1.08;
}

.download-hero p {
  margin-top: 13px;
  color: rgba(149, 156, 168, 1);
  font-size: 20px;
  line-height: 30px;
}

.download-meta {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px 28px;
  margin-top: 15px;
  color: rgba(149, 156, 168, 1);
  font-size: 12px;
  line-height: 18px;
}

.download-meta div {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.download-meta-break {
  flex-basis: 100%;
  justify-content: center;
  gap: 28px !important;
}

.download-meta dt,
.download-meta dd {
  display: inline;
}

.download-meta dd {
  color: rgba(229, 238, 252, 1);
}

.download-policy-links {
  gap: 18px !important;
}

.download-policy-links button {
  color: rgba(34, 211, 238, 1);
  font-size: 12px;
  line-height: 18px;
  cursor: pointer;
}

.download-platform-section {
  padding: 40px 0 60px;
  background: rgba(3, 9, 18, 1);
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
  color: rgba(255, 255, 255, 1);
  font-size: clamp(26px, 3vw, 36px);
  font-weight: 800;
  line-height: 1.2;
}

.download-section-heading p {
  margin-top: 12px;
  color: rgba(149, 156, 168, 1);
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

.download-version-panel {
  width: 100%;
  min-height: 477px;
  margin-top: 80px;
  padding: 28px 28px 32px;
  border-radius: 10px;
  background: rgba(27, 36, 56, 1);
}

.download-version-panel h2,
.download-reasons h2 {
  color: rgba(255, 255, 255, 1);
  font-size: 24px;
  font-weight: 800;
  line-height: 34px;
}

.download-version-layout {
  display: grid;
  grid-template-columns: 237px minmax(0, 1fr);
  gap: 44px;
  margin-top: 20px;
}

.download-version-list {
  position: relative;
  display: grid;
  gap: 58px;
  padding: 20px 0 20px 54px;
}

.download-version-list::before {
  content: "";
  position: absolute;
  top: 22px;
  bottom: 20px;
  left: 31px;
  width: 1px;
  background: rgba(72, 84, 111, 1);
}

.download-version-list::after {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  width: 1px;
  background: rgba(72, 84, 111, 1);
}

.download-version-item {
  position: relative;
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  column-gap: 34px;
  row-gap: 4px;
}

.download-version-dot {
  position: absolute;
  top: 8px;
  left: -27px;
  z-index: 1;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(75, 192, 255, 1);
}

.download-version-item-active .download-version-dot {
  background: rgba(56, 218, 132, 1);
}

.download-version-item strong {
  color: rgba(255, 255, 255, 1);
  font-size: 20px;
  font-weight: 800;
  line-height: 28px;
}

.download-version-item time {
  color: rgba(149, 156, 168, 1);
  font-size: 12px;
  line-height: 18px;
}

.download-version-detail {
  display: grid;
  gap: 25px;
  padding-top: 2px;
}

.download-version-detail ul {
  display: grid;
  gap: 14px;
}

.download-version-detail li {
  color: rgba(229, 238, 252, 0.82);
  font-size: 14px;
  line-height: 22px;
}

.download-version-detail li::before {
  content: "+ ";
}

.download-history-button {
  width: 286px;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  margin: 31px auto 0;
  border-radius: 9px;
  color: rgba(184, 195, 215, 1);
  background: rgba(45, 56, 78, 1);
  font-size: 12px;
  line-height: 18px;
  cursor: pointer;
}

.download-history-button svg {
  width: 16px;
  height: 16px;
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
  background: rgba(27, 36, 56, 1);
}

.download-reason-icon {
  width: 100px;
  height: 100px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: rgba(34, 211, 238, 1);
  background: rgba(42, 52, 76, 1);
}

.download-reason-icon img {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.download-reason-card h3 {
  margin-top: 18px;
  color: rgba(255, 255, 255, 1);
  font-size: 24px;
  font-weight: 800;
  line-height: 34px;
}

.download-reason-card p {
  margin-top: 9px;
  color: rgba(149, 156, 168, 1);
  font-size: 16px;
  line-height: 24px;
}

.download-card {
  position: relative;
  width: 338px;
  height: 389px;
  overflow: hidden;
  border-radius: 13px;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}

.download-card-title {
  position: absolute;
  top: 80px;
  left: 197px;
  width: 118px;
}

.download-card-title h3 {
  color: rgba(255, 255, 255, 1);
  font-size: 18px;
  font-weight: 800;
  line-height: 25px;
}

.download-card-title p {
  margin-top: 6px;
  color: rgba(168, 178, 197, 1);
  font-size: 12px;
  line-height: 17px;
}

.download-card-icon-button {
  position: absolute;
  top: 19px;
  right: 19px;
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: rgba(214, 230, 255, 1);
  background: rgba(255, 255, 255, 0.14);
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
  display: grid;
  gap: 5px;
  padding: 12px 14px 11px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.08);
}

.download-card-info div {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
}

.download-card-info dt {
  color: rgba(207, 220, 241, 0.82);
  font-size: 11px;
  line-height: 16px;
}

.download-card-info dd {
  color: rgba(255, 255, 255, 1);
  font-size: 11px;
  font-weight: 800;
  line-height: 16px;
}

.download-primary-button {
  position: absolute;
  left: 24px;
  right: 24px;
  bottom: 49px;
  height: 47px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border-radius: 8px;
  color: rgba(30, 25, 82, 1);
  background: rgba(255, 255, 255, 1);
  font-size: 12px;
  font-weight: 800;
  line-height: 18px;
  cursor: pointer;
}

.download-primary-button svg {
  width: 14px;
  height: 14px;
}

.download-card-footnote {
  position: absolute;
  left: 24px;
  right: 24px;
  bottom: 18px;
  color: rgba(255, 255, 255, 0.86);
  font-size: 11px;
  font-weight: 700;
  line-height: 16px;
  text-align: center;
}

@media (min-width: 1180px) {
  .download-card-grid {
    gap: 20px;
  }
}

@media (max-width: 900px) {
  .download-hero-inner {
    padding-left: 16px;
    padding-right: 16px;
  }

  .download-platform-section {
    padding: 40px 0 60px;
  }

  .download-platform-inner {
    padding-left: 16px;
    padding-right: 16px;
  }

  .download-card-grid {
    grid-template-columns: minmax(0, 338px);
    justify-content: center;
    gap: 22px;
  }

  .download-version-panel {
    min-height: 0;
    margin-top: 36px;
    padding: 22px 18px 26px;
  }

  .download-version-layout {
    grid-template-columns: 1fr;
    gap: 22px;
  }

  .download-version-list {
    gap: 34px;
    padding-left: 34px;
  }

  .download-version-list::before {
    left: 10px;
  }

  .download-version-list::after {
    display: none;
  }

  .download-version-detail {
    gap: 20px;
  }

  .download-history-button {
    width: min(100%, 286px);
  }

  .download-reason-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .download-card {
    width: min(100%, 338px);
    height: auto;
    aspect-ratio: 338 / 389;
  }

  .download-card-title {
    top: 20.5%;
    left: 58.5%;
    width: 34%;
  }

  .download-card-info {
    left: 7%;
    right: 7%;
    bottom: 28.7%;
  }

  .download-primary-button {
    left: 7%;
    right: 7%;
    bottom: 12.6%;
    height: 38px;
  }

  .download-card-footnote {
    bottom: 4.1%;
  }
}

@media (max-width: 520px) {
  .download-hero h1 {
    font-size: 38px;
  }

  .download-hero p,
  .download-section-heading p {
    font-size: 13px;
  }

  .download-reasons h2 {
    font-size: 28px;
    line-height: 38px;
  }

  .download-reason-grid {
    grid-template-columns: 1fr;
  }
}
</style>
