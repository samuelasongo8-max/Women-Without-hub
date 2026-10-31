import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './CookieBanner.css'

const CONSENT_KEY = 'cookie-consent'
const CONSENT_EVENT = 'cookie-settings-open'

function readConsent() {
  if (typeof window === 'undefined') return null

  try {
    const stored = window.localStorage.getItem(CONSENT_KEY)
    if (!stored) return null

    const consent = JSON.parse(stored)
    if (
      !consent ||
      !['accepted', 'rejected', 'custom'].includes(consent.status) ||
      typeof consent.analytics !== 'boolean' ||
      typeof consent.marketing !== 'boolean' ||
      typeof consent.date !== 'string'
    ) {
      console.warn('Ignoring invalid cookie consent stored in this browser.')
      return null
    }

    return consent
  } catch (error) {
    console.warn('Could not read cookie consent from browser storage.', error)
    return null
  }
}

function saveConsent(consent) {
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(consent))
  } catch (error) {
    console.error('Could not save cookie consent in browser storage.', error)
  }
}

export default function CookieBanner() {
  const { t } = useTranslation()
  const [consent, setConsent] = useState(readConsent)
  const [isRendered, setIsRendered] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isCustomizing, setIsCustomizing] = useState(false)
  const [analytics, setAnalytics] = useState(() => consent?.analytics ?? false)
  const [marketing, setMarketing] = useState(() => consent?.marketing ?? false)
  const bannerRef = useRef(null)
  const acceptButtonRef = useRef(null)
  const settingsTriggerRef = useRef(null)
  const previousFocusRef = useRef(null)
  const delayedOpenRef = useRef(null)

  const openBanner = useCallback((customize = false) => {
    if (delayedOpenRef.current !== null) {
      window.clearTimeout(delayedOpenRef.current)
      delayedOpenRef.current = null
    }
    setAnalytics(consent?.analytics ?? false)
    setMarketing(consent?.marketing ?? false)
    setIsCustomizing(customize)
    setIsRendered(true)
    window.requestAnimationFrame(() => setIsOpen(true))
  }, [consent])

  useEffect(() => {
    if (consent) return undefined

    delayedOpenRef.current = window.setTimeout(() => openBanner(), 1000)
    return () => {
      if (delayedOpenRef.current !== null) {
        window.clearTimeout(delayedOpenRef.current)
        delayedOpenRef.current = null
      }
    }
  }, [consent, openBanner])

  useEffect(() => {
    const handleOpenSettings = (event) => {
      settingsTriggerRef.current = event.detail?.trigger ?? null
      openBanner(true)
    }
    window.addEventListener(CONSENT_EVENT, handleOpenSettings)
    return () => window.removeEventListener(CONSENT_EVENT, handleOpenSettings)
  }, [openBanner])

  useEffect(() => {
    if (!isOpen) return undefined

    const frame = window.requestAnimationFrame(() => {
      previousFocusRef.current = document.activeElement
      acceptButtonRef.current?.focus()
    })
    return () => window.cancelAnimationFrame(frame)
  }, [isOpen])

  const closeBanner = useCallback(() => {
    setIsOpen(false)
    setIsRendered(false)
  }, [])

  const chooseConsent = (status, allowAnalytics, allowMarketing) => {
    const choice = {
      status,
      analytics: allowAnalytics,
      marketing: allowMarketing,
      date: new Date().toISOString(),
    }
    saveConsent(choice)
    setConsent(choice)
    closeBanner()
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      closeBanner()
      const focusTarget = settingsTriggerRef.current || previousFocusRef.current
      if (focusTarget instanceof HTMLElement) focusTarget.focus()
      return
    }

    if (event.key !== 'Tab') return
    const focusable = bannerRef.current?.querySelectorAll(
      'button:not(:disabled), a[href], input:not(:disabled)',
    )
    if (!focusable?.length) return

    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  if (!isRendered) return null

  return (
    <aside
      ref={bannerRef}
      className="cookie-banner"
      data-open={isOpen}
      role="dialog"
      aria-modal="false"
      aria-label={t('cookieConsent.ariaLabel')}
      aria-describedby="cookie-banner-message"
      onKeyDown={handleKeyDown}
    >
      <div className="cookie-banner__content">
        <p id="cookie-banner-message" className="cookie-banner__message">
          {t('cookieConsent.message')}
        </p>
        {isCustomizing && (
          <fieldset className="cookie-banner__options">
            <legend>{t('cookieConsent.customize')}</legend>
            <label className="cookie-banner__option">
              <input type="checkbox" checked disabled />
              <span>
                {t('cookieConsent.essential')}
                <small>{t('cookieConsent.alwaysOn')}</small>
              </span>
            </label>
            <label className="cookie-banner__option">
              <input
                type="checkbox"
                checked={analytics}
                onChange={(event) => setAnalytics(event.target.checked)}
              />
              <span>{t('cookieConsent.analytics')}</span>
            </label>
            <label className="cookie-banner__option">
              <input
                type="checkbox"
                checked={marketing}
                onChange={(event) => setMarketing(event.target.checked)}
              />
              <span>{t('cookieConsent.marketing')}</span>
            </label>
          </fieldset>
        )}
      </div>
      <div className="cookie-banner__actions">
        {isCustomizing ? (
          <button
            ref={acceptButtonRef}
            className="cookie-banner__button cookie-banner__button--primary"
            type="button"
            onClick={() =>
              chooseConsent('custom', analytics, marketing)
            }
          >
            {t('cookieConsent.savePreferences')}
          </button>
        ) : (
          <button
            ref={acceptButtonRef}
            className="cookie-banner__button cookie-banner__button--primary"
            type="button"
            onClick={() => chooseConsent('accepted', true, true)}
          >
            {t('cookieConsent.acceptAll')}
          </button>
        )}
        {!isCustomizing && (
          <>
            <button
              className="cookie-banner__button cookie-banner__button--secondary"
              type="button"
              onClick={() => chooseConsent('rejected', false, false)}
            >
              {t('cookieConsent.rejectNonEssential')}
            </button>
            <button
              className="cookie-banner__button cookie-banner__button--text"
              type="button"
              onClick={() => setIsCustomizing(true)}
            >
              {t('cookieConsent.customize')}
            </button>
          </>
        )}
        <Link
          className="cookie-banner__policy"
          to="/privacy/"
          onClick={closeBanner}
        >
          {t('cookieConsent.policyLink')}
        </Link>
      </div>
    </aside>
  )
}
