import { locales } from '../i18n/locales.config.js'
import { readFile, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import { mkdir } from 'node:fs/promises'

const STRAPI_URL = (process.env.NUXT_PUBLIC_STRAPI_URL || 'http://192.168.18.100:1337').replace(/\/+$/, '')
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || ''
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || ''
const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL || 'deepseek-v4-flash'
const DEEPSEEK_API_URL = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/chat/completions'
const SOURCE_LOCALE = process.env.SOURCE_LOCALE || 'zh-CN'
const DRY_RUN = process.argv.includes('--dry-run')
const REPAIR_HAN = process.argv.includes('--repair-han')
const OUTPUT_FILE = getArgStringValue('--output')
const INPUT_FILE = getArgStringValue('--input')
const ONLY_LOCALES = getArgValue('--locales')
const ONLY_TYPES = getArgValue('--types')

const policyCollections = [
  { route: 'footers', name: 'Footer Navigation', dataField: 'footerobj' },
  { route: 'members', name: 'Membership Subscription Agreement' },
  { route: 'gdprs', name: 'GDPR and Data Protection' },
  { route: 'privacys', name: 'VicastCam Privacy Policy' },
  { route: 'safetys', name: 'Security and Privacy Commitment' },
]

const protectedKeys = new Set([
  'key',
  'path',
  'icon',
  'url',
  'href',
  'target',
  'rel',
])

const targetLocales = locales
  .filter(locale => locale.code !== SOURCE_LOCALE)
  .filter(locale => !ONLY_LOCALES || ONLY_LOCALES.has(locale.code))

const targetCollections = policyCollections
  .filter(collection => !ONLY_TYPES || ONLY_TYPES.has(collection.route))

const outputBundle = INPUT_FILE ? await readBundle(INPUT_FILE) : {
  generatedAt: new Date().toISOString(),
  sourceLocale: SOURCE_LOCALE,
  strapiUrl: STRAPI_URL,
  items: [],
}

if (!DRY_RUN && !OUTPUT_FILE && !STRAPI_API_TOKEN) {
  throw new Error('Missing STRAPI_API_TOKEN. Set it before writing translated content back to Strapi.')
}

if (!DRY_RUN && (!INPUT_FILE || REPAIR_HAN) && !DEEPSEEK_API_KEY) {
  throw new Error('Missing DEEPSEEK_API_KEY. Set it before running DeepSeek translation.')
}

if (!targetLocales.length) {
  throw new Error('No target locales matched.')
}

if (!targetCollections.length) {
  throw new Error('No target content types matched.')
}

for (const collection of targetCollections) {
  const sourceEntry = await fetchSingleEntry(collection.route, SOURCE_LOCALE)
  const sourceData = getCollectionData(sourceEntry, collection)

  if (!sourceData) {
    throw new Error(`No ${SOURCE_LOCALE} source data found for ${collection.route}.`)
  }

  console.log(`\n${collection.name} (${collection.route})`)

  for (const locale of targetLocales) {
    const existingEntry = await fetchSingleEntry(collection.route, locale.code)

    if (DRY_RUN) {
      const status = existingEntry?.documentId ? `exists:${existingEntry.documentId}` : 'missing'
      console.log(`- ${locale.code}: ${status}`)
      continue
    }

    const cachedItem = findBundleItem(outputBundle, collection.route, locale.code)
    const safeTranslatedData = cachedItem?.data
      ? REPAIR_HAN
        ? await repairHanFragments(sourceData, cachedItem.data, locale)
        : cachedItem.data
      : restoreProtectedValues(sourceData, await translateData(sourceData, locale))

    upsertBundleItem(outputBundle, {
      route: collection.route,
      name: collection.name,
      locale: locale.code,
      language: locale.language,
      documentId: existingEntry?.documentId || cachedItem?.documentId || '',
      data: safeTranslatedData,
    })

    if (OUTPUT_FILE) {
      await writeBundle(OUTPUT_FILE, outputBundle)
    }

    if (!STRAPI_API_TOKEN) {
      console.log(`- ${locale.code}: translated`)
      continue
    }

    const savedEntry = await saveEntry(collection, locale.code, existingEntry?.documentId, safeTranslatedData)
    console.log(`- ${locale.code}: saved ${savedEntry?.documentId || existingEntry?.documentId || 'new entry'}`)
  }
}

function getCollectionData(entry, collection) {
  if (!entry) {
    return null
  }

  return collection.dataField ? entry[collection.dataField] : entry.data
}

function getArgValue(name) {
  const value = getArgStringValue(name)
  return value ? new Set(value.split(',').map(item => item.trim()).filter(Boolean)) : null
}

function getArgStringValue(name) {
  const prefix = `${name}=`
  return process.argv.find(arg => arg.startsWith(prefix))?.slice(prefix.length) || ''
}

async function fetchSingleEntry(route, locale) {
  const params = new URLSearchParams({ locale, populate: '*' })
  const response = await fetch(`${STRAPI_URL}/api/${route}?${params}`)
  const json = await readJsonResponse(response, `fetch ${route} ${locale}`)
  return Array.isArray(json.data) ? json.data[0] : json.data
}

async function saveEntry(collection, locale, documentId, data) {
  const route = collection.route
  const method = documentId ? 'PUT' : 'POST'
  const path = documentId ? `${route}/${documentId}` : route
  const params = new URLSearchParams({ locale, status: 'published' })
  const payloadData = collection.dataField ? { [collection.dataField]: data } : data
  const response = await fetch(`${STRAPI_URL}/api/${path}?${params}`, {
    method,
    headers: {
      authorization: `Bearer ${STRAPI_API_TOKEN}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ data: payloadData }),
  })

  const json = await readJsonResponse(response, `${method} ${route} ${locale}`)
  return json.data
}

async function translateData(sourceData, locale) {
  const languageName = locale.name || locale.language || locale.code
  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${DEEPSEEK_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: DEEPSEEK_MODEL,
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: [
            'You are a professional legal and product localization translator.',
            'Translate Simplified Chinese JSON content into the requested locale.',
            'Return only valid JSON with exactly the same schema, array order, and object keys.',
            'Do not translate values for fields named key, path, icon, url, href, target, or rel.',
            'Keep brand names, company names, email addresses, domain names, SKUs, legal citations, and technical identifiers unchanged.',
            'Use formal legal/privacy-policy wording suitable for production website publication.',
          ].join(' '),
        },
        {
          role: 'user',
          content: JSON.stringify({
            targetLocale: locale.code,
            targetLanguage: languageName,
            data: sourceData,
          }),
        },
      ],
    }),
  })

  const json = await readJsonResponse(response, `DeepSeek translate ${locale.code}`)
  const content = json.choices?.[0]?.message?.content

  if (!content) {
    throw new Error(`DeepSeek returned empty content for ${locale.code}.`)
  }

  const parsed = parseJsonContent(content)
  return parsed.data || parsed
}

async function repairHanFragments(sourceData, translatedData, locale) {
  if (locale.code === 'zh-TW' || locale.code === 'ja') {
    return translatedData
  }

  const fragments = []
  collectHanFragments(sourceData, translatedData, [], fragments)

  if (!fragments.length) {
    return translatedData
  }

  console.log(`  repairing ${fragments.length} Chinese fragment(s) in ${locale.code}`)
  const repairedData = structuredClone(translatedData)
  const translatedFragments = await translateTextFragments(fragments, locale)

  for (const fragment of translatedFragments) {
    setValueAtPath(repairedData, fragment.path, fragment.text)
  }

  return repairedData
}

function collectHanFragments(sourceValue, translatedValue, path, fragments) {
  if (Array.isArray(sourceValue)) {
    sourceValue.forEach((item, index) => {
      collectHanFragments(item, translatedValue?.[index], [...path, index], fragments)
    })
    return
  }

  if (sourceValue && typeof sourceValue === 'object') {
    for (const [key, sourceChild] of Object.entries(sourceValue)) {
      if (!protectedKeys.has(key)) {
        collectHanFragments(sourceChild, translatedValue?.[key], [...path, key], fragments)
      }
    }
    return
  }

  if (
    typeof sourceValue === 'string'
    && typeof translatedValue === 'string'
    && /[\u3400-\u9fff]/u.test(translatedValue)
  ) {
    fragments.push({
      id: String(fragments.length),
      path,
      text: sourceValue,
    })
  }
}

async function translateTextFragments(fragments, locale) {
  const batches = createTextBatches(fragments)
  const translations = new Map()

  for (const batch of batches) {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${DEEPSEEK_API_KEY}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: DEEPSEEK_MODEL,
        temperature: 0.2,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: [
              'You are a professional legal and product localization translator.',
              'Translate every Simplified Chinese string into the requested locale.',
              'Return only valid JSON in the form {"translations":{"id":"translated text"}}.',
              'Keep every input id exactly once and do not add any other keys.',
              'Do not leave Chinese characters in the translation, including Chinese section numerals.',
              'Keep brand names, company names, email addresses, domain names, SKUs, legal citations, and technical identifiers unchanged.',
              'Use formal legal/privacy-policy wording suitable for production website publication.',
            ].join(' '),
          },
          {
            role: 'user',
            content: JSON.stringify({
              targetLocale: locale.code,
              targetLanguage: locale.name || locale.language || locale.code,
              translations: Object.fromEntries(batch.map(fragment => [fragment.id, fragment.text])),
            }),
          },
        ],
      }),
    })

    const json = await readJsonResponse(response, `DeepSeek repair ${locale.code}`)
    const content = json.choices?.[0]?.message?.content

    if (!content) {
      throw new Error(`DeepSeek returned empty repair content for ${locale.code}.`)
    }

    const parsed = parseJsonContent(content)
    const translatedBatch = parsed.translations || parsed

    for (const fragment of batch) {
      const translatedText = translatedBatch[fragment.id]

      if (typeof translatedText !== 'string' || !translatedText.trim()) {
        throw new Error(`DeepSeek omitted repair fragment ${fragment.id} for ${locale.code}.`)
      }

      if (/[\u3400-\u9fff]/u.test(translatedText)) {
        throw new Error(`DeepSeek left Chinese text in repair fragment ${fragment.id} for ${locale.code}.`)
      }

      translations.set(fragment.id, translatedText)
    }
  }

  return fragments.map(fragment => ({
    ...fragment,
    text: translations.get(fragment.id),
  }))
}

function createTextBatches(fragments) {
  const batches = []
  let batch = []
  let characterCount = 0

  for (const fragment of fragments) {
    if (batch.length && (batch.length >= 12 || characterCount + fragment.text.length > 6000)) {
      batches.push(batch)
      batch = []
      characterCount = 0
    }

    batch.push(fragment)
    characterCount += fragment.text.length
  }

  if (batch.length) {
    batches.push(batch)
  }

  return batches
}

function setValueAtPath(target, path, value) {
  let current = target

  for (const segment of path.slice(0, -1)) {
    current = current[segment]
  }

  current[path.at(-1)] = value
}

function parseJsonContent(content) {
  const normalized = String(content)
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')

  return JSON.parse(normalized)
}

function restoreProtectedValues(sourceValue, translatedValue) {
  if (Array.isArray(sourceValue)) {
    return sourceValue.map((item, index) => restoreProtectedValues(item, translatedValue?.[index]))
  }

  if (sourceValue && typeof sourceValue === 'object') {
    const restored = {}

    for (const [key, sourceChild] of Object.entries(sourceValue)) {
      if (protectedKeys.has(key)) {
        restored[key] = sourceChild
        continue
      }

      restored[key] = restoreProtectedValues(sourceChild, translatedValue?.[key])
    }

    return restored
  }

  return typeof translatedValue === typeof sourceValue ? translatedValue : sourceValue
}

async function readJsonResponse(response, label) {
  const text = await response.text()
  let json

  try {
    json = text ? JSON.parse(text) : {}
  } catch {
    throw new Error(`${label} failed: ${response.status} ${response.statusText}\n${text.slice(0, 500)}`)
  }

  if (!response.ok) {
    throw new Error(`${label} failed: ${response.status} ${response.statusText}\n${JSON.stringify(json).slice(0, 1000)}`)
  }

  return json
}

function findBundleItem(bundle, route, locale) {
  return bundle.items.find(item => item.route === route && item.locale === locale)
}

function upsertBundleItem(bundle, item) {
  const index = bundle.items.findIndex(existingItem => existingItem.route === item.route && existingItem.locale === item.locale)

  if (index === -1) {
    bundle.items.push(item)
    return
  }

  bundle.items[index] = item
}

async function readBundle(file) {
  return JSON.parse(await readFile(file, 'utf8'))
}

async function writeBundle(file, bundle) {
  bundle.generatedAt = new Date().toISOString()
  await mkdir(dirname(file), { recursive: true })
  await writeFile(file, `${JSON.stringify(bundle, null, 2)}\n`, 'utf8')
}
