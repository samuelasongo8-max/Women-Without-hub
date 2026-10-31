const TIME_ZONE = 'Africa/Nairobi'
const DAY_MS = 24 * 60 * 60 * 1000
const NAIROBI_UTC_OFFSET_MS = 3 * 60 * 60 * 1000

function getNairobiCalendarDate(date) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)

  return Object.fromEntries(
    parts
      .filter((part) => part.type !== 'literal')
      .map(({ type, value }) => [type, Number(value)]),
  )
}

function parseDateOnly(dateString) {
  if (typeof dateString !== 'string') return null
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateString)
  if (!match) return null

  const [, yearText, monthText, dayText] = match
  const year = Number(yearText)
  const month = Number(monthText)
  const day = Number(dayText)
  const timestamp = Date.UTC(year, month - 1, day)
  const parsed = new Date(timestamp)

  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) {
    return null
  }

  return timestamp
}

export function getTimeAgo(publishDate, now = new Date()) {
  const publishedAt = parseDateOnly(publishDate)
  if (publishedAt === null || Number.isNaN(now.getTime())) return null

  const today = getNairobiCalendarDate(now)
  const todayAt = Date.UTC(today.year, today.month - 1, today.day)
  const days = Math.floor((todayAt - publishedAt) / DAY_MS)

  if (days < 0) return null
  if (days === 0) return { unit: 'today', count: 0 }
  if (days === 1) return { unit: 'yesterday', count: 1 }
  if (days < 7) return { unit: 'day', count: days }
  return { unit: 'week', count: Math.floor(days / 7) }
}

export function getMillisecondsUntilNairobiMidnight(now = new Date()) {
  const today = getNairobiCalendarDate(now)
  const nextMidnightUtc =
    Date.UTC(today.year, today.month - 1, today.day + 1) -
    NAIROBI_UTC_OFFSET_MS
  return Math.max(1, nextMidnightUtc - now.getTime() + 1)
}
