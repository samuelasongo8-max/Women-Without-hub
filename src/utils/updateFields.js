import { convertGoogleDriveUrl } from './driveUrl.js'

const configuredBackendOrigin = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '')
const backendOrigin = configuredBackendOrigin || (import.meta.env.PROD
  ? 'https://women-without-borders-backend.onrender.com'
  : 'http://localhost:4000')

function normalizeImage(value) {
  if (!value) return ''
  const image = convertGoogleDriveUrl(value)
  return image.startsWith('/uploads') ? `${backendOrigin}${image}` : image
}

export function normalizeUpdate(item = {}) {
  const content = String(item.update || item.content || '')
  return {
    _id: item._id?.toString?.() || item._id,
    title: item.title || '',
    category: item.category || 'Community',
    author: item.author || '',
    excerpt: item.excerpt || content.slice(0, 120),
    content,
    date: item.publishedAt || item.createdAt || item.date,
    image: normalizeImage(item.coverImageLink || item.image),
    images: Array.isArray(item.images)
      ? item.images.map(normalizeImage).filter(Boolean)
      : [],
    isDynamic: true,
  }
}
