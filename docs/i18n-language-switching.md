# 多语言切换实现步骤

当前项目使用 `@nuxtjs/i18n`，语言包采用 JSON 懒加载方式。

## 文件结构

- `nuxt.config.ts`：注册 i18n 模块，并维护通用 i18n 配置。
- `app/assets/styles/main.css`：维护全局页面样式和响应式容器。
- `i18n/locales.config.js`：维护语言清单。
- `i18n/locales/*.json`：维护每种语言的翻译文案。
- `app/pages/index.vue`：读取翻译文案，并实现语言切换。

## 统一页面样式

全局页面样式写在 `app/assets/styles/main.css`，页面默认使用下面这套结构：

```vue
<template>
  <!-- page-shell 负责整页背景、最小高度和水平居中。 -->
  <div class="page-shell">
    <!-- page-header 负责顶部区域，内部内容继续用 page-container 居中。 -->
    <header class="page-header">
      <div class="page-container page-header-inner">
        顶部内容
      </div>
    </header>

    <!-- page-main 负责页面主体上下留白。 -->
    <main class="page-container page-main">
      <!-- page-card 用来承载独立内容块。 -->
      <div class="page-card">
        页面内容
      </div>
    </main>
  </div>
</template>
```

样式规则：

- `page-shell`：让页面撑满屏幕，并让内容整体水平居中。
- `page-container`：统一控制页面最大宽度，1920 宽屏下外盒子为 `1920px`，内部仍保留左右间距。
- `page-header`：顶部区域宽度铺满屏幕，内部内容居中。
- `page-header-inner`：顶部内容左右排列，小屏幕允许换行。
- `page-main`：统一控制主体区域上下留白。
- `page-card`：统一内容卡片样式，圆角固定为 `8px`。

## 新增一种语言

1. 在 `i18n/locales/` 下新增语言文件。

```text
i18n/locales/ja.json
```

2. 复制 `en.json` 的 key 结构，并翻译 value。

```json
{
  "meta": {
    "title": "My International Site",
    "description": "A clean Nuxt i18n starter."
  },
  "nav": {
    "brand": "My International Site"
  },
  "hero": {
    "title": "Tailwind CSS is ready",
    "description": "You can now build UI with localized copy from one clean source.",
    "action": "Try the button"
  },
  "locale": {
    "switchLabel": "Language"
  }
}
```

注意：所有语言 JSON 的 key 必须保持一致，只翻译 value。

3. 在 `i18n/locales.config.js` 中注册语言。

```js
{ code: 'ja', language: 'ja-JP', name: '日本語', file: 'ja.json' }
```

字段说明：

- `code`：路由和切换语言时使用的语言代码，例如 `en`、`zh-CN`、`ja`。
- `language`：完整 ISO 语言标识，例如 `en-US`、`zh-CN`、`ja-JP`，SEO 标签会使用它。
- `name`：语言切换按钮上显示的名称。
- `file`：对应的 JSON 语言文件。

## 语言切换实现

页面中使用 i18n 提供的组合函数：

```js
const { locale, locales, setLocale, translate } = createI18nPageContext()
const switchLocalePath = useSwitchLocalePath()
```

说明：`t` 是 vue-i18n 官方给“翻译函数”起的名字，作用是根据 key 读取当前语言的文案。项目里已经在 `app/utils/i18n-page.js` 里把它统一改名成 `translate`，页面代码不直接写 `t`。

语言按钮来自 `i18n/locales.config.js` 中注册的语言清单。新增语言后，只要语言文件和配置都补齐，页面会自动出现对应按钮。

切换语言时执行：

```js
const switchLanguage = async (code) => {
  if (locale.value !== code) {
    await setLocale(code)
    refreshPageData()
    await navigateTo(switchLocalePath(code))
  }
}
```

这段逻辑会完成三件事：

1. 使用 `setLocale(code)` 切换当前语言。
2. 使用 `refreshPageData()` 刷新页面文案。
3. 使用 `navigateTo(switchLocalePath(code))` 跳转到当前页面的对应语言路由。

## 页面文案读取规则

页面不在模板里直接写 `$t()`，而是在 `<script setup>` 中通过函数集中生成文案。

```js
const getPageText = () => {
  return {
    navBrand: translate('nav.brand'),
    localeSwitchLabel: translate('locale.switchLabel'),
    heroTitle: translate('hero.title'),
    heroDescription: translate('hero.description'),
    heroAction: translate('hero.action'),
  }
}
```

模板只读取普通对象：

```vue
{{ pageText.navBrand }}
```

这样模板更干净，也方便后续统一检查硬编码文案。

## SEO 配置

`nuxt.config.ts` 中必须配置站点域名，否则 canonical、hreflang、sitemap 和 robots 里的链接无法生成完整 URL。

```ts
const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || process.env.NUXT_SITE_URL || 'https://example.com'
```

开发环境默认使用：

```text
https://example.com
```

说明：这里使用 `https://example.com` 作为占位域名，是为了避免 SEO 模块把 `localhost` 当成无效生产域名报警。正式上线前必须改成真实域名。

生产环境上线前设置：

```bash
NUXT_PUBLIC_SITE_URL=https://example.com
```

页面 SEO 已封装到 `app/utils/seo.js`，全局 SEO 配置放在 `nuxt.config.ts`。

当前已经完成：

- 全局默认 SEO 模板：`nuxt.config.ts` 中通过 `app.head.titleTemplate` 统一设置。
- 自动 hreflang 多语言标签：`app/utils/seo.js` 中通过 `useLocaleHead()` 自动生成。
- 自动 sitemap 生成：`nuxt.config.ts` 中启用 `@nuxtjs/sitemap`。
- robots.txt 配置：`nuxt.config.ts` 中启用 `@nuxtjs/robots`。
- 统一 canonical 规范链接：`useLocaleHead({ seo: { canonicalQueries: [] } })` 自动生成，并去掉 query 参数。
- 图片自动补 alt 规范：页面图片统一使用 `app/components/SeoImage.vue`。
- 页面标题、描述多语言适配：`setupI18nSeo()` 从当前语言 JSON 读取 `title` 和 `description`。

默认读取语言包中的 `meta.title` 和 `meta.description`：

```js
setupI18nSeo({ translate })
```

如果页面有真实分享图，可以传入 `image`：

```js
setupI18nSeo({ translate, image: '/images/share/home.jpg' })
```

如果是其他页面，可以传入自己的 SEO key 前缀：

```js
setupI18nSeo({ translate, keyPrefix: 'about.meta' })
```

对应语言包结构：

```json
{
  "about": {
    "meta": {
      "title": "About Us",
      "description": "Learn more about us."
    }
  }
}
```

SEO 工具内部使用：

```js
const localeHead = useLocaleHead()
```

它会生成：

- `<html lang>`
- canonical 链接
- alternate hreflang 链接
- Open Graph locale 标签

页面自身还从语言 JSON 中生成：

- `title`
- `description`
- `og:title`
- `og:description`
- `twitter:title`
- `twitter:description`

图片使用规范：

```vue
<SeoImage
  src="/images/product.jpg"
  alt="产品展示图"
  width="800"
  height="450"
/>
```

说明：

- `alt` 建议手动传入最准确的中文或英文描述。
- 如果漏传 `alt`，`SeoImage` 会根据图片文件名生成兜底替代文本。
- `width` 和 `height` 建议填写，能减少图片加载时的页面抖动。

## 开发规范

- `.vue` 文件不使用 TypeScript。
- `.vue` 文件不使用 `computed()`。
- `.vue` 文件不使用 `watchEffect()`。
- 模板中不使用 `$t()`。
- 模板中不硬编码面向用户的文案。
- 所有用户可见文案都放到 `i18n/locales/*.json`。
- 每个语言 JSON 的 key 必须一致。
- 新增国家或语言时，同时新增语言 JSON 和 `locales.config.js` 配置。
