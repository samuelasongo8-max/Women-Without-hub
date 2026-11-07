import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { footerNav, donateCta } from '../data/site.js'
import { SITE } from '../data/seo.js'
import { ORG_NAME } from '../config/site.js'
import emailjs from '@emailjs/browser'
import './Footer.css'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Footer() {
  const { t } = useTranslation()
  // "Stay in touch" subscribe form state.
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [status, setStatus] = useState(null) // { type: 'success' | 'error', message }
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [canSubscribe, setCanSubscribe] = useState(true)

  // Same EmailJS service + public key as the contact form; a second
  // template (subscribe) is read from its own env variable.
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
  const subscribeTemplateId = import.meta.env.VITE_EMAILJS_SUBSCRIBE_TEMPLATE_ID
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

  function handleSubscribe(event) {
    event.preventDefault()
    if (!canSubscribe) return

    // Honeypot: a non-empty "website" field means a bot submitted — act as
    // if it worked and never actually send anything.
    const website = (new FormData(event.currentTarget).get('website') || '').trim()
    if (website) {
      setStatus({ type: 'success', messageKey: 'footer.thankYou' })
      setEmail('')
      setFirstName('')
      setFieldErrors({})
      return
    }

    // Validate both fields; show a short error under the wrong one.
    const errors = {}
    const trimmedEmail = email.trim()
    const trimmedName = firstName.trim()
    if (!trimmedName) errors.first_name = 'footer.errFirstName'
    if (!trimmedEmail) errors.email = 'footer.errEmail'
    else if (!EMAIL_REGEX.test(trimmedEmail))
      errors.email = 'footer.errEmailInvalid'
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) {
      setStatus(null)
      return
    }

    // If the subscribe template isn't configured, don't crash: warn + show error.
    if (!serviceId || !subscribeTemplateId || !publicKey) {
      console.warn(
        'EmailJS subscribe template not configured. Set VITE_EMAILJS_SUBSCRIBE_TEMPLATE_ID in .env.',
      )
      setStatus({ type: 'error', messageKey: 'footer.errorGeneric' })
      return
    }

    setIsSubscribing(true)
    setStatus(null)

    emailjs
      .send(
        serviceId,
        subscribeTemplateId,
        { email: trimmedEmail, first_name: trimmedName },
        { publicKey },
      )
      .then(() => {
        setStatus({ type: 'success', messageKey: 'footer.thankYou' })
        setEmail('')
        setFirstName('')
        setFieldErrors({})
        setCanSubscribe(false)
        setTimeout(() => setCanSubscribe(true), 30000)
      })
      .catch((error) => {
        console.error('EmailJS error:', error.status, error.text)
        setStatus({ type: 'error', messageKey: 'footer.errorGeneric' })
      })
      .finally(() => {
        setIsSubscribing(false)
      })
  }

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-col footer-about">
          {/* Logo (top of the left column), linked to the home page. */}
          <Link
            to="/"
            className="footer-subscribe__logo-link"
            aria-label={`${ORG_NAME}, home`}
          >
            <img
              className="footer-subscribe__logo"
              src="/images/women-hub-logo.png"
              alt={ORG_NAME}
            />
          </Link>

          {/* "Stay in touch" subscribe form (under the logo). */}
          <form className="footer-subscribe" onSubmit={handleSubscribe} noValidate>
            <h3 className="footer-subscribe__heading">{t('footer.stayInTouch')}</h3>

            <div className="footer-subscribe__field">
              <label
                className="footer-subscribe__label"
                htmlFor="footer-subscribe-email"
              >
                {t('footer.emailAddress')} <span aria-hidden="true">*</span>
              </label>
              <input
                id="footer-subscribe-email"
                className="footer-subscribe__input"
                type="email"
                name="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {fieldErrors.email && (
                <span className="footer-subscribe__error">{t(fieldErrors.email)}</span>
              )}
            </div>

            <div className="footer-subscribe__field">
              <label
                className="footer-subscribe__label"
                htmlFor="footer-subscribe-first-name"
              >
                {t('footer.firstName')} <span aria-hidden="true">*</span>
              </label>
              <input
                id="footer-subscribe-first-name"
                className="footer-subscribe__input"
                type="text"
                name="first_name"
                autoComplete="given-name"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              {fieldErrors.first_name && (
                <span className="footer-subscribe__error">
                  {t(fieldErrors.first_name)}
                </span>
              )}
            </div>

            {/* Honeypot — hidden from users; bots often fill it in. */}
            <div className="footer-subscribe__honeypot" aria-hidden="true">
              <label htmlFor="footer-subscribe-website">
                {t('footer.websiteField')}
              </label>
              <input
                id="footer-subscribe-website"
                name="website"
                type="text"
                tabIndex={-1}
              />
            </div>

            <button
              type="submit"
              className="footer-subscribe__button"
              disabled={isSubscribing}
            >
              {isSubscribing ? t('footer.subscribing') : t('footer.subscribe')}
            </button>

            <p className="footer-subscribe__status" role="status" aria-live="polite">
              {status ? (
                <span className={`footer-subscribe__status--${status.type}`}>
                  {t(status.messageKey)}
                </span>
              ) : null}
            </p>
          </form>

          <h2 className="footer-brand">{SITE.name}</h2>
          <p>{t('footer.about')}</p>
          <p className="footer-address">
            {SITE.address.streetAddress}, {SITE.address.addressRegion},{' '}
            {SITE.address.addressCountry}
            <br />
            {SITE.postalAddress}
          </p>
        </div>

        <nav className="footer-col" aria-label={t('footer.explore')}>
          <h3>{t('footer.explore')}</h3>
          <ul>
            {footerNav.map((item) => (
              <li key={item.to}>
                <Link to={item.to}>
                  {t(item.label)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="footer-col">
          <h3>{t('footer.getInvolved')}</h3>
          <ul>
            <li>
              <Link to="/get-involved/donate/">{t('nav.donate')}</Link>
            </li>
            <li>
              <Link to="/get-involved/volunteer/">{t('footer.volunteer')}</Link>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h3>{t('footer.trustLegal')}</h3>
          <ul>
            <li>
              <Link to="/contact/">{t('footer.contact')}</Link>
            </li>
            <li>
              <Link to="/privacy/">{t('cookieConsent.policyLink')}</Link>
            </li>
            <li>
              <button
                className="cookie-settings-button"
                type="button"
                onClick={(event) =>
                  window.dispatchEvent(
                    new CustomEvent('cookie-settings-open', {
                      detail: { trigger: event.currentTarget },
                    }),
                  )
                }
              >
                {t('cookieConsent.settings')}
              </button>
            </li>
          </ul>
          <Link to={donateCta.to} className="btn btn-donate footer-donate-btn">
            {t('nav.donate')}
          </Link>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>
            © {new Date().getFullYear()} {SITE.name}. {t('footer.rightsReserved')}
          </p>
        </div>
      </div>
    </footer>
  )
}
