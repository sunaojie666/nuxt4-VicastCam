<template>
  <section class="home-faq-section" aria-labelledby="home-faq-title">
    <div class="home-faq-inner">
      <span class="home-faq-eyebrow" data-reveal>常见问题</span>

      <h2 id="home-faq-title" class="home-faq-title" data-reveal style="--reveal-delay: 80ms">
        <span>有疑问吗?</span>
        <span>我们有解答。</span>
      </h2>

      <p class="home-faq-subtitle" data-reveal style="--reveal-delay: 160ms">
        <span>关于VicastCam的常见问题都在下方</span>
        <span>没有找到你想要的答案? <a href="#" class="home-faq-contact">请联系我们的团队</a></span>
      </p>

      <div class="home-faq-list">
        <article
          v-for="item in faqItems"
          :key="item.question"
          :class="['home-faq-item', { 'home-faq-item-open': item.open }]"
          data-reveal
          :style="{ '--reveal-delay': `${item.delay}ms` }"
        >
          <button class="home-faq-question" type="button">
            <span>{{ item.question }}</span>
            <span class="home-faq-toggle" aria-hidden="true">
              <Icon v-if="item.open" name="lucide:minus" />
              <Icon v-else name="lucide:plus" />
            </span>
          </button>

          <p v-if="item.open" class="home-faq-answer">{{ item.answer }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
const questionText = '我可以用VicastCam在哪些平台进行直播?'

const faqItems = [
  {
    question: questionText,
    answer: 'VicastCam支持多个平台进行直播，包括 TikTok、YouTube Live、Twitch、InstagramLive、FacebookLive、Kick等等。只要你有直播权限，都可以进行直播。',
    open: true,
    delay: 0,
  },
  {
    question: questionText,
    answer: '',
    open: false,
    delay: 70,
  },
  {
    question: questionText,
    answer: '',
    open: false,
    delay: 140,
  },
  {
    question: questionText,
    answer: '',
    open: false,
    delay: 210,
  },
  {
    question: questionText,
    answer: '',
    open: false,
    delay: 280,
  },
]
</script>
