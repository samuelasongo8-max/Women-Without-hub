import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import PageHeader from '../components/PageHeader.jsx'
import api from '../api/axios.js'
import { convertGoogleDriveUrl } from '../utils/driveUrl.js'
import { driveDownloadUrl, driveViewUrl } from '../utils/driveFile.js'
import { normalizeReport } from '../utils/reportFields.js'
import './Reports.css'

function formatDate(value) {
  if (!value) return ''
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
}

export default function Report() {
  const { t } = useTranslation()
  const [reports, setReports] = useState([])
  const [failedImages, setFailedImages] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const fetchRef = useRef(false)

  useEffect(() => {
    if (fetchRef.current) return
    fetchRef.current = true

    api.get('/api/reports')
      .then((res) => {
        const seen = new Set()
        const unique = (res.data.reports || [])
          .map(normalizeReport)
          .filter((report) => {
            const key = report._id?.toString()
            if (!key || seen.has(key)) return false
            seen.add(key)
            return true
          })
          .sort((a, b) => new Date(b.date) - new Date(a.date))

        setReports(unique)
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Unable to load reports.')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  function handleImageError(reportId) {
    setFailedImages((current) => {
      const next = new Set(current)
      next.add(reportId)
      return next
    })
  }

  if (loading) {
    return (
      <div className="impact-section-page">
        <PageHeader
          title={t('report.title')}
          intro={t('report.subtitle')}
          className="impact-image-header report-page-header"
          minHeight={null}
        />
        <p className="report-list-state">Loading reports…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="impact-section-page">
        <PageHeader
          title={t('report.title')}
          intro={t('report.subtitle')}
          className="impact-image-header report-page-header"
          minHeight={null}
        />
        <p className="report-list-state report-list-state--error">{error}</p>
      </div>
    )
  }

  return (
    <div className="impact-section-page">
      <PageHeader
        title={t('report.title')}
        intro={t('report.subtitle')}
        className="impact-image-header report-page-header"
        minHeight={null}
      />
      {reports.length === 0 ? (
        <p className="report-list-state">Reports will be updated soon.</p>
      ) : (
        <div className="report-grid">
          {reports.map((report) => (
            <article key={report._id} className="report-card">
              <div className="report-card__image-wrap">
                {report.coverImage && !failedImages.has(report._id) ? (
                  <img
                    className="report-card__image"
                    src={convertGoogleDriveUrl(report.coverImage)}
                    alt={report.title}
                    referrerPolicy="no-referrer"
                    onError={() => handleImageError(report._id)}
                  />
                ) : (
                  <div className="report-card__placeholder">
                    <span aria-hidden="true">📄</span>
                    <span>{report.title || 'Report'}</span>
                  </div>
                )}
              </div>
              <div className="report-card__body">
                <p className="report-card__category">{report.category}</p>
                <h2 className="report-card__title">{report.title || 'Untitled report'}</h2>
                <p className="report-card__date">{formatDate(report.date)}</p>
                <p className="report-card__description">{report.description}</p>
                <div className="report-card__actions">
                  <a
                    className="report-card__button"
                    href={driveViewUrl(report.fileLink)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View report
                  </a>
                  <a
                    className="report-card__button report-card__button--secondary"
                    href={driveDownloadUrl(report.fileLink)}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={report.downloadName || undefined}
                  >
                    Download
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
