import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ORG_NAME } from '../config/site.js'
import './CommunityUpdates.css'

const MONTH_ABBR = [
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

/* "Jun 18, 2026" style date for update cards. */
export function formatPostDate(dateString) {
  if (!dateString) return ''
  const d = new Date(dateString)
  if (Number.isNaN(d.getTime())) return ''
  return `${MONTH_ABBR[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
}

/* Systematic relative date, counted live from today on every render, so
 * the label moves day by day (Today → Yesterday → N days ago →
 * N weeks ago) instead of showing one fixed string. Shared by the
 * Community Updates cards and the Impact Post badges. */
export function formatRelativeDate(dateString) {
  if (!dateString) return ''
  const DAY = 24 * 60 * 60 * 1000
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const d = new Date(dateString)
  if (Number.isNaN(d.getTime())) return ''
  d.setHours(0, 0, 0, 0)
  const diffDays = Math.round((today - d) / DAY)
  if (diffDays <= 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  const weeks = Math.floor(diffDays / 7)
  return `${weeks} week${weeks === 1 ? '' : 's'} ago`
}

// Community updates — photos served from /public.
// One source of truth; /updates/ and the Home section reuse this data.
// Any update with image: null shows a placeholder (photo coming soon).
// Adding an image path to the data restores the real photo automatically.
export const updates = [
  {
    slug: 'building-pathways-for-women-and-girls',
    title: 'Building Pathways for Women and Girls in Kakuma',
    image: '/images/women-hub7.png',
    alt: `Women and girls learning together at ${ORG_NAME} in Kakuma`,
    to: '/updates/building-pathways-for-women-and-girls',
    // Publish date (kept): drives the live "N days/weeks ago" counting.
    date: '2026-05-30',
    fullText: `What happens when women in Kakuma gain access to education, skills, and opportunity?

${ORG_NAME} is building pathways for women and girls in Kakuma to learn, earn, and lead.

Because when women gain access, communities gain resilience.

${ORG_NAME}, Kakuma, is a community-led initiative empowering women and girls in Kakuma refugee camp through:

- Education,
- Health advocacy,
- Entrepreneurship,
- Technical skills development.

We are building pathways for women and girls to access the tools, knowledge, and opportunities needed to create independent futures and stronger communities.

Our work is focused on four core pillars:

- Education Advocacy
- Health Advocacy
- Entrepreneurship Advocacy
- Technical Skills Development

This is more than a program.

It is a platform for dignity, resilience, and economic inclusion.

We believe women in refugee communities should not be defined by displacement but by their circumstances, potential, leadership, and power to shape the future.

${ORG_NAME} exists to turn access into opportunity, and opportunity into long-term transformation.

If you care about women's empowerment, refugee livelihoods, and inclusive development, we'd love to connect.`,
  },
  {
    slug: 'graduation-celebration-skills',
    title: 'Graduation Day: Young Women Complete Tailoring and Digital Skills Training',
    image: '/images/graduation-at-women-without-border.jpg',
    alt: 'Young women graduates holding their training certificates',
    to: '/updates/graduation-celebration-skills',
    // Publish date (kept): drives the live "N days/weeks ago" counting.
    date: '2026-06-18',
    fullText: `For the women of ${ORG_NAME}, this graduation was more than certificates; it was a celebration of resilience, courage, growth, and new possibilities.

Behind every certificate is a woman who chose to learn, build new skills, find her voice, and create a better future for herself, her family, and her community.

We are grateful to Teach for Community for hosting this special ceremony and celebrating these women with us.

When women learn, communities grow. When women lead, communities move forward.

Congratulations to our graduates!`,
  },
  {
    slug: 'health-advocacy',
    title: `Advocating for Health: ${ORG_NAME}`,
    image: '/images/avocating-health.jpg',
    alt: 'Health advocacy for refugee and host communities in Kakuma',
    to: '/updates/health-advocacy',
    fullText: `Health is a human right, not a privilege.

Yet many women, children, and displaced families still struggle to access basic healthcare, information, and support.

Today at ${ORG_NAME}, we are learning, engaging, and advocating for stronger health awareness and community well-being.

Through health advocacy, we believe communities become stronger, safer, and more empowered to make informed decisions about their lives and futures.

From maternal health and mental wellness to hygiene awareness and access to healthcare services, every conversation matters.

Healthy communities build stronger futures.

Awareness saves lives.

Advocacy creates change.

Together, we continue raising voices for equitable and inclusive healthcare for refugee and host communities in Kakuma and beyond.`,
  },
]

/**
 * Card markup — identical for the Home section and the /updates/ page.
 * The image slot shows a placeholder when image is null.
 */
const cards = updates.map((u) => (
  <article key={u.slug} className="updates-card">
    <Link
      to={u.to}
      className="updates-img-link"
      tabIndex={-1}
      aria-hidden="true"
    >
      {u.image ? (
        <img src={u.image} alt={u.alt} loading="lazy" />
      ) : (
        <div className="updates-card__placeholder">
          <svg width="40" height="40" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 8h3l2-2h6l2 2h3v11H4z" fill="none" stroke="#2E8C8C" strokeWidth="1.8" strokeLinejoin="round" /><circle cx="12" cy="13" r="3.2" fill="none" stroke="#2E8C8C" strokeWidth="1.8" /></svg>
          <p className="updates-card__placeholder-text">Photo coming soon</p>
        </div>
      )}
    </Link>
    <h3>
      <Link to={u.to}>{u.title}</Link>
    </h3>
    <p
      className="updates-card__preview"
      dangerouslySetInnerHTML={{
        __html: u.fullText.split('\n\n')[0] || u.text,
      }}
    />
    {u.date ? (
      <p className="updates-card__date">
        {formatPostDate(u.date)} · {formatRelativeDate(u.date)}
      </p>
    ) : null}
    <Link
      to={u.to}
      className="updates-card__readmore"
    >
      Read more <span aria-hidden="true">›</span>
    </Link>
  </article>
))

export default function CommunityUpdatesSection({ isPage, variant }) {
  const trackRef = useRef(null)
  const page = Boolean(isPage) || variant === 'page'
  const [progress, setProgress] = useState(0)

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
          <h1>
            Community<em>Updates &amp; Stories:</em>
          </h1>
        ) : (
          <h2>
            Community<em>Updates &amp; Stories:</em>
          </h2>
        )}
        {!page && (
          <Link to="/updates/" className="updates-viewall">
            View All
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
              aria-label="Previous updates"
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
              aria-label="Next updates"
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
