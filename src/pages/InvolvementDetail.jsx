import { useParams, Link, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import PageHeader from '../components/PageHeader.jsx'
import { involvement } from '../data/site.js'
import './GetInvolved.css'

export default function InvolvementDetail() {
  const { slug } = useParams()
  const { t } = useTranslation()
  const item = involvement.find((i) => i.slug === slug)

  useEffect(() => {
    if (slug !== 'donate') return undefined

    const preload = document.createElement('link')
    preload.rel = 'preload'
    preload.as = 'image'
    preload.href = '/images/donate-hero.webp'
    preload.type = 'image/webp'
    preload.fetchPriority = 'high'
    document.head.appendChild(preload)

    return () => preload.remove()
  }, [slug])

  if (!item) return <Navigate to="/get-involved/" replace />

  const isDonatePage = slug === 'donate'

  return (
    <div className={`getinvolved-page${isDonatePage ? ' getinvolved-page--donate' : ''}`}>
      <PageHeader
        title={t(item.titleKey)}
        intro={t(item.summaryKey)}
        className={isDonatePage ? 'page-header--donate' : ''}
        minHeight={isDonatePage ? null : '420px'}
      />

      <div className="getinvolved-split-list">
        <section className="getinvolved-split-row getinvolved-detail-card">
          <div className="getinvolved-split-panel">
            <div className="getinvolved-split-content">
              <h2 className="getinvolved-split-heading">
                {t('getInvolved.howItWorks')}
              </h2>
              <span className="getinvolved-split-divider" aria-hidden="true" />
              <p className="getinvolved-split-body">
                {t('getInvolved.thankYouInterest', {
                  title: t(item.titleKey),
                })}
              </p>
            </div>
          </div>

          <div className="getinvolved-split-panel getinvolved-detail-cta">
            <div className="getinvolved-split-content">
              <h2 className="getinvolved-split-heading">
                {t('getInvolved.readyTitle')}
              </h2>
              <span className="getinvolved-split-divider" aria-hidden="true" />
              <p className="getinvolved-split-body">
                {t('getInvolved.detailContactPrefix')}{' '}
                <Link to="/contact/">{t('getInvolved.detailContactLink')}</Link>{' '}
                {t('getInvolved.detailDonateConnector')}{' '}
                <Link to="/get-involved/donate/">
                  {t('getInvolved.detailDonateLink')}
                </Link>{' '}
                {t('getInvolved.detailDonateSuffix')}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
