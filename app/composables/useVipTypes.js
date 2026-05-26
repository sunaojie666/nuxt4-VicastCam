import { getVipTypes } from '../api/request/auth'

const defaultBenefit = '普通会员特权'
const badgeImages = [
  '/images/profile/month.png',
  '/images/profile/year.png',
  '/images/profile/gold.png',
]
const themes = ['theme-cyan', 'theme-blue', 'theme-violet']
const homePriceImages = {
  '9.99': '/images/pricing/price-9-99.png',
  '69.99': '/images/pricing/price-69-99.png',
  '99.99': '/images/pricing/price-99-99.png',
}

let vipTypesRequest = null

const fallbackPlans = [
  {
    id: 'fallback-month',
    name: '月卡',
    description: '适合想体验软件功能的用户',
    subtitle: '低门槛随心用，全功能按月畅享',
    price: '¥9.99',
    priceImage: '/images/pricing/price-9-99.png',
    originalPrice: '',
    unit: '/月',
    cta: '购买',
    badgeText: '',
    featured: false,
    delay: 0,
    badgeImage: badgeImages[0],
    theme: themes[0],
    benefits: Array.from({ length: 5 }, () => defaultBenefit),
  },
  {
    id: 'fallback-year',
    name: '年卡',
    description: '适合想体验软件功能的用户',
    subtitle: '超值特惠，性价比拉满更省钱',
    price: '¥69.99',
    priceImage: '/images/pricing/price-69-99.png',
    originalPrice: '',
    unit: '/年',
    cta: '购买',
    badgeText: '最受欢迎',
    featured: true,
    delay: 120,
    badgeImage: badgeImages[1],
    theme: themes[1],
    benefits: Array.from({ length: 5 }, () => defaultBenefit),
  },
  {
    id: 'fallback-life',
    name: '终身卡',
    description: '适合想体验软件功能的用户',
    subtitle: '一次付费永久畅用，免费更新',
    price: '¥99.99',
    priceImage: '/images/pricing/price-99-99.png',
    originalPrice: '',
    unit: '',
    cta: '购买',
    badgeText: '',
    featured: false,
    delay: 240,
    badgeImage: badgeImages[2],
    theme: themes[2],
    benefits: Array.from({ length: 5 }, () => defaultBenefit),
  },
]

const normalizeText = (value, fallback = '') => {
  const text = String(value || '').trim()

  return text || fallback
}

const formatPrice = (value) => {
  const text = normalizeText(value)

  if (!text) {
    return '¥0'
  }

  if (/^[¥￥$]/.test(text)) {
    return text
  }

  return `¥${text}`
}

const normalizePriceKey = (value) => {
  const text = normalizeText(value).replace(/[¥￥$]/g, '').trim()
  const numberValue = Number.parseFloat(text)

  if (!Number.isFinite(numberValue)) {
    return text
  }

  return String(numberValue)
}

const resolveHomePriceImage = (value) => {
  return homePriceImages[normalizePriceKey(value)] || ''
}

const createUnitText = (term = {}) => {
  const note = normalizeText(term.note)

  if (!note) {
    return ''
  }

  if (note.includes('个月')) {
    return '/月'
  }

  if (note.includes('年')) {
    return '/年'
  }

  return note
}

const createBenefits = (group = {}, term = {}) => {
  const benefits = [
    term.note_ios,
    term.note,
    group.description,
    group.title,
  ].map(item => normalizeText(item)).filter(Boolean)

  return [...new Set(benefits.concat(Array.from({ length: 5 }, () => defaultBenefit)))].slice(0, 5)
}

const resolveVipTypeData = (response) => {
  if (Array.isArray(response?.data)) {
    return response.data
  }

  if (Array.isArray(response?.data?.data)) {
    return response.data.data
  }

  return []
}

const mapVipTypesToPlans = (vipTypes = []) => {
  const plans = []

  vipTypes.forEach((group) => {
    const terms = Array.isArray(group?.term) ? group.term : []

    terms.forEach((term) => {
      if (term?.isAvailable === false) {
        return
      }

      const index = plans.length
      const salePrice = term.salePrice || term.price
      const featured = index === 1

      plans.push({
        id: normalizeText(term.productId, `vip-plan-${index}`),
        name: normalizeText(term.title, normalizeText(group?.title, `会员套餐 ${index + 1}`)),
        description: normalizeText(group?.description || term.note_ios || term.note, '适合想体验软件功能的用户'),
        subtitle: normalizeText(term.note_ios || group?.description || term.note, '普通会员特权'),
        price: formatPrice(salePrice),
        priceImage: resolveHomePriceImage(salePrice),
        originalPrice: normalizeText(term.desc),
        unit: createUnitText(term),
        cta: normalizeText(term.buttonTitle, '购买'),
        badgeText: normalizeText(term.flag || (featured ? '最受欢迎' : '')),
        featured,
        delay: index * 120,
        badgeImage: badgeImages[index] || badgeImages[badgeImages.length - 1],
        theme: themes[index] || themes[themes.length - 1],
        benefits: createBenefits(group, term),
      })
    })
  })

  return plans.slice(0, 3)
}

export const useVipTypes = () => {
  const vipPlans = useState('vip-plans', () => fallbackPlans)
  const isVipTypesLoaded = useState('vip-types-loaded', () => false)

  const loadVipTypes = () => {
    if (isVipTypesLoaded.value) {
      return Promise.resolve(vipPlans.value)
    }

    if (vipTypesRequest) {
      return vipTypesRequest
    }

    vipTypesRequest = getVipTypes().then((response) => {
      const plans = mapVipTypesToPlans(resolveVipTypeData(response))

      if (plans.length) {
        vipPlans.value = plans
      }

      isVipTypesLoaded.value = true
      return vipPlans.value
    }).catch(() => {
      return vipPlans.value
    }).finally(() => {
      vipTypesRequest = null
    })

    return vipTypesRequest
  }

  return {
    vipPlans,
    loadVipTypes,
  }
}
