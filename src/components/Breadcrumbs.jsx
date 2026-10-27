import { useLocation, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { breadcrumbsFor } from '../data/site.js'

// Route → breadcrumb i18n key. Unmapped routes (dynamic program /
// get-involved detail pages) keep their data label as a fallback.
const CRUMB_KEY = {
  '/': 'breadcrumb.home',
  '/about/': 'breadcrumb.about',
  '/about/our-team/': 'breadcrumb.ourTeam',
  '/about/our-story/': 'breadcrumb.ourStory',
  '/programs/': 'breadcrumb.programs',
  '/programs/second-chance-education/': 'programs.secondChanceTitle',
  '/programs/livelihood-economic-empowerment/our-approach/':
    'programs.livelihood.ourApproach.title',
  '/impact/': 'breadcrumb.impact',
  '/updates/': 'breadcrumb.communityUpdates',
  '/impact/news/': 'breadcrumb.news',
  '/impact/blogs/': 'breadcrumb.blogs',
  '/impact/report/': 'breadcrumb.report',
  '/impact/post/': 'breadcrumb.post',
  '/get-involved/': 'breadcrumb.getInvolved',
  '/get-involved/volunteer/': 'volunteer.breadcrumb',
  '/resources/': 'breadcrumb.resources',
  '/safeguarding/': 'breadcrumb.safeguarding',
  '/contact/': 'breadcrumb.contact',
}

/**
 * Breadcrumbs communicate the site hierarchy to visitors and search engines.
 * Trail is derived from the central routeMeta map in src/data/site.js, then
 * each label is translated where a key exists.
 */
export default function Breadcrumbs() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const trail = breadcrumbsFor(pathname)

  // Home page doesn't need a breadcrumb trail (nav already shows position).
  if (trail.length <= 1) return null

  // Use the i18n label when a key exists, otherwise the route label.
  // An empty key would make i18next return an empty string instead of
  // the default value, so the fallback is applied explicitly.
  const label = (crumb) => {
    const key = CRUMB_KEY[crumb.to]
    if (!key) return crumb.label
    return t(key, { defaultValue: crumb.label })
  }

  return (
    <nav className="breadcrumbs container" aria-label="Breadcrumb">
      <ol>
        {trail.map((crumb) => (
          <li key={crumb.to}>
            {crumb.isLast ? (
              <span aria-current="page">{label(crumb)}</span>
            ) : (
              <Link to={crumb.to}>{label(crumb)}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
