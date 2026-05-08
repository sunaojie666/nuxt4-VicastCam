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

<style>
.home-faq-section {
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: 80px;
  padding-bottom: 80px;
  color: var(--theme-text);
  background-color: rgba(17, 24, 39, 1);
}

.home-faq-inner {
  width: min(100%, var(--page-max-width));
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-left: var(--page-padding-x);
  padding-right: var(--page-padding-x);
}

.home-faq-eyebrow {
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

.home-faq-title {
  margin-top: 22px;
  color: rgba(255, 255, 255, 1);
  font-size: 40px;
  font-weight: 800;
  line-height: 48px;
  text-align: center;
}

.home-faq-title span {
  display: block;
}

.home-faq-title span:last-child {
  color: rgba(20, 198, 239, 1);
}

.home-faq-subtitle {
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

.home-faq-contact {
  color: rgba(20, 198, 239, 1);
}

.home-faq-list {
  width: min(100%, 795px);
  display: grid;
  gap: 16px;
  margin-top: 76px;
}

.home-faq-item {
  overflow: hidden;
  border: 1px solid transparent;
  border-radius: 15px;
  background-color: rgba(3, 7, 18, 1);
}

.home-faq-item-open {
  border-color: rgba(8, 179, 213, 0.55);
  background-color: rgba(7, 13, 28, 1);
}

.home-faq-question {
  width: 100%;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 0 22px;
  color: rgba(255, 255, 255, 1);
  font-size: 16px;
  font-weight: 800;
  line-height: 20px;
  text-align: left;
  cursor: pointer;
}

.home-faq-toggle {
  width: 22px;
  height: 22px;
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: rgba(148, 163, 184, 1);
  background-color: rgba(30, 41, 59, 0.74);
}

.home-faq-item-open .home-faq-toggle {
  color: rgba(255, 255, 255, 1);
  background-color: rgba(8, 179, 213, 0.62);
}

.home-faq-toggle svg {
  width: 14px;
  height: 14px;
}

.home-faq-answer {
  max-width: 650px;
  padding: 0 22px 26px;
  color: rgba(148, 163, 184, 1);
  font-size: 12px;
  font-weight: 400;
  line-height: 22px;
}

@media (max-width: 768px) {

  .home-faq-section {
    padding-top: 54px;
    padding-bottom: 72px;
  }

  .home-faq-title {
    margin-top: 18px;
    font-size: 32px;
    line-height: 38px;
  }

  .home-faq-subtitle {
    margin-top: 20px;
    font-size: 13px;
  }

  .home-faq-list {
    gap: 12px;
    margin-top: 48px;
  }

  .home-faq-question {
    min-height: 58px;
    padding: 0 16px;
    font-size: 13px;
  }

  .home-faq-answer {
    padding: 0 16px 22px;
  }
}
</style>
