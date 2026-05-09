// 统一获取页面需要的 i18n 能力，避免每个 .vue 页面里都直接写 t 这个缩写。
export const createI18nPageContext = () => {
  // useI18n() 是 @nuxtjs/i18n 提供的组合函数，会返回当前语言、语言清单和翻译方法。
  const i18nContext = useI18n()

  return {
    // locale 是当前语言，例如 en 或 zh-CN。
    locale: i18nContext.locale,
    // locales 是 nuxt.config.ts 中注册过的语言清单。
    locales: i18nContext.locales,
    // setLocale 用来切换当前语言。
    setLocale: i18nContext.setLocale,
    // t 是 vue-i18n 官方的翻译函数名，这里统一改名成 translate，页面代码更容易读。
    translate: i18nContext.t,
  }
}

// 根据 i18n 配置生成语言切换按钮的数据。
export const createAvailableLocales = (locales) => {
  return locales.value.map(item => typeof item === 'string'
    // 字符串写法只作为兜底，正式项目建议统一使用 locales.config.js 里的对象写法。
    ? { code: item, name: item, flagIcon: 'circle-flags:xx' }
    // flagIcon 是 @nuxt/icon 使用的图标名称，例如 circle-flags:cn。
    : { code: item.code, name: item.name || item.code, flagIcon: item.flagIcon || 'circle-flags:xx' }
  )
}

// translate 是 i18n 的翻译函数，用来从当前语言 JSON 中读取文案。
export const createSiteHeaderText = (translate) => {
  return {
    navBrand: translate('nav.brand'),
    brandMain: translate('footer.brandMain'),
    brandAccent: translate('footer.brandAccent'),
    menuLabel: translate('nav.menuLabel'),
    loginRegister: translate('nav.loginRegister'),
    localeSwitchLabel: translate('locale.switchLabel'),
  }
}
