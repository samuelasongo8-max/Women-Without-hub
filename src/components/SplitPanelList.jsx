import { useEffect, useState } from 'react'
import { FaHandshake } from 'react-icons/fa'
import './SplitPanelList.css'

export default function SplitPanelList({
  title,
  image,
  imageAlt,
  items = [],
  children,
  className = '',
  FallbackIcon = FaHandshake,
  imageWidth = 903,
  imageHeight = 1200,
}) {
  const [imageFailed, setImageFailed] = useState(false)

  useEffect(() => {
    setImageFailed(false)
  }, [image])

  return (
    <section
      className={`split-panel-list${className ? ` ${className}` : ''}`}
      aria-label={title || undefined}
    >
      <div className="split-panel-list__aside">
        {title && <h2 className="split-panel-list__title">{title}</h2>}
        <div className="split-panel-list__media">
          {image && !imageFailed ? (
            <picture>
              <source
                srcSet={image.replace(/\.jpe?g$/i, '.webp')}
                type="image/webp"
              />
              <img
                src={image}
                alt={imageAlt}
                width={imageWidth}
                height={imageHeight}
                loading="lazy"
                decoding="async"
                onError={() => setImageFailed(true)}
              />
            </picture>
          ) : (
            <div
              className="split-panel-list__placeholder"
              role="img"
              aria-label={imageAlt}
            >
              <FallbackIcon aria-hidden="true" />
            </div>
          )}
        </div>
      </div>
      <div className="split-panel-list__content">
        {children ? (
          <div className="split-panel-list__plain-content">{children}</div>
        ) : (
          <ol className="split-panel-list__items">
            {items.map((item) => (
              <li className="split-panel-list__item" key={item.number}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  )
}
