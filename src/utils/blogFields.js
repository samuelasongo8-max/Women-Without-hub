import { convertGoogleDriveUrl } from './driveUrl.js'

export function resolveImage(url) {
  if (!url) return ''

  const value = String(url).trim()
  if (!value) return ''

  if (value.includes('drive.google.com')) {
    return convertGoogleDriveUrl(value)
  }

  if (value.startsWith('/uploads')) {
    const backendOrigin = (
      import.meta.env.VITE_API_URL || 'http://localhost:4000'
    ).replace(/\/$/, '')
    return `${backendOrigin}${value}`
  }

  return value
}

export function normalizeBlog(blog) {
  return {
    _id: blog?._id,
    title: blog?.title || blog?.blogTitle || '',
    content: blog?.content || blog?.blogContent || '',
    date: blog?.date || blog?.createdAt || '',
    imageAlt: blog?.imageAlt || blog?.altText || '',
    featuredImage: resolveImage(
      blog?.featuredImageUrl || blog?.blogImage || blog?.image || ''
    ),
    contentImage: resolveImage(
      blog?.contentImageUrl || blog?.contentImage || ''
    ),
  }
}
