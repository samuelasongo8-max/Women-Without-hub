import { useLayoutEffect } from 'react'

export default function useHeroImagePreload(images) {
  const desktop = images?.desktop
  const mobile = images?.mobile

  useLayoutEffect(() => {
    if (!desktop || !mobile) return undefined

    const links = [
      { href: desktop, media: '(min-width: 768px)' },
      { href: mobile, media: '(max-width: 767px)' },
    ].map(({ href, media }) => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = href
      link.type = 'image/webp'
      link.media = media
      link.fetchPriority = 'high'
      document.head.appendChild(link)
      return link
    })

    return () => links.forEach((link) => link.remove())
  }, [desktop, mobile])
}
