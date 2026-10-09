import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { normalizePath } from '../data/site.js'

export default function NotFound() {
  const { t } = useTranslation()
  return (
    <section className="section container prose">
      <h1>{t('notFound.title')}</h1>
      <p>
        {t('notFound.message')}{' '}
        <Link to="/">{t('notFound.backHome')}</Link>.
      </p>
      <p className="hint">
        {t('a11y.routesTrailingSlash')}{' '}
        <code>{normalizePath('/about')}</code>.
      </p>
    </section>
  )
}
