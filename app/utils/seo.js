// 根据图片路径生成兜底 alt，避免页面图片完全没有替代文本。
export const createImageAlt = (src, fallbackAlt = '') => {
  if (fallbackAlt) {
    return fallbackAlt
  }

  if (!src) {
    return ''
  }

  const fileName = src.split('/').pop().split('?')[0]
  return fileName.replace(/\.[a-z0-9]+$/i, '').replace(/[-_]+/g, ' ')
}
