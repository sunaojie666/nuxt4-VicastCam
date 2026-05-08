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
