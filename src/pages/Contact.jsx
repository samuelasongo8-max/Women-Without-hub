import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import { SITE } from '../data/seo.js'
import emailjs from '@emailjs/browser'
import './Contact.css'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Contact() {
  const { t } = useTranslation()
  const formRef = useRef(null)
  const [status, setStatus] = useState(null)
  const [isSending, setIsSending] = useState(false)
  const [canResend, setCanResend] = useState(true)

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
          message: "Thank you! Your message has been sent. We'll reply soon.",
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
    <>
      <section className="contact-hero">
        <div className="container">
          <div className="contact-hero__inner">
            <div className="contact-hero__breadcrumb">
              <Link to="/">Home</Link>
              <span aria-hidden="true">›</span>
              <span aria-current="page">Contact</span>
            </div>
            <h1 className="contact-hero__title">Contact</h1>
            <p className="contact-hero__intro">
              Questions from donors, development organizations, NGOs, community partners,
              schools, training institutions, health partners, volunteers or press — we'd
              love to hear from you.
            </p>
          </div>
        </div>
      </section>

      <section className="contact-address">
        <div className="container">
          <div className="contact-address__block">
            <h2 className="contact-address__heading">Our address</h2>
            <div className="contact-address__lines">
              <p className="contact-address__line">Women Without Borders Hub</p>
              <p className="contact-address__line">Kakuma 3, Zone 2, Block 3</p>
              <p className="contact-address__line">Turkana County, Kenya</p>
              <p className="contact-address__line">P.O. Box 01-30501, Kenya</p>
            </div>
          </div>
        </div>
      </section>

      <section className="contact-form">

        <h2>Send us a message</h2>

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
                  Full name
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
                  Email
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
                Subject
              </label>
              <select
                id="subject"
                name="subject"
                className="contact-form__select"
                required
              >
                <option value="">Choose a subject</option>
                <option value="Donor">Donor</option>
                <option value="Development organization">Development organization</option>
                <option value="NGO">NGO</option>
                <option value="Community partner">Community partner</option>
                <option value="School or training institution">School or training institution</option>
                <option value="Health partner">Health partner</option>
                <option value="Volunteer">Volunteer</option>
                <option value="Press">Press</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="contact-form__row">
              <label htmlFor="message" className="contact-form__label">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                className="contact-form__textarea"
                rows="6"
                required
                minLength="10"
                placeholder="Write your message here..."
              />
            </div>

            {/* Honeypot — hidden visually; bots often fill it in. */}
            <div className="contact-form__honeypot" aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input id="website" name="website" type="text" tabIndex={-1} />
            </div>

            <button
              type="submit"
              className="contact-form__submit"
              disabled={isSending}
            >
              {isSending ? 'Sending…' : 'Send message'}
            </button>
          </form>
        )}
      </section>

      <section className="contact-map">
        <div className="container">
          <p className="contact-map__text">Find us in Kakuma, Turkana County.</p>
          <a
            href="https://www.google.com/maps/search/?api=1&query=Kakuma+3+Turkana+County+Kenya"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-map__link"
          >
            Open in Google Maps
          </a>
          <iframe
            title="Map of Women Without Borders Hub in Kakuma, Turkana County, Kenya"
            src="https://www.google.com/maps?q=Kakuma+3,+Turkana+County,+Kenya&z=13&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            className="contact-map__iframe"
          />
        </div>
      </section>
    </>
  )
}
