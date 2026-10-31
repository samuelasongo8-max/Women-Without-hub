import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ImpactsLayout from '../components/ImpactsLayout.jsx'
import './Impact.css'

const stats = [
  { number: '200+', label: 'impact.stats.reached' },
  { number: '6', label: 'impact.stats.programmes' },
  { number: '1', label: 'impact.stats.locations' },
]

export default function Impact() {
  const { t } = useTranslation()

  return (
    <>
      {/* Hero replaces the shared PageHeader on this page only; the
          component itself stays untouched for every other page. */}
      <section className="impact-hero">
        <div className="impact-hero__top">
          <h1 className="impact-hero__title">{t('nav.impact')}</h1>
          <p className="impact-hero__subtitle">{t('impact.intro')}</p>
        </div>

        {/* Stats band, pinned to the bottom of the hero. */}
        <div className="impact-hero__band">
          <div className="impact-hero__grid">
            {stats.map((s) => (
              <div key={s.label} className="impact-stat">
                <span className="impact-stat__number">{s.number}</span>
                <span className="impact-stat__label">{t(s.label)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="impact-body">
        {/* "Impacts" sidebar (All) + full card grid. */}
        <ImpactsLayout />

     

       

        {/* Image (left, full-bleed) + overlapping teal card — the
            redesigned "How we measure" block. measure-* classes are
            scoped in Impact.css so they can't clash with other styles. */}
        <section className="measure">
          <img
            className="measure__image"
            src="/Measure impact.png"
            alt={t('impact.measureImageAlt', {
              defaultValue: 'Women and girls taking part in a programme in Kakuma',
            })}
          />

          <div className="measure__card">
            <h2 className="measure__title">{t('impact.howWeMeasure', { defaultValue: 'How we measure' })}</h2>
            <p className="measure__text">
              {t('impact.measureDescription')}{' '}
              <Link to="/resources/" className="measure__link">{t('nav.resources')}</Link>.
            </p>

            <h3 className="measure__subtitle">
              {t('impact.multiply', { defaultValue: 'Help us multiply this impact' })}
            </h3>
            <p className="measure__text">
              <Link to="/get-involved/donate/" className="measure__donate">{t('nav.donate')}</Link>
              {t('impact.supportConnector')}{' '}
              <Link to="/get-involved/volunteer/" className="measure__link">{t('footer.volunteer')}</Link>{' '}
              {t('impact.or')}{' '}
              <Link to="/get-involved/partner/" className="measure__link">{t('getInvolvedCards.cardPartner.title')}</Link>{' '}
              {t('impact.withUs')}
            </p>
          </div>
        </section>
      </div>
    </>
  )
}
