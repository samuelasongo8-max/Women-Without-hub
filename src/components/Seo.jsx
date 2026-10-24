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
    const { title, description, noindex, siteName, ogImage: pageOgImage } = seoFor(pathname)

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
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', title)
    setMeta('twitter:description', description)

    // Open Graph / Twitter image — per-page override, fall back to site logo.
    let ogImage = null
    if (pageOgImage) {
      ogImage = SITE.url ? new URL(pageOgImage, SITE.url).toString() : pageOgImage
    } else if (SITE.ogImage) {
      ogImage = SITE.url ? new URL(SITE.ogImage, SITE.url).toString() : SITE.ogImage
    }
    if (ogImage) {
      setMeta('og:image', ogImage, 'property')
      setMeta('twitter:image', ogImage)
    }

    // Canonical — only when the official domain exists.
    if (SITE.url && !noindex) {
      const url = new URL(pathname, SITE.url).toString()
      setLink('canonical', url)
      setMeta('og:url', url, 'property')
    }

    // Hreflang — add alternate language links
    const supportedLangs = ['en', 'fr', 'ar', 'sw', 'so', 'es', 'de', 'pt', 'ru', 'it', 'pl']
    const langLabels = {
      en: 'en', fr: 'fr', ar: 'ar', sw: 'sw', so: 'so',
      es: 'es', de: 'de', pt: 'pt', ru: 'ru', it: 'it', pl: 'pl',
    }

    // Remove any existing hreflang links first
    const existing = document.querySelectorAll('link[rel="alternate"][hreflang]')
    existing.forEach((tag) => tag.remove())

    // Get the current language code from the pathname prefix
    const pathPrefix = pathname.replace(/\/$/, '').split('/')[1] || 'en'
    const currentLang = supportedLangs.includes(pathPrefix) ? pathPrefix : 'en'
    // Build the base URL (without language prefix for en, or with prefix for others)
    const base = SITE.url ? new URL(SITE.url).origin : window.location.origin
    // Add hreflang links for all supported languages
    supportedLangs.forEach((lang) => {
      const langPath = lang === 'en' ? '/' : `/${lang}/`
      // Construct the URL for this language version
      let href
      if (SITE.url) {
        // When using a custom domain, construct full URL with language prefix
        if (lang === 'en') {
          // For English, use the current pathname if it's already /en/, otherwise add /en/ prefix
          href = pathname.startsWith('/en/') ? base + pathname : base + '/en' + pathname.replace('/' + currentLang + '/', '/en/')
        } else {
          href = base + '/' + lang + pathname.replace('/' + currentLang + '/', '/' + lang + '/')
        }
      } else {
        // Without custom domain, use current origin
        if (lang === 'en') {
          href = window.location.origin + langPath + pathname.replace('/' + currentLang + '/', '/')
        } else {
          href = window.location.origin + langPath + pathname.replace('/' + currentLang + '/', '/' + lang + '/')
        }
      }
      const link = document.createElement('link')
      link.rel = 'alternate'
      link.href = href
      link.hreflang = langLabels[lang] || lang
      document.head.appendChild(link)
    })
  }, [pathname, SITE.url])

  return null
}

