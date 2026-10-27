import { useRef, useState } from 'react'
import './DisplayOptions.css'

const THEMES = [
  { id: 'default', color: '#1f6f6f' },
  { id: 'soft-light', color: '#f7f3e9' },
  { id: 'high-contrast-light', color: '#ffffff' },
  { id: 'high-contrast-dark', color: '#000000' },
  { id: 'yellow-on-black', color: '#ffd400' },
  { id: 'blue-on-cream', color: '#0057b8' },
  { id: 'dark-gray', color: '#1e1e1e' },
]

const SCALES = ['1', '1.25', '1.5']

export default function DisplayOptions({
  theme,
  scale,
  onThemeChange,
  onScaleChange,
  onReset,
  t,
}) {
  const [announcement, setAnnouncement] = useState('')
  const themeRefs = useRef([])
  const scaleRefs = useRef([])
  const isRtl = document.documentElement.dir === 'rtl'

  function moveRadio(event, values, selected, refs, onChange) {
    const directions = {
      ArrowRight: isRtl ? -1 : 1,
      ArrowDown: 1,
      ArrowLeft: isRtl ? 1 : -1,
      ArrowUp: -1,
    }
    const direction = directions[event.key]
    if (!direction) return
    event.preventDefault()
    const nextIndex =
      (values.indexOf(selected) + direction + values.length) % values.length
    const nextValue = values[nextIndex]
    onChange(nextValue)
    refs.current[nextIndex]?.focus()
  }

  function selectTheme(nextTheme) {
    onThemeChange(nextTheme)
    setAnnouncement(
      t('volunteer.displayOptions.announcement', {
        theme: t(`volunteer.displayOptions.themes.${nextTheme}`),
      }),
    )
  }

  function selectScale(nextScale) {
    onScaleChange(nextScale)
  }

  return (
    <section className="display-options" aria-labelledby="display-options-title">
      <h2 id="display-options-title">{t('volunteer.displayOptions.title')}</h2>
      <p className="display-options__helper">
        {t('volunteer.displayOptions.helper')}
      </p>

      <fieldset className="display-options__group" role="radiogroup">
        <legend>{t('volunteer.displayOptions.themeLegend')}</legend>
        <div className="display-options__themes">
          {THEMES.map(({ id, color }, index) => (
            <div className="display-options__theme" key={id}>
              <button
                ref={(node) => { themeRefs.current[index] = node }}
                className="display-options__swatch"
                type="button"
                role="radio"
                aria-checked={theme === id}
                aria-labelledby={`display-theme-${id}`}
                tabIndex={theme === id ? 0 : -1}
                onClick={() => selectTheme(id)}
                onKeyDown={(event) =>
                  moveRadio(event, THEMES.map((item) => item.id), theme, themeRefs, selectTheme)
                }
              >
                <span
                  className="display-options__swatch-color"
                  style={{ '--swatch-color': color }}
                  aria-hidden="true"
                />
                {theme === id && (
                  <span className="display-options__check" aria-hidden="true">
                    ✓
                  </span>
                )}
              </button>
              <span className="display-options__theme-label" id={`display-theme-${id}`}>
                {t(`volunteer.displayOptions.themes.${id}`)}
              </span>
            </div>
          ))}
        </div>
      </fieldset>

      <fieldset className="display-options__group display-options__sizes" role="radiogroup">
        <legend>{t('volunteer.displayOptions.textSizeLegend')}</legend>
        <div className="display-options__size-buttons">
          {SCALES.map((value, index) => (
            <button
              ref={(node) => { scaleRefs.current[index] = node }}
              className="display-options__size"
              type="button"
              role="radio"
              aria-checked={scale === value}
              tabIndex={scale === value ? 0 : -1}
              key={value}
              onClick={() => selectScale(value)}
              onKeyDown={(event) =>
                moveRadio(event, SCALES, scale, scaleRefs, selectScale)
              }
            >
              {t(`volunteer.displayOptions.scales.${value}`)}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="display-options__footer">
        <button
          className="display-options__reset"
          type="button"
          onClick={() => {
            onReset()
            setAnnouncement(t('volunteer.displayOptions.resetAnnouncement'))
          }}
        >
          {t('volunteer.displayOptions.reset')}
        </button>
        <span className="display-options__announcement" aria-live="polite">
          {announcement}
        </span>
      </div>
    </section>
  )
}
