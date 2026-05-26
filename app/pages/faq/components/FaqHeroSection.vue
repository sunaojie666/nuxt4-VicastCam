<template>
  <section class="faq-hero-section" aria-labelledby="faq-hero-title">
    <div class="faq-hero-inner">
      <span class="faq-hero-eyebrow">常见问题</span>

      <h1 id="faq-hero-title" class="faq-hero-title">
        <span>有疑问吗?</span>
        <span class="theme-gradient-text">我们有解答。</span>
      </h1>

      <p class="faq-hero-subtitle">
        <span>关于VicastCam的常见问题都在下方</span>
        <span>没有找到你想要的答案? <a href="#" class="faq-hero-contact">请联系我们的团队</a></span>
      </p>

      <label class="faq-search">
        <Icon class="faq-search-icon" name="lucide:search" aria-hidden="true" />
        <input type="search" placeholder="搜索问题..." aria-label="搜索问题">
      </label>
    </div>
  </section>
</template>

<style scoped>
.faq-hero-section {
  width: 100%;
  display: flex;
  justify-content: center;
  color: var(--theme-route-card-title, var(--theme-white));
  background:
    radial-gradient(circle at 50% 42%, var(--theme-extra-14-165-233-018), transparent 34%),
    linear-gradient(180deg, var(--theme-surface) 0%, var(--theme-extra-13-22-39-1) 100%);
  border-bottom: none;
}

@media (min-width: 901px) {
  :root[data-theme="light"] .faq-hero-section {
    background: url("/images/common/light-page-hero-bg.png") center / cover no-repeat;
  }
}

.faq-hero-inner {
  width: min(100%, var(--page-max-width));
  min-height: 360px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 34px var(--page-padding-x) 32px;
  text-align: center;
}

.faq-hero-eyebrow {
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

.faq-hero-title {
  max-width: 100%;
  margin-top: 18px;
  font-size: 42px;
  font-weight: 900;
  line-height: 52px;
  overflow-wrap: anywhere;
}

.faq-hero-title span {
  display: block;
}

.faq-hero-subtitle {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 14px;
  color: var(--theme-route-card-text, var(--theme-text-muted));
  font-size: 14px;
  line-height: 22px;
  overflow-wrap: anywhere;
}

.faq-hero-contact {
  color: var(--theme-accent);
}

.faq-search {
  width: min(100%, 420px);
  height: 48px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 18px;
  padding: 0 18px;
  border: 1px solid var(--theme-route-card-border, var(--theme-text-subtle));
  border-radius: 10px;
  background: var(--theme-route-card-background, var(--theme-surface-72));
}

.faq-search-icon {
  width: 18px;
  height: 18px;
  flex: 0 0 auto;
  color: var(--theme-text-muted);
}

.faq-search input {
  width: 100%;
  min-width: 0;
  color: var(--theme-route-card-title, var(--theme-text-light));
  font-size: 14px;
  line-height: 20px;
}

.faq-search input::placeholder {
  color: var(--theme-route-card-text, var(--theme-text-muted));
}

@media (max-width: 768px) {
  .faq-hero-inner {
    min-height: 360px;
    padding-top: 28px;
  }

  .faq-hero-title {
    font-size: 32px;
    line-height: 40px;
  }
}
</style>
