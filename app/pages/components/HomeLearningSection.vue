<template>
  <section class="home-learning-section" aria-labelledby="home-learning-title">
    <div class="home-learning-inner">
      <span class="home-learning-eyebrow" data-reveal>教程中心</span>

      <h2 id="home-learning-title" class="home-learning-title" data-reveal style="--reveal-delay: 80ms">
        <span>开启您的VicastCam</span>
        <span>学习之旅</span>
      </h2>

      <p class="home-learning-subtitle" data-reveal style="--reveal-delay: 160ms">
        <span>让您充分掌握软件使用方法</span>
        <a href="#" class="home-learning-link">查看所有教程</a>
      </p>

      <div class="home-learning-grid">
        <article
          v-for="course in learningCards"
          :key="course.title"
          class="home-learning-card"
          data-reveal="scale"
          :style="{ '--reveal-delay': `${course.delay}ms` }"
        >
          <img
            class="home-learning-image"
            :src="course.image"
            :alt="course.title"
            loading="lazy"
          >

          <div class="home-learning-card-body">
            <div class="home-learning-tags">
              <span class="home-learning-tag home-learning-tag-muted">{{ course.type }}</span>
              <span class="home-learning-tag home-learning-tag-primary">{{ course.level }}</span>
            </div>

            <h3 class="home-learning-card-title">{{ course.title }}</h3>
          </div>
        </article>
      </div>

      <div class="home-learning-cta" data-reveal style="--reveal-delay: 220ms">
        <span class="home-learning-cta-eyebrow">
          <img src="~/assets/images/star.png" alt="" aria-hidden="true">
          AI赋能的直播工具
        </span>

        <h2 class="home-learning-cta-title">
          <span>一键更换虚拟背景</span>
          <span>
            直播更精彩
            <img class="home-learning-cta-line" src="~/assets/images/path.png" alt="" aria-hidden="true">
          </span>
        </h2>

        <p class="home-learning-cta-copy">
          <span>VicastCam使用先进的抠图技术，在直播期间随时替换您的背景。</span>
          <span>打造丰富多彩的直播效果，处处展现专业形象。</span>
        </p>

        <div class="home-learning-cta-actions" aria-label="下载VicastCam">
          <a href="#" class="home-learning-cta-download">
            <img src="~/assets/images/apple.png" alt="" aria-hidden="true">
            <span>在App Store<br><strong>下载</strong></span>
          </a>

          <a href="#" class="home-learning-cta-download">
            <img src="~/assets/images/chromicon.png" alt="" aria-hidden="true">
            <span>在Google Play<br><strong>下载</strong></span>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const learningCards = [
  {
    type: '安装',
    level: '新手教程',
    title: '如何下载与安装VicastCam',
    image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=740&q=80',
    delay: 0,
  },
  {
    type: '安装',
    level: '新手教程',
    title: '如何下载与安装VicastCam',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=740&q=80',
    delay: 90,
  },
  {
    type: '安装',
    level: '新手教程',
    title: '如何下载与安装VicastCam',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=740&q=80',
    delay: 180,
  },
  {
    type: '安装',
    level: '新手教程',
    title: '如何下载与安装VicastCam',
    image: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&w=740&q=80',
    delay: 0,
  },
  {
    type: '安装',
    level: '新手教程',
    title: '如何下载与安装VicastCam',
    image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=740&q=80',
    delay: 90,
  },
  {
    type: '安装',
    level: '新手教程',
    title: '如何下载与安装VicastCam',
    image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=740&q=80',
    delay: 180,
  },
]
</script>

<style>
.home-learning-section {
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: 100px;
  padding-bottom: 110px;
  color: var(--theme-text);
  background-color: rgba(17, 24, 39, 1);
}

.home-learning-inner {
  width: min(100%, var(--page-max-width));
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-left: var(--page-padding-x);
  padding-right: var(--page-padding-x);
}

.home-learning-eyebrow {
  min-width: 84px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 14px;
  border: 1px solid rgba(59, 130, 246, 0.28);
  border-radius: 999px;
  color: rgba(99, 179, 255, 1);
  background-color: rgba(30, 64, 175, 0.22);
  font-size: 14px;
  font-weight: 500;
  line-height: 1;
}

.home-learning-title {
  margin-top: 22px;
  color: rgba(255, 255, 255, 1);
  font-size: 40px;
  font-weight: 800;
  line-height: 48px;
  text-align: center;
}

.home-learning-title span {
  display: block;
}

.home-learning-title span:last-child {
  color: rgba(20, 198, 239, 1);
}

.home-learning-subtitle {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  color: rgba(149, 156, 168, 1);
  font-size: 16px;
  font-weight: 400;
  line-height: 22px;
  text-align: center;
}

.home-learning-link {
  color: rgba(20, 198, 239, 1);
  font-size: 13px;
  font-weight: 700;
}

.home-learning-grid {
  width: min(100%, var(--page-max-width));
  display: grid;
  grid-template-columns: repeat(3, 368px);
  justify-content: center;
  gap: 26px 22px;
  margin-top: 74px;
}

.home-learning-card {
  overflow: hidden;
  width: 368px;
  height: 310px;
  border-radius: 8px;
  background-color: rgba(3, 7, 18, 1);
}

.home-learning-image {
  width: 100%;
  height: 206px;
  object-fit: cover;
}

.home-learning-card-body {
  min-height: 80px;
  padding: 22px 18px 18px;
}

.home-learning-tags {
  display: flex;
  align-items: center;
  gap: 8px;
}

.home-learning-tag {
  height: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 700;
  line-height: 1;
}

.home-learning-tag-muted {
  color: rgba(148, 163, 184, 1);
  background-color: rgba(31, 41, 55, 1);
}

.home-learning-tag-primary {
  color: rgba(110, 231, 183, 1);
  background-color: rgba(6, 78, 59, 0.72);
}

.home-learning-card-title {
  margin-top: 12px;
  color: rgba(255, 255, 255, 1);
  font-size: 14px;
  font-weight: 800;
  line-height: 20px;
}

.home-learning-cta {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 160px;
  text-align: center;
}

.home-learning-cta::before {
  content: "";
  position: absolute;
  top: -270px;
  left: 50%;
  z-index: 0;
  width: 1350px;
  height: 840px;
  background: url("~/assets/images/Circle.png") center / contain no-repeat;
  transform: translateX(-50%);
  pointer-events: none;
}

.home-learning-cta > * {
  position: relative;
  z-index: 1;
}

.home-learning-cta-eyebrow {
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
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
}

.home-learning-cta-eyebrow img {
  width: 14px;
  height: 14px;
  flex: 0 0 auto;
  object-fit: contain;
}

.home-learning-cta-title {
  margin-top: 22px;
  color: rgba(255, 255, 255, 1);
  font-size: 58px;
  font-weight: 900;
  line-height: 68px;
}

.home-learning-cta-title span {
  display: block;
}

.home-learning-cta-title span:last-child {
  position: relative;
  display: inline-block;
  color: transparent;
  background: linear-gradient(112.91deg, rgba(36, 209, 238, 1) 0%, rgba(88, 171, 248, 1) 53.06%, rgba(103, 231, 249, 1) 100%);
  background-clip: text;
  -webkit-background-clip: text;
}

.home-learning-cta-line {
  position: absolute;
  left: 50%;
  bottom: -13px;
  width: 222px;
  height: auto;
  transform: translateX(-50%);
}

.home-learning-cta-copy {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 28px;
  color: rgba(229, 231, 235, 1);
  font-size: 20px;
  font-weight: 400;
  line-height: 30px;
}

.home-learning-cta-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 28px;
  margin-top: 27px;
}

.home-learning-cta-download {
  width: 172px;
  height: 64px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  border-radius: 15px;
  color: rgba(89, 94, 104, 1);
  background-color: rgba(255, 255, 255, 1);
  font-size: 14px;
  font-weight: 800;
  line-height: 20px;
  text-align: left;
}

.home-learning-cta-download img {
  width: 20px;
  height: 20px;
  flex: 0 0 auto;
  object-fit: contain;
}

.home-learning-cta-download strong {
  color: rgba(0, 0, 0, 1);
}

@media (max-width: 1153px) {

  .home-learning-grid {
    grid-template-columns: repeat(2, 368px);
  }
}

@media (max-width: 768px) {

  .home-learning-section {
    padding-top: 54px;
    padding-bottom: 74px;
  }

  .home-learning-title {
    margin-top: 18px;
    font-size: 32px;
    line-height: 38px;
  }

  .home-learning-subtitle {
    margin-top: 20px;
    font-size: 13px;
  }

  .home-learning-grid {
    width: min(100%, 420px);
    grid-template-columns: 1fr;
    justify-items: center;
    gap: 18px;
    margin-top: 48px;
  }

  .home-learning-card {
    width: min(100%, 368px);
  }

  .home-learning-cta {
    margin-top: 72px;
  }

  .home-learning-cta-title {
    font-size: 32px;
    line-height: 40px;
  }

  .home-learning-cta-copy {
    font-size: 14px;
  }

  .home-learning-cta-actions {
    flex-direction: column;
    gap: 16px;
  }
}
</style>
