import { createRequest } from './index'

const businessRequest = createRequest({
  baseURL: '/api/business',
})

const trimBusinessText = value => String(value || '').trim()

export const getBusinessWechatQrcode = () => {
  return businessRequest.get('/query-wechat-qrcode', {
    skipAuthExpiredRedirect: true,
    skipGlobalLoading: true,
    responseScope: 'general',
  })
}

export const addBusinessCooperation = (payload = {}) => {
  return businessRequest.post('/add', {
    contact_name: trimBusinessText(payload.contact_name || payload.contactName),
    email: trimBusinessText(payload.email),
    country: trimBusinessText(payload.country),
    intention: trimBusinessText(payload.intention || payload.cooperationIntent),
    company_name: trimBusinessText(payload.company_name || payload.companyName),
    phone: trimBusinessText(payload.phone),
    business_type: trimBusinessText(payload.business_type || payload.businessType),
    main_region: trimBusinessText(payload.main_region || payload.region),
    working_hours: trimBusinessText(payload.working_hours || payload.workingHours),
    position: trimBusinessText(payload.position),
    budget: trimBusinessText(payload.budget),
    website: trimBusinessText(payload.website),
  }, {
    skipAuthExpiredRedirect: true,
    responseScope: 'general',
  })
}
