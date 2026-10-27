import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import BlobPhotoCard from '../components/BlobPhotoCard'
import './WhyThisMatters.css'

const photos = [
  {
    image: '/images/why-matters-girls.webp',
    altKey: 'schoolgirlsAlt',
  },
  {
    image: '/images/why-matters-education.webp',
    altKey: 'educationAlt',
  },
  {
    image: '/images/why-matters-skills.webp',
    altKey: 'skillsAlt',
  },
]

export default function WhyThisMatters() {
  const { t } = useTranslation()
  return (
    <section className="section why-matters" id="why-this-matters">

      <div className="container">
        <h2 className="section-title why-matters__title">
          {t('common.whyThisMatters')}
        </h2>
        <p className="why-intro">{t('common.whyIntro')}</p>

        <div className="why-matters-blob-wrapper">
          {photos.map((photo) => (
            <BlobPhotoCard
              key={photo.image}
              image={photo.image}
              alt={t(`whyThisMatters.${photo.altKey}`)}
            />
          ))}
        </div>

        <p className="section-cta">
          <Link to="/impact/">
            {t('common.ctaSeeImpact')}
          </Link>
        </p>
      </div>
    </section>
  )
}
