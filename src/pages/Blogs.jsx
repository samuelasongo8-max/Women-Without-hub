import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import PageHeader from '../components/PageHeader.jsx'
import ImpactsLayout from '../components/ImpactsLayout.jsx'
import './ImpactSectionPages.css'

/**
 * /impact/blogs/ — page shell only (header + Impacts sidebar).
 * The blog cards were removed, so `empty` renders no card grid.
 */
export default function Blogs() {
  const { t } = useTranslation()

  useEffect(() => {
    const preload = document.createElement('link')
    preload.rel = 'preload'
    preload.as = 'image'
    preload.href = '/images/blogs-hero.webp'
    preload.setAttribute('fetchpriority', 'high')
    document.head.appendChild(preload)

    return () => {
      preload.remove()
    }
  }, [])

  return (
    <div className="impact-section-page">
      <PageHeader
        title={t('blogs.title')}
        intro={t('blogs.subtitle')}
        className="impact-image-header blogs-page-header"
        minHeight={null}
      />
      <ImpactsLayout empty />
    </div>
  )
}