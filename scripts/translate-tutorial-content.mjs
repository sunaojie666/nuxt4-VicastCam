import { locales } from '../i18n/locales.config.js'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'

const ENV_FILES = [
  ...getArgValues('--env-file'),
  '.env.local',
  '.env.strapi.local',
  '.env.soundcard.local',
]

await loadEnvFiles(ENV_FILES)

const STRAPI_URL = (process.env.NUXT_PUBLIC_STRAPI_URL || 'http://192.168.18.100:1337').replace(/\/+$/, '')
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || ''
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || ''
const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL || 'deepseek-v4-flash'
const DEEPSEEK_API_URL = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/chat/completions'
const SOURCE_LOCALE = process.env.SOURCE_LOCALE || 'zh-CN'
const DRY_RUN = process.argv.includes('--dry-run')
const REPAIR_HAN = process.argv.includes('--repair-han')
const FORCE = process.argv.includes('--force')
const OUTPUT_FILE = getArgString('--output')
const INPUT_FILE = getArgString('--input')
const ONLY_LOCALES = getArgSet('--locales')
const ONLY_TYPES = getArgSet('--types')

const contentTypes = [
  {
    route: 'tutorials',
    name: 'Home Tutorial Section',
    mode: 'single',
    fields: ['data'],
  },
  {
    route: 'cards',
    name: 'Home Tutorial Cards',
    mode: 'collection',
    fields: ['title', 'tag1', 'tag2'],
  },
  {
    route: 'videos',
    name: 'Video Tutorial Page',
    mode: 'single',
    fields: ['data', 'videoBox'],
  },
]

const protectedKeys = new Set([
  'id',
  'documentId',
  'locale',
  'createdAt',
  'updatedAt',
  'publishedAt',
  'key',
  'icon',
  'video',
  'poster',
  'coverImg',
  'lessonId',
  'index',
  'url',
  'href',
  'src',
  'path',
  'mime',
  'ext',
  'hash',
  'formats',
  'provider',
  'provider_metadata',
])

const targetLocales = locales
  .filter(locale => locale.code !== SOURCE_LOCALE)
  .filter(locale => !ONLY_LOCALES || ONLY_LOCALES.has(locale.code))

const targetTypes = contentTypes
  .filter(type => !ONLY_TYPES || ONLY_TYPES.has(type.route))

const outputBundle = INPUT_FILE ? await readBundle(INPUT_FILE) : {
  generatedAt: new Date().toISOString(),
  sourceLocale: SOURCE_LOCALE,
  strapiUrl: STRAPI_URL,
  items: [],
}

if (!targetLocales.length) {
  throw new Error('No target locales matched.')
}

if (!targetTypes.length) {
  throw new Error('No tutorial content types matched.')
}

if (!DRY_RUN && !OUTPUT_FILE && !STRAPI_API_TOKEN) {
  throw new Error('Missing STRAPI_API_TOKEN. Set it before writing translated tutorial content back to Strapi, or pass --output=path.')
}

if (!DRY_RUN && (!INPUT_FILE || REPAIR_HAN) && !DEEPSEEK_API_KEY) {
  throw new Error('Missing DEEPSEEK_API_KEY. Set it before running translation.')
}

for (const type of targetTypes) {
  console.log(`\n${type.name} (${type.route})`)

  if (type.mode === 'collection') {
    await translateCollection(type)
  } else {
    await translateSingle(type)
  }
}

if (OUTPUT_FILE) {
  await writeBundle(OUTPUT_FILE, outputBundle)
  console.log(`\nWrote ${outputBundle.items.length} item(s) to ${OUTPUT_FILE}`)
}

async function translateSingle(type) {
  const sourceEntry = await fetchSingleEntry(type.route, SOURCE_LOCALE)
  const sourceContent = getTranslatableContent(sourceEntry, type)
  const sourceField = getContentField(sourceEntry, type)

  if (!sourceEntry?.documentId || !sourceContent) {
    throw new Error(`No ${SOURCE_LOCALE} source entry found for ${type.route}.`)
  }

  for (const locale of targetLocales) {
    const existingEntry = await fetchSingleEntry(type.route, locale.code)
    const cachedItem = findBundleItem(outputBundle, type.route, locale.code)
    const status = existingEntry?.documentId ? `exists:${existingEntry.documentId}` : 'missing'

    if (DRY_RUN) {
      console.log(`- ${locale.code}: ${status}, sourceField=${sourceField || 'entry'}`)
      continue
    }

    if (!FORCE && cachedItem?.data && OUTPUT_FILE) {
      console.log(`- ${locale.code}: cached`)
      continue
    }

    const translatedContent = cachedItem?.data
      ? REPAIR_HAN
        ? await repairHanFragments(sourceContent, cachedItem.data, locale)
        : cachedItem.data
      : restoreProtectedValues(sourceContent, await translateData(sourceContent, locale, type))

    upsertBundleItem(outputBundle, {
      route: type.route,
      name: type.name,
      locale: locale.code,
      language: locale.language,
      documentId: existingEntry?.documentId || cachedItem?.documentId || '',
      sourceDocumentId: sourceEntry.documentId,
      field: sourceField,
      data: translatedContent,
    })

    if (OUTPUT_FILE) {
      await writeBundle(OUTPUT_FILE, outputBundle)
      console.log(`- ${locale.code}: translated`)
      continue
    }

    const payload = createSavePayload(existingEntry, type, translatedContent, sourceField)
    const savedEntry = await saveEntry(type.route, locale.code, existingEntry?.documentId, payload)
    console.log(`- ${locale.code}: saved ${savedEntry?.documentId || existingEntry?.documentId || 'new entry'}`)
  }
}

async function translateCollection(type) {
  const sourceEntries = await fetchCollectionEntries(type.route, SOURCE_LOCALE)

  if (!sourceEntries.length) {
    throw new Error(`No ${SOURCE_LOCALE} source entries found for ${type.route}.`)
  }

  const sourceItems = sourceEntries.map((entry, index) => ({
    documentId: entry.documentId,
    key: createCollectionItemKey(entry, index),
    data: pickFields(entry, type.fields),
  }))

  for (const locale of targetLocales) {
    const existingEntries = await fetchCollectionEntries(type.route, locale.code)
    const existingByKey = new Map(existingEntries.map((entry, index) => [createCollectionItemKey(entry, index), entry]))
    const cachedItem = findBundleItem(outputBundle, type.route, locale.code)

    if (DRY_RUN) {
      console.log(`- ${locale.code}: ${existingEntries.length}/${sourceEntries.length} card(s) exist`)
      continue
    }

    if (!FORCE && cachedItem?.data && OUTPUT_FILE) {
      console.log(`- ${locale.code}: cached`)
      continue
    }

    const translatedItems = cachedItem?.data
      ? REPAIR_HAN
        ? await repairHanFragments(sourceItems, cachedItem.data, locale)
        : cachedItem.data
      : restoreProtectedValues(sourceItems, await translateData(sourceItems, locale, type))

    upsertBundleItem(outputBundle, {
      route: type.route,
      name: type.name,
      locale: locale.code,
      language: locale.language,
      data: translatedItems,
    })

    if (OUTPUT_FILE) {
      await writeBundle(OUTPUT_FILE, outputBundle)
      console.log(`- ${locale.code}: translated ${translatedItems.length} card(s)`)
      continue
    }

    for (const item of translatedItems) {
      const existingEntry = existingByKey.get(item.key)
      const payload = {
        ...pickFields(existingEntry || {}, type.fields),
        ...item.data,
      }
      const savedEntry = await saveEntry(type.route, locale.code, existingEntry?.documentId, payload)
      console.log(`- ${locale.code}: saved card ${item.key} (${savedEntry?.documentId || existingEntry?.documentId || 'new entry'})`)
    }
  }
}

function getArgSet(name) {
  const value = getArgString(name)
  return value ? new Set(value.split(',').map(item => item.trim()).filter(Boolean)) : null
}

function getArgValues(name) {
  const prefix = `${name}=`
  return process.argv
    .filter(arg => arg.startsWith(prefix))
    .map(arg => arg.slice(prefix.length))
    .filter(Boolean)
}

function getArgString(name) {
  const prefix = `${name}=`
  return process.argv.find(arg => arg.startsWith(prefix))?.slice(prefix.length) || ''
}

async function loadEnvFiles(files) {
  const loadedFiles = new Set()

  for (const file of files) {
    if (!file || loadedFiles.has(file)) {
      continue
    }

    loadedFiles.add(file)

    let content = ''

    try {
      content = await readFile(file, 'utf8')
    } catch (error) {
      if (error?.code !== 'ENOENT') {
        throw error
      }

      continue
    }

    for (const line of content.split(/\r?\n/u)) {
      const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)?\s*$/u)

      if (!match || process.env[match[1]]) {
        continue
      }

      process.env[match[1]] = parseEnvValue(match[2] || '')
    }
  }
}

function parseEnvValue(value) {
  const trimmed = value.trim()
  const quote = trimmed[0]

  if ((quote === '"' || quote === "'") && trimmed.endsWith(quote)) {
    return trimmed.slice(1, -1)
  }

  return trimmed.replace(/\s+#.*$/u, '')
}

async function fetchSingleEntry(route, locale) {
  const entries = await fetchCollectionEntries(route, locale)
  return entries[0] || null
}

async function fetchCollectionEntries(route, locale) {
  const params = new URLSearchParams({ locale, populate: '*' })
  const response = await fetch(`${STRAPI_URL}/api/${route}?${params}`)
  const json = await readJsonResponse(response, `fetch ${route} ${locale}`)
  const data = Array.isArray(json.data) ? json.data : json.data ? [json.data] : []
  return data.map(normalizeEntry)
}

function normalizeEntry(entry = {}) {
  return {
    ...entry,
    ...(entry.attributes || {}),
  }
}

function getTranslatableContent(entry, type) {
  const field = getContentField(entry, type)
  return field ? entry[field] : omitMetaFields(entry)
}

function getContentField(entry, type) {
  return type.fields.find(field => entry && typeof entry[field] === 'object' && entry[field] !== null) || ''
}

function createSavePayload(existingEntry, type, translatedContent, sourceField) {
  if (sourceField) {
    return { [sourceField]: translatedContent }
  }

  return {
    ...omitMetaFields(existingEntry || {}),
    ...translatedContent,
  }
}

function omitMetaFields(entry = {}) {
  const result = {}

  for (const [key, value] of Object.entries(entry)) {
    if (!protectedKeys.has(key) && key !== 'attributes') {
      result[key] = value
    }
  }

  return result
}

function pickFields(entry = {}, fields = []) {
  return Object.fromEntries(fields.map(field => [field, entry[field] || '']))
}

function createCollectionItemKey(entry = {}, index = 0) {
  return String(entry.lessonId || entry.key || `item-${index + 1}`)
}

async function saveEntry(route, locale, documentId, data) {
  const method = documentId ? 'PUT' : 'POST'
  const path = documentId ? `${route}/${documentId}` : route
  const params = new URLSearchParams({ locale, status: 'published' })
  const response = await fetch(`${STRAPI_URL}/api/${path}?${params}`, {
    method,
    headers: {
      authorization: `Bearer ${STRAPI_API_TOKEN}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ data }),
  })

  const json = await readJsonResponse(response, `${method} ${route} ${locale}`)
  return json.data
}

async function translateData(sourceData, locale, type) {
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
            'You are a professional product localization translator for a live-streaming virtual camera website.',
            'Translate Simplified Chinese JSON content into the requested locale.',
            'Return only valid JSON with exactly the same schema, array order, and object keys.',
            'Do not translate values for protected identifiers, media fields, URLs, file paths, lesson ids, video paths, icon names, numbers, or Strapi metadata.',
            'Keep VicastCam, platform names, product names, technical identifiers, and route/query fragments unchanged.',
            'Use concise, natural wording suitable for tutorial cards, tutorial navigation, and video lesson descriptions.',
          ].join(' '),
        },
        {
          role: 'user',
          content: JSON.stringify({
            contentType: type.route,
            targetLocale: locale.code,
            targetLanguage: locale.name || locale.language || locale.code,
            data: sourceData,
          }),
        },
      ],
    }),
  })

  const json = await readJsonResponse(response, `DeepSeek translate ${type.route} ${locale.code}`)
  const content = json.choices?.[0]?.message?.content

  if (!content) {
    throw new Error(`DeepSeek returned empty content for ${type.route} ${locale.code}.`)
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
            'Translate every Simplified Chinese string into the requested locale.',
            'Return only valid JSON in the form {"translations":{"id":"translated text"}}.',
            'Keep every input id exactly once and do not add any other keys.',
            'Do not leave Chinese characters in the translation, except for zh-TW or Japanese text.',
            'Keep VicastCam, URLs, file paths, product names, and technical identifiers unchanged.',
          ].join(' '),
        },
        {
          role: 'user',
          content: JSON.stringify({
            targetLocale: locale.code,
            targetLanguage: locale.name || locale.language || locale.code,
            translations: Object.fromEntries(fragments.map(fragment => [fragment.id, fragment.text])),
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

  const translatedTexts = parseJsonContent(content).translations || parseJsonContent(content)
  return fragments.map(fragment => {
    const text = translatedTexts[fragment.id]

    if (typeof text !== 'string' || !text.trim()) {
      throw new Error(`DeepSeek omitted repair fragment ${fragment.id} for ${locale.code}.`)
    }

    if (locale.code !== 'zh-TW' && locale.code !== 'ja' && /[\u3400-\u9fff]/u.test(text)) {
      throw new Error(`DeepSeek left Chinese text in repair fragment ${fragment.id} for ${locale.code}.`)
    }

    return { ...fragment, text }
  })
}

function setValueAtPath(target, path, value) {
  let current = target

  for (const segment of path.slice(0, -1)) {
    current = current[segment]
  }

  current[path.at(-1)] = value
}

function restoreProtectedValues(sourceValue, translatedValue) {
  if (Array.isArray(sourceValue)) {
    return sourceValue.map((item, index) => restoreProtectedValues(item, translatedValue?.[index]))
  }

  if (sourceValue && typeof sourceValue === 'object') {
    const restored = {}

    for (const [key, sourceChild] of Object.entries(sourceValue)) {
      restored[key] = protectedKeys.has(key)
        ? sourceChild
        : restoreProtectedValues(sourceChild, translatedValue?.[key])
    }

    return restored
  }

  return typeof translatedValue === typeof sourceValue ? translatedValue : sourceValue
}

function parseJsonContent(content) {
  const normalized = String(content)
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')

  return JSON.parse(normalized)
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
