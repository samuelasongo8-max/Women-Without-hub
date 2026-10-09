import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { mainNav, donateCta } from '../data/site.js'
import LanguageSwitcher from './LanguageSwitcher.jsx'
import './Navbar.css'

// Route → i18n key, so the navigation labels translate while the design
// (uppercase via CSS) stays identical.
const NAV_LABEL_KEY = {
  '/': 'nav.home',
  '/about/': 'nav.about',
  '/about/our-story/': 'nav.ourStory',
  '/about/our-team/': 'nav.ourTeam',
  '/programs/': 'nav.programs',
  '/impact/': 'nav.impact',
  '/impact/news/': 'nav.news',
  '/impact/blogs/': 'nav.blogs',
  '/impact/report/': 'nav.report',
  '/get-involved/': 'nav.getInvolved',
  '/resources/': 'nav.resources',
  '/contact/': 'nav.contact',
}

export default function Navbar() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [openSub, setOpenSub] = useState(null)
  const { pathname } = useLocation()

  // Translate a nav item's label; fall back to the data label if unmapped.
  const label = (item) =>
    t(NAV_LABEL_KEY[item.to] ?? '', { defaultValue: item.label })

  // Close the mobile menu (and any open sub-menu) whenever a link is clicked.
  const close = () => {
    setOpen(false)
    setOpenSub(null)
  }

  const toggleSub = (to) => {
    setOpenSub((current) => (current === to ? null : to))
  }

  // Escape closes an open dropdown; focus stays where it was.
  const closeSubOnEscape = (event) => {
    if (event.key === 'Escape') setOpenSub(null)
  }

  return (
    <header className="auvd-header">
      <div className="auvd-header-inner">
        <Link to="/" className="auvd-brand" onClick={close}>
          <img
            className="auvd-brand-logo"
            src="/women-hub-logo.png"
            alt="Women Without Borders Hub"
          />
        </Link>

        <button
          type="button"
          className="auvd-nav-toggle"
          aria-expanded={open}
          aria-controls="auvd-primary-nav"
          aria-label={open ? t('a11y.closeMenu') : t('a11y.openMenu')}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="auvd-nav-toggle-bar" />
          <span className="auvd-nav-toggle-bar" />
          <span className="auvd-nav-toggle-bar" />
        </button>

        <nav
          id="auvd-primary-nav"
          className={`auvd-nav${open ? ' is-open' : ''}`}
          aria-label={t('a11y.primaryNav')}
        >
          <ul className="auvd-nav-list">
            {mainNav.map((item) =>
              item.children && item.children.length > 0 ? (
                <li
                  key={item.to}
                  className={`auvd-nav-item--has-sub${openSub === item.to ? ' is-open' : ''}`}
                  onMouseEnter={() => setOpenSub(item.to)}
                  onMouseLeave={() => setOpenSub(null)}
                >
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `auvd-nav-link auvd-nav-parent-link${
                        isActive || pathname.startsWith(item.to)
                          ? ' is-active'
                          : ''
                      }`
                    }
                    aria-haspopup="true"
                    aria-expanded={openSub === item.to}
                    onFocus={() => setOpenSub(item.to)}
                    onBlur={(event) => {
                      const next = event.relatedTarget
                      if (
                        !next ||
                        !event.currentTarget.parentElement.contains(next)
                      ) {
                        setOpenSub(null)
                      }
                    }}
                    onKeyDown={closeSubOnEscape}
                    onClick={close}
                  >
                    {label(item)}
                    <span className="auvd-nav-chevron" aria-hidden="true">
                      ▾
                    </span>
                  </NavLink>
                  <button
                    type="button"
                    className="auvd-nav-sub-toggle"
                    aria-expanded={openSub === item.to}
                    aria-label={t(
                      openSub === item.to ? 'nav.collapseSub' : 'nav.expandSub',
                      { label: label(item) },
                    )}
                    onClick={() => toggleSub(item.to)}
                  >
                    <span className="auvd-nav-chevron" aria-hidden="true">
                      ▾
                    </span>
                  </button>
                  <ul
                    className="auvd-nav-sub"
                    role="menu"
                    onKeyDown={closeSubOnEscape}
                  >
                    {item.children.map((child) => (
                      <li key={child.to} role="none">
                        <NavLink
                          to={child.to}
                          role="menuitem"
                          className={({ isActive }) =>
                            `auvd-nav-sub-link${isActive ? ' is-active' : ''}`
                          }
                          onClick={close}
                        >
                          {label(child)}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </li>
              ) : (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `auvd-nav-link${isActive ? ' is-active' : ''}`
                    }
                    onClick={close}
                  >
                    {label(item)}
                  </NavLink>
                </li>
              ),
            )}
          </ul>
          <LanguageSwitcher />
          <Link
            to={donateCta.to}
            className="auvd-donate-btn"
            onClick={close}
            aria-current={
              pathname === donateCta.to ? 'page' : undefined
            }
          >
            {t('nav.donate')}
          </Link>
        </nav>
      </div>
    </header>
  )
}
