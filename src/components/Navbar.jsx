import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { mainNav, donateCta } from '../data/site.js'
import { ORG_NAME } from '../config/site.js'
import LanguageSwitcher from './LanguageSwitcher.jsx'
import MegaMenu from './MegaMenu.jsx'
import './Navbar.css'

const SiteSearchPanel = lazy(() => import('./SiteSearchPanel.jsx'))

export default function Navbar() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [openSub, setOpenSub] = useState(null)
  const [openMegaMenu, setOpenMegaMenu] = useState(null)
  const [isMobileNav, setIsMobileNav] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const navRef = useRef(null)
  const headerRef = useRef(null)
  const navToggleRef = useRef(null)
  const aboutItemRef = useRef(null)
  const aboutTriggerRef = useRef(null)
  const impactItemRef = useRef(null)
  const impactTriggerRef = useRef(null)
  const menuImageRef = useRef(null)
  const searchButtonRef = useRef(null)
  const { pathname } = useLocation()
  const orgName = t('nav.orgName', { defaultValue: ORG_NAME })
  const orgNameWords = orgName.split(/\s+(?=[^ ]+$)/)

  const label = (item) => t(item.label)

  // Close the mobile menu (and any open sub-menu) whenever a link is clicked.
  const close = () => {
    setOpen(false)
    setOpenSub(null)
    setOpenMegaMenu(null)
    setSearchOpen(false)
  }

  const aboutLinks = [
    { key: 'megaMenu.whoWeAre', fallback: 'Who we are', to: '/about/' },
    { key: 'nav.ourStory', fallback: 'Our Story', to: '/about/our-story/' },
    { key: 'nav.ourTeam', fallback: 'Our Team', to: '/about/our-team/' },
    {
      key: 'megaMenu.ourImpact',
      fallback: 'Our impact',
      to: '/impact/',
    },
    {
      key: 'nav.getInvolved',
      fallback: 'Get Involved',
      to: '/get-involved/',
      hasChildren: true,
    },
    {
      key: 'megaMenu.contactUs',
      fallback: 'Contact us',
      to: '/contact/',
    },
  ].map((item) => ({
    ...item,
    label: t(item.key, { defaultValue: item.fallback }),
    isActive: pathname.startsWith(item.to),
  }))

  const impactLinks = [
    { key: 'megaMenu.impactOverview', to: '/impact/', end: true },
    { key: 'news.title', to: '/impact/news/' },
    { key: 'blogs.title', to: '/impact/blogs/' },
    { key: 'report.title', to: '/impact/report/' },
    { key: 'post.title', to: '/impact/post/' },
  ].map((item) => ({
    ...item,
    label: t(item.key),
    isActive: item.end ? pathname === item.to : pathname.startsWith(item.to),
  }))

  const toggleMegaMenu = (menu, to) => {
    if (isMobileNav) {
      setOpenSub((current) => (current === to ? null : to))
      setOpenMegaMenu(null)
      return
    }

    setOpenSub(null)
    setOpenMegaMenu((current) => (current === menu ? null : menu))
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
    setOpenMegaMenu(null)
    setSearchOpen(false)
  }, [pathname])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 1000px)')
    const updateViewport = () => {
      setIsMobileNav(mediaQuery.matches)
      setOpenMegaMenu(null)
      setOpenSub(null)
    }
    updateViewport()
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', updateViewport)
      return () => mediaQuery.removeEventListener('change', updateViewport)
    }

    mediaQuery.addListener(updateViewport)
    return () => mediaQuery.removeListener(updateViewport)
  }, [])

  useEffect(() => {
    if (!openMegaMenu) return undefined

    const handlePointerDown = (event) => {
      const megaMenu = headerRef.current?.querySelector(
        `#${openMegaMenu}-mega-menu`,
      )
      if (
        !aboutItemRef.current?.contains(event.target) &&
        !impactItemRef.current?.contains(event.target) &&
        !megaMenu?.contains(event.target)
      ) {
        setOpenMegaMenu(null)
      }
    }
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setOpenMegaMenu(null)
        const trigger =
          openMegaMenu === 'about'
            ? aboutTriggerRef.current
            : impactTriggerRef.current
        trigger?.focus()
      }
    }
    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [openMegaMenu])

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
    <header
      ref={headerRef}
      className={`auvd-header${searchOpen ? ' auvd-header--search-open' : ''}${openMegaMenu ? ' auvd-header--about-open' : ''}`}
    >
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
              item.to === '/about/' || item.to === '/impact/' ? (
                (() => {
                  const isAboutMenu = item.to === '/about/'
                  const menuName = isAboutMenu ? 'about' : 'impact'
                  const menuOpen = openMegaMenu === menuName
                  const mobileOpen = openSub === item.to
                  const links = isAboutMenu ? aboutLinks : impactLinks
                  const mobileLinks = isAboutMenu ? links : links.slice(1)
                  const menuId = `${menuName}-mega-menu`
                  const mobileLinksId = `${menuName}-mobile-links`
                  const itemRef = isAboutMenu ? aboutItemRef : impactItemRef
                  const triggerRef = isAboutMenu
                    ? aboutTriggerRef
                    : impactTriggerRef
                  const overviewLabel = t(
                    isAboutMenu ? 'megaMenu.aboutUs' : 'megaMenu.impactOverview',
                  )

                  return (
                    <li
                      key={item.to}
                      ref={itemRef}
                      className={`auvd-nav-item--mega auvd-nav-item--${menuName}${menuOpen ? ' is-open' : ''}${mobileOpen ? ' mobile-open' : ''}`}
                    >
                      <button
                        ref={triggerRef}
                        type="button"
                        className={`auvd-nav-link auvd-nav-parent-link auvd-nav-about-trigger${
                          menuOpen ||
                          mobileOpen ||
                          pathname.startsWith(item.to) ||
                          (isAboutMenu && pathname.startsWith('/get-involved/'))
                            ? ' is-active'
                            : ''
                        }`}
                        aria-haspopup="true"
                        aria-expanded={isMobileNav ? mobileOpen : menuOpen}
                        aria-controls={
                          isMobileNav ? mobileLinksId : menuId
                        }
                        onClick={() => toggleMegaMenu(menuName, item.to)}
                      >
                        {label(item)}
                        <span className="auvd-nav-chevron" aria-hidden="true">
                          ▾
                        </span>
                      </button>
                      <ul
                        id={mobileLinksId}
                        className="auvd-nav-sub auvd-nav-about-mobile"
                      >
                        <li>
                          <NavLink
                            to={item.to}
                            end={isAboutMenu ? false : true}
                            className={({ isActive }) =>
                              `auvd-nav-sub-link${isActive ? ' is-active' : ''}`
                            }
                            onClick={close}
                          >
                            {overviewLabel}
                          </NavLink>
                        </li>
                        {mobileLinks.map((child) => (
                          <li key={child.to}>
                            <NavLink
                              to={child.to}
                              className={({ isActive }) =>
                                `auvd-nav-sub-link${isActive || child.isActive ? ' is-active' : ''}`
                              }
                              onClick={close}
                            >
                              {child.label}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </li>
                  )
                })()
              ) : item.children && item.children.length > 0 ? (
                <li
                  key={item.to}
                  className={`auvd-nav-item--has-sub${openSub === item.to ? ' is-open' : ''}`}
                  onMouseEnter={() => {
                    setOpenMegaMenu(null)
                    setOpenSub(item.to)
                  }}
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
                    onFocus={() => {
                      setOpenMegaMenu(null)
                      setOpenSub(item.to)
                    }}
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
      <MegaMenu
        id="about-mega-menu"
        label={t('nav.about')}
        image="/images/about-banner-desktop.webp"
        imageAlt={t('megaMenu.imageAlt', {
          defaultValue: 'Community members learning together',
        })}
        description={t('megaMenu.aboutDescription', {
          defaultValue:
            'We work alongside girls and young women in Kakuma, creating opportunities to learn, build confidence, and shape a brighter future.',
        })}
        aboutLabel={t('megaMenu.aboutUs', {
          defaultValue: 'About us',
        })}
        aboutTo="/about/"
        links={aboutLinks}
        open={openMegaMenu === 'about'}
        onNavigate={close}
      />
      <MegaMenu
        id="impact-mega-menu"
        label={t('nav.impact')}
        image="/Working%20together.jpg"
        imagePosition="center top"
        imageAlt={t('megaMenu.impactImageAlt')}
        description={t('megaMenu.impactDescription')}
        aboutLabel={t('megaMenu.impactOverview')}
        aboutTo="/impact/"
        links={impactLinks}
        open={openMegaMenu === 'impact'}
        firstLinkChevron={false}
        onNavigate={close}
      />
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
