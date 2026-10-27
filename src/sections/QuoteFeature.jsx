import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ORG_NAME } from '../config/site.js'
import './QuoteFeature.css'

/**
 * Section: Featured quote (portrait + testimonial)
 * Reusable — every value below can be overridden with props.
 */
const DEFAULTS = {
  quote:
    'Every girl and young woman deserves a safe space to learn, grow, and believe in herself. When we support one another, share knowledge, and build our confidence, we create opportunities for a brighter future for ourselves and our community.',
  name: 'Khadijoh Mahamed',
  role: `Member of ${ORG_NAME}`,
  image: '/Khadijoh%20Mahamed.jpg',
  alt: 'Khadijoh Mahamed',
}

export default function QuoteFeature({
  quote = DEFAULTS.quote,
  name = DEFAULTS.name,
  role = DEFAULTS.role,
  image = DEFAULTS.image,
  alt = DEFAULTS.alt,
  showClosingMark = true,
  reverse = false,
}) {
  const { t } = useTranslation()
  const [imageFailed, setImageFailed] = useState(false)

  const quoteText = quote !== DEFAULTS.quote ? quote : t('quoteFeature.quote', { defaultValue: quote })
  const nameText = quote !== DEFAULTS.quote ? name : t('quoteFeature.name', { defaultValue: name })
  const roleText = quote !== DEFAULTS.quote ? role : t('quoteFeature.role', { defaultValue: role })
  const label = t('quoteFeature.label', { defaultValue: 'Featured quote' })

  // Optional closing quotation mark, appended after the final word.
  const closingMark = showClosingMark ? (
    <svg
      className="quote-feature__icon quote-feature__icon--closing"
      viewBox="0 0 26 20"
      width="26"
      height="20"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M0 20V11.2C0 4.9 3.6 1 9.2 0l1.3 3.6C7 4.7 5.2 6.8 5.1 9.2h4.1V20H0Zm15.8 0V11.2C15.8 4.9 19.4 1 25 0l1.3 3.6c-3.5 1.1-5.3 3.2-5.4 5.6h4.1V20H15.8Z" />
    </svg>
  ) : null
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <>
      
   
    {/* <section className={`quote-feature${reverse ? ' quote-feature--reverse' : ''}`} aria-label={label}>
      <div className="quote-feature__mark" aria-hidden="true">
        <svg
          viewBox="0 0 100 40"
          width="100"
          height="40"
          fill="none"
          stroke="#fbb41f"
          strokeWidth="9"
          strokeLinecap="butt"
          strokeLinejoin="miter"
          focusable="false"
        >
          <polyline points="6,34 24,8 38,24 52,8 70,34" />
        </svg>
      </div>

      <figure className="quote-feature__figure">
        <div className="quote-feature__portrait">
          {imageFailed ? (
            <span className="quote-feature__initials" aria-hidden="true">
              {initials}
            </span>
          ) : (
            <img
              className="quote-feature__img"
              src={image}
              alt={alt}
              loading="lazy"
              decoding="async"
              width="1086"
              height="1448"
              onError={() => setImageFailed(true)}
            />
          )}
        </div>

        <div className="quote-feature__body">
          <blockquote className="quote-feature__quote">
            <svg
              className="quote-feature__icon"
              viewBox="0 0 26 20"
              width="26"
              height="20"
              fill="currentColor"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M0 20V11.2C0 4.9 3.6 1 9.2 0l1.3 3.6C7 4.7 5.2 6.8 5.1 9.2h4.1V20H0Zm15.8 0V11.2C15.8 4.9 19.4 1 25 0l1.3 3.6c-3.5 1.1-5.3 3.2-5.4 5.6h4.1V20H15.8Z" />
            </svg>
            <span className="quote-feature__text">{quoteText}</span>
            {closingMark}
          </blockquote>

          <figcaption className="quote-feature__attribution">
            <span className="quote-feature__name">— {nameText}</span>
            <span className="quote-feature__role">{roleText}</span>
          </figcaption>
        </div>
      </figure>
    </section> */}

       
    <section className={`quote-feature${reverse ? ' quote-feature--reverse' : ''}`} aria-label={label}>
      <div className="quote-feature__mark" aria-hidden="true">
        <svg
          viewBox="0 0 100 40"
          width="100"
          height="40"
          fill="none"
          stroke="#fbb41f"
          strokeWidth="9"
          strokeLinecap="butt"
          strokeLinejoin="miter"
          focusable="false"
        >
          <polyline points="6,34 24,8 38,24 52,8 70,34" />
        </svg>
      </div>

      <figure className="quote-feature__figure">
        <div className="quote-feature__portrait">
          {imageFailed ? (
            <span className="quote-feature__initials" aria-hidden="true">
              {initials}
            </span>
          ) : (
            <img
              className="quote-feature__img"
              src={image}
              alt={alt}
              loading="lazy"
              decoding="async"
              width="1086"
              height="1448"
              onError={() => setImageFailed(true)}
            />
          )}
        </div>

        <div className="quote-feature__body">
          <blockquote className="quote-feature__quote">
            <svg
              className="quote-feature__icon"
              viewBox="0 0 26 20"
              width="26"
              height="20"
              fill="currentColor"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M0 20V11.2C0 4.9 3.6 1 9.2 0l1.3 3.6C7 4.7 5.2 6.8 5.1 9.2h4.1V20H0Zm15.8 0V11.2C15.8 4.9 19.4 1 25 0l1.3 3.6c-3.5 1.1-5.3 3.2-5.4 5.6h4.1V20H15.8Z" />
            </svg>
            <span className="quote-feature__text">{quoteText}</span>
            {closingMark}
          </blockquote>

          <figcaption className="quote-feature__attribution">
            <span className="quote-feature__name">— {nameText}</span>
            <span className="quote-feature__role">{roleText}</span>
          </figcaption>
        </div>
      </figure>
    </section>
     </>
  )
}
