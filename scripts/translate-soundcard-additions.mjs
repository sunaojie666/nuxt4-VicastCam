import { locales } from '../i18n/locales.config.js'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'

const STRAPI_URL = (process.env.NUXT_PUBLIC_STRAPI_URL || 'http://192.168.18.100:1337').replace(/\/+$/, '')
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || ''
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || ''
const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL || 'deepseek-v4-flash'
const DEEPSEEK_API_URL = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/chat/completions'
const SOURCE_LOCALE = process.env.SOURCE_LOCALE || 'zh-CN'
const DRY_RUN = process.argv.includes('--dry-run')
const SOURCE_ONLY = process.argv.includes('--source-only')
const FORCE = process.argv.includes('--force')
const OUTPUT_FILE = getArgString('--output')
const ONLY_LOCALES = getArgSet('--locales')

const ITEM_ANCHOR = 'audio-speaker-volume'
const FUNCTION_ANCHOR = 'g_vicastcammic_changeSpeakerVolume'
const EXPECTED_FUNCTION_COUNT = 21

const additions = [
  {
    item: {
      key: 'audio-system-audio-switch',
      title: '开启/关闭系统默认扬声器发送给虚拟麦克风开关',
      functionName: 'g_vicastcammic_startSystemAudioPlaying',
    },
    document: {
      path: 'g_vicastcammic_startSystemAudioPlaying (C/C++)\nVicastcamMicSdk.g_vicastcammic_startSystemAudioPlaying (C#)',
      params: 'tmpFlag：系统声音播放开关，int。\n1：开启——虚拟麦克风增加输入的系统扬声器声音（与物理麦克风、PCM 播放线路是叠加关系，不是替换，三者可同时存在）。\n0：关闭。\n\n与物理麦克风（g_vicastcammic_startVicastcamMic）、PCM 播放（g_vicastcammic_startPcmPlaying）完全独立，无需额外调用其他启动接口。',
      codeSamples: `C:
int ret = g_vicastcammic_startSystemAudioPlaying(1);
// ...采集并推送系统扬声器 PCM...
g_vicastcammic_startSystemAudioPlaying(0);

C++:
int ret = g_vicastcammic_startSystemAudioPlaying(1);
// ...采集并推送系统扬声器 PCM...
g_vicastcammic_startSystemAudioPlaying(0);

C#:
int ret =
    VicastcamMicSdk.g_vicastcammic_startSystemAudioPlaying(1);
// ...采集并推送系统扬声器 PCM...
VicastcamMicSdk.g_vicastcammic_startSystemAudioPlaying(0);`,
      returns: 'VCM_OK (0)：切换成功\nVCM_ERR_STATE (-8)：SDK 状态异常，或 C# 包装器未加载 DLL',
    },
  },
  {
    item: {
      key: 'audio-system-audio-play',
      title: '将系统默认扬声器音频发送给虚拟麦克风',
      functionName: 'g_vicastcammic_playSystemAudioToVicastcamMic',
    },
    document: {
      path: 'g_vicastcammic_playSystemAudioToVicastcamMic (C/C++)\nVicastcamMicSdk.g_vicastcammic_playSystemAudioToVicastcamMic (C#)',
      params: 'tmpAudioData：待发送的系统扬声器 PCM 数据（由客户端自行采集转换）。\nC/C++ 类型：unsigned char*\nC# 类型：byte[]\n\nbytes：tmpAudioData 的有效字节数，int。\n\n音频格式固定为 48000 Hz / 16-bit / 双声道；bytes 中不满一个立体声帧（4 字节）的尾部字节会被丢弃。可连续多次调用分段推送。没有独立的音量/静音接口，需由客户端处理好之后再送入。',
      codeSamples: `C:
int ret = g_vicastcammic_playSystemAudioToVicastcamMic(
    pcmBytes, pcmBytesLen);

C++:
int ret = g_vicastcammic_playSystemAudioToVicastcamMic(
    pcmBytes, pcmBytesLen);

C#:
int ret =
    VicastcamMicSdk.g_vicastcammic_playSystemAudioToVicastcamMic(
        pcmBytes, pcmBytes.Length);`,
      returns: 'VCM_OK (0)：数据已写入缓冲区\nVCM_ERR_INVALID_ARG (-2)：tmpAudioData 为空、bytes <= 0，或去掉不完整帧后无数据\nVCM_ERR_STATE (-8)：SDK 状态异常',
    },
  },
]

const protectedKeys = new Set(['key', 'functionName', 'path'])
const technicalTokens = [
  'g_vicastcammic_startSystemAudioPlaying',
  'g_vicastcammic_playSystemAudioToVicastcamMic',
  'g_vicastcammic_startVicastcamMic',
  'g_vicastcammic_startPcmPlaying',
  'VicastcamMicSdk',
  'tmpFlag',
  'tmpAudioData',
  'bytes',
  'pcmBytes',
  'pcmBytesLen',
  'VCM_OK',
  'VCM_ERR_INVALID_ARG',
  'VCM_ERR_STATE',
]

const targetLocales = SOURCE_ONLY
  ? []
  : locales
      .filter(locale => locale.code !== SOURCE_LOCALE)
      .filter(locale => !ONLY_LOCALES || ONLY_LOCALES.has(locale.code))

const outputBundle = OUTPUT_FILE ? await readOutputBundle(OUTPUT_FILE) : null

if (!DRY_RUN && targetLocales.length && !DEEPSEEK_API_KEY) {
  throw new Error('Missing DEEPSEEK_API_KEY. Set it before translating soundcard additions.')
}

const sourceEntry = await fetchSingleEntry(SOURCE_LOCALE)

if (!sourceEntry?.data) {
  throw new Error(`No ${SOURCE_LOCALE} soundcard source data found.`)
}

const mergedSourceData = mergeAdditions(sourceEntry.data, additions)

if (DRY_RUN) {
  printStatus(SOURCE_LOCALE, sourceEntry.data, 'source')
} else if (outputBundle) {
  upsertBundleItem(outputBundle, createBundleItem(SOURCE_LOCALE, sourceEntry.documentId, mergedSourceData))
  await writeOutputBundle()
  console.log(`${SOURCE_LOCALE}: prepared ${EXPECTED_FUNCTION_COUNT} soundcard functions`)
} else {
  await saveEntry(SOURCE_LOCALE, sourceEntry.documentId, mergedSourceData)
  console.log(`${SOURCE_LOCALE}: saved ${EXPECTED_FUNCTION_COUNT} soundcard functions`)
}

for (const locale of targetLocales) {
  const existingEntry = await fetchSingleEntry(locale.code)

  if (!existingEntry?.data) {
    throw new Error(`No existing soundcard entry found for ${locale.code}.`)
  }

  if (!FORCE && outputBundle?.items.some(item => item.locale === locale.code)) {
    console.log(`${locale.code}: cached, skipped`)
    continue
  }

  if (DRY_RUN) {
    printStatus(locale.code, existingEntry.data, 'translation')
    continue
  }

  if (!FORCE && hasCompleteAdditions(existingEntry.data)) {
    if (outputBundle) {
      upsertBundleItem(outputBundle, createBundleItem(locale.code, existingEntry.documentId, existingEntry.data))
      await writeOutputBundle()
    }

    console.log(`${locale.code}: already complete, skipped`)
    continue
  }

  const translatedAdditions = await translateAdditions(locale)
  const mergedData = mergeAdditions(existingEntry.data, translatedAdditions)

  if (outputBundle) {
    upsertBundleItem(outputBundle, createBundleItem(locale.code, existingEntry.documentId, mergedData))
    await writeOutputBundle()
    console.log(`${locale.code}: translated 2 additions`)
  } else {
    await saveEntry(locale.code, existingEntry.documentId, mergedData)
    console.log(`${locale.code}: translated and saved 2 additions`)
  }
}

if (outputBundle) {
  await writeOutputBundle()
  console.log(`Wrote ${outputBundle.items.length} locale entries to ${OUTPUT_FILE}`)
}

function getArgSet(name) {
  const value = getArgString(name)
  return value ? new Set(value.split(',').map(item => item.trim()).filter(Boolean)) : null
}

function getArgString(name) {
  const prefix = `${name}=`
  return process.argv.find(arg => arg.startsWith(prefix))?.slice(prefix.length) || ''
}

function createBundleItem(locale, documentId, data) {
  return { locale, documentId, data }
}

function upsertBundleItem(bundle, item) {
  const index = bundle.items.findIndex(existing => existing.locale === item.locale)

  if (index === -1) {
    bundle.items.push(item)
  } else {
    bundle.items[index] = item
  }
}

async function readOutputBundle(file) {
  try {
    const parsed = JSON.parse(await readFile(file, 'utf8'))
    return {
      generatedAt: parsed.generatedAt || new Date().toISOString(),
      sourceLocale: SOURCE_LOCALE,
      items: Array.isArray(parsed.items) ? parsed.items : [],
    }
  } catch (error) {
    if (error?.code !== 'ENOENT') {
      throw error
    }

    return {
      generatedAt: new Date().toISOString(),
      sourceLocale: SOURCE_LOCALE,
      items: [],
    }
  }
}

async function writeOutputBundle() {
  outputBundle.generatedAt = new Date().toISOString()
  await mkdir(dirname(OUTPUT_FILE), { recursive: true })
  await writeFile(OUTPUT_FILE, `${JSON.stringify(outputBundle, null, 2)}\n`, 'utf8')
}

async function fetchSingleEntry(locale) {
  const params = new URLSearchParams({ locale, populate: '*' })
  const response = await fetch(`${STRAPI_URL}/api/soundcards?${params}`)
  const json = await readJsonResponse(response, `fetch soundcards ${locale}`)
  return Array.isArray(json.data) ? json.data[0] : json.data
}

async function saveEntry(locale, documentId, data) {
  const method = documentId ? 'PUT' : 'POST'
  const path = documentId ? `soundcards/${documentId}` : 'soundcards'
  const params = new URLSearchParams({ locale, status: 'published' })
  const headers = { 'content-type': 'application/json' }

  if (STRAPI_API_TOKEN) {
    headers.authorization = `Bearer ${STRAPI_API_TOKEN}`
  }

  const response = await fetch(`${STRAPI_URL}/api/${path}?${params}`, {
    method,
    headers,
    body: JSON.stringify({ data }),
  })

  const json = await readJsonResponse(response, `${method} soundcards ${locale}`)
  return json.data
}

async function translateAdditions(locale) {
  const sourcePayload = additionsToPayload(additions)
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
            'You are a professional SDK documentation localization translator.',
            'Translate Simplified Chinese JSON content into the requested locale.',
            'Return only valid JSON with exactly the same schema, array order, and object keys.',
            'Do not translate values for fields named key, functionName, or path.',
            'Preserve C, C++, and C# section labels, line breaks, code formatting, API names, identifiers, constants, types, numeric values, and VicastCam brand names exactly.',
            'Translate natural-language comments inside code samples.',
            'Use concise technical documentation wording suitable for production publication.',
          ].join(' '),
        },
        {
          role: 'user',
          content: JSON.stringify({
            targetLocale: locale.code,
            targetLanguage: locale.name || locale.language || locale.code,
            data: sourcePayload,
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
  const translatedPayload = restoreProtectedValues(sourcePayload, parsed.data || parsed)
  validateTranslatedPayload(sourcePayload, translatedPayload, locale)
  return payloadToAdditions(translatedPayload)
}

function additionsToPayload(entries) {
  return {
    items: entries.map(entry => entry.item),
    functions: Object.fromEntries(entries.map(entry => [entry.item.functionName, entry.document])),
  }
}

function payloadToAdditions(payload) {
  return payload.items.map(item => ({
    item,
    document: payload.functions[item.functionName],
  }))
}

function mergeAdditions(data, entries) {
  const mergedData = structuredClone(data)
  const module = mergedData?.module

  if (!module || module.key !== 'audio') {
    throw new Error('Soundcard data does not contain module.key="audio".')
  }

  module.items = insertAfter(
    Array.isArray(module.items) ? module.items : [],
    entries.map(entry => entry.item),
    ITEM_ANCHOR,
    item => item.key,
  )
  module.documents ||= {}
  module.documents.functions = insertPropertiesAfter(
    module.documents.functions || {},
    Object.fromEntries(entries.map(entry => [entry.item.functionName, entry.document])),
    FUNCTION_ANCHOR,
  )
  module.count = updateCount(module.count)
  return mergedData
}

function insertAfter(existingItems, newItems, anchorKey, getKey) {
  const newKeys = new Set(newItems.map(getKey))
  const result = existingItems.filter(item => !newKeys.has(getKey(item)))
  const anchorIndex = result.findIndex(item => getKey(item) === anchorKey)
  result.splice(anchorIndex >= 0 ? anchorIndex + 1 : result.length, 0, ...newItems)
  return result
}

function insertPropertiesAfter(existingObject, newProperties, anchorKey) {
  const newKeys = new Set(Object.keys(newProperties))
  const result = {}
  let inserted = false

  for (const [key, value] of Object.entries(existingObject)) {
    if (newKeys.has(key)) {
      continue
    }

    result[key] = value

    if (key === anchorKey) {
      Object.assign(result, newProperties)
      inserted = true
    }
  }

  if (!inserted) {
    Object.assign(result, newProperties)
  }

  return result
}

function updateCount(value) {
  const current = String(value || '')
  return /\d+/u.test(current)
    ? current.replace(/\d+/u, String(EXPECTED_FUNCTION_COUNT))
    : String(EXPECTED_FUNCTION_COUNT)
}

function hasCompleteAdditions(data) {
  const module = data?.module
  const itemKeys = new Set((module?.items || []).map(item => item.key))
  const functionKeys = new Set(Object.keys(module?.documents?.functions || {}))
  const count = Number.parseInt(String(module?.count || ''), 10)

  return count === EXPECTED_FUNCTION_COUNT && additions.every(entry => (
    itemKeys.has(entry.item.key) && functionKeys.has(entry.item.functionName)
  ))
}

function printStatus(locale, data, kind) {
  const module = data?.module || {}
  const itemKeys = new Set((module.items || []).map(item => item.key))
  const functionKeys = new Set(Object.keys(module.documents?.functions || {}))
  const present = additions.filter(entry => (
    itemKeys.has(entry.item.key) && functionKeys.has(entry.item.functionName)
  )).length
  const functionCount = functionKeys.size

  console.log(
    `${locale}: ${kind}, count=${module.count || '-'}, functions=${functionCount}, additions=${present}/2 -> ${EXPECTED_FUNCTION_COUNT}`,
  )
}

function validateTranslatedPayload(sourcePayload, translatedPayload, locale) {
  if (!Array.isArray(translatedPayload?.items) || translatedPayload.items.length !== additions.length) {
    throw new Error(`DeepSeek returned an invalid items array for ${locale.code}.`)
  }

  for (const sourceItem of sourcePayload.items) {
    const translatedItem = translatedPayload.items.find(item => item.key === sourceItem.key)

    if (!translatedItem?.title || translatedItem.functionName !== sourceItem.functionName) {
      throw new Error(`DeepSeek returned an invalid item ${sourceItem.key} for ${locale.code}.`)
    }
  }

  for (const [functionName, sourceDocument] of Object.entries(sourcePayload.functions)) {
    const translatedDocument = translatedPayload.functions?.[functionName]

    if (!translatedDocument || !['path', 'params', 'codeSamples', 'returns'].every(key => typeof translatedDocument[key] === 'string')) {
      throw new Error(`DeepSeek returned an invalid document ${functionName} for ${locale.code}.`)
    }

    for (const label of ['C:\n', 'C++:\n', 'C#:\n']) {
      if (!translatedDocument.codeSamples.includes(label)) {
        throw new Error(`DeepSeek changed the ${label.trim()} code section for ${locale.code}.`)
      }
    }

    const sourceText = JSON.stringify(sourceDocument)
    const translatedText = JSON.stringify(translatedDocument)

    for (const token of technicalTokens) {
      if (sourceText.includes(token) && !translatedText.includes(token)) {
        throw new Error(`DeepSeek changed technical token ${token} for ${locale.code}.`)
      }
    }
  }

  if (locale.code !== 'zh-TW' && locale.code !== 'ja') {
    const naturalLanguageText = [
      ...translatedPayload.items.map(item => item.title),
      ...Object.values(translatedPayload.functions).flatMap(document => [
        document.params,
        document.codeSamples,
        document.returns,
      ]),
    ].join('\n')

    if (/[\u3400-\u9fff]/u.test(naturalLanguageText)) {
      throw new Error(`DeepSeek left Chinese text in ${locale.code}.`)
    }
  }
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
