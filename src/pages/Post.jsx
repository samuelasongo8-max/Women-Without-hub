import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import PageHeader from '../components/PageHeader.jsx'
import ImpactsLayout from '../components/ImpactsLayout.jsx'
import './ImpactSectionPages.css'

/** /impact/post/ — Post cards only. */
export default function Post() {
  const { t } = useTranslation()

  useEffect(() => {
    const preload = document.createElement('link')
    preload.rel = 'preload'
    preload.as = 'image'
    preload.href = '/images/post-hero.webp'
    preload.setAttribute('fetchpriority', 'high')
    document.head.appendChild(preload)

    return () => {
      preload.remove()
    }
  }, [])

  return (
    <div className="impact-section-page">
      <PageHeader
        title={t('post.title')}
        intro={t('post.subtitle')}
        className="impact-image-header post-page-header"
        minHeight={null}
      />
      <ImpactsLayout type="Post" />
    </div>
  )
}