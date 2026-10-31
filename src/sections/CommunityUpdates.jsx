import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Reveal from '../components/Reveal.jsx'
import './CommunityUpdates.css'

export function formatPostDate(dateString, language = 'en') {
  if (!dateString) return ''
  const d = new Date(dateString)
  if (Number.isNaN(d.getTime())) return ''
  return new Intl.DateTimeFormat(language, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d)
}

/* Systematic relative date, counted live from today on every render, so
 * the label moves day by day (Today → Yesterday → N days ago →
 * N weeks ago) instead of showing one fixed string. Shared by the
 * Community Updates cards and the Impact Post badges. */
export function formatRelativeDate(dateString, language = 'en') {
  if (!dateString) return ''
  const DAY = 24 * 60 * 60 * 1000
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const d = new Date(dateString)
  if (Number.isNaN(d.getTime())) return ''
  d.setHours(0, 0, 0, 0)
  const diffDays = Math.round((today - d) / DAY)
  const formatter = new Intl.RelativeTimeFormat(language, { numeric: 'auto' })
  if (diffDays < 7) return formatter.format(-diffDays, 'day')
  return formatter.format(-Math.floor(diffDays / 7), 'week')
}

// Community updates — photos served from /public.
// One source of truth; /updates/ and the Home section reuse this data.
// Any update with image: null shows a placeholder (photo coming soon).
// Adding an image path to the data restores the real photo automatically.
export const updates = [
  {
    slug: 'building-pathways-for-women-and-girls',
    image: '/images/women-hub7.png',
    to: '/updates/building-pathways-for-women-and-girls',
    date: '2026-05-30',
  },
  {
    slug: 'graduation-celebration-skills',
    image: '/images/graduation-at-women-without-border.jpg',
    to: '/updates/graduation-celebration-skills',
    date: '2026-06-18',
  },
  {
    slug: 'health-advocacy',
    image: '/images/avocating-health.jpg',
    to: '/updates/health-advocacy',
  },
]

/**
 * Card markup — identical for the Home section and the /updates/ page.
 * The image slot shows a placeholder when image is null.
 */
function renderCards(t, language) {
  return updates.map((u, index) => {
    const content = t(`updates.items.${u.slug}`, { returnObjects: true })
    return (
      <Reveal
        key={u.slug}
        as="article"
        className="updates-card"
        direction="up"
        delay={index * 150}
      >
        <Link
          to={u.to}
          className="updates-img-link"
          tabIndex={-1}
          aria-hidden="true"
        >
          {u.image ? (
            <img src={u.image} alt={content.alt} loading="lazy" />
          ) : (
            <div className="updates-card__placeholder">
              <svg width="40" height="40" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 8h3l2-2h6l2 2h3v11H4z" fill="none" stroke="#2E8C8C" strokeWidth="1.8" strokeLinejoin="round" /><circle cx="12" cy="13" r="3.2" fill="none" stroke="#2E8C8C" strokeWidth="1.8" /></svg>
              <p className="updates-card__placeholder-text">{t('common.photoComingSoon')}</p>
            </div>
          )}
        </Link>
        <h3>
          <Link to={u.to}>{content.title}</Link>
        </h3>
        <p className="updates-card__preview">{content.summary}</p>
        {u.date ? (
          <p className="updates-card__date">
            {formatPostDate(u.date, language)} · {formatRelativeDate(u.date, language)}
          </p>
        ) : null}
        <Link
          to={u.to}
          className="updates-card__readmore"
        >
          {t('common.readMore')} <span aria-hidden="true">›</span>
        </Link>
      </Reveal>
    )
  })
}

export default function CommunityUpdatesSection({ isPage, variant }) {
  const { t, i18n } = useTranslation()
  const trackRef = useRef(null)
  const page = Boolean(isPage) || variant === 'page'
  const [progress, setProgress] = useState(0)
  const language = i18n.resolvedLanguage || 'en'
  const cards = renderCards(t, language)

  const scrollByCard = (dir) => {
    const el = trackRef.current
    if (el == null) return
    const card = el.querySelector('.updates-card')
    if (card == null) return
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0
    el.scrollBy({ left: dir * (card.offsetWidth + gap), behavior: 'smooth' })
  }

  const handleScroll = () => {
    const el = trackRef.current
    if (el == null) return
    const maxScroll = el.scrollWidth - el.clientWidth
    setProgress(maxScroll > 0 ? el.scrollLeft / maxScroll : 0)
  }

  return (
    <section className="updates">
      <div className="updates-head">
        {page ? (
          <Reveal as="h1" direction="up" duration={650}>
            {t('updates.title')}
          </Reveal>
        ) : (
          <Reveal as="h2" direction="up" duration={650}>
            {t('updates.title')}
          </Reveal>
        )}
        {!page && (
          <Link to="/updates/" className="updates-viewall">
            {t('common.viewAll')}
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M3 1l4 4-4 4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        )}
      </div>

      {!page && (
        <div className="updates-controls">
          <div className="updates-progress">
            <span
              className="updates-progress-thumb"
              style={{ left: `calc(${progress} * (100% - 14px))` }}
            />
          </div>
          <div className="updates-arrows">
            <button
              type="button"
              className="updates-arrow"
              aria-label={t('updates.previous', { defaultValue: 'Previous updates' })}
              onClick={() => scrollByCard(-1)}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  d="M15 5l-7 7 7 7"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              className="updates-arrow"
              aria-label={t('updates.next', { defaultValue: 'Next updates' })}
              onClick={() => scrollByCard(1)}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  d="M9 5l7 7-7 7"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {page ? (
        <div className="updates-grid">{cards}</div>
      ) : (
        <div
          className="updates-track"
          ref={trackRef}
          onScroll={handleScroll}
        >
          {cards}
        </div>
      )}
    </section>
  )
}
