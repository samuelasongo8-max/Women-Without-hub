import Breadcrumbs from './Breadcrumbs.jsx'
import Reveal from './Reveal.jsx'
import { useTranslation } from 'react-i18next'

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
  revealTitle = false,
  revealIntro = false,
  revealDirection = 'up',
  revealDelay = 0,
  revealDuration = 650,
}) {
  const { t } = useTranslation()

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
      aria-label={t('a11y.heroLabel', { title })}
      fetchPriority="high"
    >
      <div className="page-header__overlay" aria-hidden="true" />
      <div className="container">
        {revealTitle ? (
          <Reveal as="h1" direction={revealDirection} delay={revealDelay} duration={revealDuration}>
            {title}
          </Reveal>
        ) : (
          <h1>{title}</h1>
        )}
        {revealIntro ? (
          introContent || (intro && (
            <Reveal as="p" className="page-intro" direction="up" delay={revealDelay + 120} duration={revealDuration}>
              {intro}
            </Reveal>
          ))
        ) : (
          introContent || (intro && <p className="page-intro">{intro}</p>)
        )}
      </div>
    </section>
  )
}