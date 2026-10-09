import { NavLink, Link } from 'react-router-dom'
import { newsPosts } from './../data/newsPosts.js'
import { blogsPosts } from './../data/blogsPosts.js'
import { reportPosts } from './../data/reportPosts.js'
import { postPosts } from './../data/postPosts.js'
import { formatRelativeDate } from './../sections/CommunityUpdates.jsx'
import './ImpactsLayout.css'

/** Sections of the Impact area, shown as the "Impacts" sidebar. */
export const impactSections = [
  { label: 'All', to: '/impact/' },
  { label: 'News', to: '/impact/news/' },
  { label: 'Blogs', to: '/impact/blogs/' },
  { label: 'Report', to: '/impact/report/' },
  { label: 'Post', to: '/impact/post/' },
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

/** Abbreviated month names, used when formatting each item's date. */
const monthAbbr = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

/**
 * A single card rendered by the combined "All" list or a type filter.
 * Same 2-column grid style as the existing card grid, but each card is
 * built from the full item record (image, date, weeks-ago, caption,
 * read time, button + link) instead of a bare excerpt.
 */
function ImpallCard({ item }) {
  const date = item.date ? new Date(item.date) : null
  // Badge counts live from the stored date on every render (Today →
  // Yesterday → N days/weeks ago), so it moves forward automatically.
  const relativeLabel = item.date ? formatRelativeDate(item.date) : ''
  const formattedDate = date
    ? `${monthAbbr[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
    : ''

  return (
    <article className="impall-card">
      <div
        className={`impall-card__image${item.image ? '' : ' impall-card__image--empty'}`}
      >
        {item.image ? (
          <img src={item.image} alt={item.alt ?? item.title} loading="lazy" />
        ) : (
          /* Same "Photo coming soon" fallback as the Updates cards. */
          <span className="impall-card__placeholder">Photo coming soon</span>
        )}
        {relativeLabel !== '' && (
          <span className="impall-card__badge">{relativeLabel}</span>
        )}
      </div>

      <div className="impall-card__body">
        <p className="impall-card__label">
          <span aria-hidden="true" className="impall-card__label-dot" />
          {item.type}
        </p>
        <h3 className="impall-card__title">{item.title}</h3>
        {item.caption && <p className="impall-card__caption">{item.caption}</p>}
        <p className="impall-card__text">{item.excerpt}</p>
        {formattedDate && <p className="impall-card__date">{formattedDate}</p>}
        {item.readTime && <p className="impall-card__readtime">{item.readTime}</p>}
        {item.button && (
          <Link to={item.to} className="impall-card__button">
            {item.button}
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
  const cards = type
    ? allPosts.filter((item) => item.type === type)
    : allPosts

  return (
    <section className="section container">
      <div className="impacts-layout">
        <aside className="impacts-sidebar">
          <h2 className="impacts-sidebar__title">Impact</h2>
          <nav aria-label="Impact sections">
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
                    {section.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <div className="impacts-main">
          {empty ? (
            <p className="impall-empty">Nothing to show yet.</p>
          ) : notice ? (
            <p className="impacts-notice">{notice}</p>
          ) : (
            <>
              {type === null && (
                <h2 className="impall-section-title">All</h2>
              )}
              {cards.length > 0 ? (
                <div className="impall-grid">
                  {cards.map((item) => (
                    <ImpallCard key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <p className="impall-empty">Nothing to show yet.</p>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  )
}
