function backendOrigin() {
  return (
    import.meta.env.VITE_API_URL || 'http://localhost:4000'
  ).replace(/\/$/, '')
}

function resolveLocalUrl(url) {
  if (String(url || '').startsWith('/uploads')) {
    return `${backendOrigin()}${url}`
  }
  return url
}

export function getDriveFileId(url) {
  if (!url || !String(url).includes('drive.google.com')) return ''

  const value = String(url).trim()
  const match =
    value.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
    value.match(/[?&]id=([a-zA-Z0-9_-]+)/)

  return match ? match[1] : ''
}

export function driveViewUrl(url) {
  const value = resolveLocalUrl(url)
  const id = getDriveFileId(value)
  return id ? `https://drive.google.com/file/d/${id}/view` : value
}

export function driveDownloadUrl(url) {
  const value = resolveLocalUrl(url)
  const id = getDriveFileId(value)
  return id ? `https://drive.google.com/uc?export=download&id=${id}` : value
}
