// Image URL helpers for community updates.
// Cloudinary URLs get f_auto,q_auto,w_1200 for display.
// Drive thumbnails use w1200 for detail, w600 for cards.
// Non-Drive URLs pass through unchanged.

// Insert Cloudinary transformation: f_auto,q_auto,w_1200
export function cloudinaryTransform(url) {
  if (!url || !url.includes('cloudinary.com')) return url
  // If URL already has a transform path, insert before the final path segment
  // e.g. https://res.cloudinary.com/ENV/image/upload/v123/folder/image.jpg
  const match = url.match(/^(https:\/\/[^/]+\/[^/]+\/upload\/[^?]*)(\/.*)$/)
  if (match) {
    return match[1] + '/f_auto,q_auto,w_1200' + match[2]
  }
  // Query string format: https://res.cloudinary.com/.../image.jpg?params
  const queryMatch = url.match(/^(.+?)(\?.*)$/)
  if (queryMatch) {
    return queryMatch[1] + '/f_auto,q_auto,w_1200' + queryMatch[2]
  }
  return url + '/f_auto,q_auto,w_1200'
}

// Node-side version for backend
export function cloudinaryTransformNode(url) {
  if (!url || !url.includes('cloudinary.com')) return url
  const match = url.match(/^(https:\/\/[^/]+\/[^/]+\/upload\/[^?]*)(\/.*)$/)
  if (match) {
    return match[1] + '/f_auto,q_auto,w_1200' + match[2]
  }
  const queryMatch = url.match(/^(.+?)(\?.*)$/)
  if (queryMatch) {
    return queryMatch[1] + '/f_auto,q_auto,w_1200' + queryMatch[2]
  }
  return url + '/f_auto,q_auto,w_1200'
}

// Build a Drive thumbnail URL with the given size
export function driveThumbnailUrl(url, size = 'w1200') {
  if (!url || !url.includes('drive.google.com')) return url
  const idMatch = url.match(/id=([a-zA-Z0-9_-]+)/)
  if (!idMatch) return url
  return `https://drive.google.com/thumbnail?id=${idMatch[1]}&${size}`
}

// Node-side version
export function driveThumbnailUrlNode(url, size = 'w1200') {
  if (!url || !url.includes('drive.google.com')) return url
  const idMatch = url.match(/id=([a-zA-Z0-9_-]+)/)
  if (!idMatch) return url
  return `https://drive.google.com/thumbnail?id=${idMatch[1]}&${size}`
}

// Convert any stored image URL to a display URL
export function toDisplayImageUrl(url, size = 'w1200') {
  if (!url) return url
  if (url.includes('cloudinary.com')) {
    return cloudinaryTransform(url)
  }
  if (url.includes('drive.google.com')) {
    return driveThumbnailUrl(url, size)
  }
  return url
}
