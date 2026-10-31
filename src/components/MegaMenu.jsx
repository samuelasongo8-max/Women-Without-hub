import { Link } from 'react-router-dom'
import './MegaMenu.css'

export default function MegaMenu({
  id = 'about-mega-menu',
  label,
  image,
  imagePosition,
  imageAlt,
  description,
  aboutLabel,
  aboutTo,
  links,
  open,
  onNavigate,
  firstLinkChevron = true,
}) {
  return (
    <section
      id={id}
      className={`mega-menu${open ? ' is-open' : ''}`}
      aria-label={label}
      aria-hidden={!open}
      inert={open ? undefined : ''}
    >
      <div className="mega-menu__inner">
        <div className="mega-menu__feature">
          <img
            className="mega-menu__image"
            src={image}
            alt={imageAlt}
            style={imagePosition ? { objectPosition: imagePosition } : undefined}
          />
          <p className="mega-menu__description">{description}</p>
          <Link
            className="mega-menu__about-link"
            to={aboutTo}
            onClick={onNavigate}
          >
            <span className="mega-menu__about-arrow" aria-hidden="true">&gt;</span>
            <span>{aboutLabel}</span>
          </Link>
        </div>
        <div className="mega-menu__divider" aria-hidden="true" />
        <nav className="mega-menu__links" aria-label={label}>
          <ul>
            {links.map((link, index) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  onClick={onNavigate}
                  className={`mega-menu__link${link.isActive ? ' is-active' : ''}`}
                  aria-current={link.isActive ? 'page' : undefined}
                  aria-label={link.label}
                >
                  <span>{link.label}</span>
                  {(link.hasChildren || (firstLinkChevron && index === 0)) && (
                    <span className="mega-menu__chevron" aria-hidden="true">
                      &gt;
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  )
}
