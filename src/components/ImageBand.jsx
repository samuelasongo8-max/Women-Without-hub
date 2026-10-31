import { useState } from 'react'
import './ImageBand.css'

/**
 * ImageBand — a slim, decorative photo strip used to fill the gap between
 * two home-page sections (e.g. between "Community Updates & Stories" and
 * "Our Programs").
 *
 * Props
 *   image          {string}  Path to the photo (URL-encoded if it has spaces).
 *   alt            {string}  Accessible description of the image.
 *   height         {string}  CSS height for the band. Defaults to
 *                              'clamp(140px, 22vw, 260px)'.
 *   objectPosition {string}  CSS object-position for the photo.
 *                              Defaults to 'center 62%'.
 *   overlayText    {string}  Optional short text shown over the photo on a
 *                              dark scrim. The band height never changes:
 *                              the text sits absolutely inside the band.
 *   overlayCaption {string} Optional attribution line shown under the
 *                              overlay text (e.g. name and role).
 *
 * The image description is exposed to assistive technology.
 * If the image fails to load the flat palette colour (#F2F2F0) is shown
 * at the same height instead of a broken-image icon.
 */
export default function ImageBand({
  image,
  alt,
  height = 'clamp(140px, 22vw, 260px)',
  objectPosition = 'center 62%',
  overlayText = '',
  overlayCaption = '',
}) {
  const [failed, setFailed] = useState(false)

  // No image supplied, or the image failed to load → flat palette colour.
  if (!image || failed) {
    return (
      <div
        className="image-band image-band--fallback"
        style={{ height }}
        role="presentation"
        aria-hidden="true"
      />
    )
  }

  return (
    <div className="image-band" style={{ height }}>
      <img
        className="image-band__img"
        src={image}
        alt={alt}
        loading="lazy"
        decoding="async"
        width="1600"
        height="1200"
        style={{ objectPosition }}
        onError={() => setFailed(true)}
      />
      {overlayText ? (
        <div className="image-band__overlay">
          <p className="image-band__text">{overlayText}</p>
          {overlayCaption ? (
            <p className="image-band__caption">{overlayCaption}</p>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
