import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
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
  const { t, i18n } = useTranslation()
  const update = allUpdates.find((item) => item.slug === slug)
  const content = update
    ? t(`updates.items.${slug}`, { returnObjects: true })
    : null
  const language = i18n.resolvedLanguage || 'en'

  if (!update) {
    return (
      <div className="update-detail-page">
        <div className="update-detail__error">{t('updates.notFound')}</div>
        <Link to="/updates/" className="update-detail__backlink">
          ← {t('updates.backToAll')}
        </Link>
      </div>
    )
  }

  return (
    <div className="update-detail-page">
      <div className="update-detail__breadcrumb">
        <Link to="/">{t('breadcrumb.home')}</Link>
        <span aria-hidden="true">›</span>
        <Link to="/updates/">{t('updates.title')}</Link>
        <span aria-hidden="true">›</span>
        <span className="update-detail__breadcrumb-title">{content.title}</span>
      </div>

      <figure className="update-detail__media">
        {update.image ? (
          <img
            src={update.image}
            alt={content.alt}
            className="update-detail__media-image"
          />
        ) : (
          /* Automatic placeholder: any update with `image: null` shows this;
             adding an image path to the data restores the real photo automatically. */
          <div
            className="update-detail__placeholder"
            role="img"
            aria-label={content.alt}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 8h3l2-2h6l2 2h3v11H4z" fill="none" stroke="#2E8C8C" strokeWidth="1.8" strokeLinejoin="round" /><circle cx="12" cy="13" r="3.2" fill="none" stroke="#2E8C8C" strokeWidth="1.8" /></svg>
            <p className="updates-card__placeholder-text">
              {t('common.photoComingSoon')}
            </p>
          </div>
        )}
      </figure>

      <div className="update-detail">
        <h1 className="update-detail__title">{content.title}</h1>

        <div className="update-detail__meta">
          <time dateTime={update.date ?? '2024'}>
            {update.date
              ? `${formatPostDate(update.date, language)} · ${formatRelativeDate(update.date, language)} · ${t('updates.title')}`
              : t('updates.title')}
          </time>
        </div>

        <div
          className="update-detail__body"
          dangerouslySetInnerHTML={{
            __html: renderBody(content.fullText),
          }}
        />

        <Link to="/updates/" className="update-detail__back-link">
          ← {t('updates.backToAll')}
        </Link>
      </div>
    </div>
  )
}
