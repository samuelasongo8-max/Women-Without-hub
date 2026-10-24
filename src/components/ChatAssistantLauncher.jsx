import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import './ChatAssistantLauncher.css'

const ChatAssistant = lazy(() => import('../chatbot/ChatAssistant.jsx'))

export default function ChatAssistantLauncher() {
  const { t } = useTranslation()
  const buttonRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const [hasOpened, setHasOpened] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const closeChat = useCallback(() => setIsOpen(false), [])

  useEffect(() => {
    try {
      if (!sessionStorage.getItem('wwbh-chat-tooltip-seen')) {
        setShowTooltip(true)
        const timeout = window.setTimeout(() => {
          setShowTooltip(false)
          sessionStorage.setItem('wwbh-chat-tooltip-seen', 'true')
        }, 6000)
        return () => window.clearTimeout(timeout)
      }
    } catch {
      return undefined
    }
    return undefined
  }, [])

  function openChat() {
    setHasOpened(true)
    setIsOpen(true)
    setShowTooltip(false)
    try {
      sessionStorage.setItem('wwbh-chat-tooltip-seen', 'true')
    } catch {
      // Storage can be disabled; opening chat does not depend on it.
    }
  }

  return (
    <>
      <button
        ref={buttonRef}
        className="chat-assistant-launcher"
        type="button"
        aria-label={t('chatbot.openChat', { defaultValue: 'Open chat' })}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        onClick={openChat}
      >
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M4 5.75A2.75 2.75 0 0 1 6.75 3h10.5A2.75 2.75 0 0 1 20 5.75v7.5A2.75 2.75 0 0 1 17.25 16H11l-4.8 4v-4.1a2.75 2.75 0 0 1-2.2-2.65z" />
          <path d="M8 8h8M8 11.5h5" />
        </svg>
      </button>
      {showTooltip && !isOpen && (
        <span className="chat-assistant-tooltip" role="status">
          {t('chatbot.tooltip', { defaultValue: 'Ask us anything' })}
        </span>
      )}
      {hasOpened && (
        <Suspense fallback={null}>
          <ChatAssistant
            isOpen={isOpen}
            onClose={closeChat}
            openerRef={buttonRef}
          />
        </Suspense>
      )}
    </>
  )
}
