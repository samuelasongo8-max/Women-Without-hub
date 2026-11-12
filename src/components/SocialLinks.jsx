import { socialLinks } from '../data/site.js'

const icons = {
  facebook: (
    <svg viewBox="0 0 320 512" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06H297.6V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 448 512" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 149.1V448z" />
    </svg>
  ),
}

function defaultLabel(platform) {
  return platform === 'linkedin'
    ? 'LinkedIn'
    : `${platform.charAt(0).toUpperCase()}${platform.slice(1)}`
}

export default function SocialLinks({
  className,
  linkClassName,
  platformClassPrefix,
  labelFor = defaultLabel,
}) {
  return (
    <div className={className}>
      {Object.entries(socialLinks).map(([platform, url]) => {
        const icon = icons[platform]
        if (!icon) return null

        const platformClass = platformClassPrefix
          ? ` ${platformClassPrefix}-${platform}`
          : ''

        return (
          <a
            key={platform}
            className={`${linkClassName}${platformClass}`}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={labelFor(platform)}
          >
            {icon}
          </a>
        )
      })}
    </div>
  )
}
