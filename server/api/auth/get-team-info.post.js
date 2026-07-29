import { defineEventHandler } from 'h3'
import { readVicastBody, requestVicastApi, requireVicastParam } from '../../utils/vicast-api'

const GET_TEAM_INFO_PATH = '/v1/GetTeamInfo'

// Proxy team summary counts. Only user_id is forwarded to VicastCam.
export default defineEventHandler((event) => {
  return readVicastBody(event).then((requestBody) => {
    const user_id = requireVicastParam(requestBody, 'user_id', 'User information is missing, please sign in again')

    return requestVicastApi(event, {
      path: GET_TEAM_INFO_PATH,
      method: 'GET',
      auth: true,
      query: {
        user_id,
      },
      errorMessage: 'Failed to load team info',
    })
  })
})
