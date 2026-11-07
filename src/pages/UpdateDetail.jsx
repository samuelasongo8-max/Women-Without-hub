import { useEffect, useState } from 'react'
import { Link, useParams, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import DOMPurify from 'dompurify'
import { updates as allUpdates, formatPostDate } from '../sections/CommunityUpdates.jsx'
import { normalizeUpdate } from '../utils/updateFields.js'
import { toDisplayImageUrl } from '../utils/updateImages.js'
import api from '../api/axios.js'
import './UpdateDetail.css'

const UPDATE_CONTENT_SANITIZE_CONFIG = {
  ALLOWED_TAGS: [
    'p', 'br', 'strong', 'b', 'em', 'i', 'u',
    'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'span',
  ],
  ALLOWED_ATTR: ['class', 'style'],
  ADD_ATTR: ['style'],
  ALLOW_DATA_ATTR: false,
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
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

// Skeleton placeholder that matches the final layout (text left, image right)
function UpdateSkeleton() {
  return (
    <main className="update-detail-page">
      <Link to="/updates/" className="update-detail__back-link">← Back to Updates</Link>
      <section className="update-detail__content">
        {/* Text column skeleton */}
        <div className="update-detail__text-column">
          <div className="update-detail__skeleton" style={{ height: '1.2rem', marginBottom: '0.75rem', width: '60%' }} />
          <div className="update-detail__skeleton" style={{ height: '2.2rem', marginBottom: '1rem', width: '100%', borderRadius: '0.5rem' }} />
          <div className="update-detail__skeleton" style={{ height: '1.1rem', width: '30%', marginBottom: '1.5rem', borderRadius: '0.25rem' }} />
          <div className="update-detail__skeleton" style={{ height: '1.1rem', width: '80%', marginBottom: '0.5rem', borderRadius: '0.25rem' }} />
          <div className="update-detail__skeleton" style={{ height: '1.1rem', width: '50%', marginBottom: '1.5rem', borderRadius: '0.25rem' }} />
          <div className="update-detail__skeleton" style={{ height: '12rem', width: '100%', borderRadius: '0.5rem' }} />
        </div>
        {/* Image column skeleton */}
        <div className="update-detail__image-column">
          <div className="update-detail__skeleton" style={{ height: '320px', width: '100%', borderRadius: '12px' }} />
        </div>
      </section>
    </main>
  )
}

export default function UpdateDetail() {
  const { slug, index } = useParams()
  const location = useLocation()
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

  // 1. Check router state first (instant render from Link state)
  const routerUpdate = location.state?.update

  // Router state can render a card's data while the canonical record loads.
  const routerUpdateMatchesRoute = isDynamicId && String(routerUpdate?._id) === slug
  const displayUpdate = dynamicUpdate || (routerUpdateMatchesRoute ? normalizeUpdate(routerUpdate) : null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [index, slug])

  useEffect(() => {
    if (!isDynamicId) return // Static/hardcoded updates don't need API fetch
    setDynamicUpdate(null)
    setDynamicLoading(true)
    setDynamicError('')
    setDynamicNotFound(false)
    setImageFailed(false)
    let active = true
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

  // --- Renders ---
  if (dynamicLoading && !displayUpdate) {
    return <UpdateSkeleton />
  }

  if (dynamicError) {
    return (
      <main className="update-detail-page">
        <Link to="/updates/" className="update-detail__back-link">← Back to Updates</Link>
        <p className="update-detail__error">{dynamicError}</p>
        <Link to="/updates/" className="update-detail__back-link">← Back to Updates</Link>
      </main>
    )
  }

  if (dynamicNotFound) {
    return (
      <main className="update-detail-page">
        <Link to="/updates/" className="update-detail__back-link">← Back to Updates</Link>
        <p className="update-detail__error">Update not found.</p>
        <Link to="/updates/" className="update-detail__back-link">← Back to Updates</Link>
      </main>
    )
  }

  if (isDynamicId && displayUpdate) {
    const imageUrl = toDisplayImageUrl(displayUpdate.image || '', 'w1200')
    const hasImage = Boolean(imageUrl) && !imageFailed
    const additionalImages = [...new Set(displayUpdate.images || [])]
      .filter((image) => image && image !== displayUpdate.image)
    return (
      <main className="update-detail-page update-detail-page--dynamic">
        <Link to="/updates/" className="update-detail__back-link">← Back to Updates</Link>
        <section className="update-detail__content">
          <div className="update-detail__image-column">
            {hasImage ? (
              <img
                className="update-detail__image"
                src={imageUrl}
                alt={displayUpdate.title || ''}
                referrerPolicy="no-referrer"
                loading="eager"
                fetchPriority="high"
                onError={() => setImageFailed(true)}
              />
            ) : (
              <div className="update-detail__placeholder" role="img" aria-label="No cover image available">
                <span className="updates-card__placeholder-text">Photo coming soon</span>
              </div>
            )}
            {additionalImages.map((image, imageIndex) => (
              <img
                key={`${image}-${imageIndex}`}
                className="update-detail__image update-detail__image--additional"
                src={toDisplayImageUrl(image, 'w1200')}
                alt={`${displayUpdate.title || 'Community update'} ${imageIndex + 2}`}
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            ))}
          </div>
          <div className="update-detail__text-column">
            <header className="update-detail__header">
              <p className="update-detail__category">{displayUpdate.category || 'Community'}</p>
              <h1 className="update-detail__title">{displayUpdate.title || 'Untitled'}</h1>
              {(displayUpdate.author || displayUpdate.date) && (
                <p className="update-detail__meta">
                  {displayUpdate.author || ''}
                  {displayUpdate.author && displayUpdate.date ? ' · ' : ''}
                  {displayUpdate.date ? formatPostDate(displayUpdate.date, language) : ''}
                </p>
              )}
            </header>
            <div
              className="update-detail__text"
              style={{ whiteSpace: 'pre-line' }}
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  displayUpdate.content || displayUpdate.update || '',
                  UPDATE_CONTENT_SANITIZE_CONFIG,
                ),
              }}
            />
          </div>
        </section>
      </main>
    )
  }

  // Static/hardcoded update
  if (staticContent) {
    const imageUrl = toDisplayImageUrl(staticUpdate.image || '', 'w600')
    return (
      <div className="update-detail-page update-detail-page--static">
        <div className="update-detail__breadcrumb">
          <Link to="/">{t('breadcrumb.home')}</Link>
          <span aria-hidden="true">›</span>
          <Link to="/updates/">{t('updates.title')}</Link>
          <span aria-hidden="true">›</span>
          <span className="update-detail__breadcrumb-title">{staticContent.title}</span>
        </div>
        <section className="update-detail__content">
          <div className="update-detail__text-column">
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
          </div>
          <div className="update-detail__image-column">
            {staticUpdate.image ? (
              <img
                src={imageUrl}
                alt={staticContent.alt}
                className="update-detail__media-image"
                referrerPolicy="no-referrer"
                loading="lazy"
                onError={(event) => { event.currentTarget.style.display = 'none' }}
              />
            ) : (
              <div className="update-detail__placeholder" role="img" aria-label={staticContent.alt}>
                <p className="updates-card__placeholder-text">{t('common.photoComingSoon')}</p>
              </div>
            )}
          </div>
        </section>
        <Link to="/updates/" className="update-detail__back-link">← {t('updates.backToAll')}</Link>
      </div>
    )
  }

  // Fallback: not found
  return (
    <main className="update-detail-page">
      <Link to="/updates/" className="update-detail__back-link">← Back to Updates</Link>
      <p className="update-detail__error">Update not found.</p>
      <Link to="/updates/" className="update-detail__back-link">← Back to Updates</Link>
    </main>
  )
}
