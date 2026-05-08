<template>
  <section class="home-hero-section" aria-labelledby="home-hero-title">
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
        <Icon name="lucide:sparkles" aria-hidden="true" />
        AI赋能的直播工具
      </span>

      <h1 id="home-hero-title" class="home-hero-title">
        <span>一键更换虚拟背景</span>
        <span>直播更精彩</span>
      </h1>

      <p class="home-hero-subtitle">
        <span>VicastCam使用先进的抠图技术，在直播期间随时替换您的背景。</span>
        <span>打造丰富多彩的直播效果，处处展现专业形象。</span>
      </p>

      <div class="home-hero-actions" aria-label="下载VicastCam">
        <a href="#" class="home-hero-download home-hero-download-light">
          <Icon name="lucide:apple" aria-hidden="true" />
          <span>在App Store<br>下载</span>
        </a>

        <a href="#" class="home-hero-download home-hero-download-light">
          <Icon name="lucide:play" aria-hidden="true" />
          <span>在Google Play<br>下载</span>
        </a>

        <a href="#" class="home-hero-download home-hero-download-primary">
          <Icon name="lucide:monitor-down" aria-hidden="true" />
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
          <span class="home-hero-stars">★★★★★</span>
          <strong>4.9</strong>
          <span>App Store评分</span>
        </div>

        <div class="home-hero-metric">
          <Icon name="lucide:download" aria-hidden="true" />
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
const heroVideoSrc = '/videos/home-hero.mp4'
</script>
