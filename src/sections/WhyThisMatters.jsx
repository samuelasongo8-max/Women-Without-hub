import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useEffect, useRef, useState } from 'react'
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
  const photosRef = useRef(null)
  const [photosVisible, setPhotosVisible] = useState(false)

  useEffect(() => {
    const photosElement = photosRef.current
    if (!photosElement) return undefined

    if (!('IntersectionObserver' in window)) {
      setPhotosVisible(true)
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPhotosVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.18, rootMargin: '0px 0px -8% 0px' },
    )

    observer.observe(photosElement)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="section why-matters" id="why-this-matters">

      <div className="container">
        <h2 className="section-title why-matters__title">
          {t('common.whyThisMatters')}
        </h2>
        <p className="why-intro">{t('common.whyIntro')}</p>

        <div
          ref={photosRef}
          className={`why-matters-blob-wrapper${photosVisible ? ' is-visible' : ''}`}
        >
          {photos.map((photo) => (
            <BlobPhotoCard
              key={photo.image}
              image={photo.image}
              alt={t(`whyThisMatters.${photo.altKey}`)}
            />
          ))}
        </div>

        <p className="section-cta">
          <Link to="/about/">
            {t('whyThisMatters.exploreMore')}
          </Link>
        </p>
      </div>
    </section>
  )
}
