<template>
  <div class="download-page-shell">
    <SiteHeader />

    <main class="download-page-main">
      <section class="download-hero">
        <div class="page-container download-hero-inner">
          <span class="download-eyebrow">下载中心</span>
          <h1>下载VicastCam</h1>
          <p>支持iOS、Android和Windows<br>选择你的平台，几分钟内即可开播。</p>

          <dl class="download-meta" aria-label="版本信息">
            <div>
              <dt>开发者：</dt>
              <dd>VICAST INTERNATIONAL LIMITED</dd>
            </div>
            <div class="download-policy-links">
              <button type="button">应用权限</button>
              <NuxtLink :to="localePath('/privacy')">隐私政策</NuxtLink>
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
              :class="['download-card', `download-card-${platform.key}`]"
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
                <img class="download-desktop-action-icon" :src="platform.desktopActionIcon" alt="" aria-hidden="true">
                <img class="download-mobile-action-icon" :src="platform.actionIcon" alt="" aria-hidden="true">
                <span>{{ platform.actionLabel }}</span>
              </button>

              <p class="download-card-footnote">{{ platform.system }}</p>
            </article>
          </div>

          <section class="download-mobile-help" aria-labelledby="download-mobile-help-title">
            <span class="download-mobile-help-icon" aria-hidden="true">
              <Icon name="lucide:messages-square" />
            </span>
            <div>
              <h2 id="download-mobile-help-title">下载遇到问题？</h2>
              <p>您可联系我们获取专业的设备顾问，我们将帮助您完成软件安装</p>
            </div>
            <button type="button">联系客服</button>
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

            <section class="download-desktop-help" aria-labelledby="download-desktop-help-title">
              <div class="download-desktop-help-copy">
                <h2 id="download-desktop-help-title">下载遇到问题？</h2>
                <p>查看常见问题或联系我们的客服团队，我们将竭诚为您提供帮助</p>
              </div>
              <button type="button">联系客服</button>
            </section>
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

const localePath = useLocalePath()

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
    actionLabel: '立即下载',
    actionIcon: '/images/xiazai.png',
    desktopActionIcon: '/images/saomagreen.png',
    mobileBackground: '/images/live/anzhuobg.png',
    mobileIcon: '/images/live/anzhuoshouji.png',
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
    actionLabel: 'App Store',
    actionIcon: '/images/xiazai.png',
    desktopActionIcon: '/images/saomagzi.png',
    mobileBackground: '/images/live/iosbg.png',
    mobileIcon: '/images/live/iosshouji.png',
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
    actionIcon: '/images/xiazai.png',
    desktopActionIcon: '/images/xiazai.png',
    mobileBackground: '/images/live/winbg.png',
    mobileIcon: '/images/live/winshouji.png',
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
  background: var(--page-route-background);
}

.download-page-main {
  width: 100%;
  flex: 1;
  background: var(--page-route-background);
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

.download-policy-links button,
.download-policy-links a {
  color: rgba(34, 211, 238, 1);
  font-size: 12px;
  line-height: 18px;
  cursor: pointer;
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

.download-reasons h2 {
  color: rgba(255, 255, 255, 1);
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

.download-desktop-help {
  width: 100%;
  aspect-ratio: 1155 / 228;
  display: grid;
  grid-template-columns: minmax(0, 520px) 128px minmax(220px, 1fr);
  align-items: center;
  gap: 40px;
  margin-top: 30px;
  padding: 0 72px;
  overflow: hidden;
  border-radius: 12px;
  background: url("/images/xiazaikefu.png") center / cover no-repeat;
}

.download-desktop-help-copy {
  max-width: 520px;
}

.download-desktop-help h2 {
  color: rgba(255, 255, 255, 1);
  font-size: 32px;
  font-weight: 800;
  line-height: 44px;
  text-align: left;
}

.download-desktop-help p {
  margin-top: 10px;
  color: rgba(201, 211, 226, 1);
  font-size: 16px;
  line-height: 26px;
}

.download-desktop-help button {
  width: 128px;
  height: 44px;
  grid-column: 2;
  justify-self: end;
  border-radius: 999px;
  color: rgba(255, 255, 255, 1);
  background: linear-gradient(124deg, rgba(8, 179, 213, 1), rgba(58, 131, 245, 1));
  font-size: 15px;
  font-weight: 700;
  line-height: 20px;
  cursor: pointer;
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

.download-primary-button img {
  width: 15px;
  height: 15px;
  object-fit: contain;
}

.download-mobile-action-icon {
  display: none;
}

.download-card-android .download-primary-button {
  color: rgba(20, 89, 80, 1);
}

.download-card-ios .download-primary-button {
  color: rgba(39, 20, 89, 1);
}

.download-card-windows .download-primary-button {
  color: rgba(2, 112, 254, 1);
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

.download-platform-icon {
  display: none;
}

.download-mobile-help {
  display: none;
}

.download-desktop-help {
  display: grid;
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
      radial-gradient(circle at 74% 0%, rgba(69, 45, 137, 0.48), transparent 35%),
      radial-gradient(circle at 22% 0%, rgba(28, 93, 188, 0.28), transparent 34%),
      rgba(8, 15, 29, 1);
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

  .download-hero p {
    width: min(100%, 520px);
    margin-top: 5px;
    font-size: clamp(11px, 2.7778vw, 30px);
    line-height: 1.35;
  }

  .download-meta,
  .download-section-heading,
  .download-reasons {
    display: none;
  }

  .download-desktop-help {
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
    color: rgba(20, 89, 80, 1);
  }

  .download-card-ios .download-primary-button {
    color: rgba(39, 20, 89, 1);
  }

  .download-card-windows .download-primary-button {
    color: rgba(2, 112, 254, 1);
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
    color: rgba(255, 255, 255, 0.86);
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

  .download-mobile-help {
    width: min(88.9815vw, 961px);
    min-height: 0;
    aspect-ratio: 961 / 204;
    display: grid;
    grid-template-columns: min(15.7407vw, 170px) minmax(0, 1fr) min(23.1481vw, 250px);
    align-items: center;
    gap: min(2.7778vw, 30px);
    margin-top: min(19.4444vw, 210px);
    padding: min(3.2407vw, 35px) min(4.2593vw, 46px);
    border: none;
    border-radius: min(2.2222vw, 24px);
    background: url("/images/live/kefu.png") center / cover no-repeat;
  }

  .download-mobile-help-icon {
    width: min(12.963vw, 140px);
    height: min(12.963vw, 140px);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: min(2.2222vw, 24px);
    color: rgba(125, 211, 252, 1);
    background:
      radial-gradient(circle at 35% 25%, rgba(34, 211, 238, 0.56), transparent 44%),
      rgba(37, 99, 235, 0.32);
  }

  .download-mobile-help-icon svg {
    width: min(6.1111vw, 66px);
    height: min(6.1111vw, 66px);
  }

  .download-mobile-help h2 {
    color: rgba(255, 255, 255, 1);
    font-size: clamp(11px, 3.3333vw, 36px);
    font-weight: 800;
    line-height: 16px;
  }

  .download-mobile-help p {
    margin-top: min(0.7407vw, 8px);
    color: rgba(149, 156, 168, 1);
    font-size: clamp(6px, 1.4815vw, 16px);
    line-height: 1.3;
  }

  .download-mobile-help button {
    width: min(21.2037vw, 229px);
    height: auto;
    aspect-ratio: 229 / 72;
    justify-self: end;
    border-radius: min(1.3889vw, 15px);
    color: rgba(255, 255, 255, 1);
    background: linear-gradient(124deg, rgba(8, 179, 213, 1), rgba(58, 131, 245, 1));
    font-size: clamp(8px, 1.8519vw, 20px);
    font-weight: 800;
    line-height: 12px;
    cursor: pointer;
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
