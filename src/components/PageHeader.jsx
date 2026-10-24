import Breadcrumbs from './Breadcrumbs.jsx'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**>
 * Consistent page header: breadcrumbs (communicates hierarchy to Google),
 * H1 and optional intro.
 */
export default function PageHeader({
  title,
  intro,
  introContent,
  image,
  imageWebp,
  backgroundPosition = 'center',
  minHeight = '420px',
  className = '',
}) {
  const location = useLocation()

  // Scroll to top when navigating to this page
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <section
      className={`page-header${className ? ` ${className}` : ''}`}
      style={{
        backgroundImage: image ? `url(${image})` : className ? undefined : 'none',
        backgroundPosition: image ? backgroundPosition : undefined,
        backgroundSize: image ? 'cover' : undefined,
        backgroundRepeat: image ? 'no-repeat' : undefined,
        backgroundAttachment: image ? 'scroll' : undefined,
        minHeight: minHeight ?? undefined,
      }}
      aria-label={`Hero background image: ${title} page hero`}
      fetchPriority="high"
    >
      <div className="page-header__overlay" aria-hidden="true" />
      <div className="container">
        <h1>{title}</h1>
        {introContent || (intro && <p className="page-intro">{intro}</p>)}
      </div>
    </section>
  )
}