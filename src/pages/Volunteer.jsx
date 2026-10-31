import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import DisplayOptions from '../components/DisplayOptions.jsx'
import useHeroImagePreload from '../hooks/useHeroImagePreload.js'
import useFormDisplayOptions from '../hooks/useFormDisplayOptions.js'
import { breadcrumbListSchema } from '../data/seo.js'
import './Volunteer.css'

const PROGRAMMES = [
  'education',
  'digital',
  'mentorship',
  'health',
  'srhr',
  'livelihood',
  'anywhere',
]

const CONTRIBUTIONS = [
  'teaching',
  'mentoring',
  'digital',
  'vocational',
  'health',
  'business',
  'community',
  'translation',
  'other',
]

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'weekends']
const RATE_LIMIT_KEY = 'wwbh-volunteer-last-submit'
const RATE_LIMIT_MS = 30_000
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const INITIAL_FORM = {
  fullName: '',
  email: '',
  phone: '',
  location: '',
  adult: false,
  programmes: [],
  contributions: [],
  otherContribution: '',
  skillsExperience: '',
  languages: '',
  volunteerMode: '',
  daysAvailable: [],
  timeCommitment: '',
  startWhen: '',
  startDate: '',
  motivation: '',
  consent: false,
  _gotcha: '',
}

function VolunteerError({ id, prefix, children }) {
  if (!children) return null
  return (
    <span className="volunteer-field__error" id={id} role="alert">
      <span aria-hidden="true">!</span> <strong>{prefix}:</strong> {children}
    </span>
  )
}

export default function Volunteer() {
  const { t, i18n } = useTranslation()
  const { pathname } = useLocation()
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState(null)
  const [isSending, setIsSending] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const displayOptions = useFormDisplayOptions()
  const startedAt = useRef(Date.now())
  const lastAttempt = useRef(0)
  const inputRefs = useRef({})

  useHeroImagePreload({
    desktop: '/images/volunteer-hero-full.webp',
    desktopMedia: '(min-width: 1024px)',
    tablet: '/images/volunteer-hero.webp',
    mobile: '/images/volunteer-hero.webp',
  })

  useEffect(() => {
    document.body.classList.add('volunteer-form-page')
    return () => document.body.classList.remove('volunteer-form-page')
  }, [])

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => {
      if (!current[name]) return current
      const next = { ...current }
      delete next[name]
      return next
    })
  }

  function toggleOption(name, value) {
    setForm((current) => {
      const selected = current[name]
      return {
        ...current,
        [name]: selected.includes(value)
          ? selected.filter((item) => item !== value)
          : [...selected, value],
      }
    })
    setErrors((current) => {
      if (!current[name]) return current
      const next = { ...current }
      delete next[name]
      return next
    })
  }

  function validate() {
    const next = {}
    const required = t('volunteer.form.errors.required')

    if (!form.fullName.trim()) next.fullName = required
    else if (form.fullName.trim().length > 120) {
      next.fullName = t('volunteer.form.errors.nameLength')
    }

    if (!form.email.trim()) next.email = required
    else if (!EMAIL_REGEX.test(form.email.trim()) || form.email.length > 254) {
      next.email = t('volunteer.form.errors.email')
    }

    if (!form.phone.trim()) next.phone = required
    else if (form.phone.trim().length > 50) {
      next.phone = t('volunteer.form.errors.phoneLength')
    }

    if (!form.location.trim()) next.location = required
    else if (form.location.trim().length > 160) {
      next.location = t('volunteer.form.errors.locationLength')
    }

    if (!form.adult) next.adult = t('volunteer.form.errors.adult')
    if (!form.programmes.length) next.programmes = t('volunteer.form.errors.chooseOne')
    if (!form.contributions.length) next.contributions = t('volunteer.form.errors.chooseOne')
    if (form.contributions.includes('other') && !form.otherContribution.trim()) {
      next.otherContribution = required
    }
    if (form.otherContribution.length > 160) {
      next.otherContribution = t('volunteer.form.errors.shortTextLength')
    }
    if (form.skillsExperience.trim().length < 20) {
      next.skillsExperience = t('volunteer.form.errors.experienceMin')
    } else if (form.skillsExperience.length > 1000) {
      next.skillsExperience = t('volunteer.form.errors.experienceMax')
    }
    if (form.languages.length > 160) {
      next.languages = t('volunteer.form.errors.shortTextLength')
    }
    if (form.startWhen === 'date' && !form.startDate) {
      next.startDate = required
    }
    if (form.motivation.length > 600) {
      next.motivation = t('volunteer.form.errors.motivationMax')
    }
    if (!form.consent) next.consent = t('volunteer.form.errors.consent')

    setErrors(next)
    if (Object.keys(next).length) {
      const firstError = Object.keys(next)[0]
      requestAnimationFrame(() => {
        const target = inputRefs.current[firstError]
        target?.focus()
        target?.scrollIntoView({
          block: 'center',
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
            ? 'auto'
            : 'smooth',
        })
      })
      return false
    }
    return true
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (isSending || !validate()) return

    if (form._gotcha) return
    if (Date.now() - startedAt.current < 5000) {
      setStatus({ type: 'error', message: t('volunteer.form.errors.tooFast') })
      return
    }

    let lastSubmission = lastAttempt.current
    try {
      lastSubmission = Math.max(
        lastSubmission,
        Number(window.localStorage.getItem(RATE_LIMIT_KEY) || 0),
      )
    } catch {
      lastSubmission = lastAttempt.current
    }
    if (Date.now() - lastSubmission < RATE_LIMIT_MS) {
      setStatus({ type: 'error', message: t('volunteer.form.errors.rateLimit') })
      return
    }

    const endpoint = import.meta.env.VITE_FORMSPREE_VOLUNTEER_ENDPOINT
    if (!endpoint) {
      setStatus({ type: 'error', message: t('volunteer.form.failure') })
      return
    }

    const programmeLabels = form.programmes.map((value) =>
      t(`volunteer.form.options.programmes.${value}`),
    )
    const contributionLabels = form.contributions.map((value) =>
      value === 'other'
        ? `${t('volunteer.form.options.contributions.other')}: ${form.otherContribution.trim()}`
        : t(`volunteer.form.options.contributions.${value}`),
    )
    const payload = {
      _subject: `Volunteer application: ${form.fullName.trim()}`,
      'Full name': form.fullName.trim(),
      Email: form.email.trim(),
      'Phone or WhatsApp': form.phone.trim(),
      'Country and city or town': form.location.trim(),
      'Age confirmation': t('volunteer.form.confirmed'),
      Programmes: programmeLabels.join(', '),
      Contributions: contributionLabels.join(', '),
      'Skills and experience': form.skillsExperience.trim(),
      'Languages spoken': form.languages.trim(),
      'Volunteer mode': form.volunteerMode
        ? t(`volunteer.form.options.modes.${form.volunteerMode}`)
        : '',
      'Days available': form.daysAvailable
        .map((value) => t(`volunteer.form.options.days.${value}`))
        .join(', '),
      'Time commitment': form.timeCommitment
        ? t(`volunteer.form.options.commitments.${form.timeCommitment}`)
        : '',
      'Start availability':
        form.startWhen === 'date'
          ? form.startDate
          : form.startWhen === 'soon'
            ? t('volunteer.form.options.asap')
            : '',
      Motivation: form.motivation.trim(),
      Consent: t('volunteer.form.consent'),
      Language: i18n.resolvedLanguage || i18n.language || 'en',
      'Page URL': window.location.href,
    }

    lastAttempt.current = Date.now()
    try {
      window.localStorage.setItem(RATE_LIMIT_KEY, String(lastAttempt.current))
    } catch {
      lastAttempt.current = Date.now()
    }

    setIsSending(true)
    setStatus(null)
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!response.ok) throw new Error('Form submission was not accepted')
      setSubmitted(true)
      setStatus({ type: 'success', message: t('volunteer.form.success') })
    } catch {
      setStatus({ type: 'error', message: t('volunteer.form.failure') })
    } finally {
      setIsSending(false)
    }
  }

  const requiredMark = (
    <>
      <span aria-hidden="true"> *</span>
      <span className="volunteer-visually-hidden">
        {t('volunteer.form.required')}
      </span>
    </>
  )

  function fieldDescribedBy(name, helperId) {
    return [helperId, errors[name] ? `${name}-error` : null]
      .filter(Boolean)
      .join(' ')
  }

  function renderFieldError(name) {
    return (
      <VolunteerError
        id={`${name}-error`}
        prefix={t('volunteer.displayOptions.errorPrefix')}
      >
        {errors[name]}
      </VolunteerError>
    )
  }

  const routeSchema = breadcrumbListSchema(pathname, undefined, t)

  return (
    <div className="getinvolved-page volunteer-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(routeSchema) }}
      />

      <section className="volunteer-hero" aria-labelledby="volunteer-title">
        <div className="volunteer-hero__inner">
          <Breadcrumbs />
          <div className="volunteer-hero__copy">
            <h1 id="volunteer-title">{t('volunteer.heroTitle')}</h1>
            <p>{t('volunteer.heroSentence')}</p>
            <a
              className="volunteer-hero__button"
              href="#volunteer-form"
              onClick={(event) => {
                event.preventDefault()
                const formSection = document.getElementById('volunteer-form')
                formSection?.scrollIntoView({
                  block: 'start',
                  behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
                    ? 'auto'
                    : 'smooth',
                })
                formSection?.focus({ preventScroll: true })
              }}
            >
              {t('volunteer.heroCta')}
            </a>
          </div>
        </div>
      </section>

      <section className="volunteer-intro" aria-label={t('volunteer.introLabel')}>
        <p>{t('volunteer.intro')}</p>
      </section>

      <section
        className="volunteer-form-section"
        id="volunteer-form"
        tabIndex="-1"
        aria-labelledby="volunteer-form-title"
      >
        <div
          className="volunteer-form-card"
          data-form-theme={displayOptions.theme}
          data-form-scale={displayOptions.scale}
        >
          <DisplayOptions
            theme={displayOptions.theme}
            scale={displayOptions.scale}
            onThemeChange={displayOptions.setTheme}
            onScaleChange={displayOptions.setScale}
            onReset={displayOptions.reset}
            t={t}
          />
          {submitted ? (
            <div className="volunteer-thankyou" aria-live="polite">
              <h2>{t('volunteer.form.successTitle')}</h2>
              <p>{status?.message}</p>
              <div className="volunteer-thankyou__actions">
                <Link to="/get-involved/">
                  {t('volunteer.form.backToInvolved')}
                </Link>
                <Link to="/programs/">{t('volunteer.form.exploreProgrammes')}</Link>
              </div>
            </div>
          ) : (
            <>
              <div className="volunteer-form-card__header">
                <h2 id="volunteer-form-title">{t('volunteer.form.title')}</h2>
                <p>{t('volunteer.form.requiredNote')}</p>
              </div>

              {status?.type === 'error' && (
                <p className="volunteer-form-status volunteer-form-status--error" role="alert" aria-live="assertive">
                  <span aria-hidden="true">!</span>{' '}
                  <strong>{t('volunteer.displayOptions.errorPrefix')}:</strong>{' '}
                  {status.message}
                </p>
              )}

              <form className="volunteer-form" noValidate onSubmit={handleSubmit}>
                <div className="volunteer-honeypot" aria-hidden="true">
                  <label htmlFor="volunteer-gotcha">
                    {t('volunteer.form.honeypot')}
                  </label>
                  <input
                    id="volunteer-gotcha"
                    name="_gotcha"
                    type="text"
                    tabIndex="-1"
                    autoComplete="off"
                    value={form._gotcha}
                    onChange={(event) => updateField('_gotcha', event.target.value)}
                  />
                </div>

                <section className="volunteer-form__section" aria-labelledby="volunteer-about">
                  <h3 id="volunteer-about">{t('volunteer.form.sections.about')}</h3>
                  <div className="volunteer-form__grid">
                    <div className="volunteer-field">
                      <label htmlFor="volunteer-name">
                        {t('volunteer.form.fields.fullName')}
                        {requiredMark}
                      </label>
                      <input
                        ref={(node) => { inputRefs.current.fullName = node }}
                        id="volunteer-name"
                        name="fullName"
                        required
                        autoComplete="name"
                        maxLength={120}
                        value={form.fullName}
                        aria-invalid={Boolean(errors.fullName)}
                        aria-describedby={fieldDescribedBy('fullName', 'volunteer-name-help')}
                        onChange={(event) => updateField('fullName', event.target.value)}
                      />
                      <span className="volunteer-field__helper" id="volunteer-name-help">
                        {t('volunteer.form.helpers.fullName')}
                      </span>
                      {renderFieldError('fullName')}
                    </div>

                    <div className="volunteer-field">
                      <label htmlFor="volunteer-email">
                        {t('volunteer.form.fields.email')}
                        {requiredMark}
                      </label>
                      <input
                        ref={(node) => { inputRefs.current.email = node }}
                        id="volunteer-email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        maxLength={254}
                        value={form.email}
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={fieldDescribedBy('email', 'volunteer-email-help')}
                        onChange={(event) => updateField('email', event.target.value)}
                      />
                      <span className="volunteer-field__helper" id="volunteer-email-help">
                        {t('volunteer.form.helpers.email')}
                      </span>
                      {renderFieldError('email')}
                    </div>

                    <div className="volunteer-field">
                      <label htmlFor="volunteer-phone">
                        {t('volunteer.form.fields.phone')}
                        {requiredMark}
                      </label>
                      <input
                        ref={(node) => { inputRefs.current.phone = node }}
                        id="volunteer-phone"
                        name="phone"
                        type="tel"
                        required
                        autoComplete="tel"
                        maxLength={50}
                        value={form.phone}
                        aria-invalid={Boolean(errors.phone)}
                        aria-describedby={fieldDescribedBy('phone', 'volunteer-phone-help')}
                        onChange={(event) => updateField('phone', event.target.value)}
                      />
                      <span className="volunteer-field__helper" id="volunteer-phone-help">
                        {t('volunteer.form.helpers.phone')}
                      </span>
                      {renderFieldError('phone')}
                    </div>

                    <div className="volunteer-field">
                      <label htmlFor="volunteer-location">
                        {t('volunteer.form.fields.location')}
                        {requiredMark}
                      </label>
                      <input
                        ref={(node) => { inputRefs.current.location = node }}
                        id="volunteer-location"
                        name="location"
                        required
                        autoComplete="address-level2"
                        maxLength={160}
                        value={form.location}
                        aria-invalid={Boolean(errors.location)}
                        aria-describedby={fieldDescribedBy('location', 'volunteer-location-help')}
                        onChange={(event) => updateField('location', event.target.value)}
                      />
                      <span className="volunteer-field__helper" id="volunteer-location-help">
                        {t('volunteer.form.helpers.location')}
                      </span>
                      {renderFieldError('location')}
                    </div>
                  </div>

                  <label className="volunteer-check volunteer-check--single" htmlFor="volunteer-adult">
                    <input
                      ref={(node) => { inputRefs.current.adult = node }}
                      id="volunteer-adult"
                      name="adult"
                      type="checkbox"
                      required
                      checked={form.adult}
                      aria-invalid={Boolean(errors.adult)}
                      aria-describedby={errors.adult ? 'adult-error' : undefined}
                      onChange={(event) => updateField('adult', event.target.checked)}
                    />
                    <span>{t('volunteer.form.fields.adult')}{requiredMark}</span>
                  </label>
                  {renderFieldError('adult')}
                </section>

                <section className="volunteer-form__section" aria-labelledby="volunteer-programmes-heading">
                  <h3 id="volunteer-programmes-heading">
                    {t('volunteer.form.sections.programmes')}
                    {requiredMark}
                  </h3>
                  <p className="volunteer-field__helper" id="volunteer-programmes-help">
                    {t('volunteer.form.helpers.chooseMany')}
                  </p>
                  <fieldset
                    className="volunteer-choice-grid"
                    aria-required="true"
                    aria-describedby={fieldDescribedBy('programmes', 'volunteer-programmes-help')}
                  >
                    <legend className="volunteer-visually-hidden">
                      {t('volunteer.form.sections.programmes')}
                    </legend>
                    {PROGRAMMES.map((value, index) => (
                      <label className="volunteer-check" key={value} htmlFor={`programme-${value}`}>
                        <input
                          ref={index === 0 ? (node) => { inputRefs.current.programmes = node } : undefined}
                          id={`programme-${value}`}
                          name="programmes"
                          type="checkbox"
                          value={value}
                          checked={form.programmes.includes(value)}
                          aria-invalid={Boolean(errors.programmes)}
                          onChange={() => toggleOption('programmes', value)}
                        />
                        <span>{t(`volunteer.form.options.programmes.${value}`)}</span>
                      </label>
                    ))}
                  </fieldset>
                  {renderFieldError('programmes')}
                </section>

                <section className="volunteer-form__section" aria-labelledby="volunteer-contributions-heading">
                  <h3 id="volunteer-contributions-heading">
                    {t('volunteer.form.sections.contributions')}
                    {requiredMark}
                  </h3>
                  <p className="volunteer-field__helper" id="volunteer-contributions-help">
                    {t('volunteer.form.helpers.chooseMany')}
                  </p>
                  <fieldset
                    className="volunteer-choice-grid"
                    aria-required="true"
                    aria-describedby={fieldDescribedBy('contributions', 'volunteer-contributions-help')}
                  >
                    <legend className="volunteer-visually-hidden">
                      {t('volunteer.form.sections.contributions')}
                    </legend>
                    {CONTRIBUTIONS.map((value, index) => (
                      <label className="volunteer-check" key={value} htmlFor={`contribution-${value}`}>
                        <input
                          ref={index === 0 ? (node) => { inputRefs.current.contributions = node } : undefined}
                          id={`contribution-${value}`}
                          name="contributions"
                          type="checkbox"
                          value={value}
                          checked={form.contributions.includes(value)}
                          aria-invalid={Boolean(errors.contributions)}
                          onChange={() => toggleOption('contributions', value)}
                        />
                        <span>{t(`volunteer.form.options.contributions.${value}`)}</span>
                      </label>
                    ))}
                  </fieldset>
                  {renderFieldError('contributions')}

                  {form.contributions.includes('other') && (
                    <div className="volunteer-field volunteer-field--other">
                      <label htmlFor="volunteer-other-contribution">
                        {t('volunteer.form.fields.otherContribution')}
                        {requiredMark}
                      </label>
                      <input
                        ref={(node) => { inputRefs.current.otherContribution = node }}
                        id="volunteer-other-contribution"
                        name="otherContribution"
                        required
                        maxLength={160}
                        value={form.otherContribution}
                        aria-invalid={Boolean(errors.otherContribution)}
                        aria-describedby={fieldDescribedBy('otherContribution', 'volunteer-other-help')}
                        onChange={(event) => updateField('otherContribution', event.target.value)}
                      />
                      <span className="volunteer-field__helper" id="volunteer-other-help">
                        {t('volunteer.form.helpers.otherContribution')}
                      </span>
                      {renderFieldError('otherContribution')}
                    </div>
                  )}

                  <div className="volunteer-field">
                    <label htmlFor="volunteer-experience">
                      {t('volunteer.form.fields.experience')}
                      {requiredMark}
                    </label>
                    <textarea
                      ref={(node) => { inputRefs.current.skillsExperience = node }}
                      id="volunteer-experience"
                      name="skillsExperience"
                      required
                      rows="5"
                      minLength={20}
                      maxLength={1000}
                      value={form.skillsExperience}
                      aria-invalid={Boolean(errors.skillsExperience)}
                      aria-describedby={fieldDescribedBy('skillsExperience', 'volunteer-experience-help')}
                      onChange={(event) => updateField('skillsExperience', event.target.value)}
                    />
                    <span className="volunteer-field__helper" id="volunteer-experience-help">
                      {t('volunteer.form.helpers.experience')}
                    </span>
                    <span className="volunteer-character-count" aria-live="polite">
                      {t('volunteer.form.characterCount', { count: form.skillsExperience.length })}
                    </span>
                    {renderFieldError('skillsExperience')}
                  </div>

                  <div className="volunteer-field">
                    <label htmlFor="volunteer-languages">
                      {t('volunteer.form.fields.languages')}
                    </label>
                    <input
                      ref={(node) => { inputRefs.current.languages = node }}
                      id="volunteer-languages"
                      name="languages"
                      maxLength={160}
                      value={form.languages}
                      aria-invalid={Boolean(errors.languages)}
                      aria-describedby={fieldDescribedBy('languages', 'volunteer-languages-help')}
                      onChange={(event) => updateField('languages', event.target.value)}
                    />
                    <span className="volunteer-field__helper" id="volunteer-languages-help">
                      {t('volunteer.form.helpers.languages')}
                    </span>
                    {renderFieldError('languages')}
                  </div>
                </section>

                <section className="volunteer-form__section" aria-labelledby="volunteer-availability-heading">
                  <h3 id="volunteer-availability-heading">
                    {t('volunteer.form.sections.availability')}
                  </h3>
                  <fieldset
                    className="volunteer-radio-grid"
                    aria-describedby="volunteer-mode-help"
                  >
                    <legend>{t('volunteer.form.fields.mode')}</legend>
                    {['inPerson', 'remote', 'either'].map((value, index) => (
                      <label className="volunteer-check" key={value} htmlFor={`mode-${value}`}>
                        <input
                          ref={index === 0 ? (node) => { inputRefs.current.volunteerMode = node } : undefined}
                          id={`mode-${value}`}
                          name="volunteerMode"
                          type="radio"
                          value={value}
                          checked={form.volunteerMode === value}
                          onChange={() => updateField('volunteerMode', value)}
                        />
                        <span>{t(`volunteer.form.options.modes.${value}`)}</span>
                      </label>
                    ))}
                  </fieldset>
                  <span className="volunteer-field__helper" id="volunteer-mode-help">
                    {t('volunteer.form.helpers.optional')}
                  </span>

                  <fieldset className="volunteer-days" aria-describedby="volunteer-days-help">
                    <legend>{t('volunteer.form.fields.days')}</legend>
                    <div className="volunteer-choice-grid">
                      {DAYS.map((value, index) => (
                        <label className="volunteer-check" key={value} htmlFor={`day-${value}`}>
                          <input
                            ref={index === 0 ? (node) => { inputRefs.current.daysAvailable = node } : undefined}
                            id={`day-${value}`}
                            name="daysAvailable"
                            type="checkbox"
                            value={value}
                            checked={form.daysAvailable.includes(value)}
                            onChange={() => toggleOption('daysAvailable', value)}
                          />
                          <span>{t(`volunteer.form.options.days.${value}`)}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  <span className="volunteer-field__helper" id="volunteer-days-help">
                    {t('volunteer.form.helpers.days')}
                  </span>

                  <div className="volunteer-form__grid">
                    <div className="volunteer-field">
                      <label htmlFor="volunteer-time">
                        {t('volunteer.form.fields.commitment')}
                      </label>
                      <select
                        ref={(node) => { inputRefs.current.timeCommitment = node }}
                        id="volunteer-time"
                        name="timeCommitment"
                        value={form.timeCommitment}
                        aria-describedby="volunteer-time-help"
                        onChange={(event) => updateField('timeCommitment', event.target.value)}
                      >
                        <option value="">{t('volunteer.form.options.select')}</option>
                        {['monthly', 'weekly', 'severalDays', 'fullTime'].map((value) => (
                          <option key={value} value={value}>
                            {t(`volunteer.form.options.commitments.${value}`)}
                          </option>
                        ))}
                      </select>
                      <span className="volunteer-field__helper" id="volunteer-time-help">
                        {t('volunteer.form.helpers.optional')}
                      </span>
                    </div>

                    <div className="volunteer-field">
                      <label htmlFor="volunteer-start-when">
                        {t('volunteer.form.fields.startWhen')}
                      </label>
                      <select
                        ref={(node) => { inputRefs.current.startWhen = node }}
                        id="volunteer-start-when"
                        name="startWhen"
                        value={form.startWhen}
                        aria-describedby="volunteer-start-help"
                        onChange={(event) => {
                          updateField('startWhen', event.target.value)
                          if (event.target.value !== 'date') updateField('startDate', '')
                        }}
                      >
                        <option value="">{t('volunteer.form.options.select')}</option>
                        <option value="soon">{t('volunteer.form.options.asap')}</option>
                        <option value="date">{t('volunteer.form.options.chooseDate')}</option>
                      </select>
                      <span className="volunteer-field__helper" id="volunteer-start-help">
                        {t('volunteer.form.helpers.startWhen')}
                      </span>
                    </div>
                  </div>

                  {form.startWhen === 'date' && (
                    <div className="volunteer-field volunteer-field--date">
                      <label htmlFor="volunteer-start-date">
                        {t('volunteer.form.fields.startDate')}
                        {requiredMark}
                      </label>
                      <input
                        ref={(node) => { inputRefs.current.startDate = node }}
                        id="volunteer-start-date"
                        name="startDate"
                        type="date"
                        required
                        value={form.startDate}
                        aria-invalid={Boolean(errors.startDate)}
                        aria-describedby={fieldDescribedBy('startDate', 'volunteer-date-help')}
                        onChange={(event) => updateField('startDate', event.target.value)}
                      />
                      <span className="volunteer-field__helper" id="volunteer-date-help">
                        {t('volunteer.form.helpers.optional')}
                      </span>
                      {renderFieldError('startDate')}
                    </div>
                  )}
                </section>

                <section className="volunteer-form__section" aria-labelledby="volunteer-motivation-heading">
                  <h3 id="volunteer-motivation-heading">
                    {t('volunteer.form.sections.motivation')}
                  </h3>
                  <div className="volunteer-field">
                    <label htmlFor="volunteer-motivation">
                      {t('volunteer.form.fields.motivation')}
                    </label>
                    <textarea
                      ref={(node) => { inputRefs.current.motivation = node }}
                      id="volunteer-motivation"
                      name="motivation"
                      rows="4"
                      maxLength={600}
                      value={form.motivation}
                      aria-invalid={Boolean(errors.motivation)}
                      aria-describedby={fieldDescribedBy('motivation', 'volunteer-motivation-help')}
                      onChange={(event) => updateField('motivation', event.target.value)}
                    />
                    <span className="volunteer-field__helper" id="volunteer-motivation-help">
                      {t('volunteer.form.helpers.motivation')}
                    </span>
                    <span className="volunteer-character-count" aria-live="polite">
                      {t('volunteer.form.characterCount', { count: form.motivation.length })}
                    </span>
                    {renderFieldError('motivation')}
                  </div>
                </section>

                <section className="volunteer-form__section" aria-labelledby="volunteer-consent-heading">
                  <h3 id="volunteer-consent-heading">
                    {t('volunteer.form.sections.consent')}
                  </h3>
                  <label className="volunteer-check volunteer-check--single" htmlFor="volunteer-consent">
                    <input
                      ref={(node) => { inputRefs.current.consent = node }}
                      id="volunteer-consent"
                      name="consent"
                      type="checkbox"
                      required
                      checked={form.consent}
                      aria-invalid={Boolean(errors.consent)}
                      aria-describedby={fieldDescribedBy('consent', 'volunteer-consent-help')}
                      onChange={(event) => updateField('consent', event.target.checked)}
                    />
                    <span>{t('volunteer.form.fields.consent')}{requiredMark}</span>
                  </label>
                  <span className="volunteer-field__helper" id="volunteer-consent-help">
                    {t('volunteer.form.helpers.sensitive')}
                  </span>
                  {renderFieldError('consent')}
                  <p className="volunteer-safeguarding-note">
                    {t('volunteer.form.helpers.safeguarding')}
                  </p>
                </section>

                <button
                  className="volunteer-submit"
                  type="submit"
                  disabled={isSending}
                >
                  {isSending
                    ? t('volunteer.form.sending')
                    : t('volunteer.form.submit')}
                </button>
              </form>
            </>
          )}
        </div>
      </section>
    </div>
  )
}
