const path = require('path')
const fs = require('fs')
const sqlite = require('C:/Users/sunao/Desktop/前端/strapi-nuxt/node_modules/better-sqlite3')

const dbFile = 'C:/Users/sunao/Desktop/前端/strapi-nuxt/.tmp/data.db'
const workDir = 'C:/Users/sunao/Desktop/前端/strapi-nuxt/scripts/translation/work/terms-rename-20260821T031644Z'
const backupDir = 'C:/Users/sunao/Desktop/前端/strapi-nuxt/.tmp/translation-backups'

const scriptLocales = ['en', 'zh-TW', 'id', 'ms', 'th', 'vi', 'fil', 'es', 'pt', 'ar', 'ja', 'tr', 'it', 'de', 'fr', 'ko', 'ru', 'pl', 'nl', 'hi', 'ur', 'bn', 'fa']

const scriptTerms = { 'zh-CN': '服务条款' }
for (const loc of scriptLocales) {
  const file = path.join(workDir, `${loc}.json`)
  const obj = JSON.parse(fs.readFileSync(file, 'utf8'))
  scriptTerms[loc] = obj.termsName
}

function replaceStrings(value, from, to) {
  if (typeof value === 'string') return value.split(from).join(to)
  if (Array.isArray(value)) return value.map((v) => replaceStrings(v, from, to))
  if (value && typeof value === 'object') {
    const out = {}
    for (const [k, v] of Object.entries(value)) out[k] = replaceStrings(v, from, to)
    return out
  }
  return value
}

async function main() {
  const db = sqlite(dbFile)
  db.pragma('busy_timeout = 10000')

  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  const backupFile = path.join(backupDir, `apply-script-terms-${stamp}.data.db`)
  await db.backup(backupFile)
  console.log('backup:', backupFile)

  // Current term per locale = the agreement title currently in the CMS.
  const currentTerms = {}
  for (const row of db.prepare('SELECT locale, data FROM agreements WHERE published_at IS NOT NULL').all()) {
    const data = JSON.parse(row.data)
    currentTerms[row.locale] = data.title
  }

  const tables = [
    { table: 'agreements', jsonCol: 'data' },
    { table: 'logins', jsonCol: 'logins' },
    { table: 'profiles', jsonCol: 'data' },
    { table: 'footers', jsonCol: 'footerobj' },
  ]

  const run = db.transaction(() => {
    for (const t of tables) {
      const rows = db.prepare(`SELECT id, locale, ${t.jsonCol} FROM ${t.table}`).all()
      let updated = 0
      for (const row of rows) {
        const from = currentTerms[row.locale]
        const to = scriptTerms[row.locale]
        if (!from || !to || from === to) continue
        const obj = JSON.parse(row[t.jsonCol])
        const next = replaceStrings(obj, from, to)
        const before = JSON.stringify(obj)
        const after = JSON.stringify(next)
        if (before !== after) {
          db.prepare(`UPDATE ${t.table} SET ${t.jsonCol} = ? WHERE id = ?`).run(after, row.id)
          updated++
        }
      }
      console.log(`${t.table}: ${updated} rows updated`)
    }
  })
  run()

  // Summary
  const summary = db.prepare(`
    SELECT a.locale,
      json_extract(a.data, '$.title') AS agreementTitle,
      json_extract(l.logins, '$.loginBox.userProtocolText') AS loginText,
      json_extract(p.data, '$.profileBox.redeem.userProtocolText') AS redeemText,
      json_extract(f.footerobj, '$.footer.columns[2].links[2].text') AS footerText
    FROM agreements a
    LEFT JOIN logins l ON l.locale = a.locale AND l.published_at IS NOT NULL
    LEFT JOIN profiles p ON p.locale = a.locale AND p.published_at IS NOT NULL
    LEFT JOIN footers f ON f.locale = a.locale AND f.published_at IS NOT NULL
    WHERE a.published_at IS NOT NULL
    ORDER BY a.locale
  `).all()
  for (const s of summary) {
    console.log(`${s.locale} | ${s.agreementTitle} | ${s.loginText} | ${s.redeemText} | ${s.footerText}`)
  }
  db.close()
}

main().catch((err) => {
  console.error('ERROR:', err.message)
  process.exit(1)
})
