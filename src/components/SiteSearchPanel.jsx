import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ORG_NAME } from '../config/site.js'
import './SiteSearchPanel.css'

function highlightedSnippet(result) {
  const match =
    result.matches?.find((entry) => entry.key === 'text' && entry.indices.length) ??
    result.matches?.find((entry) => entry.indices.length)
  const fullText = match?.key === 'heading'
    ? result.item.heading
    : match?.key === 'title'
      ? result.item.title
      : result.item.text
  const [matchStart, matchEnd] = match?.indices[0] ?? [0, 0]
  const start = Math.max(0, matchStart - 65)
  const end = Math.min(fullText.length, Math.max(start + 180, matchEnd + 90))
  const snippet = fullText.slice(start, end)
  const relativeStart = matchStart - start
  const relativeEnd = Math.min(snippet.length, matchEnd + 1 - start)

  return (
    <>
      {start > 0 && '…'}
      {snippet.slice(0, relativeStart)}
      {relativeEnd > relativeStart ? (
        <mark>{snippet.slice(relativeStart, relativeEnd)}</mark>
      ) : null}
      {snippet.slice(relativeEnd)}
      {end < fullText.length && '…'}
    </>
  )
}

export default function SiteSearchPanel({ onClose }) {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const panelRef = useRef(null)
  const inputRef = useRef(null)
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [fuse, setFuse] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    let active = true
    setIsLoading(true)
    setLoadError(false)
    setFuse(null)
    Promise.all([
      import('fuse.js'),
      import('../search/searchIndex.js'),
    ])
      .then(([fuseModule, indexModule]) => {
        if (!active) return
        const records = indexModule.buildSearchIndex(t)
        const Fuse = fuseModule.default
        setFuse(
          new Fuse(records, {
            keys: [
              { name: 'title', weight: 0.35 },
              { name: 'heading', weight: 0.4 },
              { name: 'text', weight: 0.25 },
            ],
            threshold: 0.36,
            ignoreLocation: true,
            ignoreDiacritics: true,
            minMatchCharLength: 2,
            includeMatches: true,
          }),
        )
        setIsLoading(false)
      })
      .catch((error) => {
        console.error('Unable to load site search.', error)
        if (active) {
          setLoadError(true)
          setIsLoading(false)
        }
      })
    return () => {
      active = false
    }
  }, [i18n.language, t])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedQuery(query.trim())
      setSelectedIndex(0)
    }, 200)
    return () => window.clearTimeout(timeoutId)
  }, [query])

  useEffect(() => {
    const onDocumentClick = (event) => {
      if (!panelRef.current?.contains(event.target)) onClose()
    }
    document.addEventListener('click', onDocumentClick)
    return () => document.removeEventListener('click', onDocumentClick)
  }, [onClose])

  const results = useMemo(() => {
    if (!fuse || debouncedQuery.length < 2) return []
    return fuse.search(debouncedQuery, { limit: 8 })
  }, [debouncedQuery, fuse])

  const closeAndRestoreFocus = () => onClose({ restoreFocus: true })
  const selectResult = (result) => {
    navigate(result.item.url)
    onClose()
    if (result.item.url.includes('#')) {
      const targetId = decodeURIComponent(result.item.url.split('#')[1])
      window.requestAnimationFrame(() => {
        document.getElementById(targetId)?.scrollIntoView({ block: 'start' })
      })
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowDown' && results.length) {
      event.preventDefault()
      setSelectedIndex((current) => (current + 1) % results.length)
    } else if (event.key === 'ArrowUp' && results.length) {
      event.preventDefault()
      setSelectedIndex((current) => (current - 1 + results.length) % results.length)
    } else if (event.key === 'Enter' && results.length) {
      event.preventDefault()
      selectResult(results[selectedIndex] ?? results[0])
    }
  }

  return (
    <div
      className="auvd-search-panel"
      ref={panelRef}
      onKeyDownCapture={(event) => {
        if (event.key === 'Escape') {
          event.preventDefault()
          closeAndRestoreFocus()
        }
      }}
    >
      <div className="auvd-search-panel__inner">
        <form
          className="auvd-search-form"
          role="search"
          onSubmit={(event) => event.preventDefault()}
        >
          <label className="auvd-search-form__label" htmlFor="site-search">
            {t('search.open', { defaultValue: 'Search' })}
          </label>
          <div className="auvd-search-form__control">
            <input
              ref={inputRef}
              id="site-search"
              type="search"
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={results.length > 0}
              aria-controls={results.length ? 'site-search-results' : undefined}
              aria-activedescendant={
                results.length ? `site-search-result-${selectedIndex}` : undefined
              }
              autoComplete="off"
              placeholder={t('search.placeholder', {
                defaultValue: `Search ${ORG_NAME}...`,
              })}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={handleKeyDown}
            />
            {query && (
              <button
                className="auvd-search-form__clear"
                type="button"
                aria-label={t('search.clear', { defaultValue: 'Clear search' })}
                onClick={() => {
                  setQuery('')
                  inputRef.current?.focus()
                }}
              >
                ×
              </button>
            )}
          </div>
          <button
            className="auvd-search-form__close"
            type="button"
            aria-label={t('search.close', { defaultValue: 'Close search' })}
            onClick={closeAndRestoreFocus}
          >
            ×
          </button>
        </form>

        {loadError ? (
          <p className="auvd-search-message" role="alert">
            {t('search.error', { defaultValue: 'Search could not be loaded. Please try again.' })}
          </p>
        ) : isLoading && debouncedQuery.length >= 2 ? (
          <p className="auvd-search-message" role="status">
            {t('search.loading', { defaultValue: 'Loading search...' })}
          </p>
        ) : debouncedQuery.length >= 2 && results.length > 0 ? (
          <ul
            className="auvd-search-results"
            id="site-search-results"
            role="listbox"
            aria-label={t('search.results', { defaultValue: 'Search results' })}
          >
            {results.map((result, resultIndex) => (
              <li
                className={`auvd-search-result${selectedIndex === resultIndex ? ' is-selected' : ''}`}
                id={`site-search-result-${resultIndex}`}
                key={result.item.id}
                role="option"
                aria-selected={selectedIndex === resultIndex}
              >
                <Link
                  to={result.item.url}
                  onClick={() => onClose()}
                  onMouseEnter={() => setSelectedIndex(resultIndex)}
                >
                  <span className="auvd-search-result__meta">
                    {result.item.title} · {result.item.heading}
                  </span>
                  <span className="auvd-search-result__snippet">
                    {highlightedSnippet(result)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : debouncedQuery.length >= 2 ? (
          <div className="auvd-search-empty">
            <p>
              {t('search.noResults', {
                query: debouncedQuery,
                defaultValue: "No results for '{{query}}'. Try different words.",
                interpolation: { escapeValue: false },
              })}
            </p>
            <div className="auvd-search-empty__links">
              <Link to="/get-involved/" onClick={() => onClose()}>
                {t('search.getInvolved', { defaultValue: 'Get Involved' })}
              </Link>
              <Link to="/contact/" onClick={() => onClose()}>
                {t('search.contact', { defaultValue: 'Contact' })}
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
