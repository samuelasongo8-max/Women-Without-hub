import { useLayoutEffect } from 'react'

export default function useHeroImagePreload(images) {
  const desktop = images?.desktop
  const tablet = images?.tablet
  const mobile = images?.mobile

  useLayoutEffect(() => {
    if (!desktop || !mobile) return undefined

    const sources = [
      { href: desktop, media: images.desktopMedia || '(min-width: 768px)' },
      ...(tablet
        ? [{ href: tablet, media: images.tabletMedia || '(min-width: 768px) and (max-width: 1023px)' }]
        : []),
      { href: mobile, media: '(max-width: 767px)' },
    ]
    const links = sources.map(({ href, media }) => {
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
  }, [desktop, tablet, mobile, images?.desktopMedia, images?.tabletMedia])
}
