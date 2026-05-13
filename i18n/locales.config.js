// 所有支持的语言统一维护在这里，新增国家或语言时只需要追加一项。
export const locales = [
  // 简体中文站点，不带路由前缀。
  { code: 'zh-CN', language: 'zh-CN', name: '简体中文', flagIcon: 'circle-flags:cn' },
  // 英文站点，访问路径为 /en。
  { code: 'en', language: 'en-US', name: 'English', flagIcon: 'circle-flags:us' },
]
