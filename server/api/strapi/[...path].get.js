import { defineEventHandler, getQuery, getRouterParam } from 'h3'
import { createStrapiApiError, createStrapiApiURL } from '../../utils/strapi-api'

const cardCoverImages = [
  '/images/tutorial/cards/create-live-room.png',
  '/images/tutorial/cards/chroma-key-mode.png',
  '/images/tutorial/cards/layer-features.png',
  '/images/tutorial/cards/desktop-app-overview.png',
  '/images/tutorial/cards/ios-wireless-connection.png',
  '/images/tutorial/cards/local-media-assets.png',
]

const isCardsPath = (path = '') => String(path).replace(/^\/+|\/+$/g, '') === 'cards'

const shouldUseLocalCardCovers = (path, query = {}) => {
  const populate = query.populate

  return isCardsPath(path)
    && (
      populate === '*'
      || populate === 'coverImg'
      || (Array.isArray(populate) && populate.some(item => item === '*' || item === 'coverImg'))
    )
}

const createCardsQuery = (query = {}) => {
  const nextQuery = { ...query }

  delete nextQuery.populate

  return nextQuery
}

const withLocalCardCovers = (response) => {
  if (!Array.isArray(response?.data)) {
    return response
  }

  return {
    ...response,
    data: response.data.map((item, index) => {
      const coverImg = { url: cardCoverImages[index] || '' }

      if (item?.attributes) {
        return {
          ...item,
          attributes: {
            ...item.attributes,
            coverImg,
          },
        }
      }

      return {
        ...item,
        coverImg,
      }
    }),
  }
}

export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event)
  const path = getRouterParam(event, 'path')
  const query = getQuery(event)
  const useLocalCardCovers = shouldUseLocalCardCovers(path, query)

  return $fetch(createStrapiApiURL(config.public.strapiUrl, path), {
    method: 'GET',
    query: useLocalCardCovers ? createCardsQuery(query) : query,
  }).then((response) => {
    return useLocalCardCovers ? withLocalCardCovers(response) : response
  }).catch((error) => {
    throw createStrapiApiError(error)
  })
})
