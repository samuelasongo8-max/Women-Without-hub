import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import useHeroImagePreload from '../hooks/useHeroImagePreload.js'
import {
  SITE,
  contactPageSchema,
  contactOrganizationSchema,
  breadcrumbListSchema,
} from '../data/seo.js'
import emailjs from '@emailjs/browser'
import './Contact.css'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Contact() {
  const { t } = useTranslation()
  useHeroImagePreload({
    desktop: '/images/contact-banner-desktop.webp',
    mobile: '/images/contact-banner-mobile.webp',
  })
  const formRef = useRef(null)
  const [status, setStatus] = useState(null)
  const [isSending, setIsSending] = useState(false)
  const [canResend, setCanResend] = useState(true)
  const { pathname } = useLocation()

  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

  function handleSubmit(event) {
    event.preventDefault()
    if (!canResend) return

    const form = formRef.current
    const data = new FormData(form)

    // Honeypot: a non-empty website field means a bot submitted — act as if it succeeded.
    const website = (data.get('website') || '').trim()
    if (website) {
      setStatus({ type: 'success', message: t('contact.successContact') })
      form.reset()
      return
    }

    const name = (data.get('name') || '').trim()
    const email = (data.get('email') || '').trim()
    const subject = data.get('subject') || ''
    const message = (data.get('message') || '').trim()

    if (!name) {
      setStatus({ type: 'error', message: t('contact.errName') })
      return
    }
    if (!email || !EMAIL_REGEX.test(email)) {
      setStatus({ type: 'error', message: t('contact.errEmail') })
      return
    }
    if (!subject) {
      setStatus({ type: 'error', message: t('contact.errSubject') })
      return
    }
    if (message.length < 10) {
      setStatus({ type: 'error', message: t('contact.errMessage') })
      return
    }

    // Verify env vars are loaded before sending (log only existence, not values).
    const serviceIdOK = !!serviceId
    const templateIdOK = !!templateId
    const publicKeyOK = !!publicKey
    if (!serviceIdOK || !templateIdOK || !publicKeyOK) {
      console.error('EmailJS config missing:', {
        serviceId: serviceIdOK,
        templateId: templateIdOK,
        publicKey: publicKeyOK,
      })
      setStatus({ type: 'error', message: t('contact.errorSend') })
      return
    }

    setIsSending(true)
    setStatus(null)

    emailjs
      .sendForm(serviceId, templateId, formRef.current, { publicKey })
      .then(() => {
        setStatus({
          type: 'success',
          message: t('contact.successSent'),
        })
        form.reset()
        setCanResend(false)
        setTimeout(() => setCanResend(true), 30000)
      })
      .catch((error) => {
        console.error("EmailJS error:", error.status, error.text)
        setStatus({ type: 'error', message: t('contact.errorSend') })
      })
      .finally(() => {
        setIsSending(false)
      })
  }

  return (
    <div className="contact-page">
      <section className="contact-hero" aria-label={t('contact.heroLabel')}>
        <div className="container">
          <div className="contact-hero__inner">
            <div className="contact-hero__breadcrumb">
              <Link to="/">{t('breadcrumb.home')}</Link>
              <span aria-hidden="true">›</span>
              <span aria-current="page">{t('breadcrumb.contact')}</span>
            </div>
            <h1 className="contact-hero__title">{t('contact.title')}</h1>
            <p className="contact-hero__intro">{t('contact.intro')}</p>
          </div>
        </div>
      </section>

      {/* Partner With Women Without Borders Hub — inserted directly after the contact intro block. */}
      <section className="contact-partner" aria-labelledby="partner-heading">
        <div className="container">
          <div className="contact-partner__inner">
            <div className="contact-partner__copy">
              <h2 id="partner-heading">{t('contact.partnerHeading')}</h2>
              <p className="contact-partner__text">{t('contact.partnerText1')}</p>
              <p className="contact-partner__text">{t('contact.partnerText2')}</p>
              <p className="contact-partner__text">{t('contact.partnerText3')}</p>
              <p className="contact-partner__text">{t('contact.partnerText4')}</p>
              <div className="contact-partner__details">
                <h3>{t('contact.getInTouchHeading')}</h3>
                <p>{t('contact.getInTouchText')}</p>

                <address className="contact-partner__address">
                  <p className="contact-partner__contact-item">
                    <svg
                      className="contact-partner__icon"
                      aria-hidden="true"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    <span>
                      <strong>{t('contact.emailLabel')}</strong>{' '}
                      <a href="mailto:womenwithoutbordershub@gmail.com">
                        womenwithoutbordershub@gmail.com
                      </a>
                    </span>
                  </p>
                  <p className="contact-partner__contact-item">
                    <svg
                      className="contact-partner__icon"
                      aria-hidden="true"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>
                      <strong>{t('contact.locationLabel')}</strong>{' '}
                      {t('contact.locationValue')}
                    </span>
                  </p>
                </address>

                <p className="contact-partner__closing">
                  <strong>{t('contact.closingText')}</strong>
                </p>

                <a
                  href="mailto:womenwithoutbordershub@gmail.com?subject=Partnership%20Enquiry"
                  className="btn btn-lg contact-partner__cta"
                  aria-label={t('contact.emailUsAria', { email: 'womenwithoutbordershub@gmail.com' })}
                >
                  {t('contact.emailUs')}
                </a>
              </div>
            </div>

            {/* Structured data: ContactPage, Organization (NGO), BreadcrumbList. */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(contactPageSchema()),
              }}
            />
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(contactOrganizationSchema()),
              }}
            />
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(breadcrumbListSchema(pathname, undefined, t)),
              }}
            />
          </div>
        </div>
      </section>

      <section className="contact-form">

        <h2>{t('contact.formHeading')}</h2>

        {status ? (
          <div
            className={`contact-form__status contact-form__status--${status.type}`}
            role="status"
            aria-live="polite"
          >
            {status.message}
          </div>
        ) : (
          <form
            ref={formRef}
            className="contact-form"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="contact-form__row--split">
              <div className="contact-form__field">
                <label htmlFor="name" className="contact-form__label">
                  {t('contact.name')}
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="contact-form__input"
                  required
                  autoComplete="name"
                />
              </div>

              <div className="contact-form__field">
                <label htmlFor="email" className="contact-form__label">
                  {t('contact.emailLabel')}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="contact-form__input"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="contact-form__row">
              <label htmlFor="subject" className="contact-form__label">
                {t('contact.subject')}
              </label>
              <select
                id="subject"
                name="subject"
                className="contact-form__select"
                required
              >
                <option value="">{t('contact.subjectPlaceholder')}</option>
                <option value="Donor">{t('contact.subjectDonor')}</option>
                <option value="Development organization">{t('contact.subjectDevelopmentOrg')}</option>
                <option value="NGO">{t('contact.subjectNgo')}</option>
                <option value="Community partner">{t('contact.subjectCommunityPartner')}</option>
                <option value="School or training institution">{t('contact.subjectSchool')}</option>
                <option value="Health partner">{t('contact.subjectHealthPartner')}</option>
                <option value="Volunteer">{t('contact.subjectVolunteer')}</option>
                <option value="Press">{t('contact.subjectPress')}</option>
                <option value="Other">{t('contact.subjectOther')}</option>
              </select>
            </div>

            <div className="contact-form__row">
              <label htmlFor="message" className="contact-form__label">
                {t('contact.message')}
              </label>
              <textarea
                id="message"
                name="message"
                className="contact-form__textarea"
                rows="6"
                required
                minLength="10"
                placeholder={t('contact.messagePlaceholder')}
              />
            </div>

            {/* Honeypot — hidden visually; bots often fill it in. */}
            <div className="contact-form__honeypot" aria-hidden="true">
              <label htmlFor="website">{t('contact.website')}</label>
              <input id="website" name="website" type="text" tabIndex={-1} />
            </div>

            <button
              type="submit"
              className="contact-form__submit"
              disabled={isSending}
            >
              {isSending ? t('contact.sending') : t('contact.send')}
            </button>
          </form>
        )}
      </section>

      <section className="contact-map">
        <div className="container">
          <p className="contact-map__text">{t('contact.mapText')}</p>
          <a
            href="https://www.google.com/maps/search/?api=1&query=Kakuma+3+Turkana+County+Kenya"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-map__link"
          >
            {t('contact.mapLink')}
          </a>
          <iframe
            title={t('contact.mapTitle')}
            src="https://www.google.com/maps?q=Kakuma+3,+Turkana+County,+Kenya&z=13&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            className="contact-map__iframe"
          />
        </div>
      </section>
    </div>
  )
}
