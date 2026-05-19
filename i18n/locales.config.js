// 所有支持的语言统一维护在这里，新增国家或语言时只需要追加一项。
export const locales = [
  // 简体中文站点，不带路由前缀。
  { code: 'zh-CN', language: 'zh-CN', name: '简体中文', flagIcon: 'circle-flags:cn' },
  // 英文站点，访问路径为 /en。
  { code: 'en', language: 'en-US', name: 'English', flagIcon: 'circle-flags:us' },
  // 其他语言已在 Strapi 侧准备，前端展示时再打开。
  // { code: 'zh-TW', language: 'zh-TW', name: '繁體中文', flagIcon: 'circle-flags:hk' },
  // { code: 'id', language: 'id-ID', name: 'Indonesia', flagIcon: 'circle-flags:id' },
  // { code: 'ms', language: 'ms-MY', name: 'Bahasa Malaysia', flagIcon: 'circle-flags:my' },
  // { code: 'th', language: 'th-TH', name: 'ไทย', flagIcon: 'circle-flags:th' },
  // { code: 'vi', language: 'vi-VN', name: 'Tiếng Việt', flagIcon: 'circle-flags:vn' },
  // { code: 'fil', language: 'fil-PH', name: 'Filipino', flagIcon: 'circle-flags:ph' },
  // { code: 'es', language: 'es-ES', name: 'Español', flagIcon: 'circle-flags:es' },
  // { code: 'pt', language: 'pt-PT', name: 'Português', flagIcon: 'circle-flags:pt' },
  // { code: 'ar', language: 'ar', name: 'العربية', flagIcon: 'circle-flags:sa', dir: 'rtl' },
  // { code: 'ja', language: 'ja-JP', name: '日本語', flagIcon: 'circle-flags:jp' },
  // { code: 'tr', language: 'tr-TR', name: 'Türkçe', flagIcon: 'circle-flags:tr' },
  // { code: 'it', language: 'it-IT', name: 'Italiano', flagIcon: 'circle-flags:it' },
  // { code: 'de', language: 'de-DE', name: 'Deutsch', flagIcon: 'circle-flags:de' },
  // { code: 'fr', language: 'fr-FR', name: 'Français', flagIcon: 'circle-flags:fr' },
  // { code: 'ko', language: 'ko-KR', name: '한국어', flagIcon: 'circle-flags:kr' },
  // { code: 'ru', language: 'ru-RU', name: 'Русские', flagIcon: 'circle-flags:ru' },
  // { code: 'pl', language: 'pl-PL', name: 'polski', flagIcon: 'circle-flags:pl' },
  // { code: 'nl', language: 'nl-NL', name: 'Nederlands', flagIcon: 'circle-flags:nl' },
  // { code: 'hi', language: 'hi-IN', name: 'हिंदी', flagIcon: 'circle-flags:in' },
  // { code: 'ur', language: 'ur-PK', name: 'اردو', flagIcon: 'circle-flags:pk', dir: 'rtl' },
  // { code: 'bn', language: 'bn-BD', name: 'বাংলা', flagIcon: 'circle-flags:bd' },
  // { code: 'fa', language: 'fa-IR', name: 'فارسی', flagIcon: 'circle-flags:ir', dir: 'rtl' },
]
