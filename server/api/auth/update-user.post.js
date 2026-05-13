import { defineEventHandler, readMultipartFormData } from 'h3'
import { requestVicastApi, requireVicastParam } from '../../utils/vicast-api'

const UPDATE_USER_PATH = '/v1/UpdateUser'
const updateUserFields = new Set([
  'user_id',
  'nickname',
  'intro',
  'industry',
  'gender',
  'area',
  'password',
  'avatar',
  'mobile',
  'email',
])

const createTextValue = (part) => {
  return Buffer.from(part?.data || []).toString()
}

const createFileValue = (part) => {
  if (!part?.filename || !part?.data?.length) {
    return null
  }

  return {
    data: part.data,
    filename: part.filename,
    type: part.type || 'application/octet-stream',
  }
}

const readUpdateUserParams = (event) => {
  return readMultipartFormData(event).then((parts) => {
    const params = {}

    ;(parts || []).forEach(part => {
      if (!part?.name || !updateUserFields.has(part.name)) {
        return
      }

      if (part.name === 'avatar') {
        const file = createFileValue(part)

        if (file) {
          params.avatar = file
        }
        return
      }

      params[part.name] = createTextValue(part)
    })

    params.user_id = requireVicastParam(params, 'user_id', '用户信息不存在，请重新登录')

    return params
  })
}

// 用户资料修改代理。前端提交 multipart/form-data，服务端继续转发给 VicastCam 业务接口。
export default defineEventHandler((event) => {
  return readUpdateUserParams(event).then((params) => {
    return requestVicastApi(event, {
      path: UPDATE_USER_PATH,
      formData: true,
      params,
      errorMessage: '用户资料修改失败',
    })
  })
})
