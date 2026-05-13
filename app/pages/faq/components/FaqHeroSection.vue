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
  color: rgba(255, 255, 255, 1);
  background:
    radial-gradient(circle at 50% 42%, rgba(14, 165, 233, 0.18), transparent 34%),
    linear-gradient(180deg, rgba(15, 23, 42, 1) 0%, rgba(13, 22, 39, 1) 100%);
  border-bottom: 1px solid rgba(30, 41, 59, 1);
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
  border: 1px solid rgba(59, 130, 246, 0.34);
  border-radius: 999px;
  color: rgba(96, 165, 250, 1);
  background: rgba(30, 64, 175, 0.22);
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
  color: rgba(148, 163, 184, 1);
  font-size: 14px;
  line-height: 22px;
  overflow-wrap: anywhere;
}

.faq-hero-contact {
  color: rgba(34, 211, 238, 1);
}

.faq-search {
  width: min(100%, 420px);
  height: 48px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 18px;
  padding: 0 18px;
  border: 1px solid rgba(100, 116, 139, 1);
  border-radius: 10px;
  background: rgba(15, 23, 42, 0.72);
}

.faq-search-icon {
  width: 18px;
  height: 18px;
  flex: 0 0 auto;
  color: rgba(148, 163, 184, 1);
}

.faq-search input {
  width: 100%;
  min-width: 0;
  color: rgba(226, 232, 240, 1);
  font-size: 14px;
  line-height: 20px;
}

.faq-search input::placeholder {
  color: rgba(148, 163, 184, 1);
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
