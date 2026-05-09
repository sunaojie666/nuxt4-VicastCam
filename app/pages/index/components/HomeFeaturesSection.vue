<template>
  <section id="home-features" class="home-features-section" aria-labelledby="home-features-title">
    <div class="home-features-inner">
      <span id="home-features-anchor" class="home-features-eyebrow" data-reveal>功能特色</span>

      <h2 id="home-features-title" class="home-features-title" data-reveal style="--reveal-delay: 80ms">
        <span>让您直播更加专业的</span>
        <span class="theme-gradient-text">实用工具</span>
      </h2>

      <p class="home-features-subtitle" data-reveal style="--reveal-delay: 160ms">
        <span>专业级功能集成到移动端应用中。随时随地创建精彩的直播场景。</span>
        <span>打造更加丰富的直播效果</span>
      </p>

      <div class="home-features-grid">
        <article
          v-for="(feature, index) in features"
          :key="feature.title"
          :class="['home-features-card', feature.direction]"
          data-reveal="feature"
          :style="{ '--reveal-delay': `${feature.delay}ms`, '--feature-icon-bg': feature.gradient }"
        >
          <span class="home-features-icon">
            <img v-if="index === 0" src="/images/live/1.png" alt="" aria-hidden="true">
            <img v-else-if="index === 1" src="/images/live/2.png" alt="" aria-hidden="true">
            <img v-else-if="index === 2" src="/images/live/3.png" alt="" aria-hidden="true">
            <img v-else-if="index === 3" src="/images/live/4.png" alt="" aria-hidden="true">
            <img v-else-if="index === 4" src="/images/live/5.png" alt="" aria-hidden="true">
            <img v-else src="/images/live/6.png" alt="" aria-hidden="true">
          </span>

          <h3>{{ feature.title }}</h3>
          <p>{{ feature.description }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
const features = [
  {
    title: '多色抠图功能',
    description: '可实时扣除背景，更换百科虚拟直播间背景，打造专业直播间效果。',
    gradient: 'linear-gradient(135.96deg, rgba(6, 182, 212, 1) 0%, rgba(59, 130, 246, 1) 100%)',
    direction: 'home-features-card-left',
    delay: 0,
  },
  {
    title: '多机位功能',
    description: '在直播过程中，只需轻点一下即可无缝切换多个直播机位。',
    gradient: 'linear-gradient(135.96deg, rgba(59, 130, 246, 1) 0%, rgba(56, 189, 248, 1) 100%)',
    direction: 'home-features-card-up',
    delay: 90,
  },
  {
    title: '2D/3D特效添加',
    description: '应用令人惊叹的2D/3D特效图层，打造丰富多彩的直播间。',
    gradient: 'linear-gradient(135.96deg, rgba(45, 212, 191, 1) 0%, rgba(56, 189, 248, 1) 100%)',
    direction: 'home-features-card-right',
    delay: 180,
  },
  {
    title: '多平台推流直播',
    description: '支持YouTube、Twitch、TikTok、Facebook Live等平台推流直播',
    gradient: 'linear-gradient(135.96deg, rgba(37, 99, 235, 1) 0%, rgba(56, 189, 248, 1) 100%)',
    direction: 'home-features-card-left',
    delay: 0,
  },
  {
    title: '虚拟控制器',
    description: '从任何设备远程控制您的直播，一切换场景、静音音频、即时调整效果。',
    gradient: 'linear-gradient(135.96deg, rgba(34, 211, 238, 1) 0%, rgba(20, 184, 166, 1) 100%)',
    direction: 'home-features-card-up',
    delay: 90,
  },
  {
    title: '多平台直播',
    description: '通过电脑端可在TikTok、YouTube、Twitch、Instagram多个平台上同时开播。',
    gradient: 'linear-gradient(135.96deg, rgba(96, 165, 250, 1) 0%, rgba(6, 182, 212, 1) 100%)',
    direction: 'home-features-card-right',
    delay: 180,
  },
]
</script>

<style>
.reveal-ready .home-features-card-left[data-reveal="feature"]:not(.is-revealed) {
  transform: translate3d(-96px, 48px, 0) scale(0.92);
}

.reveal-ready .home-features-card-right[data-reveal="feature"]:not(.is-revealed) {
  transform: translate3d(96px, 48px, 0) scale(0.92);
}

.reveal-ready .home-features-card-up[data-reveal="feature"]:not(.is-revealed) {
  transform: translate3d(0, 82px, 0) scale(0.92);
}

.home-features-section {
  width: 100%;
  padding-top: 78px;
  padding-bottom: 80px;
  color: rgba(255, 255, 255, 1);
  background-color: rgba(3, 7, 18, 1);
}

.home-features-inner {
  width: min(100%, var(--page-max-width));
  margin: 0 auto;
  padding-left: var(--page-padding-x);
  padding-right: var(--page-padding-x);
}

.home-features-eyebrow {
  max-width: 100%;
  width: fit-content;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  padding: 0 13px;
  border: 1px solid rgba(59, 130, 246, 0.34);
  border-radius: 999px;
  color: rgba(96, 165, 250, 1);
  background-color: rgba(30, 64, 175, 0.22);
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.home-features-title {
  max-width: 100%;
  margin-top: 18px;
  color: rgba(255, 255, 255, 1);
  font-size: 40px;
  font-weight: 900;
  line-height: 52px;
  text-align: center;
  overflow-wrap: anywhere;
}

.home-features-title span {
  display: block;
}

.home-features-subtitle {
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  color: rgba(149, 156, 168, 1);
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  text-align: center;
  overflow-wrap: anywhere;
}

.home-features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-items: center;
  gap: 22px;
  margin-top: 80px;
}

.home-features-card {
  width: 370px;
  height: 263px;
  overflow: hidden;
  padding: 28px 29px;
  border-radius: 8px;
  background: url("/images/live/bg.png") center / cover no-repeat;
  transition:
    transform 0.28s ease,
    background-color 0.28s ease,
    box-shadow 0.28s ease;
}

.home-features-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 18px 36px rgba(0, 0, 0, 0.22);
}

.home-features-icon {
  width: 45px;
  height: 45px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: var(--feature-icon-bg);
}

.home-features-icon img {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

.home-features-card h3 {
  margin-top: 20px;
  color: rgba(255, 255, 255, 1);
  font-size: 18px;
  font-weight: 900;
  line-height: 24px;
  overflow: hidden;
  overflow-wrap: anywhere;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.home-features-card p {
  margin-top: 14px;
  color: rgba(148, 163, 184, 1);
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  overflow: hidden;
  overflow-wrap: anywhere;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
}

@media (max-width: 1153px) {

  .home-features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {

  .home-features-section {
    padding-top: 56px;
    padding-bottom: 56px;
  }

  .home-features-title {
    margin-top: 18px;
    font-size: 32px;
    line-height: 40px;
  }

  .home-features-subtitle {
    margin-top: 18px;
    font-size: 13px;
  }

  .home-features-subtitle span {
    display: inline;
  }

  .home-features-grid {
    grid-template-columns: 1fr;
    gap: 16px;
    margin-top: 42px;
  }

  .home-features-card {
    width: min(100%, 370px);
    min-height: 180px;
    padding: 24px;
  }
}
</style>
