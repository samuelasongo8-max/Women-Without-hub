import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './ScrollArrows.css'

const INITIAL_VISIBILITY = { canScrollUp: false, canScrollDown: false }

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function ScrollArrows() {
  const { t } = useTranslation()
  const { pathname, search, hash } = useLocation()
  const [visibility, setVisibility] = useState(INITIAL_VISIBILITY)

  useEffect(() => {
    let frameId = 0
    let routeFrameId = 0

    const updateVisibility = () => {
      frameId = 0
      const root = document.documentElement
      const maxScrollTop = Math.max(0, root.scrollHeight - window.innerHeight)
      const scrollTop = Math.max(window.scrollY, root.scrollTop)
      const scrollable = maxScrollTop > 1
      const atTop = scrollTop <= 1
      const atBottom = maxScrollTop - scrollTop <= 1
      const nextVisibility = {
        canScrollUp: scrollable && !atTop,
        canScrollDown: scrollable && !atBottom,
      }

      setVisibility((current) =>
        current.canScrollUp === nextVisibility.canScrollUp &&
        current.canScrollDown === nextVisibility.canScrollDown
          ? current
          : nextVisibility,
      )
    }

    const scheduleUpdate = () => {
      if (!frameId) frameId = window.requestAnimationFrame(updateVisibility)
    }

    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate, { passive: true })
    window.visualViewport?.addEventListener('resize', scheduleUpdate, { passive: true })
    const resizeObserver = new ResizeObserver(scheduleUpdate)
    resizeObserver.observe(document.documentElement)
    routeFrameId = window.requestAnimationFrame(scheduleUpdate)
    scheduleUpdate()

    return () => {
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      window.visualViewport?.removeEventListener('resize', scheduleUpdate)
      resizeObserver.disconnect()
      window.cancelAnimationFrame(frameId)
      window.cancelAnimationFrame(routeFrameId)
    }
  }, [pathname, search, hash])

  const scrollTo = (top) => {
    window.scrollTo({
      top: top === 'bottom' ? document.documentElement.scrollHeight : 0,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    })
  }

  if (!visibility.canScrollUp && !visibility.canScrollDown) return null

  return (
    <div
      className="scroll-arrows"
      role="group"
      aria-label={t('scroll.controls', { defaultValue: 'Page scrolling' })}
    >
      <button
        className={`scroll-arrows__button${visibility.canScrollUp ? ' is-visible' : ''}`}
        type="button"
        aria-label={t('scroll.top', { defaultValue: 'Scroll to top' })}
        tabIndex={visibility.canScrollUp ? 0 : -1}
        aria-hidden={!visibility.canScrollUp}
        onClick={() => scrollTo('top')}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="m5 14 7-7 7 7" />
        </svg>
      </button>
      <button
        className={`scroll-arrows__button${visibility.canScrollDown ? ' is-visible' : ''}`}
        type="button"
        aria-label={t('scroll.bottom', { defaultValue: 'Scroll to bottom' })}
        tabIndex={visibility.canScrollDown ? 0 : -1}
        aria-hidden={!visibility.canScrollDown}
        onClick={() => scrollTo('bottom')}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="m5 10 7 7 7-7" />
        </svg>
      </button>
    </div>
  )
}
