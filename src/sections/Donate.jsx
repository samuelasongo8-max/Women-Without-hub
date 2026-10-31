import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { donateCta } from '../data/site.js'
import './Donate.css'

export default function DonateSection() {
  const { t } = useTranslation()

  return (
    <section className="section donate-banner">
      <div className="container">
        <h2>{t('donate.title')}</h2>
        <p>
          {t('donate.subtitle')}
        </p>
        <div className="donate-actions">
          <Link to={donateCta.to} className="btn btn-donate btn-lg">
            {t('nav.donate')}
          </Link>
          <Link to="/get-involved/partner/" className="btn btn-outline btn-lg">
            {t('getInvolvedCards.cardPartner.title')}
          </Link>
        </div>
      </div>
    </section>
  )
}
