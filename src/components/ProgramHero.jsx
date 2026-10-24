import { Link } from 'react-router-dom'
import useHeroImagePreload from '../hooks/useHeroImagePreload.js'
import './ProgramHero.css'

/**
 * ProgramHero — compact banner used by every /programs/:slug/ page.
 * Keeps the six programme pages visually identical.
 *
 * Props:
 *   title  (string)   page heading (rendered as <h1>)
 *   intro  (string)   short intro paragraph
 *   image  (object?)  desktop/mobile image base paths (without extensions)
 *                     from the public folder.
 *
 * Breadcrumb is fixed for programme pages:  Home › Programs › <title>
 * (the current page title is not a link).
 *
 * BACKGROUND LOGIC (kept automatic):
 *   - If `image` is undefined, the banner uses a calm teal gradient
 *     (class .program-hero--plain).
 *   - As soon as image paths are passed, the photo appears behind a
 *     dark-teal overlay (class .program-hero--has-image) so the white
 *     text stays readable.
 */
export default function ProgramHero({
  title,
  intro,
  introContent,
  image,
  breadcrumbTrail,
  className = '',
}) {
  const hasImage = Boolean(image)
  useHeroImagePreload(
    hasImage
      ? {
          desktop: `${image.desktop}.webp`,
          mobile: `${image.mobile}.webp`,
        }
      : null,
  )

  return (
    <section
      className={`program-hero ${
        hasImage ? 'program-hero--has-image' : 'program-hero--plain'
      }${className ? ` ${className}` : ''}`}
      style={
        hasImage
          ? {
              '--program-hero-desktop-fallback': `url("${image.desktop}.jpg")`,
              '--program-hero-desktop-image': `image-set(url("${image.desktop}.webp") type("image/webp"), url("${image.desktop}.jpg") type("image/jpeg"))`,
              '--program-hero-mobile-fallback': `url("${image.mobile}.jpg")`,
              '--program-hero-mobile-image': `image-set(url("${image.mobile}.webp") type("image/webp"), url("${image.mobile}.jpg") type("image/jpeg"))`,
            }
          : undefined
      }
    >
      <div className="program-hero__inner">
        <nav className="program-hero__crumb" aria-label="Breadcrumb">
          <ol>
            {(breadcrumbTrail || [
              { label: 'Home', to: '/' },
              { label: 'Programs', to: '/programs/' },
              { label: title },
            ]).map((crumb, index, trail) => (
              <li key={crumb.to || crumb.label}>
                {index === trail.length - 1 ? (
                  <span aria-current="page">{crumb.label}</span>
                ) : (
                  <Link to={crumb.to}>{crumb.label}</Link>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <h1 className="program-hero__title">{title}</h1>
        {introContent ||
          (intro && <p className="program-hero__intro">{intro}</p>)}
      </div>
    </section>
  )
}