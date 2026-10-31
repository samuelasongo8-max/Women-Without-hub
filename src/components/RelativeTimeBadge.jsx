import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  getMillisecondsUntilNairobiMidnight,
  getTimeAgo,
} from '../utils/timeAgo.js'

export default function RelativeTimeBadge({ publishDate }) {
  const { t, i18n } = useTranslation()
  const [relativeTime, setRelativeTime] = useState(null)
  const language = i18n.resolvedLanguage || i18n.language || 'en'

  useEffect(() => {
    let timer

    const update = () => setRelativeTime(getTimeAgo(publishDate))
    const scheduleNextMidnight = () => {
      window.clearTimeout(timer)
      timer = window.setTimeout(() => {
        update()
        scheduleNextMidnight()
      }, getMillisecondsUntilNairobiMidnight())
    }
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        update()
        scheduleNextMidnight()
      }
    }

    update()
    scheduleNextMidnight()
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [publishDate])

  if (relativeTime === null) {
    return (
      <time className="impall-card__badge" dateTime={publishDate}>
        {publishDate}
      </time>
    )
  }

  const label =
    relativeTime.unit === 'today' || relativeTime.unit === 'yesterday'
      ? t(`timeAgo.${relativeTime.unit}`)
      : t(`timeAgo.${relativeTime.unit}`, {
          count: relativeTime.count,
          formattedCount: new Intl.NumberFormat(language).format(
            relativeTime.count,
          ),
        })

  return (
    <time className="impall-card__badge" dateTime={publishDate}>
      {label}
    </time>
  )
}
