import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
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

function removeMeta(name, attr = 'name') {
  document.head.querySelector(`meta[${attr}="${name}"]`)?.remove()
}

function removeLink(rel) {
  document.head.querySelector(`link[rel="${rel}"]`)?.remove()
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
  const { t, i18n } = useTranslation()

  useEffect(() => {
    const {
      title: seoTitle,
      description,
      noindex,
      siteName,
      ogImage: pageOgImage,
    } = seoFor(pathname)
    const isSecondChanceProgram =
      pathname === '/programs/second-chance-education/'
    const title = isSecondChanceProgram
      ? `${t('programs.secondChanceTitle')}${seoTitle.slice(
          'Second Chance Education'.length,
        )}`
      : seoTitle

    document.title = title
    setMeta('description', description)
    setMeta('robots', noindex ? 'noindex, nofollow' : 'index, follow')

    // Open Graph
    setMeta('og:site_name', siteName || SITE.name, 'property')
    setMeta('og:title', title, 'property')
    setMeta('og:description', description, 'property')
    setMeta('og:type', 'website', 'property')
    const language = i18n.resolvedLanguage?.split('-')[0] || 'en'
    const localeByLanguage = {
      en: 'en_US',
      fr: 'fr_FR',
      ar: 'ar_AR',
      sw: 'sw_KE',
      so: 'so_SO',
      es: 'es_ES',
      de: 'de_DE',
      pt: 'pt_PT',
      ru: 'ru_RU',
      it: 'it_IT',
      pl: 'pl_PL',
    }
    setMeta('og:locale', localeByLanguage[language] || 'en_US', 'property')

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

    // Remove route-specific metadata left behind by a previous SPA route.
    if (SITE.url && !noindex) {
      const canonicalPath =
        pathname === '/' || pathname.endsWith('/') ? pathname : `${pathname}/`
      const url = new URL(canonicalPath, SITE.url).toString()
      setLink('canonical', url)
      setMeta('og:url', url, 'property')
    } else {
      removeLink('canonical')
      removeMeta('og:url', 'property')
    }

  }, [pathname, SITE.url, i18n.resolvedLanguage, t])

  return null
}
