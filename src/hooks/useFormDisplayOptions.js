import { useCallback, useState } from 'react'

export const FORM_THEMES = [
  'default',
  'soft-light',
  'high-contrast-light',
  'high-contrast-dark',
  'yellow-on-black',
  'blue-on-cream',
  'dark-gray',
]

export const FORM_TEXT_SCALES = ['1', '1.25', '1.5']

function getSystemTheme() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return 'default'
  }
  if (window.matchMedia('(prefers-contrast: more)').matches) {
    return 'high-contrast-light'
  }
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark-gray'
  }
  return 'default'
}

function getInitialOptions() {
  let savedTheme
  let savedScale
  try {
    savedTheme = window.localStorage.getItem('wwbh.formTheme')
    savedScale = window.localStorage.getItem('wwbh.formTextScale')
  } catch {
    return { theme: getSystemTheme(), scale: '1' }
  }

  return {
    theme: FORM_THEMES.includes(savedTheme) ? savedTheme : getSystemTheme(),
    scale: FORM_TEXT_SCALES.includes(savedScale) ? savedScale : '1',
  }
}

function saveOption(key, value) {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // The selected option remains active for this visit when storage is blocked.
  }
}

export default function useFormDisplayOptions() {
  const [options, setOptions] = useState(getInitialOptions)

  const setTheme = useCallback((theme) => {
    if (!FORM_THEMES.includes(theme)) return
    setOptions((current) => ({ ...current, theme }))
    saveOption('wwbh.formTheme', theme)
  }, [])

  const setScale = useCallback((scale) => {
    if (!FORM_TEXT_SCALES.includes(scale)) return
    setOptions((current) => ({ ...current, scale }))
    saveOption('wwbh.formTextScale', scale)
  }, [])

  const reset = useCallback(() => {
    setOptions({ theme: 'default', scale: '1' })
    saveOption('wwbh.formTheme', 'default')
    saveOption('wwbh.formTextScale', '1')
  }, [])

  return { ...options, setTheme, setScale, reset }
}
