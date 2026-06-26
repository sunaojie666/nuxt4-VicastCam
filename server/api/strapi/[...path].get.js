import { defineEventHandler, getQuery, getRouterParam } from 'h3'
import { createStrapiApiError, createStrapiApiURL } from '../../utils/strapi-api'

export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event)
  const path = getRouterParam(event, 'path')

  return $fetch(createStrapiApiURL(config.public.strapiUrl, path), {
    method: 'GET',
    query: getQuery(event),
  }).catch((error) => {
    throw createStrapiApiError(error)
  })
})
