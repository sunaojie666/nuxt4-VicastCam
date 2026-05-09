<template>
  <section id="home-download" class="home-hero-section" aria-labelledby="home-hero-title">
    <video
      class="home-hero-video"
      :src="heroVideoSrc"
      autoplay
      muted
      loop
      playsinline
      preload="metadata"
      aria-hidden="true"
    />

    <div class="home-hero-overlay"></div>

    <div class="home-hero-inner">
      <span class="home-hero-eyebrow">
        <img src="/images/star.png" alt="" aria-hidden="true">
        AI赋能的直播工具
      </span>

      <h1 id="home-hero-title" class="home-hero-title">
        <span>一键更换虚拟背景</span>
        <span>
          直播更精彩
          <img class="home-hero-title-line" src="/images/path.png" alt="" aria-hidden="true">
        </span>
      </h1>

      <p class="home-hero-subtitle">
        <span>VicastCam使用先进的抠图技术，在直播期间随时替换您的背景。</span>
        <span>打造丰富多彩的直播效果，处处展现专业形象。</span>
      </p>

      <div class="home-hero-actions" aria-label="下载VicastCam">
        <a href="#" class="home-hero-download home-hero-download-light">
          <img src="/images/apple.png" alt="" aria-hidden="true">
          <span>在App Store<br><strong>下载</strong></span>
        </a>

        <a href="#" class="home-hero-download home-hero-download-light">
          <img src="/images/chromicon.png" alt="" aria-hidden="true">
          <span>在Google Play<br><strong>下载</strong></span>
        </a>

        <a href="#" class="home-hero-download home-hero-download-primary">
          <img src="/images/win.png" alt="" aria-hidden="true">
          <span>下载客户端</span>
        </a>
      </div>

      <div class="home-hero-metrics" aria-label="VicastCam数据">
        <div class="home-hero-metric">
          <span class="home-hero-avatars">
            <span></span>
            <span></span>
            <span></span>
          </span>
          <strong>50万+</strong>
          <span>全球使用人数</span>
        </div>

        <div class="home-hero-metric">
          <span class="home-hero-score-icons" aria-hidden="true">
            <img v-for="star in 5" :key="star" src="/images/score.png" alt="">
          </span>
          <strong>4.9</strong>
          <span>App Store评分</span>
        </div>

        <div class="home-hero-metric">
          <img class="home-hero-download-icon" src="/images/download.png" alt="" aria-hidden="true">
          <strong>10万+</strong>
          <span>全球下载次数</span>
        </div>
      </div>

      <a class="home-hero-scroll-cue" href="#home-features" aria-label="向下滚动查看功能特色">
        <span class="home-hero-scroll-arrows" aria-hidden="true">
          <span class="home-hero-scroll-arrow">
            <Icon name="lucide:chevron-down" />
          </span>
          <span class="home-hero-scroll-arrow">
            <Icon name="lucide:chevron-down" />
          </span>
          <span class="home-hero-scroll-arrow">
            <Icon name="lucide:chevron-down" />
          </span>
        </span>
      </a>
    </div>
  </section>
</template>

<script setup>
const heroVideoSrc = 'https://cdn.douyinggongchang.com/upload/sys/media/d0/6114f628f3df1f3facbc4f87127fd5.mp4'
</script>

<style>
@media (prefers-reduced-motion: reduce) {

  .home-hero-eyebrow,
  .home-hero-title,
  .home-hero-subtitle,
  .home-hero-actions,
  .home-hero-metrics,
  .home-hero-scroll-cue,
  .home-hero-scroll-arrow {
    animation: none;
  }
}
.home-hero-section {
  position: relative;
  width: 100%;
  height: 929px;
  display: flex;
  justify-content: center;
  overflow: hidden;
  color: rgba(255, 255, 255, 1);
  background:
    linear-gradient(180deg, rgba(10, 17, 31, 1) 0%, rgba(3, 7, 18, 1) 100%),
    radial-gradient(circle at 50% 20%, rgba(30, 64, 175, 0.22), transparent 58%);
}
.home-hero-video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.62;
}
.home-hero-overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(3, 7, 18, 0.46) 0%, rgba(3, 7, 18, 0.72) 58%, rgba(3, 7, 18, 0.98) 100%),
    radial-gradient(circle at 50% 26%, rgba(15, 23, 42, 0.08) 0%, rgba(3, 7, 18, 0.82) 72%);
}
.home-hero-inner {
  position: relative;
  z-index: 1;
  width: min(100%, var(--page-max-width));
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 172px var(--page-padding-x) 72px;
  text-align: center;
}
.home-hero-eyebrow {
  max-width: 100%;
  min-width: 242px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 0 18px;
  border: 1px solid rgba(34, 211, 238, 0.38);
  border-radius: 999px;
  color: rgba(103, 232, 249, 1);
  background-color: rgba(8, 145, 178, 0.18);
  box-shadow: inset 0 0 18px rgba(34, 211, 238, 0.14);
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  animation: home-hero-enter 0.7s ease both;
}
.home-hero-eyebrow img {
  width: 14px;
  height: 14px;
  flex: 0 0 auto;
  object-fit: contain;
}
.home-hero-title {
  max-width: 100%;
  margin-top: 22px;
  font-size: 58px;
  font-weight: 900;
  line-height: 68px;
  text-align: center;
  overflow-wrap: anywhere;
  animation: home-hero-enter 0.75s ease 0.08s both;
}
.home-hero-title span {
  display: block;
}
.home-hero-title span:last-child {
  position: relative;
  display: inline-block;
  color: transparent;
  background: linear-gradient(112.91deg, rgba(36, 209, 238, 1) 0%, rgba(88, 171, 248, 1) 53.06%, rgba(103, 231, 249, 1) 100%);
  background-clip: text;
  -webkit-background-clip: text;
}
.home-hero-title-line {
  position: absolute;
  left: 50%;
  bottom: -13px;
  width: 222px;
  height: auto;
  transform: translateX(-50%);
}
.home-hero-subtitle {
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 28px;
  color: rgba(229, 231, 235, 1);
  font-size: 20px;
  font-weight: 400;
  line-height: 30px;
  overflow-wrap: anywhere;
  animation: home-hero-enter 0.75s ease 0.16s both;
}
.home-hero-actions {
  max-width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 26px;
  margin-top: 37px;
  animation: home-hero-enter 0.75s ease 0.24s both;
}
.home-hero-download {
  width: 172px;
  height: 64px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  border-radius: 15px;
  font-size: 14px;
  font-weight: 800;
  line-height: 20px;
  text-align: left;
  overflow: hidden;
}
.home-hero-download span {
  min-width: 0;
  overflow: hidden;
  overflow-wrap: anywhere;
}
.home-hero-download img {
  width: 20px;
  height: 20px;
  flex: 0 0 auto;
  object-fit: contain;
}
.home-hero-download-light {
  color: rgba(89, 94, 104, 1);
  background-color: rgba(255, 255, 255, 1);
}
.home-hero-download-light strong {
  color: rgba(0, 0, 0, 1);
}
.home-hero-download-primary {
  color: rgba(255, 255, 255, 1);
  background: linear-gradient(124.24deg, rgba(8, 179, 213, 1) 0%, rgba(58, 131, 245, 1) 100%);
  box-shadow: 0 0 18px rgba(14, 165, 233, 0.36);
}
.home-hero-metrics {
  max-width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 86px;
  margin-top: 45px;
  color: rgba(148, 163, 184, 1);
  font-size: 16px;
  line-height: 24px;
  animation: home-hero-enter 0.75s ease 0.32s both;
}
.home-hero-scroll-cue {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 112px;
  height: 112px;
  margin-top: 94px;
  color: rgba(226, 232, 240, 0.78);
  line-height: 1;
  animation: home-hero-enter 0.75s ease 0.42s both;
}
.home-hero-scroll-arrows {
  position: relative;
  z-index: 1;
  display: grid;
  justify-items: center;
  gap: 0;
  color: rgba(103, 232, 249, 1);
}
.home-hero-scroll-arrow {
  width: 112px;
  height: 56px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: rgba(103, 232, 249, 1);
  filter: drop-shadow(0 0 34px rgba(34, 211, 238, 0.86));
  transform-origin: center;
  animation: home-hero-scroll-arrow 1.9s ease-in-out infinite;
}
.home-hero-scroll-arrow + .home-hero-scroll-arrow {
  margin-top: -30px;
}
.home-hero-scroll-arrow:nth-child(2) {
  animation-delay: 0.2s;
}
.home-hero-scroll-arrow:nth-child(3) {
  animation-delay: 0.4s;
}
.home-hero-scroll-arrow svg {
  width: 520px;
  height: 520px;
  min-width: 520px;
  min-height: 520px;
  stroke-width: 1.45;
}
@keyframes home-hero-enter {
  from {
    opacity: 0;
    transform: translate3d(0, 24px, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}
@keyframes home-hero-scroll-arrow {
  0% {
    opacity: 0;
    transform: scale(0.42);
  }

  32% {
    opacity: 1;
    transform: scale(1.18);
  }

  58% {
    opacity: 0.92;
    transform: scale(1);
  }

  100% {
    opacity: 0;
    transform: scale(1.34);
  }
}
.home-hero-metric {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  min-width: 0;
  white-space: nowrap;
}
.home-hero-metric > span:last-child {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}
.home-hero-metric strong {
  color: rgba(255, 255, 255, 1);
  font-size: 16px;
  font-weight: 900;
}
.home-hero-score-icons {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  flex: 0 0 auto;
}
.home-hero-score-icons img {
  width: 15px;
  height: 15px;
  object-fit: contain;
}
.home-hero-download-icon {
  width: 24px;
  height: 24px;
  flex: 0 0 auto;
  object-fit: contain;
}
.home-hero-avatars {
  position: relative;
  width: 20px;
  height: 20px;
  display: inline-flex;
  flex: 0 0 20px;
  overflow: hidden;
}
.home-hero-avatars span {
  position: absolute;
  top: 0;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(15, 23, 42, 1);
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(253, 186, 116, 1), rgba(59, 130, 246, 1));
}
.home-hero-avatars span:nth-child(1) {
  left: 0;
}
.home-hero-avatars span:nth-child(2) {
  left: 7px;
  background: linear-gradient(135deg, rgba(165, 180, 252, 1), rgba(14, 165, 233, 1));
}
.home-hero-avatars span:nth-child(3) {
  left: 14px;
  background: linear-gradient(135deg, rgba(254, 240, 138, 1), rgba(244, 114, 182, 1));
}
@media (max-width: 768px) {

  .home-hero-section {
    height: auto;
    min-height: 720px;
  }

  .home-hero-inner {
    padding-top: 62px;
    padding-bottom: 58px;
  }

  .home-hero-eyebrow {
    min-width: 172px;
  }

  .home-hero-title {
    margin-top: 22px;
    font-size: 36px;
    line-height: 44px;
  }

  .home-hero-title span:last-child::after {
    bottom: -8px;
    width: 158px;
  }

  .home-hero-subtitle {
    margin-top: 26px;
    font-size: 13px;
    line-height: 22px;
  }

  .home-hero-subtitle span {
    display: inline;
  }

  .home-hero-actions {
    width: min(100%, 360px);
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
    margin-top: 32px;
  }

  .home-hero-download {
    width: 100%;
  }

  .home-hero-download-primary {
    grid-column: 1 / -1;
  }

  .home-hero-metrics {
    width: min(100%, 360px);
    flex-direction: column;
    gap: 14px;
    margin-top: 34px;
  }

  .home-hero-scroll-cue {
    margin-top: 42px;
    width: 84px;
    height: 84px;
  }

  .home-hero-scroll-arrow {
    width: 84px;
    height: 42px;
  }

  .home-hero-scroll-arrow + .home-hero-scroll-arrow {
    margin-top: -23px;
  }

  .home-hero-scroll-arrow svg {
    width: 360px;
    height: 360px;
    min-width: 360px;
    min-height: 360px;
  }
}
</style>
