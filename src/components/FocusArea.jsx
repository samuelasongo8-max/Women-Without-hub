import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import './FocusArea.css'

export default function FocusArea({
  number,
  title,
  paragraphs,
  image,
  imageAlt,
  width,
  height,
  imageFocus = 'center 30%',
  icon: Icon,
  reverse = false,
  id,
  hidden = false,
  headingRef,
  revealing = false,
}) {
  const { t } = useTranslation()
  const [imageFailed, setImageFailed] = useState(false)
  const alt = t(imageAlt)

  const handleImageError = (event) => {
    const img = event.currentTarget
    if (img.dataset.jpgFallback !== 'true') {
      img.dataset.jpgFallback = 'true'
      img.removeAttribute('srcSet')
      img.src = image
      return
    }
    setImageFailed(true)
  }

  return (
    <section
      className={`livelihood-focus-area${reverse ? ' livelihood-focus-area--reverse' : ''}${revealing ? ' livelihood-focus-area--revealing' : ''}`}
      id={id}
      aria-labelledby={`${id}-title`}
      hidden={hidden}
    >
      {!imageFailed ? (
        <div className="livelihood-focus-area__picture">
          <img
            className="livelihood-focus-area__image"
            src={image.replace(/\.jpg$/i, '.webp')}
            srcSet={`${image.replace(/\.jpg$/i, '.webp')} 1x`}
            alt={alt}
            width={width}
            height={height}
            style={{ objectPosition: imageFocus }}
            loading={number === 1 ? 'eager' : 'lazy'}
            decoding="async"
            onError={handleImageError}
          />
        </div>
      ) : (
        <div
          className="livelihood-focus-area__image livelihood-focus-area__image--placeholder"
          role="img"
          aria-label={alt}
        >
          <Icon aria-hidden="true" focusable="false" />
        </div>
      )}

      <div className="livelihood-focus-area__card">
        <h2
          className="livelihood-focus-area__title"
          id={`${id}-title`}
          ref={headingRef}
          tabIndex={-1}
        >
          {title}
        </h2>
        <div className="livelihood-focus-area__text">
          {paragraphs.map((paragraph, index) => (
            <p key={`${id}-paragraph-${index}`}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  )
}
