import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { LANGUAGES } from '../i18n/languages.js'
import { setLanguage } from '../i18n/index.js'
import './LanguageSwitcher.css'

/**
 * Language dropdown for the navigation bar. Opens on hover (desktop) or click
 * (touch/keyboard), shows each language in its own script, and highlights the
 * current one. Fully keyboard accessible (Enter/Space open, arrows move,
 * Escape closes, Home/End jump, Tab closes). Choice persists via localStorage
 * (handled by i18next) and applies instantly without a page reload.
 */
export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const rootRef = useRef(null)
  const triggerRef = useRef(null)
  const itemRefs = useRef([])

  const current = i18n.resolvedLanguage || i18n.language || 'en'
  const currentMeta = LANGUAGES.find((l) => l.code === current) || LANGUAGES[0]

  // Close when clicking outside the switcher.
  useEffect(() => {
    if (!open) return
    function onPointerDown(event) {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false)
        setActiveIndex(-1)
      }
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('touchstart', onPointerDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('touchstart', onPointerDown)
    }
  }, [open])

  // Move focus to the active option whenever it changes while open.
  useEffect(() => {
    if (open && activeIndex >= 0 && itemRefs.current[activeIndex]) {
      itemRefs.current[activeIndex].focus()
    }
  }, [open, activeIndex])

  function openMenu(startIndex) {
    setOpen(true)
    const idx = startIndex ?? Math.max(0, LANGUAGES.findIndex((l) => l.code === current))
    setActiveIndex(idx)
  }

  function closeMenu(returnFocus) {
    setOpen(false)
    setActiveIndex(-1)
    if (returnFocus && triggerRef.current) triggerRef.current.focus()
  }

  function choose(code) {
    setLanguage(code)
    closeMenu(true)
  }

  function onTriggerKeyDown(event) {
    if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
      event.preventDefault()
      openMenu()
    } else if (event.key === 'Escape') {
      closeMenu(false)
    }
  }

  function onMenuKeyDown(event) {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        setActiveIndex((i) => (i + 1) % LANGUAGES.length)
        break
      case 'ArrowUp':
        event.preventDefault()
        setActiveIndex((i) => (i - 1 + LANGUAGES.length) % LANGUAGES.length)
        break
      case 'Home':
        event.preventDefault()
        setActiveIndex(0)
        break
      case 'End':
        event.preventDefault()
        setActiveIndex(LANGUAGES.length - 1)
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        if (activeIndex >= 0) choose(LANGUAGES[activeIndex].code)
        break
      case 'Escape':
        event.preventDefault()
        closeMenu(true)
        break
      case 'Tab':
        closeMenu(false)
        break
      default:
        break
    }
  }

  return (
    <div
      className="lang-switch"
      ref={rootRef}
      onMouseEnter={() => openMenu()}
      onMouseLeave={() => closeMenu(false)}
    >
      <button
        ref={triggerRef}
        type="button"
        className="lang-switch__trigger"
        aria-label={t('lang.label', { defaultValue: 'Choose language' })}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => (open ? closeMenu(false) : openMenu())}
        onKeyDown={onTriggerKeyDown}
      >
        <svg
          className="lang-switch__icon"
          viewBox="0 0 24 24"
          width="21"
          height="21"
          fill="none"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M4 5h10M9 3v2c0 4-2 7-5 9m2-6c1 2 3 4 5 5m1 6 4.5-11L21 19m-5.5-4h5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span>{t('lang.menu')}</span>
        <span className="lang-switch__current">{currentMeta.short}</span>
        <span className="lang-switch__chevron" aria-hidden="true">
          ▾
        </span>
      </button>

      {open && (
        <ul className="lang-switch__menu" role="listbox" onKeyDown={onMenuKeyDown}>
          {LANGUAGES.map((lang, index) => {
            const isCurrent = lang.code === current
            return (
              <li key={lang.code} role="none">
                <button
                  ref={(el) => (itemRefs.current[index] = el)}
                  type="button"
                  role="option"
                  aria-selected={isCurrent}
                  className={`lang-switch__item${isCurrent ? ' is-current' : ''}`}
                  onClick={() => choose(lang.code)}
                  tabIndex={activeIndex === index ? 0 : -1}
                >
                  <span className="lang-switch__native">{lang.native}</span>
                  <span className="lang-switch__short">{lang.short}</span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}