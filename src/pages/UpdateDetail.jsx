import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { updates as allUpdates, formatPostDate } from '../sections/CommunityUpdates.jsx'
import { normalizeUpdate } from '../utils/updateFields.js'
import api from '../api/axios.js'
import './UpdateDetail.css'

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function renderBody(fullText) {
  const blocks = fullText.split(/\n\s*\n/)
  let html = ''
  let openList = false
  blocks.forEach((block) => {
    const lines = block.split('\n').map((line) => line.trim())
    const items = lines.filter((line) => line.startsWith('- ')).map((line) => line.slice(2).trim())
    if (items.length > 0 && items.length === lines.filter((line) => line.length > 0).length) {
      if (!openList) {
        html += '<ul>'
        openList = true
      }
      items.forEach((item) => {
        html += '<li>' + escapeHtml(item) + '</li>'
      })
    } else {
      if (openList) {
        html += '</ul>'
        openList = false
      }
      html += '<p>' + escapeHtml(block.trim()).replace(/\n/g, '<br />') + '</p>'
    }
  })
  if (openList) html += '</ul>'
  return html
}

export default function UpdateDetail() {
  const { slug, index } = useParams()
  const { t, i18n } = useTranslation()
  const [dynamicUpdate, setDynamicUpdate] = useState(null)
  const [dynamicLoading, setDynamicLoading] = useState(false)
  const [dynamicError, setDynamicError] = useState('')
  const [dynamicNotFound, setDynamicNotFound] = useState(false)
  const [imageFailed, setImageFailed] = useState(false)
  const language = i18n.resolvedLanguage || 'en'
  const isStaticIndex = index !== undefined
  const parsedIndex = Number(index)
  const staticUpdate = isStaticIndex
    ? Number.isInteger(parsedIndex) && parsedIndex >= 0 && parsedIndex < allUpdates.length
      ? allUpdates[parsedIndex]
      : null
    : allUpdates.find((item) => item.slug === slug)
  const staticContent = staticUpdate
    ? t(`updates.items.${staticUpdate.slug}`, { returnObjects: true })
    : null
  const isDynamicId = !isStaticIndex && !staticUpdate && Boolean(slug)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [index, slug])

  useEffect(() => {
    setImageFailed(false)
    setDynamicError('')
    setDynamicNotFound(false)
    setDynamicUpdate(null)
    if (!isDynamicId) {
      setDynamicLoading(false)
      return undefined
    }

    let active = true
    setDynamicLoading(true)
    api.get(`/api/updates/${slug}`)
      .then((response) => {
        if (active) setDynamicUpdate(normalizeUpdate(response.data.update || {}))
      })
      .catch((error) => {
        if (!active) return
        if (error.response?.status === 404) {
          setDynamicNotFound(true)
        } else {
          setDynamicError('Unable to load this update.')
        }
      })
      .finally(() => {
        if (active) setDynamicLoading(false)
      })
    return () => { active = false }
  }, [isDynamicId, slug])

  if (dynamicLoading) {
    return (
      <main className="update-detail-page">
        <p className="update-detail__state">Loading update…</p>
      </main>
    )
  }

  if (dynamicError) {
    return (
      <main className="update-detail-page">
        <p className="update-detail__error">{dynamicError}</p>
        <Link to="/updates/" className="update-detail__back-link">← Back to Updates</Link>
      </main>
    )
  }

  if (dynamicNotFound || (!staticUpdate && isDynamicId)) {
    return (
      <main className="update-detail-page">
        <p className="update-detail__error">Update not found.</p>
        <Link to="/updates/" className="update-detail__back-link">← Back to Updates</Link>
      </main>
    )
  }

  if (!staticUpdate && !dynamicUpdate) {
    return (
      <main className="update-detail-page">
        <p className="update-detail__error">Update not found.</p>
        <Link to="/updates/" className="update-detail__back-link">← Back to Updates</Link>
      </main>
    )
  }

  if (dynamicUpdate) {
    const hasImage = Boolean(dynamicUpdate.image) && !imageFailed
    return (
      <main className={`update-detail-page update-detail-page--dynamic${hasImage ? '' : ' update-detail-page--no-image'}`}>
        <Link to="/updates/" className="update-detail__back-link">← Back to Updates</Link>
        <header className="update-detail__header">
          <p className="update-detail__category">{dynamicUpdate.category}</p>
          <h1 className="update-detail__title">{dynamicUpdate.title}</h1>
          {(dynamicUpdate.author || dynamicUpdate.date) && (
            <p className="update-detail__meta">
              {dynamicUpdate.author || ''}
              {dynamicUpdate.author && dynamicUpdate.date ? ' · ' : ''}
              {dynamicUpdate.date ? formatPostDate(dynamicUpdate.date, language) : ''}
            </p>
          )}
        </header>
        <section className="update-detail__content">
          {hasImage && (
            <div className="update-detail__image-column">
              <img
                className="update-detail__image"
                src={dynamicUpdate.image}
                alt={dynamicUpdate.title}
                referrerPolicy="no-referrer"
                onError={() => setImageFailed(true)}
              />
            </div>
          )}
          <div className="update-detail__text-column">
            <div className="update-detail__text">{dynamicUpdate.content}</div>
          </div>
        </section>
      </main>
    )
  }

  return (
    <div className="update-detail-page update-detail-page--static">
      <div className="update-detail__breadcrumb">
        <Link to="/">{t('breadcrumb.home')}</Link>
        <span aria-hidden="true">›</span>
        <Link to="/updates/">{t('updates.title')}</Link>
        <span aria-hidden="true">›</span>
        <span className="update-detail__breadcrumb-title">{staticContent.title}</span>
      </div>
      <figure className="update-detail__media">
        {staticUpdate.image ? (
          <img
            src={staticUpdate.image}
            alt={staticContent.alt}
            className="update-detail__media-image"
            referrerPolicy="no-referrer"
            onError={(event) => { event.currentTarget.style.display = 'none' }}
          />
        ) : (
          <div className="update-detail__placeholder" role="img" aria-label={staticContent.alt}>
            <p className="updates-card__placeholder-text">{t('common.photoComingSoon')}</p>
          </div>
        )}
      </figure>
      <div className="update-detail">
        <h1 className="update-detail__title">{staticContent.title}</h1>
        <div className="update-detail__meta">
          <time dateTime={staticUpdate.date ?? '2024'}>
            {staticUpdate.date
              ? `${formatPostDate(staticUpdate.date, language)} · ${t('updates.title')}`
              : t('updates.title')}
          </time>
        </div>
        <div
          className="update-detail__body"
          dangerouslySetInnerHTML={{ __html: renderBody(staticContent.fullText) }}
        />
        <Link to="/updates/" className="update-detail__back-link">← {t('updates.backToAll')}</Link>
      </div>
    </div>
  )
}
