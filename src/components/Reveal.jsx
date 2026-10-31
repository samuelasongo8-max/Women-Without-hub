import { useEffect, useRef, useState } from 'react'
import './Reveal.css'

export function SplitWords({ children, startIndex = 0, stagger = 80 }) {
  const text = typeof children === 'string' ? children : String(children ?? '')
  const tokens = text.match(/\s+|\S+/gu) ?? []
  let wordIndex = startIndex

  return (
    <span className="motion-split-words">
      {tokens.map((token, index) => {
        if (/^\s+$/u.test(token)) return token
        const currentIndex = wordIndex
        wordIndex += 1
        return (
          <span
            key={`${index}-${token}`}
            className="motion-split-word"
            style={{
              '--split-delay': `${currentIndex * stagger}ms`,
            }}
          >
            {token}
          </span>
        )
      })}
    </span>
  )
}

export default function Reveal({
  as: Element = 'div',
  children,
  className = '',
  delay = 0,
  direction = 'up',
  duration = 650,
  once = true,
  playOnMount = false,
  wordStagger = false,
  ...props
}) {
  const elementRef = useRef(null)
  const [motionState, setMotionState] = useState('visible')

  useEffect(() => {
    const element = elementRef.current
    const reducedMotion = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (
      !element ||
      reducedMotion ||
      typeof IntersectionObserver === 'undefined'
    ) {
      setMotionState('visible')
      return undefined
    }

    if (playOnMount) {
      setMotionState('hidden')
      const frame = window.requestAnimationFrame(() => setMotionState('visible'))
      return () => window.cancelAnimationFrame(frame)
    }

    setMotionState('hidden')
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMotionState('visible')
          if (once) observer.disconnect()
        } else if (!once) {
          setMotionState('hidden')
        }
      },
      { threshold: 0.12 },
    )
    observer.observe(element)

    return () => observer.disconnect()
  }, [once, playOnMount])

  return (
    <Element
      {...props}
      ref={elementRef}
      className={`motion-reveal${wordStagger ? ' motion-reveal--word-stagger' : ''}${className ? ` ${className}` : ''}`}
      data-motion-state={motionState}
      data-motion-direction={direction}
      style={{
        ...props.style,
        '--reveal-delay': `${delay}ms`,
        '--reveal-duration': `${duration}ms`,
      }}
    >
      {children}
    </Element>
  )
}
