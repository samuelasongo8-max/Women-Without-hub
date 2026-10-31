import { useLocation, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { breadcrumbsFor } from '../data/site.js'

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

  return (
    <nav
      className="breadcrumbs container"
      aria-label={t('breadcrumb.label', { defaultValue: 'Breadcrumb' })}
    >
      <ol>
        {trail.map((crumb) => (
          <li key={crumb.to}>
            {crumb.isLast ? (
              <span aria-current="page">{t(crumb.labelKey)}</span>
            ) : (
              <Link to={crumb.to}>{t(crumb.labelKey)}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
