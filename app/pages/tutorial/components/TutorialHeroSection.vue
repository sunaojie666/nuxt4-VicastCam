<template>
  <section class="tutorial-hero-section" aria-labelledby="tutorial-hero-title">
    <div class="tutorial-hero-inner">
      <span class="tutorial-hero-eyebrow">{{ content.eyebrow }}</span>

      <h1 id="tutorial-hero-title" class="tutorial-hero-title">
        <span>{{ content.titleMain }}</span>
        <span class="theme-gradient-text">{{ content.titleHighlight }}</span>
      </h1>

      <p class="tutorial-hero-subtitle">
        <span>{{ content.descriptionMain }}</span>
        <span class="theme-gradient-text">{{ content.descriptionHighlight }}</span>
      </p>
    </div>
  </section>
</template>

<script setup>
defineProps({
  content: {
    type: Object,
    required: true,
  },
})
</script>

<style scoped>
.tutorial-hero-section {
  width: 100%;
  display: flex;
  justify-content: center;
  color: var(--theme-route-card-title, var(--theme-white));
  background:
    radial-gradient(circle at 50% 42%, var(--theme-extra-14-165-233-018), transparent 34%),
    linear-gradient(180deg, var(--theme-surface) 0%, var(--theme-extra-13-22-39-1) 100%);
  border-bottom: none;
}

:root[data-theme="light"] .tutorial-hero-section {
  background: url("https://cdn2.douyinggongchang.com/vicastcam-website-media-20260721/images/common/light-page-hero-bg.png") center / cover no-repeat;
}

.tutorial-hero-inner {
  width: min(100%, var(--page-max-width));
  min-height: 294px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 34px var(--page-padding-x) 32px;
  text-align: center;
}

.tutorial-hero-eyebrow {
  min-width: 76px;
  height: 26px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 14px;
  border: 1px solid var(--theme-primary-border);
  border-radius: 999px;
  color: var(--theme-primary-light);
  background: var(--theme-primary-softer);
  font-size: 12px;
  line-height: 1;
}

.tutorial-hero-title {
  max-width: 100%;
  margin-top: 18px;
  font-size: 42px;
  font-weight: 900;
  line-height: 52px;
  overflow-wrap: anywhere;
}

.tutorial-hero-title span {
  display: block;
}

.tutorial-hero-subtitle {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 14px;
  color: var(--theme-text-muted);
  font-size: 16px;
  line-height: 24px;
  overflow-wrap: anywhere;
}

@media (max-width: 900px) {
  .tutorial-hero-section {
    display: none;
  }

  .tutorial-hero-inner {
    min-height: 294px;
    padding-top: 28px;
  }

  .tutorial-hero-title {
    font-size: 32px;
    line-height: 40px;
  }

  .tutorial-hero-subtitle {
    font-size: 14px;
    line-height: 22px;
  }
}
</style>
