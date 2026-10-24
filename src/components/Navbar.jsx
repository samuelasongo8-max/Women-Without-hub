import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { mainNav, donateCta } from '../data/site.js'
import LanguageSwitcher from './LanguageSwitcher.jsx'
import './Navbar.css'

const SiteSearchPanel = lazy(() => import('./SiteSearchPanel.jsx'))

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
  const [searchOpen, setSearchOpen] = useState(false)
  const navRef = useRef(null)
  const navToggleRef = useRef(null)
  const menuImageRef = useRef(null)
  const searchButtonRef = useRef(null)
  const { pathname } = useLocation()
  const orgName = t('nav.orgName', { defaultValue: 'Women Without Hub' })
  const orgNameWords = orgName.split(/\s+(?=[^ ]+$)/)

  // Translate a nav item's label; fall back to the data label if unmapped.
  const label = (item) =>
    t(NAV_LABEL_KEY[item.to] ?? '', { defaultValue: item.label })

  // Close the mobile menu (and any open sub-menu) whenever a link is clicked.
  const close = () => {
    setOpen(false)
    setOpenSub(null)
    setSearchOpen(false)
  }

  const loadMobileMenuImage = () => {
    if (menuImageRef.current) return
    const image = new Image()
    image.src = '/images/mobile-menu-bg.webp'
    menuImageRef.current = image
  }

  useEffect(() => {
    let idleId
    let timeoutId
    const loadWhenIdle = () => loadMobileMenuImage()

    if (!window.matchMedia('(max-width: 1000px)').matches) return undefined

    if ('requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(loadWhenIdle, { timeout: 2000 })
    } else {
      timeoutId = window.setTimeout(loadWhenIdle, 1000)
    }

    return () => {
      if (idleId !== undefined && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleId)
      }
      if (timeoutId !== undefined) window.clearTimeout(timeoutId)
    }
  }, [])

  useEffect(() => {
    setOpen(false)
    setOpenSub(null)
    setSearchOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!open) return undefined

    const previousOverflow = document.body.style.overflow
    const previousHtmlOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    const focusableElements = () => {
      const selector =
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      const elements = [
        ...(navRef.current?.querySelectorAll(selector) ?? []),
        ...(document.querySelector('.auvd-search-panel')?.querySelectorAll(
          selector,
        ) ?? []),
      ]
      return elements.filter(
        (element) =>
          element.getClientRects().length > 0 &&
          window.getComputedStyle(element).visibility !== 'hidden',
      )
    }

    const focusFrame = window.requestAnimationFrame(() => {
      focusableElements()[0]?.focus()
    })

    const handleMenuKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        close()
        navToggleRef.current?.focus()
        return
      }

      if (event.key !== 'Tab') return
      const focusable = focusableElements()
      if (!focusable.length) {
        event.preventDefault()
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      } else if (!navRef.current?.contains(document.activeElement)) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleMenuKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.documentElement.style.overflow = previousHtmlOverflow
      window.cancelAnimationFrame(focusFrame)
      document.removeEventListener('keydown', handleMenuKeyDown)
      navToggleRef.current?.focus()
    }
  }, [open])

  const closeSearch = useCallback(({ restoreFocus = false } = {}) => {
    setSearchOpen(false)
    if (restoreFocus) {
      window.requestAnimationFrame(() => searchButtonRef.current?.focus())
    }
  }, [])

  const toggleSub = (to) => {
    setOpenSub((current) => (current === to ? null : to))
  }

  // Escape closes an open dropdown; focus stays where it was.
  const closeSubOnEscape = (event) => {
    if (event.key === 'Escape') setOpenSub(null)
  }

  return (
    <header className={`auvd-header${searchOpen ? ' auvd-header--search-open' : ''}`}>
      <div className="auvd-header-inner">
        <Link
          to="/"
          className="auvd-brand"
          onClick={close}
          aria-label={`${orgName}, home`}
        >
          <picture className="auvd-brand-logo-picture">
            <source srcSet="/images/women-hub-logo.webp" type="image/webp" />
            <img
              className="auvd-brand-logo"
              src="/images/women-hub-logo.png"
              alt=""
              width="264"
              height="264"
              decoding="async"
            />
          </picture>
          <span className="auvd-brand-name">
            <span>{orgNameWords[0]}</span>
            <span>{orgNameWords[1]}</span>
          </span>
        </Link>

        <button
          ref={navToggleRef}
          type="button"
          className="auvd-nav-toggle"
          aria-expanded={open}
          aria-controls="auvd-primary-nav"
          aria-label={open ? t('a11y.closeMenu') : t('a11y.openMenu')}
          onPointerDown={loadMobileMenuImage}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="auvd-nav-toggle-bar" />
          <span className="auvd-nav-toggle-bar" />
          <span className="auvd-nav-toggle-bar" />
        </button>

        <nav
          ref={navRef}
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
            <li className="auvd-nav-search-item">
              <button
                ref={searchButtonRef}
                type="button"
                className="auvd-search-toggle"
                aria-label={t('search.open', { defaultValue: 'Search' })}
                aria-expanded={searchOpen}
                aria-controls="site-search"
                onClick={() => setSearchOpen((isOpen) => !isOpen)}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle cx="10.8" cy="10.8" r="6.8" />
                  <path d="m16 16 5 5" />
                </svg>
              </button>
            </li>
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
      {searchOpen && (
        <Suspense
          fallback={
            <div className="auvd-search-loading" role="status">
              {t('search.loading', { defaultValue: 'Loading search...' })}
            </div>
          }
        >
          <SiteSearchPanel onClose={closeSearch} />
        </Suspense>
      )}
    </header>
  )
}
