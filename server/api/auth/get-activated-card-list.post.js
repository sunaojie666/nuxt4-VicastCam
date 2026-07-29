import { defineEventHandler } from 'h3'
import { readVicastBody, requestVicastApi, requireVicastParam } from '../../utils/vicast-api'

const GET_ACTIVATED_CARD_LIST_PATH = '/v1/GetActivatedCardList'

const createPositiveInteger = (value, fallback) => {
  const numberValue = Number.parseInt(value, 10)

  if (Number.isFinite(numberValue) && numberValue > 0) {
    return numberValue
  }

  return fallback
}

// Proxy activated card records. Authorization is forwarded via header and business params are sent as multipart/form-data.
export default defineEventHandler((event) => {
  return readVicastBody(event).then((requestBody) => {
    const user_id = requireVicastParam(requestBody, 'user_id', 'User information is missing, please sign in again')

    return requestVicastApi(event, {
      path: GET_ACTIVATED_CARD_LIST_PATH,
      formData: true,
      auth: true,
      params: {
        user_id,
        page: createPositiveInteger(requestBody.page, 1),
        limit: createPositiveInteger(requestBody.limit, 10),
      },
      errorMessage: 'Failed to load activated card records',
    })
  })
})
