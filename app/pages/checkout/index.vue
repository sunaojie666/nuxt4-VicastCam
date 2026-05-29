<template>
  <div class="page-shell checkout-route-shell">
    <SiteHeader />

    <main class="checkout-page" aria-labelledby="checkout-title">
      <div class="checkout-shell">
        <section class="checkout-panel checkout-payment-panel" aria-labelledby="checkout-title">
          <header class="checkout-panel-header">
            <h1 id="checkout-title">选择支付方式</h1>
          </header>

          <div class="checkout-method-grid" role="radiogroup" aria-label="支付方式">
            <button
              v-for="method in paymentMethods"
              :key="method.id"
              type="button"
              class="checkout-method"
              :class="{ 'is-active': selectedPayment === method.id }"
              role="radio"
              :aria-checked="selectedPayment === method.id"
              @click="selectedPayment = method.id"
            >
              <span class="checkout-method-icon" :class="{ 'is-paypal': method.id === 'paypal' }" aria-hidden="true">
                <span v-if="method.id === 'paypal'" class="checkout-paypal-mark">P</span>
                <Icon v-else :name="method.icon" />
              </span>
              <span class="checkout-method-copy">
                <strong>{{ method.label }}</strong>
                <small>{{ method.description }}</small>
              </span>
              <span class="checkout-radio" aria-hidden="true" />
            </button>
          </div>

          <form
            class="checkout-detail-card"
            :class="{ 'is-paypal': selectedPayment === 'paypal' }"
            :aria-labelledby="`${activePayment.id}-info-title`"
            @submit.prevent
          >
            <div class="checkout-detail-header">
              <h2 :id="`${activePayment.id}-info-title`">{{ activePayment.panelTitle }}</h2>
              <p>{{ activePayment.helperText }}</p>
            </div>

            <template v-if="selectedPayment === 'paypal'">
              <section class="checkout-detail-group" aria-labelledby="paypal-payment-title">
                <h3 id="paypal-payment-title">PayPal 付款</h3>
                <div class="checkout-payment-message">
                  <p>已选择 PayPal。提交后，系统将跳转，在新的页面安全地完成后续步骤。</p>
                  <Icon name="lucide:badge-check" aria-hidden="true" />
                </div>
              </section>

              <section class="checkout-detail-group" aria-labelledby="billing-address-title">
                <h3 id="billing-address-title">账单地址</h3>
                <div class="checkout-field-grid">
                  <label class="checkout-field" for="checkout-name">
                    <span>姓名</span>
                    <input id="checkout-name" type="text" autocomplete="name" placeholder="付款人姓名">
                  </label>

                  <label class="checkout-field" for="checkout-country">
                    <span>国家和地区</span>
                    <span class="checkout-select-wrap">
                      <select id="checkout-country" autocomplete="country-name">
                        <option>请选择</option>
                        <option>中国</option>
                        <option>美国</option>
                        <option>新加坡</option>
                        <option>日本</option>
                      </select>
                      <Icon class="checkout-select-icon" name="lucide:chevron-down" aria-hidden="true" />
                    </span>
                  </label>

                  <label class="checkout-field checkout-field-wide" for="checkout-address">
                    <span>详细地址</span>
                    <input id="checkout-address" type="text" autocomplete="street-address" placeholder="街道、门牌号、城市">
                  </label>

                  <label class="checkout-field checkout-field-wide" for="checkout-postcode">
                    <span>邮政编码</span>
                    <input id="checkout-postcode" type="text" inputmode="numeric" autocomplete="postal-code" placeholder="邮政编码">
                  </label>
                </div>
              </section>
            </template>

            <template v-else>
              <section class="checkout-detail-group" aria-labelledby="card-account-title">
                <h3 id="card-account-title">银行卡账户</h3>
                <div class="checkout-field-grid">
                  <label class="checkout-field checkout-field-wide" for="checkout-card-number">
                    <span>卡号</span>
                    <input id="checkout-card-number" type="text" inputmode="numeric" autocomplete="cc-number" placeholder="1234 1234 1234 1234 123">
                  </label>

                  <label class="checkout-field" for="checkout-card-expiry">
                    <span>有效期</span>
                    <input id="checkout-card-expiry" type="text" inputmode="numeric" autocomplete="cc-exp" placeholder="月 / 年">
                  </label>

                  <label class="checkout-field" for="checkout-card-cvc">
                    <span>安全码</span>
                    <span class="checkout-select-wrap">
                      <input id="checkout-card-cvc" type="text" inputmode="numeric" autocomplete="cc-csc" placeholder="CVC">
                      <Icon class="checkout-select-icon" name="lucide:chevron-down" aria-hidden="true" />
                    </span>
                  </label>
                </div>
              </section>
            </template>
          </form>
        </section>

        <aside class="checkout-panel checkout-summary-panel" aria-labelledby="checkout-summary-title">
          <h2 id="checkout-summary-title">订单摘要</h2>

          <div class="checkout-summary-product">
            <div>
              <strong>{{ orderSummary.productName }}</strong>
              <p>{{ orderSummary.description }}</p>
            </div>
          </div>

          <dl class="checkout-summary-list">
            <div>
              <dt>会员周期</dt>
              <dd>{{ orderSummary.period }}</dd>
            </div>
            <div>
              <dt>支付方式</dt>
              <dd>Weixin Pay</dd>
            </div>
          </dl>

          <div class="checkout-summary-total">
            <span>应付金额</span>
            <strong>{{ orderSummary.amount }}</strong>
          </div>

          <button class="checkout-submit-button" type="button">{{ orderSummary.submitLabel }}</button>

          <p class="checkout-summary-note">
            点击订阅即表示你同意服务条款和隐私政策，订单信息提交前仍可修改。
          </p>
        </aside>
      </div>
    </main>

    <SiteFooter />
  </div>
</template>

<script setup>
import SiteHeader from '../../components/SiteHeader.vue'
import SiteFooter from '../../components/SiteFooter.vue'

const paymentMethods = [
  {
    id: 'card',
    label: '银行卡',
    description: '使用银行卡支付',
    icon: 'lucide:credit-card',
    panelTitle: '付款信息',
    helperText: '填写新的信用卡资料 Apply Pay',
  },
  {
    id: 'paypal',
    label: 'PayPal',
    description: '使用PayPal支付',
    icon: 'lucide:wallet-cards',
    panelTitle: 'PayPal 付款信息',
    helperText: '填写订单信息以确定 Apple Pay',
  },
]

const orderSummary = {
  productName: '专业版',
  description: '解锁高清虚拟背景、直播增强和多平台创作能力。',
  period: '1年',
  amount: '$69.99',
  submitLabel: '订阅',
}

const selectedPayment = ref('paypal')

const activePayment = computed(() => {
  return paymentMethods.find(method => method.id === selectedPayment.value) || paymentMethods[0]
})

useSeoMeta({
  title: '订阅结算',
  description: 'VicastCam 订阅结算页面。',
  robots: 'noindex, nofollow, noarchive',
})
</script>

<style scoped>
.checkout-route-shell {
  background: var(--checkout-route-background, #070b13);
}

.checkout-page {
  --checkout-route-background: #070b13;
  --checkout-background: #070b13;
  --checkout-panel: #111827;
  --checkout-panel-soft: #172033;
  --checkout-control: #0f172a;
  --checkout-method-background: #0d1424;
  --checkout-method-active-background: #0c2030;
  --checkout-icon-background: rgba(56, 189, 248, 0.12);
  --checkout-message-border: rgba(56, 189, 248, 0.24);
  --checkout-radio-border: #4b5d78;
  --checkout-placeholder: #64748b;
  --checkout-product-icon: #facc15;
  --checkout-product-icon-background: rgba(250, 204, 21, 0.12);
  --checkout-border: #273449;
  --checkout-border-soft: #203047;
  --checkout-text: #f8fafc;
  --checkout-muted: #94a3b8;
  --checkout-muted-strong: #cbd5e1;
  --checkout-accent: #38bdf8;
  --checkout-accent-strong: #2563eb;
  --checkout-focus: rgba(56, 189, 248, 0.38);
  --checkout-page-gradient: linear-gradient(180deg, rgba(15, 23, 42, 0.72) 0%, rgba(7, 11, 19, 0) 240px);
  --checkout-panel-shadow: 0 22px 56px rgba(0, 0, 0, 0.24);
  --checkout-submit-shadow: rgba(37, 99, 235, 0.3);
  --checkout-amount: #22d3ee;

  width: 100%;
  min-height: 0;
  display: flex;
  justify-content: center;
  padding: 72px 20px;
  color: var(--checkout-text);
  background:
    var(--checkout-page-gradient),
    var(--checkout-background);
  overflow-x: hidden;
}

:root[data-theme="light"] .checkout-route-shell {
  --checkout-route-background: #f8fafc;
}

:root[data-theme="light"] .checkout-page {
  --checkout-background: #f8fafc;
  --checkout-panel: #ffffff;
  --checkout-panel-soft: #f0f9ff;
  --checkout-control: #ffffff;
  --checkout-method-background: #ffffff;
  --checkout-method-active-background: #eef8ff;
  --checkout-icon-background: rgba(14, 165, 233, 0.12);
  --checkout-message-border: rgba(14, 165, 233, 0.24);
  --checkout-radio-border: #cbd5e1;
  --checkout-placeholder: #94a3b8;
  --checkout-product-icon: #ca8a04;
  --checkout-product-icon-background: rgba(250, 204, 21, 0.18);
  --checkout-border: #dbe4ef;
  --checkout-border-soft: #e5edf6;
  --checkout-text: #0f172a;
  --checkout-muted: #64748b;
  --checkout-muted-strong: #334155;
  --checkout-accent: #0284c7;
  --checkout-accent-strong: #2563eb;
  --checkout-focus: rgba(14, 165, 233, 0.18);
  --checkout-page-gradient: linear-gradient(180deg, rgba(239, 248, 255, 0.96) 0%, rgba(248, 250, 252, 0) 260px);
  --checkout-panel-shadow: 0 20px 46px rgba(15, 23, 42, 0.08);
  --checkout-submit-shadow: rgba(37, 99, 235, 0.2);
  --checkout-amount: #0284c7;
}

.checkout-page,
.checkout-page * {
  box-sizing: border-box;
}

.checkout-shell {
  width: min(100%, 960px);
  max-width: calc(100vw - 40px);
  display: grid;
  grid-template-columns: minmax(0, 610px) minmax(284px, 300px);
  align-items: start;
  gap: 18px;
}

.checkout-panel {
  width: 100%;
  min-width: 0;
  border: 1px solid var(--checkout-border);
  border-radius: 8px;
  background: var(--checkout-panel);
  box-shadow: var(--checkout-panel-shadow);
}

.checkout-payment-panel {
  padding: 20px;
}

.checkout-panel-header h1,
.checkout-form-heading h2,
.checkout-billing-form h2,
.checkout-summary-panel h2 {
  color: var(--checkout-text);
  font-size: 20px;
  font-weight: 800;
  line-height: 28px;
}

.checkout-method-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-top: 20px;
}

.checkout-method {
  position: relative;
  min-width: 0;
  min-height: 84px;
  display: grid;
  grid-template-columns: 40px minmax(0, 1fr) 16px;
  align-items: center;
  gap: 13px;
  padding: 16px;
  border: 1px solid var(--checkout-border);
  border-radius: 8px;
  color: var(--checkout-text);
  background: var(--checkout-method-background);
  text-align: left;
  cursor: pointer;
  transition: border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.checkout-method:hover,
.checkout-method:focus {
  border-color: rgba(56, 189, 248, 0.56);
  box-shadow: 0 0 0 3px var(--checkout-focus);
  transform: translateY(-1px);
}

.checkout-method.is-active {
  border-color: var(--checkout-accent);
  background: var(--checkout-method-active-background);
  box-shadow: inset 0 0 0 1px var(--checkout-accent);
}

.checkout-method-icon {
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: var(--checkout-accent);
  background: var(--checkout-icon-background);
  flex: 0 0 40px;
}

.checkout-paypal-mark {
  width: 20px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 21px;
  font-weight: 900;
  font-style: italic;
  line-height: 24px;
  transform: translateY(1px);
}

.checkout-method-icon.is-paypal {
  background: #2b65d9;
}

.checkout-method-icon :deep(svg) {
  width: 20px;
  height: 20px;
}

.checkout-method-copy {
  min-width: 0;
  display: grid;
  gap: 4px;
  align-content: center;
}

.checkout-method-copy strong,
.checkout-method-copy small {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.checkout-method-copy strong {
  font-size: 15px;
  font-weight: 800;
  line-height: 21px;
}

.checkout-method-copy small {
  color: var(--checkout-muted);
  font-size: 12px;
  line-height: 17px;
}

.checkout-radio {
  width: 14px;
  height: 14px;
  justify-self: end;
  border: 1px solid var(--checkout-radio-border);
  border-radius: 50%;
}

.checkout-method.is-active .checkout-radio {
  border: 4px solid var(--checkout-accent);
  background: var(--checkout-panel);
}

.checkout-detail-card {
  display: grid;
  gap: 22px;
  margin-top: 12px;
  padding: 18px;
  border: 1px solid var(--checkout-border);
  border-radius: 8px;
  background: color-mix(in srgb, var(--checkout-panel) 94%, var(--checkout-control));
}

.checkout-detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.checkout-detail-header h2,
.checkout-detail-group h3 {
  color: var(--checkout-text);
  font-size: 13px;
  font-weight: 800;
  line-height: 18px;
}

.checkout-detail-header p {
  color: var(--checkout-muted);
  font-size: 11px;
  line-height: 16px;
  text-align: right;
}

.checkout-detail-group {
  display: grid;
  gap: 10px;
}

.checkout-payment-message p {
  color: var(--checkout-muted);
  font-size: 12px;
  line-height: 18px;
}

.checkout-payment-message {
  min-height: 50px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 18px;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid var(--checkout-border);
  border-radius: 7px;
  color: var(--checkout-muted-strong);
  background: var(--checkout-control);
}

.checkout-payment-message :deep(svg) {
  width: 18px;
  height: 18px;
  color: var(--checkout-muted);
}

.checkout-field-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px 16px;
}

.checkout-field {
  display: grid;
  gap: 8px;
}

.checkout-field span:first-child {
  color: var(--checkout-muted-strong);
  font-size: 12px;
  font-weight: 700;
  line-height: 17px;
}

.checkout-field-wide {
  grid-column: 1 / -1;
}

.checkout-field input,
.checkout-field select {
  width: 100%;
  height: 42px;
  border: 1px solid var(--checkout-border);
  border-radius: 7px;
  color: var(--checkout-text);
  background: var(--checkout-control);
  font-size: 12px;
  line-height: 18px;
}

.checkout-field input {
  padding: 0 14px;
}

.checkout-field input::placeholder {
  color: var(--checkout-placeholder);
}

.checkout-field input:focus,
.checkout-field select:focus {
  border-color: var(--checkout-accent);
  box-shadow: 0 0 0 3px var(--checkout-focus);
}

.checkout-select-wrap {
  position: relative;
  display: block;
}

.checkout-select-wrap select {
  appearance: none;
  padding: 0 42px 0 14px;
}

.checkout-select-icon {
  position: absolute;
  top: 50%;
  right: 14px;
  width: 18px;
  height: 18px;
  color: var(--checkout-muted);
  transform: translateY(-50%);
  pointer-events: none;
}

.checkout-summary-panel {
  align-self: start;
  position: static;
  padding: 20px;
}

.checkout-summary-product {
  display: block;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--checkout-border-soft);
}

.checkout-summary-product strong {
  display: block;
  color: var(--checkout-text);
  font-size: 16px;
  font-weight: 800;
  line-height: 22px;
}

.checkout-summary-product p {
  margin-top: 6px;
  color: var(--checkout-muted);
  font-size: 13px;
  line-height: 19px;
}

.checkout-summary-list {
  display: grid;
  gap: 14px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid var(--checkout-border-soft);
}

.checkout-summary-list div,
.checkout-summary-total {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.checkout-summary-list dt,
.checkout-summary-total span {
  color: var(--checkout-muted);
  font-size: 13px;
  line-height: 20px;
}

.checkout-summary-list dd {
  min-width: 0;
  color: var(--checkout-text);
  font-size: 13px;
  font-weight: 700;
  line-height: 20px;
  text-align: right;
  overflow-wrap: anywhere;
}

.checkout-summary-total {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--checkout-border-soft);
}

.checkout-summary-total strong {
  color: var(--checkout-amount);
  font-size: 38px;
  font-weight: 900;
  line-height: 44px;
}

.checkout-submit-button {
  width: 100%;
  height: 46px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 18px;
  padding: 0 16px;
  border-radius: 7px;
  color: #ffffff;
  background: linear-gradient(90deg, #0ea5e9 0%, var(--checkout-accent-strong) 100%);
  font-size: 14px;
  font-weight: 800;
  line-height: 1;
  cursor: pointer;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.checkout-submit-button:hover,
.checkout-submit-button:focus {
  box-shadow: 0 12px 26px var(--checkout-submit-shadow);
  transform: translateY(-1px);
}

.checkout-summary-note {
  margin-top: 18px;
  padding: 14px;
  border-radius: 7px;
  color: var(--checkout-muted);
  background: var(--checkout-panel-soft);
  font-size: 12px;
  line-height: 19px;
}

@media (max-width: 900px) {
  .checkout-page {
    padding: 40px 16px;
  }

  .checkout-shell {
    grid-template-columns: 1fr;
  }

  .checkout-summary-panel {
    position: static;
  }
}

@media (max-width: 620px) {
  .checkout-page {
    padding: 24px 14px;
  }

  .checkout-payment-panel,
  .checkout-summary-panel {
    padding: 20px;
  }

  .checkout-shell {
    max-width: calc(100vw - 28px);
  }

  .checkout-method-grid {
    grid-template-columns: 1fr;
  }

  .checkout-detail-header {
    align-items: flex-start;
    flex-direction: column;
    gap: 4px;
  }

  .checkout-detail-header p {
    text-align: left;
  }

  .checkout-field-grid {
    grid-template-columns: 1fr;
  }

  .checkout-method {
    min-height: 76px;
  }
}
</style>
