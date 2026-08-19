<template>
  <div class="team-page-shell">
    <SiteHeader />

    <main class="team-page-main">
      <section class="team-hero-section" aria-labelledby="team-hero-title">
        <div class="page-container team-hero-inner">
          <span class="team-hero-eyebrow">{{ teamBox.hero.eyebrow }}</span>

          <h1 id="team-hero-title" class="team-hero-title">
            <span>{{ teamBox.hero.title }}</span>
            <span class="theme-gradient-text team-hero-title-highlight">
              {{ teamBox.hero.highlight }}
              <img class="team-hero-title-line" :src="mediaUrl('/images/common/title-underline.png')" alt="" aria-hidden="true" role="presentation">
            </span>
          </h1>

          <p class="team-hero-description">
            {{ teamBox.hero.description }}
          </p>

          <div class="team-hero-actions">
            <button class="team-hero-button team-hero-button-primary" type="button" @click="scrollToApplication">{{ teamBox.hero.actions.primary }}</button>
            <button class="team-hero-button team-hero-button-secondary" type="button" @click="scrollToAdvantages">{{ teamBox.hero.actions.secondary }}</button>
          </div>
        </div>
      </section>

      <section id="team-cooperation-advantages" class="team-advantages-section" aria-labelledby="team-advantages-title">
        <div class="page-container team-advantages-inner">
          <span class="team-section-eyebrow">{{ teamBox.advantages.eyebrow }}</span>

          <h2 id="team-advantages-title" class="team-section-title">
            <span>{{ teamBox.advantages.titlePrefix }}</span>
            <span class="theme-gradient-text">{{ teamBox.advantages.titleHighlight }}</span>
          </h2>

          <p class="team-section-description">
            {{ teamBox.advantages.description }}
          </p>

          <div class="team-advantage-grid">
            <article
              v-for="item in advantageItems"
              :key="item.title"
              class="team-advantage-card"
            >
              <span class="team-advantage-icon" aria-hidden="true">
                <img v-if="item.icon" :src="item.icon" alt="" role="presentation">
              </span>
              <div class="team-advantage-content">
                <h3>{{ item.title }}</h3>
                <span class="team-advantage-line" aria-hidden="true"></span>
                <p>{{ item.description }}</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section class="team-rules-section" aria-labelledby="team-rules-title">
        <div class="page-container team-rules-inner">
          <span class="team-section-eyebrow">{{ teamBox.rules.eyebrow }}</span>

          <h2 id="team-rules-title" class="team-section-title">
            <span>{{ teamBox.rules.titlePrefix }}</span>
            <span class="theme-gradient-text">{{ teamBox.rules.titleHighlight }}</span>
          </h2>

          <p class="team-section-description">
            {{ teamBox.rules.description }}
          </p>

          <div class="team-rules-grid">
            <section class="team-rule-panel team-rule-panel-blue" aria-labelledby="team-agent-level-title">
              <h3 id="team-agent-level-title">{{ teamBox.rules.agentLevelTitle }}</h3>

              <div class="team-agent-level-list">
                <article v-for="item in agentLevels" :key="item.title" class="team-agent-level-item">
                  <img :src="item.icon" alt="" aria-hidden="true" role="presentation">
                  <div>
                    <h4>{{ item.title }}</h4>
                    <p>{{ item.description }}</p>
                  </div>
                </article>
              </div>
            </section>

            <section class="team-rule-panel team-rule-panel-purple" aria-labelledby="team-settlement-title">
              <h3 id="team-settlement-title">{{ teamBox.rules.settlementTitle }}</h3>

              <ul class="team-settlement-list">
                <li v-for="item in settlementRules" :key="item">
                  <span aria-hidden="true"></span>
                  <p>{{ item }}</p>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </section>

      <section class="team-support-section" aria-labelledby="team-support-title">
        <div class="page-container team-support-inner">
          <span class="team-section-eyebrow">{{ teamBox.support.eyebrow }}</span>

          <h2 id="team-support-title" class="team-section-title">
            <span>{{ teamBox.support.titlePrefix }}</span>
            <span class="theme-gradient-text">{{ teamBox.support.titleHighlight }}</span>
          </h2>

          <p class="team-section-description">
            {{ teamBox.support.description }}
          </p>

          <div class="team-support-grid">
            <article
              v-for="item in supportItems"
              :key="item.title"
              class="team-support-card"
            >
              <span class="team-support-icon" aria-hidden="true">
                <img v-if="item.icon" :src="item.icon" alt="" role="presentation">
              </span>
              <div class="team-support-content">
                <h3>{{ item.title }}</h3>
                <span class="team-support-line" aria-hidden="true"></span>
                <p>{{ item.description }}</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section class="team-plans-section" aria-labelledby="team-plans-title">
        <div class="page-container team-plans-inner">
          <span class="team-section-eyebrow">{{ teamBox.plans.eyebrow }}</span>

          <h2 id="team-plans-title" class="team-section-title">
            <span>{{ teamBox.plans.titlePrefix }}</span>
            <span class="theme-gradient-text">{{ teamBox.plans.titleHighlight }}</span>
          </h2>

          <p class="team-section-description">
            {{ teamBox.plans.description }}
          </p>

          <div class="team-plans-grid">
            <article
              v-for="item in planItems"
              :key="item.title"
              class="team-plan-card"
            >
              <div class="team-plan-content">
                <h3>{{ item.title }}</h3>
                <span class="team-plan-line" aria-hidden="true"></span>
                <p>{{ item.description }}</p>
              </div>
              <img v-if="item.image" class="team-plan-image" :src="item.image" alt="" aria-hidden="true" role="presentation">
            </article>
          </div>
        </div>
      </section>

      <section id="team-cooperation-application" class="team-application-section" aria-labelledby="team-application-title">
        <div class="page-container team-application-inner">
          <span class="team-section-eyebrow">{{ teamBox.application.eyebrow }}</span>

          <h2 id="team-application-title" class="team-section-title">
            <span>{{ teamBox.application.titlePrefix }}</span>
            <span class="theme-gradient-text">{{ teamBox.application.titleHighlight }}</span>
          </h2>

          <p class="team-section-description">
            {{ teamBox.application.description }}
          </p>

          <div class="team-application-layout">
            <form class="team-application-form" @submit.prevent="handleApplicationSubmit">
              <div class="team-form-grid">
                <label v-for="field in applicationFields" :key="field.name" class="team-form-field">
                  <span>
                    {{ field.label }}<span v-if="field.required" class="team-form-required" aria-hidden="true">*</span>
                  </span>
                  <span class="team-form-control">
                    <Icon :name="field.icon" aria-hidden="true" />
                    <template v-if="field.type === 'select'">
                      <input
                        type="hidden"
                        :name="field.name"
                        :value="getApplicationSelectValue(field.name)"
                      >
                      <span class="team-application-select" @click.stop>
                        <button
                          type="button"
                          :class="[
                            'team-application-select-button',
                            {
                              'team-application-select-button-placeholder': !getApplicationSelectValue(field.name),
                            },
                          ]"
                          :disabled="isSubmittingApplication"
                          :aria-expanded="isApplicationSelectOpen(field.name)"
                          aria-haspopup="listbox"
                          @click="toggleApplicationSelect(field.name)"
                        >
                          <span>{{ getApplicationSelectLabel(field) }}</span>
                          <Icon name="lucide:chevron-down" aria-hidden="true" />
                        </button>

                        <Transition name="team-select-fade">
                          <ul
                            v-if="isApplicationSelectOpen(field.name)"
                            class="team-application-select-menu"
                            role="listbox"
                          >
                            <li
                              v-for="option in field.options"
                              :key="option"
                              role="option"
                              :aria-selected="getApplicationSelectValue(field.name) === option"
                            >
                              <button
                                type="button"
                                class="team-application-select-option"
                                @click="selectApplicationOption(field.name, option)"
                              >
                                {{ option }}
                              </button>
                            </li>
                          </ul>
                        </Transition>
                      </span>
                    </template>
                    <input
                      v-else
                      :name="field.name"
                      :type="field.type"
                      :placeholder="field.placeholder"
                      :required="field.required"
                      :disabled="isSubmittingApplication"
                    >
                  </span>
                </label>

                <label class="team-form-field team-form-field-wide">
                  <span>
                    {{ teamBox.application.intentLabel }}<span class="team-form-required" aria-hidden="true">*</span>
                  </span>
                  <span class="team-form-control team-form-textarea-control">
                    <Icon name="lucide:pencil-line" aria-hidden="true" />
                    <textarea
                      name="cooperationIntent"
                      :placeholder="teamBox.application.intentPlaceholder"
                      required
                      :disabled="isSubmittingApplication"
                    ></textarea>
                  </span>
                </label>
              </div>

              <p class="team-form-note">{{ teamBox.application.note }}</p>

              <button class="team-form-submit" type="submit" :disabled="isSubmittingApplication">
                {{ applicationSubmitLabel }}
              </button>
            </form>

            <div class="team-application-sidebar">
              <aside class="team-application-contact" aria-labelledby="team-application-contact-title">
                <div class="team-contact-heading">
                  <span class="team-contact-icon">
                    <Icon name="lucide:headset" aria-hidden="true" />
                  </span>
                  <h3 id="team-application-contact-title">{{ teamBox.contact.title }}</h3>
                </div>

                <ul class="team-contact-list">
                  <li v-for="item in contactItems" :key="item.label">
                    <span class="team-contact-list-icon" aria-hidden="true">
                      <Icon :name="item.icon" />
                    </span>
                    <span>
                      <small>{{ item.label }}</small>
                      <strong>{{ item.value }}</strong>
                    </span>
                  </li>
                </ul>

                <p class="team-contact-note">
                  {{ teamBox.contact.note }}
                </p>
              </aside>

              <div class="team-contact-qr-card">
                <span class="team-contact-qr-image">
                  <img v-if="contactQr.image" :src="contactQr.image" :alt="contactQr.alt">
                </span>
                <strong>{{ contactQr.label }}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <SiteFooter />
  </div>
</template>

<script setup>
import SiteFooter from '../../components/SiteFooter.vue'
import SiteHeader from '../../components/SiteHeader.vue'
import { addBusinessCooperation, getBusinessWechatQrcode } from '../../api/request/business'
import { getTeams } from '../../api/request/strapi'
import { createAbsoluteUrl, createLocalizedUrl, setupPageSeo, setupStructuredData } from '../../utils/seo'
const mediaUrl = useMediaUrl()

const config = useRuntimeConfig()
const route = useRoute()
const { locale, locales } = useI18n()
const { requestLoadingText, showApiResponseErrorToast, showApiResponseSuccessToast, showErrorToast } = useSiteToast()
const isSubmittingApplication = ref(false)
const contactQrcodeSource = ref('')
const applicationSelectValues = ref({})
const openApplicationSelectName = ref('')
let requestedSectionScrollTimer = null

const activeLocaleConfig = computed(() => {
  return locales.value.find(item => typeof item !== 'string' && item.code === locale.value) || {}
})
const siteUrl = computed(() => String(config.public.siteUrl || 'https://www.vicastcam.com').replace(/\/+$/, ''))
const defaultLocale = computed(() => config.public.i18n?.defaultLocale || 'en')
const teamPageUrl = computed(() => createLocalizedUrl('/team', locale.value, siteUrl.value, defaultLocale.value))

const fieldDefaults = [
  {
    name: 'contactName',
    type: 'text',
    icon: 'lucide:user',
    required: true,
  },
  {
    name: 'companyName',
    type: 'text',
    icon: 'lucide:building-2',
    required: false,
  },
  {
    name: 'email',
    type: 'email',
    icon: 'lucide:mail',
    required: true,
  },
  {
    name: 'phone',
    type: 'tel',
    icon: 'lucide:message-circle',
    required: false,
  },
  {
    name: 'businessType',
    type: 'select',
    icon: 'lucide:briefcase-business',
    required: false,
  },
  {
    name: 'region',
    type: 'text',
    icon: 'lucide:map-pin',
    required: false,
  },
  {
    name: 'position',
    type: 'text',
    icon: 'lucide:id-card',
    required: false,
  },
  {
    name: 'budget',
    type: 'text',
    icon: 'lucide:circle-dollar-sign',
    required: false,
  },
  {
    name: 'country',
    type: 'select',
    icon: 'lucide:globe-2',
    required: false,
  },
  {
    name: 'website',
    type: 'url',
    icon: 'lucide:link',
    required: false,
  },
]

const defaultApplicationFieldNames = new Set(fieldDefaults.map(field => field.name))
const requiredApplicationFieldNames = new Set(['contactName', 'email', 'country'])

const contactIconDefaults = ['lucide:mail', 'lucide:message-circle', 'lucide:clock']
const advantageIconDefaults = [
  mediaUrl('/images/team/advantage-creators-icon.png'),
  mediaUrl('/images/team/advantage-delivery-icon.png'),
  mediaUrl('/images/team/advantage-competition-icon.png'),
]
const supportIconDefaults = [
  mediaUrl('/images/team/support-marketing-materials-icon.png'),
  mediaUrl('/images/team/support-technical-service-icon.png'),
  mediaUrl('/images/team/support-brand-authorization-icon.png'),
  mediaUrl('/images/team/support-priority-beta-icon.png'),
]
const planImageDefaults = [
  mediaUrl('/images/team/plan-channel-agent-image.png'),
  mediaUrl('/images/team/plan-oem-sdk-image.png'),
  mediaUrl('/images/team/plan-enterprise-custom-image.png'),
]

const defaultTeamBox = {
  hero: {
    eyebrow: '',
    title: '',
    highlight: '',
    description: '',
    actions: {
      primary: '',
      secondary: '',
    },
  },
  advantages: {
    eyebrow: '',
    titlePrefix: '',
    titleHighlight: '',
    description: '',
    items: [],
  },
  rules: {
    eyebrow: '',
    titlePrefix: '',
    titleHighlight: '',
    description: '',
    agentLevelTitle: '',
    agentLevels: [],
    settlementTitle: '',
    settlementRules: [],
  },
  support: {
    eyebrow: '',
    titlePrefix: '',
    titleHighlight: '',
    description: '',
    items: [],
  },
  plans: {
    eyebrow: '',
    titlePrefix: '',
    titleHighlight: '',
    description: '',
    items: [],
  },
  application: {
    eyebrow: '',
    titlePrefix: '',
    titleHighlight: '',
    description: '',
    fields: [],
    intentLabel: '',
    intentPlaceholder: '',
    note: '',
    submitLabel: '',
  },
  contact: {
    title: '',
    items: [],
    note: '',
    qr: {
      image: '',
      label: '',
      alt: '',
    },
  },
  seo: {
    title: '',
    description: '',
    image: '',
    imageAlt: '',
  },
}

const applicationToastCopy = {
  'zh-CN': {
    submit: '提交申请',
    submitting: '提交中...',
    success: '提交成功，我们会尽快联系你',
    fail: '提交失败，请稍后重试',
    invalidEmail: '请输入有效邮箱',
    requiredField: '请填写{field}',
  },
  en: {
    submit: 'Submit application',
    submitting: 'Submitting...',
    success: 'Submitted successfully. We will contact you soon.',
    fail: 'Submission failed. Please try again later.',
    invalidEmail: 'Enter a valid email address',
    requiredField: 'Please complete {field}',
  },
  'zh-TW': {
    submit: '提交申請',
    submitting: '提交中...',
    success: '提交成功，我們會盡快聯絡你',
    fail: '提交失敗，請稍後再試',
    invalidEmail: '請輸入有效郵箱',
    requiredField: '請填寫{field}',
  },
  id: {
    submit: 'Kirim aplikasi',
    submitting: 'Mengirim...',
    success: 'Berhasil dikirim. Kami akan segera menghubungi Anda.',
    fail: 'Pengiriman gagal. Silakan coba lagi nanti.',
    invalidEmail: 'Masukkan alamat email yang valid',
    requiredField: 'Harap lengkapi {field}',
  },
  ms: {
    submit: 'Hantar permohonan',
    submitting: 'Sedang menghantar...',
    success: 'Berjaya dihantar. Kami akan menghubungi anda tidak lama lagi.',
    fail: 'Penghantaran gagal. Sila cuba lagi kemudian.',
    invalidEmail: 'Masukkan alamat e-mel yang sah',
    requiredField: 'Sila lengkapkan {field}',
  },
  th: {
    submit: 'ส่งใบสมัคร',
    submitting: 'กำลังส่ง...',
    success: 'ส่งสำเร็จแล้ว เราจะติดต่อคุณโดยเร็ว',
    fail: 'ส่งไม่สำเร็จ โปรดลองอีกครั้งภายหลัง',
    invalidEmail: 'โปรดป้อนที่อยู่อีเมลที่ถูกต้อง',
    requiredField: 'โปรดกรอก {field}',
  },
  vi: {
    submit: 'Gửi đơn đăng ký',
    submitting: 'Đang gửi...',
    success: 'Gửi thành công. Chúng tôi sẽ sớm liên hệ với bạn.',
    fail: 'Gửi không thành công. Vui lòng thử lại sau.',
    invalidEmail: 'Nhập địa chỉ email hợp lệ',
    requiredField: 'Vui lòng điền {field}',
  },
  fil: {
    submit: 'Isumite ang aplikasyon',
    submitting: 'Isinusumite...',
    success: 'Matagumpay na naisumite. Makikipag-ugnayan kami sa iyo sa lalong madaling panahon.',
    fail: 'Nabigong isumite. Pakisubukang muli mamaya.',
    invalidEmail: 'Maglagay ng wastong email address',
    requiredField: 'Pakikumpleto ang {field}',
  },
  es: {
    submit: 'Enviar solicitud',
    submitting: 'Enviando...',
    success: 'Solicitud enviada correctamente. Nos pondremos en contacto contigo pronto.',
    fail: 'Error al enviar. Inténtalo de nuevo más tarde.',
    invalidEmail: 'Introduce una dirección de correo electrónico válida',
    requiredField: 'Completa {field}',
  },
  pt: {
    submit: 'Enviar candidatura',
    submitting: 'A enviar...',
    success: 'Enviado com sucesso. Entraremos em contacto consigo em breve.',
    fail: 'Falha no envio. Tente novamente mais tarde.',
    invalidEmail: 'Introduza um endereço de email válido',
    requiredField: 'Preencha {field}',
  },
  ar: {
    submit: 'إرسال الطلب',
    submitting: 'جارٍ الإرسال...',
    success: 'تم الإرسال بنجاح. سنتواصل معك قريبًا.',
    fail: 'فشل الإرسال. يُرجى المحاولة مرة أخرى لاحقًا.',
    invalidEmail: 'أدخل عنوان بريد إلكتروني صالحًا',
    requiredField: 'يُرجى إكمال {field}',
  },
  ja: {
    submit: '申請を送信',
    submitting: '送信中...',
    success: '送信が完了しました。近日中にご連絡します。',
    fail: '送信に失敗しました。しばらくしてからもう一度お試しください。',
    invalidEmail: '有効なメールアドレスを入力してください',
    requiredField: '{field}を入力してください',
  },
  tr: {
    submit: 'Başvuruyu gönder',
    submitting: 'Gönderiliyor...',
    success: 'Başarıyla gönderildi. En kısa sürede sizinle iletişime geçeceğiz.',
    fail: 'Gönderim başarısız oldu. Lütfen daha sonra tekrar deneyin.',
    invalidEmail: 'Geçerli bir e-posta adresi girin',
    requiredField: 'Lütfen {field} alanını doldurun',
  },
  it: {
    submit: 'Invia candidatura',
    submitting: 'Invio in corso...',
    success: 'Inviato con successo. Ti contatteremo presto.',
    fail: 'Invio non riuscito. Riprova più tardi.',
    invalidEmail: 'Inserisci un indirizzo email valido',
    requiredField: 'Completa {field}',
  },
  de: {
    submit: 'Bewerbung absenden',
    submitting: 'Wird gesendet...',
    success: 'Erfolgreich gesendet. Wir melden uns bald bei Ihnen.',
    fail: 'Übermittlung fehlgeschlagen. Bitte versuchen Sie es später erneut.',
    invalidEmail: 'Geben Sie eine gültige E-Mail-Adresse ein',
    requiredField: 'Bitte füllen Sie {field} aus',
  },
  fr: {
    submit: 'Envoyer la candidature',
    submitting: 'Envoi en cours...',
    success: 'Envoyé avec succès. Nous vous contacterons bientôt.',
    fail: 'Échec de l’envoi. Veuillez réessayer plus tard.',
    invalidEmail: 'Saisissez une adresse e-mail valide',
    requiredField: 'Veuillez renseigner {field}',
  },
  ko: {
    submit: '신청서 제출',
    submitting: '제출 중...',
    success: '제출이 완료되었습니다. 곧 연락드리겠습니다.',
    fail: '제출에 실패했습니다. 나중에 다시 시도해 주세요.',
    invalidEmail: '유효한 이메일 주소를 입력하세요',
    requiredField: '{field}을(를) 입력해 주세요',
  },
  ru: {
    submit: 'Отправить заявку',
    submitting: 'Отправка...',
    success: 'Заявка успешно отправлена. Мы скоро свяжемся с вами.',
    fail: 'Не удалось отправить заявку. Повторите попытку позже.',
    invalidEmail: 'Введите действительный адрес электронной почты',
    requiredField: 'Заполните поле {field}',
  },
  pl: {
    submit: 'Wyślij zgłoszenie',
    submitting: 'Wysyłanie...',
    success: 'Wysłano pomyślnie. Skontaktujemy się z Tobą wkrótce.',
    fail: 'Wysyłanie nie powiodło się. Spróbuj ponownie później.',
    invalidEmail: 'Wpisz prawidłowy adres e-mail',
    requiredField: 'Uzupełnij {field}',
  },
  nl: {
    submit: 'Aanvraag indienen',
    submitting: 'Bezig met indienen...',
    success: 'Succesvol ingediend. We nemen binnenkort contact met u op.',
    fail: 'Indienen mislukt. Probeer het later opnieuw.',
    invalidEmail: 'Voer een geldig e-mailadres in',
    requiredField: 'Vul {field} in',
  },
  hi: {
    submit: 'आवेदन जमा करें',
    submitting: 'जमा किया जा रहा है...',
    success: 'सफलतापूर्वक जमा किया गया। हम जल्द ही आपसे संपर्क करेंगे।',
    fail: 'जमा करने में विफल। कृपया बाद में पुनः प्रयास करें।',
    invalidEmail: 'एक मान्य ईमेल पता दर्ज करें',
    requiredField: 'कृपया {field} भरें',
  },
  ur: {
    submit: 'درخواست جمع کریں',
    submitting: 'جمع کیا جا رہا ہے...',
    success: 'درخواست کامیابی سے جمع ہو گئی۔ ہم جلد آپ سے رابطہ کریں گے۔',
    fail: 'درخواست جمع نہیں ہو سکی۔ براہ کرم بعد میں دوبارہ کوشش کریں۔',
    invalidEmail: 'درست ای میل ایڈریس درج کریں',
    requiredField: 'براہ کرم {field} مکمل کریں',
  },
  bn: {
    submit: 'আবেদন জমা দিন',
    submitting: 'জমা দেওয়া হচ্ছে...',
    success: 'সফলভাবে জমা হয়েছে। আমরা শীঘ্রই আপনার সঙ্গে যোগাযোগ করব।',
    fail: 'জমা দেওয়া যায়নি। অনুগ্রহ করে পরে আবার চেষ্টা করুন।',
    invalidEmail: 'একটি বৈধ ইমেল ঠিকানা লিখুন',
    requiredField: 'অনুগ্রহ করে {field} পূরণ করুন',
  },
  fa: {
    submit: 'ارسال درخواست',
    submitting: 'در حال ارسال...',
    success: 'با موفقیت ارسال شد. به‌زودی با شما تماس می‌گیریم.',
    fail: 'ارسال ناموفق بود. لطفاً بعداً دوباره تلاش کنید.',
    invalidEmail: 'یک نشانی ایمیل معتبر وارد کنید',
    requiredField: 'لطفاً {field} را تکمیل کنید',
  },
}

const cloneJson = value => JSON.parse(JSON.stringify(value))
const normalizeList = value => Array.isArray(value) ? value.filter(Boolean) : []

const mergeObject = (fallback, source) => {
  if (!source || typeof source !== 'object' || Array.isArray(source)) {
    return cloneJson(fallback)
  }

  const result = cloneJson(fallback)

  Object.entries(source).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      result[key] = value
      return
    }

    if (value && typeof value === 'object') {
      result[key] = mergeObject(result[key] || {}, value)
      return
    }

    if (value !== undefined && value !== null && value !== '') {
      result[key] = value
    }
  })

  return result
}

const parseStrapiJsonField = (value) => {
  if (typeof value !== 'string') {
    return value
  }

  try {
    return JSON.parse(value)
  } catch {
    return {}
  }
}

const normalizeStrapiRecord = record => {
  const data = record?.attributes || record || {}
  return {
    ...data,
    ...(data.attributes || {}),
  }
}

const getTeamContentData = (response) => {
  const records = response?.data
  const firstRecord = Array.isArray(records) ? records[0] : records
  const record = normalizeStrapiRecord(firstRecord)
  const parsedData = parseStrapiJsonField(record.data)

  const content = parsedData?.team ||
    parsedData?.teamBox ||
    parsedData?.data?.team ||
    parsedData?.data?.teamBox ||
    parsedData?.data ||
    parsedData ||
    {}

  if (!content || typeof content !== 'object' || Array.isArray(content)) {
    return {}
  }

  return {
    ...content,
    seo: {
      ...(record.seo || {}),
      ...(content.seo || {}),
    },
  }
}

const createTeamBox = (content = {}) => {
  return mergeObject(defaultTeamBox, content)
}

const teamBox = useState('team-page-box', () => createTeamBox())
const teamBoxLocale = useState('team-page-box-locale', () => '')

const syncTeamBox = (content = {}) => {
  teamBox.value = createTeamBox(content)
}

const advantageItems = computed(() => {
  return normalizeList(teamBox.value.advantages.items).map((item, index) => ({
    ...item,
    icon: item.icon || advantageIconDefaults[index] || '',
  }))
})
const agentLevels = computed(() => normalizeList(teamBox.value.rules.agentLevels))
const settlementRules = computed(() => normalizeList(teamBox.value.rules.settlementRules))
const supportItems = computed(() => {
  return normalizeList(teamBox.value.support.items).map((item, index) => ({
    ...item,
    icon: item.icon || supportIconDefaults[index] || '',
  }))
})
const planItems = computed(() => {
  return normalizeList(teamBox.value.plans.items).map((item, index) => ({
    ...item,
    image: planImageDefaults[index] || item.image || '',
  }))
})
const applicationFields = computed(() => {
  const fields = normalizeList(teamBox.value.application.fields)

  const defaultFields = fieldDefaults.map(defaultField => {
    const sourceField = fields.find(item => item.name === defaultField.name) || {}

    return {
      ...defaultField,
      ...sourceField,
      required: requiredApplicationFieldNames.has(defaultField.name) || Boolean(sourceField.required),
      options: normalizeList(sourceField.options),
    }
  })

  const extraFields = fields
    .filter(field => field?.name && !defaultApplicationFieldNames.has(field.name))
    .map(field => ({
      ...field,
      required: requiredApplicationFieldNames.has(field.name) || Boolean(field.required),
      options: normalizeList(field.options),
    }))

  return [
    ...defaultFields,
    ...extraFields,
  ]
})
const contactItems = computed(() => {
  return normalizeList(teamBox.value.contact.items).map((item, index) => ({
    icon: contactIconDefaults[index] || 'lucide:circle',
    ...item,
  }))
})

const contactQrCopy = {
  'zh-CN': '通过WhatsApp扫码联系我们',
  'zh-TW': '透過WhatsApp掃碼聯絡我們',
  en: 'Scan with WhatsApp to contact us',
}

const contactQr = computed(() => {
  const qr = teamBox.value.contact.qr || {}
  const label = qr.label || contactQrCopy[locale.value] || contactQrCopy.en

  return {
    image: contactQrcodeSource.value || qr.image || '',
    label,
    alt: qr.alt || label,
  }
})

const findContactQrcodeSource = (response) => {
  const source = response?.data?.qrcode
    || response?.data?.qr_code
    || response?.data?.url
    || response?.data?.image
    || response?.data
    || response?.qrcode
    || response?.url

  return typeof source === 'string' ? source.trim() : ''
}

const loadContactQrcode = () => {
  getBusinessWechatQrcode().then(
    (response) => {
      contactQrcodeSource.value = findContactQrcodeSource(response)
    },
    () => {}
  )
}

const applicationCopy = computed(() => {
  return applicationToastCopy[locale.value] || applicationToastCopy.en
})

const applicationSubmitLabel = computed(() => {
  if (isSubmittingApplication.value) {
    return requestLoadingText.value || applicationCopy.value.submitting
  }

  return teamBox.value.application.submitLabel || applicationCopy.value.submit
})

const getSingleFormValue = (formData, key) => {
  return String(formData.get(key) || '').trim()
}

const getApplicationSelectValue = (name) => {
  return String(applicationSelectValues.value[name] || '').trim()
}

const getApplicationSelectLabel = (field = {}) => {
  return getApplicationSelectValue(field.name) || field.placeholder || ''
}

const isApplicationSelectOpen = (name) => {
  return openApplicationSelectName.value === name
}

const closeApplicationSelect = () => {
  openApplicationSelectName.value = ''
}

const toggleApplicationSelect = (name) => {
  if (isSubmittingApplication.value) {
    return
  }

  openApplicationSelectName.value = isApplicationSelectOpen(name) ? '' : name
}

const selectApplicationOption = (name, option) => {
  applicationSelectValues.value = {
    ...applicationSelectValues.value,
    [name]: String(option || ''),
  }
  closeApplicationSelect()
}

const resetApplicationSelectValues = () => {
  applicationSelectValues.value = {}
  closeApplicationSelect()
}

const createApplicationPayload = (formElement) => {
  const formData = new FormData(formElement)

  const payload = {
    contactName: getSingleFormValue(formData, 'contactName'),
    companyName: getSingleFormValue(formData, 'companyName'),
    email: getSingleFormValue(formData, 'email'),
    phone: getSingleFormValue(formData, 'phone'),
    businessType: getSingleFormValue(formData, 'businessType'),
    region: getSingleFormValue(formData, 'region'),
    workingHours: getSingleFormValue(formData, 'workingHours'),
    working_hours: getSingleFormValue(formData, 'working_hours'),
    position: getSingleFormValue(formData, 'position'),
    budget: getSingleFormValue(formData, 'budget'),
    country: getSingleFormValue(formData, 'country'),
    website: getSingleFormValue(formData, 'website'),
    cooperationIntent: getSingleFormValue(formData, 'cooperationIntent'),
  }

  applicationFields.value.forEach((field) => {
    if (field?.name && payload[field.name] === undefined) {
      payload[field.name] = getSingleFormValue(formData, field.name)
    }
  })

  return payload
}

const isValidApplicationEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const getApplicationRequiredMessage = (field = {}) => {
  const template = applicationCopy.value.requiredField || applicationToastCopy.en.requiredField
  const fieldLabel = String(field.label || field.placeholder || '').replace(/\*+$/, '').trim()

  return template.replace('{field}', fieldLabel)
}

const getMissingApplicationSelectField = (payload = {}) => {
  return applicationFields.value.find(field => {
    return field?.type === 'select' &&
      field.required &&
      !String(payload[field.name] || '').trim()
  })
}

const handleApplicationSubmit = (event) => {
  if (isSubmittingApplication.value) {
    return
  }

  const formElement = event.currentTarget

  if (!formElement?.reportValidity?.()) {
    return
  }

  const payload = createApplicationPayload(formElement)
  const missingSelectField = getMissingApplicationSelectField(payload)

  if (missingSelectField) {
    showErrorToast(getApplicationRequiredMessage(missingSelectField))
    return
  }

  if (!isValidApplicationEmail(payload.email)) {
    showErrorToast(applicationCopy.value.invalidEmail)
    return
  }

  isSubmittingApplication.value = true

  addBusinessCooperation(payload).then(
    (response) => {
      isSubmittingApplication.value = false

      formElement.reset()
      resetApplicationSelectValues()
      showApiResponseSuccessToast(response, {
        scope: 'general',
        fallback: applicationCopy.value.success,
      })
    },
    (error) => {
      isSubmittingApplication.value = false
      showApiResponseErrorToast(error, {
        scope: 'general',
        fallback: applicationCopy.value.fail,
      })
    }
  )
}

const scrollToTeamSection = (sectionId) => {
  if (!process.client) {
    return
  }

  const sectionElement = document.getElementById(sectionId)
  if (!sectionElement) {
    return
  }

  const headerHeight = document.querySelector('.page-header')?.getBoundingClientRect().height || 0
  const targetTop = window.scrollY + sectionElement.getBoundingClientRect().top - headerHeight - 24

  window.scrollTo({
    top: Math.max(0, targetTop),
    behavior: 'smooth',
  })
}

const scrollToApplication = () => {
  scrollToTeamSection('team-cooperation-application')
}

const scrollToAdvantages = () => {
  scrollToTeamSection('team-cooperation-advantages')
}

const scrollToRequestedSection = () => {
  if (String(route.query.section || '').toLowerCase() !== 'application') {
    return
  }

  if (requestedSectionScrollTimer) {
    window.clearTimeout(requestedSectionScrollTimer)
    requestedSectionScrollTimer = null
  }

  nextTick(() => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        requestedSectionScrollTimer = window.setTimeout(() => {
          requestedSectionScrollTimer = null
          scrollToApplication()
        }, 120)
      })
    })
  })
}

watch([() => route.query.section, teamBoxLocale], () => {
  if (process.client) {
    scrollToRequestedSection()
  }
}, { flush: 'post' })

const handleApplicationDocumentClick = () => {
  closeApplicationSelect()
}

onMounted(() => {
  if (process.client) {
    document.addEventListener('click', handleApplicationDocumentClick)
  }

  loadContactQrcode()
  scrollToRequestedSection()
})

onBeforeUnmount(() => {
  if (requestedSectionScrollTimer) {
    window.clearTimeout(requestedSectionScrollTimer)
    requestedSectionScrollTimer = null
  }

  if (process.client) {
    document.removeEventListener('click', handleApplicationDocumentClick)
  }
})

useLocalizedAsyncState({
  locale,
  loadedLocale: teamBoxLocale,
  load: currentLocale => getTeams(currentLocale),
  sync: response => {
    syncTeamBox(getTeamContentData(response))
  },
  reset: () => {
    syncTeamBox()
  },
})

setupPageSeo('team', () => teamBox.value.seo)

setupStructuredData(() => {
  const pageTitle = teamBox.value.seo.title ||
    [teamBox.value.hero.title, teamBox.value.hero.highlight].filter(Boolean).join(' ') ||
    'VicastCam Business Cooperation'
  const pageDescription = teamBox.value.seo.description ||
    teamBox.value.hero.description ||
    'Partner with VicastCam for channel agency, OEM, SDK, and enterprise cooperation.'
  const inLanguage = activeLocaleConfig.value.language || locale.value
  const contactPoint = contactItems.value
    .map((item) => {
      const label = String(item.label || '').trim()
      const labelKey = label.toLowerCase()
      const value = String(item.value || '').trim()

      if (!value) {
        return null
      }

      const point = {
        '@type': 'ContactPoint',
        contactType: label || 'business cooperation',
        availableLanguage: inLanguage,
      }

      if (labelKey.includes('email') || labelKey.includes('mail') || label.includes('邮箱')) {
        point.email = value
      } else if (labelKey.includes('phone') || labelKey.includes('whatsapp') || label.includes('电话')) {
        point.telephone = value
      } else {
        point.name = value
      }

      return point
    })
    .filter(Boolean)

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: pageTitle,
      description: pageDescription,
      url: teamPageUrl.value,
      image: createAbsoluteUrl(teamBox.value.seo.image || mediaUrl('/images/team/partner-plan-hero-bg.png'), siteUrl.value),
      inLanguage,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'VicastCam',
      url: siteUrl.value,
      logo: createAbsoluteUrl(mediaUrl('/images/common/logo.png'), siteUrl.value),
      ...(contactPoint.length ? { contactPoint } : {}),
    },
  ]
}, { id: 'team-cooperation-jsonld' })
</script>

<style scoped>
.team-page-shell {
  --team-page-background: #02071c;
  --team-hero-title: var(--theme-white);
  --team-hero-copy: rgba(226, 232, 240, 0.84);
  --team-hero-eyebrow-border: rgba(56, 189, 248, 0.32);
  --team-hero-eyebrow-text: rgba(125, 211, 252, 1);
  --team-hero-eyebrow-background: rgba(14, 165, 233, 0.1);
  --team-hero-eyebrow-shadow: inset 0 0 18px rgba(14, 165, 233, 0.12);
  --team-hero-overlay:
    radial-gradient(circle at 50% 44%, rgba(2, 6, 23, 0.12) 0%, transparent 48%),
    linear-gradient(180deg, rgba(2, 6, 23, 0.12) 0%, rgba(2, 6, 23, 0.34) 100%);
  --team-hero-background:
    linear-gradient(180deg, rgba(3, 7, 18, 0.06) 0%, rgba(3, 7, 18, 0.16) 100%),
    var(--media-images-team-partner-plan-hero-bg-png) center / cover no-repeat,
    #040915;
  --team-primary-button-background: linear-gradient(135deg, #16a8f8 0%, #2563eb 100%);
  --team-primary-button-shadow: rgba(37, 99, 235, 0.34);
  --team-primary-button-hover-shadow: rgba(37, 99, 235, 0.42);
  --team-secondary-button-background: rgba(15, 23, 42, 0.45);
  --team-secondary-button-hover-background: rgba(15, 23, 42, 0.62);
  --team-secondary-button-border: rgba(255, 255, 255, 0.12);
  --team-secondary-button-hover-border: rgba(125, 211, 252, 0.42);
  --team-section-title: var(--theme-white);
  --team-section-copy: rgba(203, 213, 225, 0.78);
  --team-section-eyebrow-text: rgba(56, 189, 248, 0.95);
  --team-section-eyebrow-background: rgba(14, 165, 233, 0.12);
  --team-section-eyebrow-border: rgba(56, 189, 248, 0.24);
  --team-advantage-card-background: #0a143f;
  --team-advantage-card-border: rgba(80, 120, 218, 0.28);
  --team-advantage-icon-background: rgba(40, 91, 166, 0.42);
  --team-advantage-icon-border: rgba(97, 167, 255, 0.58);
  --team-image-card-title: var(--theme-white);
  --team-image-card-copy: rgba(248, 250, 252, 0.86);
  --team-support-card-background: rgba(5, 7, 28, 1);
  --team-support-card-border: rgba(80, 120, 218, 0.22);
  --team-support-icon-background: rgba(40, 91, 166, 0.42);
  --team-support-icon-border: rgba(97, 167, 255, 0.58);
  --team-support-card-copy: rgba(226, 232, 240, 0.82);
  --team-plan-card-background: rgba(5, 14, 47, 1);
  --team-plan-card-alt-background: rgba(10, 15, 57, 1);
  --team-plan-card-purple-background: rgba(20, 14, 62, 1);
  --team-plan-card-border: rgba(80, 120, 218, 0.18);
  --team-rule-blue-border: rgba(96, 165, 250, 0.62);
  --team-rule-blue-background: rgba(5, 14, 47, 0.78);
  --team-rule-blue-shadow: inset 0 0 28px rgba(37, 99, 235, 0.1);
  --team-rule-purple-border: rgba(168, 85, 247, 0.7);
  --team-rule-purple-background: rgba(18, 8, 52, 0.78);
  --team-rule-purple-shadow: inset 0 0 28px rgba(147, 51, 234, 0.12);
  --team-panel-title: var(--theme-white);
  --team-panel-item-background: rgba(255, 255, 255, 0.09);
  --team-panel-item-copy: rgba(203, 213, 225, 0.82);
  --team-settlement-copy: rgba(248, 250, 252, 0.92);
  --team-form-panel-border: rgba(148, 163, 184, 0.58);
  --team-form-panel-background: rgba(5, 9, 29, 0.74);
  --team-form-label: var(--theme-white);
  --team-form-control-border: rgba(92, 111, 152, 0.28);
  --team-form-control-background: rgba(27, 33, 62, 0.82);
  --team-form-icon: rgba(148, 163, 184, 0.78);
  --team-form-value: rgba(226, 232, 240, 0.94);
  --team-form-placeholder: rgba(148, 163, 184, 0.58);
  --team-form-muted: rgba(148, 163, 184, 0.68);
  --team-contact-icon-border: rgba(168, 85, 247, 0.58);
  --team-contact-icon-background: rgba(88, 28, 135, 0.42);
  --team-contact-title: rgba(125, 211, 252, 1);
  --team-contact-divider: rgba(148, 163, 184, 0.14);
  --team-contact-label: rgba(148, 163, 184, 0.78);
  --team-contact-value: rgba(248, 250, 252, 0.94);
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-x: clip;
  padding-top: var(--page-header-height);
  color: var(--theme-text);
  background: var(--theme-route-page-background, var(--page-route-background));
}

.team-page-main {
  width: 100%;
  flex: 1;
  background: var(--team-page-background);
}

.team-hero-section {
  position: relative;
  width: 100%;
  height: auto;
  min-height: 704px;
  overflow: hidden;
  color: var(--theme-white);
  background: var(--team-hero-background);
}

.team-hero-section::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: var(--team-hero-overlay);
}

.team-hero-inner {
  position: relative;
  z-index: 1;
  height: auto;
  min-height: 704px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 68px;
  padding-bottom: 72px;
  text-align: center;
}

.team-hero-eyebrow {
  min-width: 92px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 18px;
  border: 1px solid var(--team-hero-eyebrow-border);
  border-radius: 999px;
  color: var(--team-hero-eyebrow-text);
  background: var(--team-hero-eyebrow-background);
  box-shadow: var(--team-hero-eyebrow-shadow);
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
}

.team-hero-title {
  max-width: min(100%, 1040px);
  margin-top: 24px;
  color: var(--team-hero-title);
  font-size: clamp(38px, 5vw, 60px);
  font-weight: 900;
  line-height: 1.16;
  text-align: center;
  overflow-wrap: anywhere;
}

.team-hero-title span {
  display: block;
}

.team-hero-title-highlight {
  position: relative;
  display: inline-block !important;
  margin-top: 6px;
}

.team-hero-title-line {
  position: absolute;
  left: 50%;
  bottom: -16px;
  width: min(260px, 78%);
  height: auto;
  transform: translateX(-50%);
  pointer-events: none;
}

.team-hero-description {
  max-width: 840px;
  margin-top: 32px;
  color: var(--team-hero-copy);
  font-size: 18px;
  line-height: 30px;
  text-align: center;
  overflow-wrap: anywhere;
}

.team-hero-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 34px;
}

.team-hero-button {
  min-width: 132px;
  height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 24px;
  border: 1px solid var(--team-secondary-button-border);
  border-radius: 10px;
  color: var(--theme-white);
  background: rgba(255, 255, 255, 0.06);
  font-size: 15px;
  font-weight: 800;
  line-height: 1;
  transition: border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.team-hero-button:hover,
.team-hero-button:focus-visible {
  transform: translateY(-1px);
}

.team-hero-button-primary {
  border-color: transparent;
  background: var(--team-primary-button-background);
  box-shadow: 0 14px 30px var(--team-primary-button-shadow);
}

.team-hero-button-primary:hover,
.team-hero-button-primary:focus-visible {
  box-shadow: 0 18px 36px var(--team-primary-button-hover-shadow);
}

.team-hero-button-secondary {
  background: var(--team-secondary-button-background);
}

.team-hero-button-secondary:hover,
.team-hero-button-secondary:focus-visible {
  border-color: var(--team-secondary-button-hover-border);
  background: var(--team-secondary-button-hover-background);
}

.team-advantages-section {
  width: 100%;
  padding: 40px 20px;
  color: var(--theme-white);
  background: var(--team-page-background);
}

.team-advantages-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.team-section-eyebrow {
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  border: 1px solid var(--team-section-eyebrow-border);
  border-radius: 999px;
  color: var(--team-section-eyebrow-text);
  background: var(--team-section-eyebrow-background);
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
}

.team-section-title {
  margin-top: 18px;
  color: var(--team-section-title);
  font-size: 40px;
  font-weight: 900;
  line-height: 48px;
  text-align: center;
}

.team-section-title span {
  display: block;
}

.team-section-description {
  max-width: 640px;
  margin-top: 18px;
  color: var(--team-section-copy);
  font-size: 14px;
  line-height: 22px;
  text-align: center;
  overflow-wrap: anywhere;
}

.team-advantage-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
  margin-top: 38px;
}

.team-advantage-card {
  position: relative;
  height: auto;
  min-height: 231px;
  overflow: hidden;
  padding: 16px 20px 22px;
  border: 1px solid var(--team-advantage-card-border);
  border-radius: 8px;
  background: var(--team-advantage-card-background);
}

.team-advantage-icon {
  width: 50px;
  height: 50px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--team-advantage-icon-border);
  border-radius: 8px;
  background: var(--team-advantage-icon-background);
}

.team-advantage-icon img {
  width: 33px;
  height: 33px;
  object-fit: contain;
}

.team-advantage-content {
  position: relative;
  z-index: 1;
  width: 100%;
  padding-top: 18px;
}

.team-advantage-content h3 {
  color: var(--team-image-card-title);
  font-size: 18px;
  font-weight: 900;
  line-height: 25px;
  overflow-wrap: anywhere;
}

.team-advantage-line {
  width: 36px;
  height: 2px;
  display: block;
  margin-top: 10px;
  border-radius: 999px;
  background: linear-gradient(90deg, #22d3ee 0%, rgba(34, 211, 238, 0) 100%);
}

.team-advantage-content p {
  margin-top: 12px;
  color: var(--team-image-card-copy);
  font-size: 13px;
  line-height: 20px;
  overflow-wrap: anywhere;
}

.team-rules-section {
  width: 100%;
  padding: 40px 20px;
  color: var(--theme-white);
  background: var(--team-page-background);
}

.team-rules-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.team-rules-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-top: 24px;
}

.team-rule-panel {
  min-width: 0;
  min-height: 0;
  padding: 22px;
  border: 1px solid var(--team-rule-blue-border);
  border-radius: 20px;
  background: var(--team-rule-blue-background);
}

.team-rule-panel-blue {
  box-shadow: var(--team-rule-blue-shadow);
}

.team-rule-panel-purple {
  border-color: var(--team-rule-purple-border);
  background: var(--team-rule-purple-background);
  box-shadow: var(--team-rule-purple-shadow);
}

.team-rule-panel h3 {
  color: var(--team-panel-title);
  font-size: 24px;
  font-weight: 900;
  line-height: 32px;
}

.team-agent-level-list {
  display: grid;
  gap: 10px;
  margin-top: 14px;
}

.team-agent-level-item {
  min-width: 0;
  min-height: 0;
  display: grid;
  grid-template-columns: 50px minmax(0, 1fr);
  align-items: center;
  gap: 18px;
  padding: 14px 22px;
  border-radius: 8px;
  background: var(--team-panel-item-background);
}

.team-agent-level-item img {
  width: 39px;
  height: 40px;
  object-fit: contain;
}

.team-agent-level-item h4 {
  color: var(--team-panel-title);
  font-size: 16px;
  font-weight: 900;
  line-height: 22px;
}

.team-agent-level-item p {
  margin-top: 4px;
  color: var(--team-panel-item-copy);
  font-size: 13px;
  line-height: 20px;
  overflow-wrap: anywhere;
}

.team-settlement-list {
  display: grid;
  gap: 22px;
  margin-top: 20px;
  padding: 31px 28px;
  border-radius: 8px;
  background: var(--team-panel-item-background);
}

.team-settlement-list li {
  min-width: 0;
  display: grid;
  grid-template-columns: 14px minmax(0, 1fr);
  align-items: start;
  gap: 22px;
}

.team-settlement-list span {
  width: 12px;
  height: 12px;
  display: block;
  margin-top: 6px;
  border-radius: 999px;
  background: #36d9f3;
}

.team-settlement-list p {
  color: var(--team-settlement-copy);
  font-size: 16px;
  line-height: 24px;
  overflow-wrap: anywhere;
}

.team-support-section {
  width: 100%;
  padding: 40px 20px;
  color: var(--theme-white);
  background: var(--team-page-background);
}

.team-support-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.team-support-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  justify-content: center;
  gap: 24px;
  margin-top: 56px;
}

.team-support-card {
  position: relative;
  width: 100%;
  max-width: 100%;
  height: auto;
  min-height: 233px;
  overflow: hidden;
  padding: 19px 14px 24px;
  border: 1px solid var(--team-support-card-border);
  border-radius: 16px;
  background: var(--team-support-card-background);
}

.team-support-icon {
  width: 50px;
  height: 50px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--team-support-icon-border);
  border-radius: 8px;
  background: var(--team-support-icon-background);
}

.team-support-icon img {
  width: 34px;
  height: 34px;
  object-fit: contain;
}

.team-support-content {
  position: relative;
  z-index: 1;
  width: 100%;
  padding-top: 19px;
}

.team-support-content h3 {
  color: var(--team-image-card-title);
  font-size: 20px;
  font-weight: 900;
  line-height: 28px;
  overflow-wrap: anywhere;
}

.team-support-line {
  width: 66px;
  height: 2px;
  display: block;
  margin-top: 8px;
  border-radius: 999px;
  background: linear-gradient(90deg, #22d3ee 0%, rgba(34, 211, 238, 0) 100%);
}

.team-support-content p {
  margin-top: 10px;
  color: var(--team-support-card-copy);
  font-size: 15px;
  line-height: 23px;
  overflow-wrap: anywhere;
}

.team-plans-section {
  width: 100%;
  padding: 40px 20px;
  color: var(--theme-white);
  background: var(--team-page-background);
}

.team-plans-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.team-plans-grid {
  width: 100%;
  max-width: 1162px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 370px));
  justify-content: center;
  gap: 24px;
  margin-top: 24px;
}

.team-plan-card {
  position: relative;
  width: 370px;
  max-width: 100%;
  height: auto;
  min-height: 160px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 134px;
  align-items: center;
  gap: 10px;
  overflow: hidden;
  padding: 24px 16px 22px 18px;
  border: 1px solid var(--team-plan-card-border);
  border-radius: 12px;
  background: var(--team-plan-card-background);
}

.team-plan-card:nth-child(2) {
  background: var(--team-plan-card-alt-background);
}

.team-plan-card:nth-child(3) {
  background: var(--team-plan-card-purple-background);
}

.team-plan-content {
  position: relative;
  z-index: 1;
  min-width: 0;
}

.team-plan-content h3 {
  color: var(--team-image-card-title);
  font-size: 17px;
  font-weight: 900;
  line-height: 24px;
  overflow-wrap: anywhere;
}

.team-plan-line {
  width: 40px;
  height: 2px;
  display: block;
  margin-top: 8px;
  border-radius: 999px;
  background: linear-gradient(90deg, #22d3ee 0%, rgba(34, 211, 238, 0) 100%);
}

.team-plan-content p {
  margin-top: 9px;
  color: var(--team-support-card-copy);
  font-size: 13px;
  line-height: 20px;
  overflow-wrap: anywhere;
}

.team-plan-image {
  position: relative;
  z-index: 1;
  width: 126px;
  height: 126px;
  object-fit: contain;
  justify-self: center;
}

.team-application-section {
  width: 100%;
  scroll-margin-top: calc(var(--page-header-height) + 24px);
  padding: 40px 20px 88px;
  color: var(--theme-white);
  background: var(--team-page-background);
}

.team-application-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.team-application-layout {
  width: 100%;
  max-width: 1148px;
  display: grid;
  grid-template-columns: 778px 346px;
  align-items: start;
  gap: 24px;
  margin-top: 24px;
}

.team-application-form,
.team-application-contact,
.team-contact-qr-card {
  border: 1px solid var(--team-form-panel-border);
  border-radius: 22px;
  background: var(--team-form-panel-background);
}

.team-application-sidebar {
  width: 346px;
  min-width: 0;
  display: grid;
  gap: 24px;
}

.team-application-form {
  width: 778px;
  height: auto;
  min-width: 0;
  padding: 34px 36px 36px;
}

.team-form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 34px 26px;
}

.team-form-field {
  min-width: 0;
  display: grid;
  gap: 10px;
  color: var(--team-form-label);
  font-size: 13px;
  font-weight: 600;
  line-height: 18px;
}

.team-form-field-wide {
  grid-column: 1 / -1;
}

.team-form-required {
  margin-left: 3px;
  color: #ef4444;
}

.team-form-control {
  width: 100%;
  min-width: 0;
  height: 55px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 14px;
  border: 1px solid var(--team-form-control-border);
  border-radius: 12px;
  color: var(--team-form-icon);
  background: var(--team-form-control-background);
}

.team-form-control svg {
  width: 18px;
  height: 18px;
  flex: 0 0 auto;
  color: var(--team-form-icon);
}

.team-form-control input,
.team-form-control select,
.team-form-control textarea {
  width: 100%;
  min-width: 0;
  border: 0;
  color: var(--team-form-value);
  background: transparent;
  font-size: 12px;
  line-height: 18px;
  outline: none;
}

.team-form-control input::placeholder,
.team-form-control textarea::placeholder {
  color: var(--team-form-placeholder);
}

.team-form-control select {
  color: var(--team-form-value);
  color-scheme: dark;
  cursor: pointer;
}

.team-form-control select:invalid {
  color: var(--team-form-placeholder);
}

.team-form-control select option {
  color: rgba(226, 232, 240, 0.94);
  background: rgba(17, 24, 39, 1);
}

.team-form-control select option[value=""] {
  color: rgba(148, 163, 184, 0.86);
}

.team-form-control select option:checked {
  color: var(--theme-white);
  background: rgba(37, 99, 235, 1);
}

.team-application-select {
  position: relative;
  min-width: 0;
  height: 100%;
  flex: 1 1 auto;
  display: flex;
  align-items: center;
}

.team-application-select-button {
  width: 100%;
  min-width: 0;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  color: var(--team-form-value);
  font-size: 12px;
  line-height: 18px;
  text-align: left;
  cursor: pointer;
}

.team-application-select-button-placeholder {
  color: var(--team-form-placeholder);
}

.team-application-select-button > span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.team-form-control .team-application-select-button svg {
  width: 15px;
  height: 15px;
  color: var(--team-form-icon);
  transition: transform 0.18s ease;
}

.team-application-select-button[aria-expanded="true"] svg {
  transform: rotate(180deg);
}

.team-application-select-button:disabled {
  cursor: not-allowed;
  opacity: 0.72;
}

.team-application-select-menu {
  position: absolute;
  top: calc(100% + 8px);
  left: -42px;
  right: -14px;
  z-index: 40;
  max-height: 248px;
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior: contain;
  padding: 6px;
  border: 1px solid rgba(92, 111, 152, 0.44);
  border-radius: 8px;
  background: rgba(15, 23, 42, 0.98);
  box-shadow: 0 18px 36px rgba(0, 0, 0, 0.34), 0 0 0 1px rgba(125, 211, 252, 0.06);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  scrollbar-width: thin;
  scrollbar-color: rgba(125, 211, 252, 0.58) rgba(15, 23, 42, 0.98);
}

.team-application-select-menu::-webkit-scrollbar {
  width: 6px;
}

.team-application-select-menu::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.98);
}

.team-application-select-menu::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: rgba(125, 211, 252, 0.58);
}

.team-application-select-menu li {
  color: var(--team-form-value);
}

.team-application-select-option {
  width: 100%;
  min-height: 40px;
  display: flex;
  align-items: center;
  padding: 9px 10px;
  border-radius: 6px;
  color: rgba(226, 232, 240, 0.9);
  font-size: 12px;
  line-height: 18px;
  text-align: left;
  overflow-wrap: anywhere;
  cursor: pointer;
  transition: background-color 0.18s ease, color 0.18s ease;
}

.team-application-select-option:hover,
.team-application-select-option:focus {
  color: var(--theme-white);
  background: rgba(37, 99, 235, 0.22);
}

.team-application-select-menu li[aria-selected="true"] .team-application-select-option {
  color: var(--theme-white);
  background: linear-gradient(135deg, rgba(45, 145, 255, 0.88) 0%, rgba(146, 70, 245, 0.78) 100%);
}

.team-select-fade-enter-active,
.team-select-fade-leave-active {
  transition: opacity 0.16s ease, transform 0.16s ease;
}

.team-select-fade-enter-from,
.team-select-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.team-form-control input:disabled,
.team-form-control select:disabled,
.team-form-control textarea:disabled {
  cursor: not-allowed;
  opacity: 0.72;
}

.team-form-textarea-control {
  width: 100%;
  height: 103px;
  align-items: flex-start;
  padding-top: 14px;
}

.team-form-textarea-control textarea {
  height: 75px;
  resize: none;
}

.team-form-note {
  margin-top: 10px;
  color: var(--team-form-muted);
  font-size: 12px;
  line-height: 18px;
}

.team-form-submit {
  width: min(100%, 300px);
  height: 56px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 30px;
  border-radius: 10px;
  color: var(--theme-white);
  background: linear-gradient(135deg, #2d91ff 0%, #9246f5 100%);
  box-shadow: 0 18px 36px rgba(37, 99, 235, 0.28);
  font-size: 15px;
  font-weight: 800;
  line-height: 1;
  cursor: pointer;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.team-form-submit:hover,
.team-form-submit:focus-visible {
  transform: translateY(-1px);
  box-shadow: 0 22px 42px rgba(37, 99, 235, 0.36);
}

.team-form-submit:disabled,
.team-form-submit:disabled:hover,
.team-form-submit:disabled:focus-visible {
  cursor: not-allowed;
  opacity: 0.72;
  transform: none;
  box-shadow: 0 18px 36px rgba(37, 99, 235, 0.2);
}

.team-application-contact {
  width: 346px;
  height: auto;
  min-width: 0;
  padding: 36px 28px 30px;
}

.team-contact-heading {
  display: flex;
  align-items: center;
  gap: 16px;
}

.team-contact-icon {
  width: 50px;
  height: 50px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  border: 1px solid var(--team-contact-icon-border);
  border-radius: 50%;
  color: var(--theme-white);
  background: var(--team-contact-icon-background);
}

.team-contact-icon svg {
  width: 23px;
  height: 23px;
}

.team-contact-heading h3 {
  color: var(--team-contact-title);
  font-size: 20px;
  font-weight: 900;
  line-height: 28px;
}

.team-contact-list {
  display: grid;
  gap: 26px;
  margin-top: 28px;
  padding-top: 28px;
  border-top: 1px solid var(--team-contact-divider);
}

.team-contact-list li {
  min-width: 0;
  display: grid;
  grid-template-columns: 32px minmax(0, 1fr);
  align-items: center;
  gap: 14px;
}

.team-contact-list-icon {
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  color: var(--team-contact-title);
  background: var(--team-contact-icon-background);
  box-shadow: inset 0 0 0 1px var(--team-contact-icon-border);
}

.team-contact-list-icon svg {
  width: 17px;
  height: 17px;
}

.team-contact-list span {
  min-width: 0;
  display: grid;
  gap: 4px;
}

.team-contact-list small {
  color: var(--team-contact-label);
  font-size: 12px;
  line-height: 16px;
}

.team-contact-list strong {
  color: var(--team-contact-value);
  font-size: 13px;
  font-weight: 600;
  line-height: 18px;
  overflow-wrap: anywhere;
}

.team-contact-note {
  margin-top: 30px;
  padding-top: 28px;
  border-top: 1px solid var(--team-contact-divider);
  color: var(--team-contact-label);
  font-size: 13px;
  line-height: 21px;
  overflow-wrap: anywhere;
}

.team-contact-qr-card {
  width: 100%;
  min-width: 0;
  display: grid;
  justify-items: center;
  gap: 22px;
  padding: 44px 28px 28px;
  color: var(--team-contact-value);
}

.team-contact-qr-image {
  width: 230px;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 12px;
  border-radius: 18px;
  background: #ffffff;
}

.team-contact-qr-image img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: contain;
}

.team-contact-qr-card > strong {
  color: var(--team-contact-value);
  font-size: 17px;
  font-weight: 600;
  line-height: 24px;
  text-align: center;
}

:root[data-theme="light"] .team-page-shell {
  --team-page-background: rgba(248, 252, 255, 1);
  --team-hero-title: var(--theme-white);
  --team-hero-copy: rgba(226, 232, 240, 0.84);
  --team-hero-eyebrow-border: rgba(56, 189, 248, 0.32);
  --team-hero-eyebrow-text: rgba(125, 211, 252, 1);
  --team-hero-eyebrow-background: rgba(14, 165, 233, 0.1);
  --team-hero-eyebrow-shadow: inset 0 0 18px rgba(14, 165, 233, 0.12);
  --team-hero-overlay:
    radial-gradient(circle at 50% 44%, rgba(2, 6, 23, 0.12) 0%, transparent 48%),
    linear-gradient(180deg, rgba(2, 6, 23, 0.12) 0%, rgba(2, 6, 23, 0.34) 100%);
  --team-hero-background:
    linear-gradient(180deg, rgba(3, 7, 18, 0.06) 0%, rgba(3, 7, 18, 0.16) 100%),
    var(--media-images-team-partner-plan-hero-bg-png) center / cover no-repeat,
    #040915;
  --team-primary-button-background: linear-gradient(135deg, rgba(6, 182, 212, 1) 0%, rgba(37, 99, 235, 1) 100%);
  --team-primary-button-shadow: rgba(37, 99, 235, 0.2);
  --team-primary-button-hover-shadow: rgba(37, 99, 235, 0.28);
  --team-secondary-button-background: rgba(15, 23, 42, 0.45);
  --team-secondary-button-hover-background: rgba(15, 23, 42, 0.62);
  --team-secondary-button-border: rgba(255, 255, 255, 0.12);
  --team-secondary-button-hover-border: rgba(125, 211, 252, 0.42);
  --team-section-title: rgba(17, 24, 39, 1);
  --team-section-copy: rgba(31, 41, 55, 0.78);
  --team-section-eyebrow-text: rgba(40, 115, 253, 1);
  --team-section-eyebrow-background: rgba(239, 248, 255, 1);
  --team-section-eyebrow-border: rgba(42, 130, 228, 0.18);
  --team-advantage-card-background: rgba(255, 255, 255, 1);
  --team-advantage-card-border: rgba(42, 130, 228, 0.16);
  --team-advantage-icon-background: rgba(239, 248, 255, 1);
  --team-advantage-icon-border: rgba(42, 130, 228, 0.24);
  --team-image-card-title: rgba(17, 24, 39, 1);
  --team-image-card-copy: rgba(31, 41, 55, 0.78);
  --team-support-card-background: rgba(255, 255, 255, 1);
  --team-support-card-border: rgba(42, 130, 228, 0.16);
  --team-support-icon-background: rgba(239, 248, 255, 1);
  --team-support-icon-border: rgba(42, 130, 228, 0.24);
  --team-support-card-copy: rgba(31, 41, 55, 0.78);
  --team-plan-card-background: rgba(255, 255, 255, 1);
  --team-plan-card-alt-background: rgba(247, 250, 255, 1);
  --team-plan-card-purple-background: rgba(250, 245, 255, 1);
  --team-plan-card-border: rgba(42, 130, 228, 0.16);
  --team-rule-blue-border: rgba(42, 130, 228, 0.2);
  --team-rule-blue-background: linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(239, 248, 255, 1) 100%);
  --team-rule-blue-shadow: 0 18px 42px rgba(37, 99, 235, 0.08);
  --team-rule-purple-border: rgba(168, 85, 247, 0.18);
  --team-rule-purple-background: linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(250, 245, 255, 1) 100%);
  --team-rule-purple-shadow: 0 18px 42px rgba(124, 58, 237, 0.08);
  --team-panel-title: rgba(17, 24, 39, 1);
  --team-panel-item-background: rgba(255, 255, 255, 0.86);
  --team-panel-item-copy: rgba(31, 41, 55, 0.78);
  --team-settlement-copy: rgba(31, 41, 55, 0.86);
  --team-form-panel-border: rgba(149, 156, 168, 0.16);
  --team-form-panel-background: rgba(255, 255, 255, 1);
  --team-form-label: rgba(17, 24, 39, 1);
  --team-form-control-border: rgba(229, 231, 235, 1);
  --team-form-control-background: rgba(248, 250, 252, 1);
  --team-form-icon: rgba(107, 114, 128, 1);
  --team-form-value: rgba(17, 24, 39, 1);
  --team-form-placeholder: rgba(107, 114, 128, 0.72);
  --team-form-muted: rgba(31, 41, 55, 0.62);
  --team-contact-icon-border: rgba(40, 115, 253, 0.18);
  --team-contact-icon-background: rgba(239, 248, 255, 1);
  --team-contact-title: rgba(40, 115, 253, 1);
  --team-contact-divider: rgba(229, 231, 235, 1);
  --team-contact-label: rgba(31, 41, 55, 0.68);
  --team-contact-value: rgba(17, 24, 39, 0.92);
  background: var(--team-page-background);
}

:root[data-theme="light"] .team-page-main {
  background:
    linear-gradient(180deg, rgba(248, 252, 255, 1) 0%, rgba(255, 255, 255, 1) 44%, rgba(248, 252, 255, 1) 100%);
}

:root[data-theme="light"] .team-hero-button-secondary {
  color: var(--theme-white);
  box-shadow: 0 14px 28px rgba(15, 23, 42, 0.06);
}

:root[data-theme="light"] .team-advantages-section,
:root[data-theme="light"] .team-rules-section,
:root[data-theme="light"] .team-support-section,
:root[data-theme="light"] .team-plans-section,
:root[data-theme="light"] .team-application-section {
  color: rgba(17, 24, 39, 1);
  background: transparent;
}

:root[data-theme="light"] .team-advantage-card,
:root[data-theme="light"] .team-support-card,
:root[data-theme="light"] .team-plan-card {
  box-shadow: 0 18px 42px rgba(15, 23, 42, 0.1);
}

:root[data-theme="light"] .team-rule-panel,
:root[data-theme="light"] .team-application-form,
:root[data-theme="light"] .team-application-contact,
:root[data-theme="light"] .team-contact-qr-card {
  padding-left: 28px;
  padding-right: 28px;
  box-shadow: 0 18px 42px rgba(15, 23, 42, 0.06);
}

:root[data-theme="light"] .team-contact-list li {
  grid-template-columns: 32px minmax(0, 1fr);
  gap: 14px;
}

:root[data-theme="light"] .team-contact-icon,
:root[data-theme="light"] .team-contact-list-icon {
  color: rgba(40, 115, 253, 1);
  background: rgba(239, 248, 255, 1);
  box-shadow: inset 0 0 0 1px rgba(40, 115, 253, 0.14);
}

:root[data-theme="light"] .team-agent-level-item,
:root[data-theme="light"] .team-settlement-list {
  border: 1px solid rgba(229, 231, 235, 0.82);
}

:root[data-theme="light"] .team-form-control:focus-within {
  border-color: rgba(40, 115, 253, 0.46);
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 0 0 3px rgba(40, 115, 253, 0.1);
}

:root[data-theme="light"] .team-form-control select option {
  color: rgba(17, 24, 39, 1);
  background: rgba(255, 255, 255, 1);
}

:root[data-theme="light"] .team-form-control select {
  color-scheme: light;
}

:root[data-theme="light"] .team-form-control select:invalid,
:root[data-theme="light"] .team-form-control select option[value=""] {
  color: rgba(100, 116, 139, 0.88);
}

:root[data-theme="light"] .team-form-control select option:checked {
  color: var(--theme-white);
  background: rgba(40, 115, 253, 1);
}

:root[data-theme="light"] .team-application-select-menu {
  border-color: rgba(203, 213, 225, 0.95);
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 18px 36px rgba(15, 23, 42, 0.14), 0 0 0 1px rgba(40, 115, 253, 0.06);
  scrollbar-color: rgba(40, 115, 253, 0.45) rgba(255, 255, 255, 0.98);
}

:root[data-theme="light"] .team-application-select-menu::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.98);
}

:root[data-theme="light"] .team-application-select-menu::-webkit-scrollbar-thumb {
  background: rgba(40, 115, 253, 0.45);
}

:root[data-theme="light"] .team-application-select-option {
  color: rgba(30, 41, 59, 0.92);
}

:root[data-theme="light"] .team-application-select-option:hover,
:root[data-theme="light"] .team-application-select-option:focus {
  color: rgba(30, 64, 175, 1);
  background: rgba(40, 115, 253, 0.1);
}

:root[data-theme="light"] .team-application-select-menu li[aria-selected="true"] .team-application-select-option {
  color: var(--theme-white);
  background: linear-gradient(135deg, rgba(40, 115, 253, 0.94) 0%, rgba(113, 82, 255, 0.9) 100%);
}

@media (max-width: 768px) {
  .team-hero-section,
  .team-hero-inner {
    height: auto;
    min-height: 704px;
  }

  .team-hero-inner {
    padding-top: 56px;
    padding-bottom: 58px;
  }

  .team-hero-title {
    margin-top: 20px;
    font-size: 32px;
    line-height: 40px;
  }

  .team-hero-description {
    margin-top: 28px;
    font-size: 14px;
    line-height: 24px;
  }

  .team-hero-actions {
    width: 100%;
    gap: 12px;
    margin-top: 28px;
  }

  .team-hero-button {
    min-width: 124px;
    height: 44px;
    padding: 0 18px;
    font-size: 14px;
  }

  .team-advantages-section {
    padding: 40px 24px;
  }

  .team-section-title {
    font-size: 32px;
    line-height: 40px;
  }

  .team-section-description {
    font-size: 13px;
    line-height: 20px;
  }

  .team-advantage-grid {
    grid-template-columns: 1fr;
    gap: 18px;
    margin-top: 32px;
  }

  .team-advantage-card {
    min-height: calc((100vw - 48px) * 231 / 370);
    padding: 16px 18px 18px;
    border-radius: 12px;
  }

  .team-advantage-content {
    padding-top: 16px;
  }

  .team-advantage-content h3 {
    font-size: 17px;
    line-height: 24px;
  }

  .team-advantage-content p {
    margin-top: 10px;
    font-size: 12px;
    line-height: 19px;
  }

  .team-rules-section {
    padding: 40px 16px;
  }

  .team-rules-grid {
    grid-template-columns: 1fr;
    gap: 16px;
    margin-top: 28px;
  }

  .team-rule-panel {
    padding: 20px;
    border-radius: 16px;
  }

  .team-agent-level-item {
    grid-template-columns: 44px minmax(0, 1fr);
    gap: 14px;
    padding: 14px;
  }

  .team-settlement-list {
    gap: 18px;
    padding: 22px 18px;
  }

  .team-settlement-list li {
    gap: 14px;
  }

  .team-settlement-list p {
    font-size: 14px;
    line-height: 22px;
  }

  .team-support-section {
    padding: 40px 16px;
  }

  .team-support-grid {
    grid-template-columns: 1fr;
    gap: 18px;
    margin-top: 32px;
  }

  .team-support-card {
    width: 100%;
    height: auto;
    min-height: 220px;
    padding: 18px 18px 22px;
  }

  .team-support-content {
    padding-top: 16px;
  }

  .team-support-content h3 {
    font-size: 18px;
    line-height: 25px;
  }

  .team-support-content p {
    font-size: 13px;
    line-height: 20px;
  }

  .team-plans-section {
    padding: 40px 16px;
  }

  .team-plans-grid {
    grid-template-columns: 1fr;
    gap: 18px;
  }

  .team-plan-card {
    width: 100%;
    height: auto;
    min-height: 160px;
    grid-template-columns: minmax(0, 1fr) 118px;
    padding: 22px 14px 20px 18px;
  }

  .team-plan-content {
    min-width: 0;
  }

  .team-plan-image {
    width: 112px;
    height: 112px;
  }

  .team-application-section {
    padding: 40px 16px 72px;
  }

  .team-application-layout {
    grid-template-columns: 1fr;
    gap: 18px;
  }

  .team-application-form,
  .team-application-contact,
  .team-contact-qr-card {
    border-radius: 16px;
  }

  .team-application-form {
    width: 100%;
    height: auto;
    padding: 22px 18px 24px;
  }

  .team-form-grid {
    grid-template-columns: 1fr;
    gap: 18px;
  }

  .team-form-control,
  .team-form-textarea-control {
    width: 100%;
  }

  .team-form-submit {
    width: 100%;
  }

  .team-application-sidebar,
  .team-application-contact {
    width: 100%;
  }

  .team-application-sidebar {
    gap: 18px;
  }

  .team-application-contact {
    height: auto;
    padding: 24px 20px;
  }

  .team-contact-qr-card {
    padding: 32px 20px 24px;
  }

  .team-contact-qr-image {
    width: min(230px, 76vw);
  }

  .team-contact-heading h3 {
    font-size: 18px;
    line-height: 25px;
  }
}
</style>
