import { NavLink, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { newsPosts } from './../data/newsPosts.js'
import { blogsPosts } from './../data/blogsPosts.js'
import { reportPosts } from './../data/reportPosts.js'
import { postPosts } from './../data/postPosts.js'
import RelativeTimeBadge from './RelativeTimeBadge.jsx'
import { formatRelativeDate } from './../sections/CommunityUpdates.jsx'
import './ImpactsLayout.css'

/** Sections of the Impact area, shown as the "Impacts" sidebar. */
export const impactSections = [
  { label: 'impact.all', to: '/impact/' },
  { label: 'impact.sections.news', to: '/impact/news/' },
  { label: 'impact.sections.blogs', to: '/impact/blogs/' },
  { label: 'impact.sections.report', to: '/impact/report/' },
  { label: 'impact.sections.post', to: '/impact/post/' },
]

/**
 * One combined, type-tagged, date-sorted list for the "All" view.
 *
 * Each section keeps its cards in its own file (newsPosts.js,
 * blogsPosts.js, reportPosts.js, postPosts.js) so there is a single
 * source of truth per section: nothing is duplicated between the
 * section pages and "All", and any change in a section shows up in
 * "All" automatically. A section without cards contributes nothing.
 */
const allPosts = [...newsPosts, ...blogsPosts, ...reportPosts, ...postPosts].sort(
  (a, b) => new Date(b.date) - new Date(a.date),
)

/**
 * A single card rendered by the combined "All" list or a type filter.
 * Same 2-column grid style as the existing card grid, but each card is
 * built from the full item record (image, date, weeks-ago, caption,
 * read time, button + link) instead of a bare excerpt.
 */
function ImpallCard({ item, t, language, useLivePostAge }) {
  const content = item.slug
    ? t(`updates.items.${item.slug}`, { returnObjects: true })
    : item
  const fullText = content.fullText || ''
  const readMinutes = Math.max(1, Math.round(fullText.trim().split(/\s+/).filter(Boolean).length / 200))
  const date = item.date ? new Date(`${item.date}T12:00:00`) : null
  // Badge counts live from the stored date on every render (Today →
  // Yesterday → N days/weeks ago), so it moves forward automatically.
  const relativeLabel =
    item.date && !(useLivePostAge && item.type === 'Post')
      ? formatRelativeDate(item.date, language)
      : ''
  const formattedDate = date
    ? new Intl.DateTimeFormat(language, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(date)
    : ''

  return (
    <article className="impall-card">
      <div
        className={`impall-card__image${item.image ? '' : ' impall-card__image--empty'}`}
      >
        {item.image ? (
          <img
            src={item.image}
            alt={content.alt || item.alt || content.title || ''}
            loading="lazy"
          />
        ) : (
          <span className="impall-card__placeholder">
            {t('common.photoComingSoon')}
          </span>
        )}
        {useLivePostAge && item.type === 'Post' && item.date ? (
          <RelativeTimeBadge publishDate={item.date} />
        ) : relativeLabel !== '' ? (
          <span className="impall-card__badge">{relativeLabel}</span>
        ) : null}
      </div>

      <div className="impall-card__body">
        <p className="impall-card__label">
          <span aria-hidden="true" className="impall-card__label-dot" />
          {t(`impact.sections.${item.type.toLowerCase()}`)}
        </p>
        <h3 className="impall-card__title">{content.title || item.title}</h3>
        <p className="impall-card__caption">{t('impact.cardCaption')}</p>
        <p className="impall-card__text">{content.summary || item.excerpt}</p>
        {formattedDate && <p className="impall-card__date">{formattedDate}</p>}
        {fullText && (
          <p className="impall-card__readtime">
            {t('impact.readTime', { count: readMinutes })}
          </p>
        )}
        {item.to && (
          <Link to={item.to} className="impall-card__button">
            {t('common.readMore')}
          </Link>
        )}
      </div>
    </article>
  )
}

/**
 * Shared "Impacts" sidebar + card grid, used by /impact/ and its
 * /impact/news|blogs|report|post/ sub pages.
 *
 * @param {string|null} type When set, only cards of that type are shown.
 *                           When null (the /impact/ page) the combined
 *                           "All" list shows.
 * @param {string|null} notice Replaces the grid with a short notice
 *                            (used by the Report page).
 * @param {boolean} empty      Renders the sidebar only, with the empty
 *                            message ("Nothing to show yet.").
 */
export default function ImpactsLayout({
  type = null,
  notice = null,
  empty = false,
}) {
  const { t, i18n } = useTranslation()
  const language = i18n.resolvedLanguage || 'en'
  const cards = type
    ? allPosts.filter((item) => item.type === type)
    : allPosts

  return (
    <section className="section container">
      <div className="impacts-layout">
        <aside className="impacts-sidebar">
          <h2 className="impacts-sidebar__title">{t('nav.impact')}</h2>
          <nav aria-label={t('impact.sectionsLabel')}>
            <ul className="impacts-sidebar__list">
              {impactSections.map((section) => (
                <li key={section.to}>
                  <NavLink
                    to={section.to}
                    end={section.to === '/impact/'}
                    className={({ isActive }) =>
                      `impacts-sidebar__link${isActive ? ' is-active' : ''}`
                    }
                  >
                    {t(section.label)}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <div className="impacts-main">
          {empty ? (
            <p className="impall-empty">{t('common.willBeUpdatedSoon')}</p>
          ) : notice ? (
            <p className="impacts-notice">{notice}</p>
          ) : (
            <>
              {type === null && (
                <h2 className="impall-section-title">{t('impact.all')}</h2>
              )}
              {cards.length > 0 ? (
                <div className="impall-grid">
                  {cards.map((item) => (
                    <ImpallCard
                      key={item.id}
                      item={item}
                      t={t}
                      language={language}
                      useLivePostAge={type === 'Post'}
                    />
                  ))}
                </div>
              ) : (
                <p className="impall-empty">{t('common.willBeUpdatedSoon')}</p>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  )
}
