// 所有支持的语言统一维护在这里，新增国家或语言时只需要追加一项。
export const locales = [
  // 默认英文站点，不带路由前缀。
  { code: 'en', language: 'en-US', name: 'English', file: 'en.json', flagIcon: 'circle-flags:us' },
  // 简体中文站点，访问路径为 /zh-CN。
  { code: 'zh-CN', language: 'zh-CN', name: '简体中文', file: 'zh-CN.json', flagIcon: 'circle-flags:cn' },
  // 日语站点，访问路径为 /ja。
  { code: 'ja', language: 'ja-JP', name: '日本語', file: 'ja.json', flagIcon: 'circle-flags:jp' },
]
