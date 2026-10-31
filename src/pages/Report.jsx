import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import PageHeader from '../components/PageHeader.jsx'
import ImpactsLayout from '../components/ImpactsLayout.jsx'
import './ImpactSectionPages.css'

/** /impact/report/ — notice instead of cards until reports are uploaded. */
export default function Report() {
  const { t } = useTranslation()

  useEffect(() => {
    const preload = document.createElement('link')
    preload.rel = 'preload'
    preload.as = 'image'
    preload.href = '/images/report-hero.webp'
    preload.setAttribute('fetchpriority', 'high')
    document.head.appendChild(preload)

    return () => {
      preload.remove()
    }
  }, [])

  return (
    <div className="impact-section-page">
      <PageHeader
        title={t('report.title')}
        intro={t('report.subtitle')}
        className="impact-image-header report-page-header"
        minHeight={null}
      />
      <ImpactsLayout
        type="Report"
        notice={t('report.notice')}
      />
    </div>
  )
}