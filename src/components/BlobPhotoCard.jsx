import { useId, useState } from 'react'
import './BlobPhotoCard.css'

const BLOB = 'M70 40 C120 -5 215 10 238 62 C262 118 205 150 222 196 C238 240 175 268 118 252 C58 236 28 190 46 140 C58 104 30 76 70 40 Z'

export default function BlobPhotoCard({ image, alt, lines = [] }) {
  const clipId = useId().replace(/:/g, '')
  const fallbackImage = image.replace(/\.webp$/i, '.jpg')
  const [photo, setPhoto] = useState(image)

  return (
    <figure className="bp">
      <svg className="bp-art" viewBox="0 0 300 330" role="img" aria-label={alt}>
        <defs>
          <clipPath id={clipId}>
            <path d={BLOB} />
          </clipPath>
        </defs>
        <g transform="translate(16 22)">
          <path d={BLOB} fill="var(--bp-yellow)" />
        </g>
        <g clipPath={`url(#${clipId})`}>
          <rect x="10" y="-6" width="260" height="280" fill="#7b8f45" />
          <image
            href={photo}
            loading="lazy"
            decoding="async"
            x="38"
            y="0"
            width="215"
            height="269"
            preserveAspectRatio="xMidYMid slice"
            onError={() => {
              if (photo !== fallbackImage) setPhoto(fallbackImage)
            }}
          />
        </g>
        <path
          d="M210 262 A36 36 0 0 1 204 306"
          fill="none"
          stroke="var(--bp-yellow)"
          strokeWidth="9"
          strokeLinecap="round"
        />
        <g fill="var(--bp-dot)">
          <circle cx="262" cy="96" r="4" />
          <circle cx="274" cy="110" r="3" />
          <circle cx="256" cy="112" r="3" />
          <circle cx="270" cy="124" r="3.5" />
          <circle cx="284" cy="118" r="2.5" />
          <circle cx="20" cy="236" r="3.5" />
          <circle cx="32" cy="250" r="3" />
          <circle cx="14" cy="254" r="2.5" />
          <circle cx="28" cy="266" r="3.5" />
          <circle cx="44" cy="260" r="2.5" />
        </g>
        <circle cx="150" cy="14" r="12" fill="var(--bp-yellow)" fillOpacity=".75" />
      </svg>
      <figcaption className="bp-title">
        {lines.map((line, index) => (
          <span key={`${index}-${line}`}>{line}</span>
        ))}
      </figcaption>
    </figure>
  )
}
