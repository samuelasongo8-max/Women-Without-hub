import { useEffect, useMemo, useRef, useState } from 'react'
import Fuse from 'fuse.js'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  LANGUAGE_CODES,
  CHAT_CONTACT,
  knowledge,
  PROGRAMME_IDS,
  QUICK_REPLIES,
  RISK_KEYWORDS,
} from './knowledge.js'
import './ChatAssistant.css'

const localeModules = import.meta.glob('./locales/*.json', {
  eager: true,
  import: 'default',
})
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const sessionKey = 'wwbh-chat-messages'
const lastSubmitKey = 'wwbh-chat-last-submit'
const maxMessageCount = 100
const maxMessageLength = 2000

function normalize(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase()
    .trim()
}

function localeFor(code) {
  if (!LANGUAGE_CODES.includes(code)) code = 'en'
  return (
    localeModules[`./locales/${code}.json`] ||
    localeModules['./locales/en.json'] ||
    {}
  )
}

function safeReadMessages() {
  try {
    const value = JSON.parse(sessionStorage.getItem(sessionKey) || '[]')
    return Array.isArray(value)
      ? value
          .filter(
            (message) =>
              message &&
              (message.role === 'assistant' || message.role === 'visitor') &&
              typeof message.text === 'string',
          )
          .slice(-maxMessageCount)
      : []
  } catch {
    return []
  }
}

function safeWriteMessages(messages) {
  try {
    sessionStorage.setItem(sessionKey, JSON.stringify(messages.slice(-maxMessageCount)))
  } catch {
    // Conversation persistence is optional when browser storage is disabled.
  }
}

function getIntentKeywords(chatLocale, id) {
  const values = chatLocale?.keywords?.[id]
  return Array.isArray(values) ? values : []
}

function detectLanguage(text, fallback) {
  if (/[\u0600-\u06ff]/u.test(text)) return 'ar'
  if (/[\u0400-\u04ff]/u.test(text)) return 'ru'
  if (/[\u0900-\u0dff\u0e00-\u0e7f\u3040-\u30ff\u3400-\u9fff\uf900-\ufaff]/u.test(text)) {
    return 'unsupported'
  }

  const normalizedText = normalize(text)
  const matching = LANGUAGE_CODES.map((code) => {
    const chatLocale = localeFor(code)
    const markers = chatLocale.languageIndicators || []
    return {
      language: code,
      score: markers.reduce(
        (score, marker) =>
          score + (normalizedText.includes(normalize(marker)) ? marker.length : 0),
        0,
      ),
    }
  })
    .sort((left, right) => right.score - left.score)

  return matching[0]?.score > 0 ? matching[0].language : fallback
}

function containsAny(text, keywords = []) {
  const normalizedText = normalize(text)
  return keywords.some((keyword) => normalizedText.includes(normalize(keyword)))
}

function AssistantText({ text }) {
  const parts = text.split(/(marwalugazo@gmail\.com|\+254113947398)/gi)

  return parts.map((part, index) => {
    const key = `${part}-${index}`
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(part)) {
      return (
        <a key={key} href={`mailto:${part}`}>
          {part}
        </a>
      )
    }
    if (/^\+254113947398$/i.test(part)) {
      return (
        <a key={key} href="tel:+254113947398">
          {part}
        </a>
      )
    }
    return <span key={key}>{part}</span>
  })
}

function ChatContactAvatar({ className }) {
  const [imageFailed, setImageFailed] = useState(false)

  if (imageFailed) {
    return (
      <span className={`${className} chat-assistant-avatar-fallback`} role="img" aria-label={CHAT_CONTACT.alt}>
        {CHAT_CONTACT.initials}
      </span>
    )
  }

  return (
    <img
      className={className}
      src={CHAT_CONTACT.photo}
      alt={CHAT_CONTACT.alt}
      width={className.includes('contact') ? 72 : 40}
      height={className.includes('contact') ? 72 : 40}
      loading="lazy"
      decoding="async"
      onError={() => setImageFailed(true)}
    />
  )
}

export default function ChatAssistant({ isOpen, onClose, openerRef }) {
  const { i18n } = useTranslation()
  const [language, setLanguage] = useState('en')
  const [messages, setMessages] = useState(safeReadMessages)
  const [question, setQuestion] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [formStartedAt, setFormStartedAt] = useState(0)
  const [formStatus, setFormStatus] = useState('')
  const [isSending, setIsSending] = useState(false)
  const messageListRef = useRef(null)
  const inputRef = useRef(null)
  const dialogRef = useRef(null)

  const currentSiteLanguage =
    LANGUAGE_CODES.includes(i18n.resolvedLanguage) ? i18n.resolvedLanguage : 'en'
  const locale = useMemo(() => localeFor(language), [language])
  const text = (key, fallback = '') =>
    key.split('.').reduce((value, part) => value?.[part], locale) ?? fallback

  useEffect(() => {
    if (messages.length === 0) {
      const greeting = {
        role: 'assistant',
        text: text('answers.welcome'),
        language,
      }
      const initial = [greeting]
      if (!LANGUAGE_CODES.includes(i18n.resolvedLanguage)) {
        initial.push({
          role: 'assistant',
          text: text('answers.unsupportedLanguage'),
          language: 'en',
        })
      }
      setMessages(initial)
      safeWriteMessages(initial)
    }
  }, [])

  useEffect(() => {
    safeWriteMessages(messages)
  }, [messages])

  useEffect(() => {
    const list = messageListRef.current
    if (list) list.scrollTop = list.scrollHeight
  }, [messages, isTyping, showForm])

  useEffect(() => {
    if (!isOpen) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    inputRef.current?.focus()

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab' || !dialogRef.current) return
      const focusable = dialogRef.current.querySelectorAll(
        'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
      )
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (!first || !last) return
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
      openerRef.current?.focus()
    }
  }, [isOpen, onClose, openerRef])

  const allFuseRecords = useMemo(
    () =>
      LANGUAGE_CODES.flatMap((code) => {
        const chatLocale = localeFor(code)
        return knowledge.map((entry) => ({
          ...entry,
          language: code,
          searchKeywords: [
            ...entry.keywords,
            ...getIntentKeywords(chatLocale, entry.id),
            entry.question,
          ],
        }))
      }),
    [],
  )
  const fuse = useMemo(
    () =>
      new Fuse(allFuseRecords, {
        keys: ['searchKeywords', 'question'],
        includeScore: true,
        threshold: 0.35,
        ignoreLocation: true,
        ignoreDiacritics: true,
        isCaseSensitive: false,
        minMatchCharLength: 3,
      }),
    [allFuseRecords],
  )

  function getAnswer(intentId, answerLanguage) {
    const entry = knowledge.find((item) => item.id === intentId)
    const answerLocale = localeFor(answerLanguage)
    return {
      role: 'assistant',
      text: answerLocale?.answers?.[intentId] || entry?.answer || '',
      language: answerLanguage,
      link: entry?.link || (intentId === 'joinDetails' ? '/contact/' : undefined),
      programmeList: intentId === 'programmes',
      isFallback: intentId === 'fallback',
    }
  }

  function queueAnswer(answer) {
    setIsTyping(true)
    window.setTimeout(() => {
      setMessages((previous) => [...previous, answer])
      setIsTyping(false)
    }, 600)
  }

  function findAnswer(query) {
    const detectedLanguage = detectLanguage(query, currentSiteLanguage)
    const answerLocale = localeFor(detectedLanguage)
    const allLocalizedRisks = Object.values(localeModules).flatMap((item) =>
      Object.values(item.riskKeywords || {}),
    )
    const allRiskWords = (key) => [
      ...Object.values(RISK_KEYWORDS).flatMap((item) => item[key] || []),
      ...allLocalizedRisks.flatMap((item) => item[key] || []),
    ]

    if (containsAny(query, allRiskWords('emergency'))) {
      return getAnswer('emergency', detectedLanguage)
    }
    if (containsAny(query, allRiskWords('personal'))) {
      return {
        role: 'assistant',
        text: answerLocale?.answers?.privacyRefusal || localeFor('en').answers.privacyRefusal,
        language: detectedLanguage,
        link: '/contact/',
      }
    }
    if (containsAny(query, allRiskWords('advice'))) {
      return {
        role: 'assistant',
        text: answerLocale?.answers?.adviceRefusal || localeFor('en').answers.adviceRefusal,
        language: detectedLanguage,
        link: 'mailto:marwalugazo@gmail.com',
      }
    }

    const localizedJoinDetails = [
      ...(answerLocale?.keywords?.joinDetails || []),
      ...(localeFor('en')?.keywords?.joinDetails || []),
    ]
    if (containsAny(query, localizedJoinDetails)) {
      return getAnswer('joinDetails', detectedLanguage)
    }

    const normalizedQuery = normalize(query)
    const directMatches = knowledge.flatMap((entry) => {
      const keywords = [
        ...entry.keywords,
        ...getIntentKeywords(answerLocale, entry.id),
      ]
      return keywords
        .filter((keyword) => normalizedQuery.includes(normalize(keyword)))
        .map((keyword) => ({ id: entry.id, length: normalize(keyword).length }))
    })
    directMatches.sort((left, right) => right.length - left.length)
    if (directMatches[0]) {
      return getAnswer(directMatches[0].id, detectedLanguage)
    }

    const results = fuse.search(query)
    const result =
      results.find(
        (item) => item.score <= 0.35 && item.item.language === detectedLanguage,
      ) || results.find((item) => item.score <= 0.3)
    if (result) return getAnswer(result.item.id, detectedLanguage)

    return {
      ...getAnswer('fallback', detectedLanguage),
      isFallback: true,
    }
  }

  function sendQuestion(value = question, intentId = null) {
    const submitted = value.trim()
    if (!submitted || isTyping || messages.length >= maxMessageCount) return

    const answerLanguage = intentId
      ? language
      : detectLanguage(submitted, currentSiteLanguage)
    setLanguage(answerLanguage)
    setQuestion('')
    setMessages((previous) => [
      ...previous,
      {
        role: 'visitor',
        text: intentId ? text(`quickReplies.${intentId}`, submitted) : submitted,
        language: answerLanguage,
      },
    ])

    const answer = intentId
      ? getAnswer(intentId, answerLanguage)
      : findAnswer(submitted)
    if (!LANGUAGE_CODES.includes(answerLanguage)) {
      answer.text = `${answer.text}\n\n${localeFor('en').answers.unsupportedLanguage}`
    }
    queueAnswer(answer)
  }

  function clearConversation() {
    const greeting = getAnswer('welcome', language)
    setMessages([greeting])
    safeWriteMessages([greeting])
    setShowForm(false)
    setFormStatus('')
  }

  function openMessageForm() {
    setShowForm(true)
    setFormStartedAt(Date.now())
    setFormStatus('')
  }

  async function submitMessage(event) {
    event.preventDefault()
    if (isSending) return

    const form = event.currentTarget
    const data = new FormData(form)
    const name = String(data.get('name') || '').trim()
    const contact = String(data.get('contact') || '').trim()
    const message = String(data.get('message') || '').trim()
    const gotcha = String(data.get('_gotcha') || '').trim()
    const consent = data.get('consent') === 'on'
    const ui = locale?.form || {}

    if (gotcha) return
    if (Date.now() - formStartedAt < 3000) {
      setFormStatus(ui.waitBeforeSend || '')
      return
    }
    if (name.length > 100 || contact.length > 150 || message.length > maxMessageLength) {
      setFormStatus(ui.lengthError || '')
      return
    }
    if (!contact) {
      setFormStatus(ui.contactRequired || '')
      return
    }
    if (contact.includes('@') && !emailPattern.test(contact)) {
      setFormStatus(ui.invalidContact || '')
      return
    }
    if (!contact.includes('@') && !/^\+?[\d\s().-]{7,25}$/.test(contact)) {
      setFormStatus(ui.invalidContact || '')
      return
    }
    if (message.length < 1) {
      setFormStatus(ui.messageRequired || '')
      return
    }
    if (!consent) {
      setFormStatus(ui.consentRequired || '')
      return
    }

    try {
      const lastSubmitted = Number(localStorage.getItem(lastSubmitKey) || 0)
      if (Date.now() - lastSubmitted < 30_000) {
        setFormStatus(ui.rateLimit || '')
        return
      }
    } catch {
      // The in-memory cooldown below still applies if local storage is unavailable.
    }

    const endpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT
    if (!endpoint) {
      setFormStatus(ui.failure || '')
      return
    }

    const isEmail = contact.includes('@')
    const payload = {
      name,
      contact,
      message,
      language,
      pageUrl: window.location.href,
      _gotcha: '',
      ...(isEmail ? { email: contact, _replyto: contact } : { phone: contact }),
    }

    setIsSending(true)
    setFormStatus('')
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
      if (response.status !== 200) {
        setFormStatus(ui.failure || '')
        return
      }

      try {
        localStorage.setItem(lastSubmitKey, String(Date.now()))
      } catch {
        // The successful submission remains complete if storage is unavailable.
      }
      setFormStatus(ui.success || '')
      form.reset()
      setFormStartedAt(Date.now())
    } catch {
      setFormStatus(ui.failure || '')
    } finally {
      setIsSending(false)
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="chat-assistant-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        ref={dialogRef}
        className="chat-assistant-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="chat-assistant-title"
        dir={language === 'ar' ? 'rtl' : 'ltr'}
      >
        <header className="chat-assistant-header">
          <ChatContactAvatar className="chat-assistant-avatar" />
          <div className="chat-assistant-header__copy">
            <h2 id="chat-assistant-title">{text('title')}</h2>
            <p>{text('automated')}</p>
          </div>
          <button
            className="chat-assistant-icon-button"
            type="button"
            aria-label={text('closeChat')}
            onClick={onClose}
          >
            <span aria-hidden="true">×</span>
          </button>
        </header>

        <div className="chat-assistant-body">
          <div
            ref={messageListRef}
            className="chat-assistant-messages"
            aria-live="polite"
            aria-relevant="additions text"
            aria-label={text('conversation')}
          >
            {messages.map((message, index) => (
              <div
                className={`chat-assistant-message chat-assistant-message--${message.role}`}
                key={`${index}-${message.text.slice(0, 20)}`}
                dir={message.language === 'ar' ? 'rtl' : 'auto'}
              >
                <div className="chat-assistant-bubble">
                  {message.role === 'assistant' ? (
                    <AssistantText text={message.text} />
                  ) : (
                    message.text
                  )}
                </div>
                {message.role === 'assistant' && message.link && (
                  message.link.startsWith('mailto:') ||
                  message.link.startsWith('tel:') ? (
                    <a className="chat-assistant-answer-link" href={message.link}>
                      {text('contactTeam')}
                    </a>
                  ) : (
                    <Link className="chat-assistant-answer-link" to={message.link}>
                      {text(message.programmeList ? 'learnMore' : 'openPage')}
                    </Link>
                  )
                )}
                {message.role === 'assistant' && message.programmeList && (
                  <div className="chat-assistant-programme-chips">
                    {PROGRAMME_IDS.map((programmeId) => (
                      <button
                        key={programmeId}
                        type="button"
                        onClick={() => sendQuestion('', programmeId)}
                      >
                        {text(`programmes.${programmeId}.title`)}
                      </button>
                    ))}
                  </div>
                )}
                {message.role === 'assistant' && (
                  <div className="chat-assistant-quick-replies">
                    {QUICK_REPLIES.map((reply) => (
                      <button
                        key={reply.id}
                        type="button"
                        onClick={() => sendQuestion('', reply.id)}
                      >
                        {text(`quickReplies.${reply.id}`, reply.label)}
                      </button>
                    ))}
                    {message.isFallback && (
                      <button type="button" onClick={openMessageForm}>
                        {text('leaveMessage')}
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="chat-assistant-typing" role="status">
                {text('typing')}
              </div>
            )}
          </div>

          {showForm && (
            <form className="chat-assistant-form" onSubmit={submitMessage}>
              <div className="chat-assistant-contact-card">
                <ChatContactAvatar className="chat-assistant-avatar chat-assistant-avatar--contact" />
                <div>
                  <strong>{CHAT_CONTACT.name}</strong>
                </div>
              </div>
              <h3>{text('form.title')}</h3>
              <label>
                {text('form.name')}
                <input name="name" type="text" maxLength="100" autoComplete="name" />
              </label>
              <label>
                {text('form.contact')}
                <input
                  name="contact"
                  type="text"
                  required
                  maxLength="150"
                  autoComplete="email"
                  aria-label={text('form.contact')}
                />
              </label>
              <label>
                {text('form.message')}
                <textarea name="message" required maxLength={maxMessageLength} rows="3" />
              </label>
              <label className="chat-assistant-honeypot" aria-hidden="true">
                Website
                <input name="_gotcha" type="text" tabIndex="-1" autoComplete="off" />
              </label>
              <label className="chat-assistant-consent">
                <input name="consent" type="checkbox" required />
                <span>{text('form.consent')}</span>
              </label>
              <p className="chat-assistant-privacy-note">{text('privacyNote')}</p>
              {formStatus && (
                <p className="chat-assistant-form-status" role="status">
                  {formStatus}
                </p>
              )}
              <button className="chat-assistant-send" type="submit" disabled={isSending}>
                {isSending ? text('form.sending') : text('form.send')}
              </button>
            </form>
          )}

          {!showForm && (
            <form
              className="chat-assistant-composer"
              onSubmit={(event) => {
                event.preventDefault()
                sendQuestion()
              }}
            >
              <label className="visually-hidden" htmlFor="chat-assistant-input">
                {text('inputLabel')}
              </label>
              <input
                ref={inputRef}
                id="chat-assistant-input"
                value={question}
                maxLength={maxMessageLength}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder={text('placeholder')}
                autoComplete="off"
              />
              <button type="submit" disabled={!question.trim() || isTyping}>
                {text('send')}
              </button>
            </form>
          )}
        </div>

        <footer className="chat-assistant-footer">
          <span>{text('privacyNote')}</span>
          <button type="button" onClick={clearConversation}>
            {text('clearChat')}
          </button>
        </footer>
      </section>
    </div>
  )
}
