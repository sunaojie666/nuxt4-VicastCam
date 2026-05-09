<template>
  <section class="home-community-section" aria-labelledby="home-community-title">
    <div class="home-community-inner">
      <span class="home-community-eyebrow" data-reveal>全球社区</span>

      <h2 id="home-community-title" class="home-community-title" data-reveal style="--reveal-delay: 80ms">
        <span>全球直播者信赖的</span>
        <span>直播工具</span>
      </h2>

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
            <img
              v-if="index === 0"
              class="home-community-image"
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=740&q=80"
              :alt="creator.name"
              loading="lazy"
            >
            <img
              v-else-if="index === 1"
              class="home-community-image"
              src="https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?auto=format&fit=crop&w=740&q=80"
              :alt="creator.name"
              loading="lazy"
            >
            <img
              v-else-if="index === 2"
              class="home-community-image"
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=740&q=80"
              :alt="creator.name"
              loading="lazy"
            >
            <img
              v-else-if="index === 3"
              class="home-community-image"
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=740&q=80"
              :alt="creator.name"
              loading="lazy"
            >
            <img
              v-else
              class="home-community-image"
              src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=740&q=80"
              :alt="creator.name"
              loading="lazy"
            >

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
  },
  {
    name: 'Marcus Johnson',
    handle: 'marcusi',
    location: 'Dubai, UAE',
    fans: '12万',
  },
  {
    name: 'Marcus Johnson',
    handle: 'marcusi',
    location: 'Dubai, UAE',
    fans: '12万',
  },
  {
    name: 'Marcus Johnson',
    handle: 'marcusi',
    location: 'Dubai, UAE',
    fans: '12万',
  },
  {
    name: 'Marcus Johnson',
    handle: 'marcusi',
    location: 'Dubai, UAE',
    fans: '12万',
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

<style>
.home-community-section {
  width: 100%;
  overflow: hidden;
  padding-top: 80px;
  padding-bottom: 80px;
  color: var(--theme-text);
  background-color: rgba(17, 24, 39, 1);
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
  border: 1px solid rgba(59, 130, 246, 0.35);
  border-radius: 999px;
  color: rgba(99, 179, 255, 1);
  background-color: rgba(30, 64, 175, 0.22);
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
  color: rgba(255, 255, 255, 1);
  font-size: 40px;
  font-weight: 800;
  line-height: 52px;
  text-align: center;
  overflow-wrap: anywhere;
}

.home-community-title span {
  display: block;
}

.home-community-title span:last-child {
  color: rgba(20, 198, 239, 1);
}

.home-community-subtitle {
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

.home-community-carousel {
  width: 100%;
  max-width: 100vw;
  overflow: hidden;
  margin-top: 76px;
}

.home-community-track {
  display: flex;
  align-items: stretch;
  gap: var(--home-community-gap, 25px);
  width: max-content;
  animation: home-community-marquee 32s linear infinite;
  will-change: transform;
}

.home-community-loop {
  display: flex;
  align-items: stretch;
  gap: var(--home-community-gap, 25px);
  flex: 0 0 auto;
}

.home-community-carousel:hover .home-community-track {
  animation-play-state: paused;
}

@keyframes home-community-marquee {
  from {
    transform: translate3d(0, 0, 0);
  }

  to {
    transform: translate3d(calc(-50% - var(--home-community-gap-half, 12.5px)), 0, 0);
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
  background-color: rgba(3, 7, 18, 1);
  cursor: pointer;
  opacity: 0.78;
  transition: border-color 0.25s ease, opacity 0.25s ease, transform 0.25s ease;
}

.home-community-card-active {
  border-color: rgba(59, 130, 246, 1);
  opacity: 1;
}

.home-community-card:hover,
.home-community-card:focus-within {
  opacity: 1;
}

.home-community-image {
  width: 100%;
  height: 382px;
  object-fit: cover;
}

.home-community-card::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 118px;
  height: 108px;
  background: linear-gradient(180deg, rgba(3, 7, 18, 0) 0%, rgba(3, 7, 18, 0.92) 100%);
  pointer-events: none;
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
  color: rgba(255, 255, 255, 1);
  background-color: rgba(239, 68, 68, 1);
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
  background-color: rgba(255, 255, 255, 1);
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
  background-color: rgba(3, 7, 18, 1);
}

.home-community-card-body > div {
  min-width: 0;
}

.home-community-card-name {
  color: rgba(255, 255, 255, 1);
  font-size: 15px;
  font-weight: 800;
  line-height: 20px;
  overflow: hidden;
  overflow-wrap: anywhere;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.home-community-handle {
  margin-top: 4px;
  color: rgba(148, 163, 184, 1);
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
  color: rgba(148, 163, 184, 1);
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
}
.home-community-location {
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
  color: rgba(148, 163, 184, 1);
  font-size: 12px;
  line-height: 18px;
}
.home-community-fans span {
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.home-community-fans strong {
  color: rgba(20, 198, 239, 1);
  font-size: 16px;
  font-weight: 800;
  line-height: 20px;
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
  background-color: rgba(3, 7, 18, 1);
}

.home-community-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-right: 1px solid rgba(30, 41, 59, 0.72);
}

.home-community-stat:last-child {
  border-right: none;
}

.home-community-stat strong {
  color: rgba(20, 198, 239, 1);
  font-size: 28px;
  font-weight: 800;
  line-height: 34px;
}

.home-community-stat span {
  margin-top: 6px;
  color: rgba(148, 163, 184, 1);
  font-size: 14px;
  font-weight: 400;
  line-height: 18px;
  max-width: 90%;
  overflow: hidden;
  overflow-wrap: anywhere;
  text-align: center;
}

@media (max-width: 768px) {

  .home-community-section {
    padding-top: 54px;
    padding-bottom: 54px;
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
    --home-community-gap-half: 8px;
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

  .home-community-card::after {
    bottom: 96px;
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
    border-bottom: 1px solid rgba(30, 41, 59, 0.72);
  }
}
</style>
