<template>
  <section class="home-community-section" aria-labelledby="home-community-title">
    <div class="home-community-inner">
      <span class="home-community-eyebrow" data-reveal>全球社区</span>

      <h1 id="home-community-title" class="home-community-title" data-reveal style="--reveal-delay: 80ms">
        <span>全球直播者信赖的</span>
        <span>直播工具</span>
      </h1>

      <p class="home-community-subtitle" data-reveal style="--reveal-delay: 160ms">
        <span>从普通主播到专业人士——VicastCam为150多个国家的创</span>
        <span>作者提供支持。</span>
      </p>
    </div>

    <div class="home-community-carousel" aria-label="全球直播者轮播" data-reveal="scale" style="--reveal-delay: 220ms">
      <div class="home-community-track">
        <div
          v-for="loopIndex in 2"
          :key="loopIndex"
          class="home-community-loop"
          :aria-hidden="loopIndex === 2"
        >
          <article
            v-for="(creator, index) in creators"
            :key="`${loopIndex}-${creator.name}-${index}`"
            :class="['home-community-card', { 'home-community-card-active': index === 2 }]"
          >
            <img class="home-community-image" :src="creator.image" :alt="creator.name" loading="lazy">

            <span class="home-community-live">
              <span></span>
              LIVE
            </span>

            <div class="home-community-card-body">
              <div>
                <h2 class="home-community-card-name">{{ creator.name }}</h2>
                <p class="home-community-handle">@{{ creator.handle }}</p>
                <p class="home-community-location">
                  <Icon name="lucide:map-pin" aria-hidden="true" />
                  {{ creator.location }}
                </p>
              </div>

              <p class="home-community-fans">
                <strong>{{ creator.fans }}</strong>
                <span>粉丝</span>
              </p>
            </div>
          </article>
        </div>
      </div>
    </div>

    <div ref="statsElement" class="home-community-stats" aria-label="VicastCam社区数据" data-reveal style="--reveal-delay: 120ms">
      <div v-for="stat in stats" :key="stat.label" class="home-community-stat">
        <strong>{{ stat.displayValue }}{{ stat.suffix }}</strong>
        <span>{{ stat.label }}</span>
      </div>
    </div>
  </section>
</template>

<script setup>
const creators = [
  {
    name: 'Marcus Johnson',
    handle: 'marcusi',
    location: 'Dubai, UAE',
    fans: '12万',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=740&q=80',
  },
  {
    name: 'Marcus Johnson',
    handle: 'marcusi',
    location: 'Dubai, UAE',
    fans: '12万',
    image: 'https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?auto=format&fit=crop&w=740&q=80',
  },
  {
    name: 'Marcus Johnson',
    handle: 'marcusi',
    location: 'Dubai, UAE',
    fans: '12万',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=740&q=80',
  },
  {
    name: 'Marcus Johnson',
    handle: 'marcusi',
    location: 'Dubai, UAE',
    fans: '12万',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=740&q=80',
  },
  {
    name: 'Marcus Johnson',
    handle: 'marcusi',
    location: 'Dubai, UAE',
    fans: '12万',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=740&q=80',
  },
]

const statsElement = ref(null)
const statsAnimated = ref(false)

const stats = reactive([
  { target: 150, displayValue: 0, suffix: '+', label: '国家', decimals: 0 },
  { target: 2000, displayValue: 0, suffix: '+', label: '活跃主播', decimals: 0 },
  { target: 5000, displayValue: 0, suffix: '+', label: '热度提升', decimals: 0 },
  { target: 99.9, displayValue: 0, suffix: '%', label: '稳定性', decimals: 1 },
])

const easeOutCubic = progress => 1 - Math.pow(1 - progress, 3)

const animateStats = () => {
  if (statsAnimated.value) {
    return
  }

  statsAnimated.value = true

  const duration = 1600
  const startTime = performance.now()

  const tick = (currentTime) => {
    const progress = Math.min((currentTime - startTime) / duration, 1)
    const easedProgress = easeOutCubic(progress)

    stats.forEach((stat) => {
      const value = stat.target * easedProgress
      stat.displayValue = stat.decimals > 0
        ? value.toFixed(stat.decimals)
        : Math.round(value)
    })

    if (progress < 1) {
      window.requestAnimationFrame(tick)
    }
  }

  window.requestAnimationFrame(tick)
}

onMounted(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (prefersReducedMotion) {
    stats.forEach((stat) => {
      stat.displayValue = stat.decimals > 0 ? stat.target.toFixed(stat.decimals) : stat.target
    })
    return
  }

  const observer = new IntersectionObserver((entries) => {
    if (entries.some(entry => entry.isIntersecting)) {
      animateStats()
      observer.disconnect()
    }
  }, {
    threshold: 0.35,
  })

  if (statsElement.value) {
    observer.observe(statsElement.value)
  }
})
</script>
