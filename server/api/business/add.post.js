import { defineEventHandler } from 'h3'
import { readVicastBody, requestVicastApi, requireVicastParam } from '../../utils/vicast-api'

const ADD_BUSINESS_PATH = '/v1/addbusiness'
const optionalBusinessFields = [
  'company_name',
  'phone',
  'business_type',
  'main_region',
  'working_hours',
  'position',
  'budget',
  'website',
]

const trimBusinessText = value => String(value || '').trim()

const createBusinessPayload = (requestBody = {}) => {
  const payload = {
    contact_name: requireVicastParam(requestBody, 'contact_name', 'Missing contact name'),
    email: requireVicastParam(requestBody, 'email', 'Missing email'),
    country: requireVicastParam(requestBody, 'country', 'Missing country'),
    intention: requireVicastParam(requestBody, 'intention', 'Missing cooperation intention'),
  }

  optionalBusinessFields.forEach((field) => {
    const value = trimBusinessText(requestBody[field])

    if (value) {
      payload[field] = value
    }
  })

  return payload
}

export default defineEventHandler((event) => {
  return readVicastBody(event).then((requestBody) => {
    return requestVicastApi(event, {
      path: ADD_BUSINESS_PATH,
      formData: true,
      params: createBusinessPayload(requestBody),
      errorMessage: 'Business cooperation request failed',
    })
  })
})
