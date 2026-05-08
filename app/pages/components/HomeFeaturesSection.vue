<template>
  <section id="home-features" class="home-features-section" aria-labelledby="home-features-title">
    <div class="home-features-inner">
      <span class="home-features-eyebrow" data-reveal>功能特色</span>

      <h2 id="home-features-title" class="home-features-title" data-reveal style="--reveal-delay: 80ms">
        <span>让您直播更加专业的</span>
        <span>实用工具</span>
      </h2>

      <p class="home-features-subtitle" data-reveal style="--reveal-delay: 160ms">
        <span>专业级功能集成到移动端应用中。随时随地创建精彩的直播场景。</span>
        <span>打造更加丰富的直播效果</span>
      </p>

      <div class="home-features-grid">
        <article
          v-for="feature in features"
          :key="feature.title"
          :class="['home-features-card', feature.direction]"
          data-reveal="feature"
          :style="{ '--reveal-delay': `${feature.delay}ms` }"
        >
          <span class="home-features-icon">
            <Icon :name="feature.icon" aria-hidden="true" />
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
    icon: 'lucide:badge-star',
    direction: 'home-features-card-left',
    delay: 0,
  },
  {
    title: '多机位功能',
    description: '在直播过程中，只需轻点一下即可无缝切换多个直播机位。',
    icon: 'lucide:camera',
    direction: 'home-features-card-up',
    delay: 90,
  },
  {
    title: '2D/3D特效添加',
    description: '应用令人惊叹的2D/3D特效图层，打造丰富多彩的直播间。',
    icon: 'lucide:boxes',
    direction: 'home-features-card-right',
    delay: 180,
  },
  {
    title: '多平台推流直播',
    description: '支持YouTube、Twitch、TikTok、Facebook Live等平台推流直播',
    icon: 'lucide:video',
    direction: 'home-features-card-left',
    delay: 0,
  },
  {
    title: '虚拟控制器',
    description: '从任何设备远程控制您的直播，一切换场景、静音音频、即时调整效果。',
    icon: 'lucide:gamepad-2',
    direction: 'home-features-card-up',
    delay: 90,
  },
  {
    title: '多平台直播',
    description: '通过电脑端可在TikTok、YouTube、Twitch、Instagram多个平台上同时开播。',
    icon: 'lucide:radio',
    direction: 'home-features-card-right',
    delay: 180,
  },
]
</script>
