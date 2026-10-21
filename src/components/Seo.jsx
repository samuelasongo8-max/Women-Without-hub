import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { seoFor, SITE } from '../data/seo.js'

/** Get (or create) a <meta> tag by name and set its content. */
function setMeta(name, content, attr = 'name') {
  let tag = document.head.querySelector(`meta[${attr}="${name}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attr, name)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

/** Get (or create) a <link rel="..."> tag and set its href. */
function setLink(rel, href) {
  let tag = document.head.querySelector(`link[rel="${rel}"]`)
  if (!tag) {
    tag = document.createElement('link')
    tag.setAttribute('rel', rel)
    document.head.appendChild(tag)
  }
  tag.setAttribute('href', href)
}

/**
 * Applies per-page SEO metadata on every route change:
 *  - <title> and meta description
 *  - robots (noindex for 404s)
 *  - Open Graph / Twitter tags
 *  - canonical URL (only when SITE.url is set — no invented domain)
 */
export default function Seo() {
  const { pathname } = useLocation()

  useEffect(() => {
    const { title, description, noindex, siteName } = seoFor(pathname)

    document.title = title
    setMeta('description', description)
    setMeta('robots', noindex ? 'noindex, nofollow' : 'index, follow')

    // Open Graph
    setMeta('og:site_name', siteName || SITE.name, 'property')
    setMeta('og:title', title, 'property')
    setMeta('og:description', description, 'property')
    setMeta('og:type', 'website', 'property')
    setMeta('og:locale', 'en_US', 'property')

    // Twitter
    setMeta('twitter:card', 'summary')
    setMeta('twitter:title', title)
    setMeta('twitter:description', description)

    // Canonical — only when the official domain exists.
    if (SITE.url && !noindex) {
      const url = new URL(pathname, SITE.url).toString()
      setLink('canonical', url)
      setMeta('og:url', url, 'property')
    }
  }, [pathname])

  return null
}
