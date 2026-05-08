<template>
  <section class="home-pricing-section" aria-labelledby="home-pricing-title">
    <div class="home-pricing-inner">
      <span class="home-pricing-eyebrow" data-reveal>套餐价格</span>

      <h1 id="home-pricing-title" class="home-pricing-title" data-reveal style="--reveal-delay: 80ms">
        <span>请选择你想要的</span>
        <span>订阅计划</span>
      </h1>

      <p class="home-pricing-subtitle" data-reveal style="--reveal-delay: 160ms">免费试用，也可以选择其他套餐</p>

      <div class="home-pricing-grid">
        <article
          v-for="plan in pricingPlans"
          :key="plan.name"
          :class="['home-pricing-card', { 'home-pricing-card-featured': plan.featured }]"
          data-reveal="scale"
          :style="{ '--reveal-delay': `${plan.delay}ms` }"
        >
          <span v-if="plan.featured" class="home-pricing-badge">最受欢迎</span>

          <div>
            <h2 class="home-pricing-card-title">{{ plan.name }}</h2>
            <p class="home-pricing-card-description">{{ plan.description }}</p>
          </div>

          <p class="home-pricing-price">
            <span class="home-pricing-currency">$</span>{{ plan.price }}
            <span class="home-pricing-period">/月</span>
          </p>

          <ul class="home-pricing-features">
            <li
              v-for="feature in plan.features"
              :key="feature"
              class="home-pricing-feature"
            >
              <Icon class="home-pricing-check" name="lucide:check" aria-hidden="true" />
              <span>{{ feature }}</span>
            </li>
          </ul>

          <button class="home-pricing-button" type="button">购买</button>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
const pricingFeatureText = '普通会员特权'

const pricingPlans = [
  {
    name: '月卡',
    description: '适合想体验软件功能的用户',
    price: '9.99',
    featured: false,
    delay: 0,
    features: Array.from({ length: 5 }, () => pricingFeatureText),
  },
  {
    name: '年卡',
    description: '适合想体验软件功能的用户',
    price: '69.99',
    featured: true,
    delay: 120,
    features: Array.from({ length: 5 }, () => pricingFeatureText),
  },
  {
    name: '终身卡',
    description: '适合想体验软件功能的用户',
    price: '9.99',
    featured: false,
    delay: 240,
    features: Array.from({ length: 5 }, () => pricingFeatureText),
  },
]
</script>
