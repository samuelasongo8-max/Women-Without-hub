import { useEffect, useState } from 'react'
import { Link, useParams, useLocation } from 'react-router-dom'
import { updates as allUpdates, formatPostDate, formatRelativeDate } from '../sections/CommunityUpdates.jsx'
import '../sections/CommunityUpdates.css'

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/* Render paragraphs and "- " lines as real bullet lists (<ul>).
 * Small helper so detail text with list items keeps its structure. */
function renderBody(fullText) {
  const blocks = fullText.split(/\n\s*\n/)
  let html = ''
  let openList = false
  blocks.forEach((block) => {
    const lines = block.split('\n').map((l) => l.trim())
    const items = lines.filter((l) => l.startsWith('- ')).map((l) => l.slice(2).trim())
    if (items.length > 0 && items.length === lines.filter((l) => l.length > 0).length) {
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
  const { slug } = useParams()
  const location = useLocation()
  const [update, setUpdate] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const found = allUpdates.find((u) => u.slug === slug)
    if (found) {
      setUpdate(found)
      setError(null)
    } else {
      setUpdate(null)
      setError('Update not found')
    }
  }, [slug])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  if (error) {
    return (
      <div className="update-detail-page">
        <div className="update-detail__error">{error}</div>
        <Link to="/updates/" className="update-detail__backlink">
          ← Back to all updates
        </Link>
      </div>
    )
  }

  if (!update) return null

  return (
    <div className="update-detail-page">
      <div className="update-detail__breadcrumb">
        <Link to="/">Home</Link>
        <span aria-hidden="true">›</span>
        <Link to="/updates/">Updates</Link>
        <span aria-hidden="true">›</span>
        <span className="update-detail__breadcrumb-title">{update.title}</span>
      </div>

      <figure className="update-detail__media">
        {update.image ? (
          <img
            src={update.image}
            alt={update.alt}
            className="update-detail__media-image"
          />
        ) : (
          /* Automatic placeholder: any update with `image: null` shows this;
             adding an image path to the data restores the real photo automatically. */
          <div
            className="update-detail__placeholder"
            role="img"
            aria-label={update.alt}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 8h3l2-2h6l2 2h3v11H4z" fill="none" stroke="#2E8C8C" strokeWidth="1.8" strokeLinejoin="round" /><circle cx="12" cy="13" r="3.2" fill="none" stroke="#2E8C8C" strokeWidth="1.8" /></svg>
            <p className="updates-card__placeholder-text">Photo coming soon</p>
          </div>
        )}
      </figure>

      <div className="update-detail">
        <h1 className="update-detail__title">{update.title}</h1>

        <div className="update-detail__meta">
          <time dateTime={update.date ?? '2024'}>
            {update.date
              ? `${formatPostDate(update.date)} · ${formatRelativeDate(update.date)} · Community Updates`
              : 'Community Updates'}
          </time>
        </div>

        <div
          className="update-detail__body"
          dangerouslySetInnerHTML={{
            __html: renderBody(update.fullText),
          }}
        />

        <Link to="/updates/" className="update-detail__back-link">
          ← Back to all updates
        </Link>
      </div>
    </div>
  )
}
