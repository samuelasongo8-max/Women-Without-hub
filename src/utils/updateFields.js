import { convertGoogleDriveUrl } from './driveUrl.js'

const backendOrigin = import.meta.env.VITE_API_URL || 'http://localhost:4000'

function normalizeImage(value) {
  if (!value) return ''
  const image = convertGoogleDriveUrl(value)
  return image.startsWith('/uploads') ? `${backendOrigin}${image}` : image
}

export function normalizeUpdate(item = {}) {
  const content = String(item.update || '')
  return {
    _id: item._id?.toString?.() || item._id,
    title: item.title || '',
    category: item.category || 'Community',
    author: item.author || '',
    excerpt: item.excerpt || content.slice(0, 140),
    content,
    date: item.createdAt,
    image: normalizeImage(item.coverImageLink),
    isDynamic: true,
  }
}
