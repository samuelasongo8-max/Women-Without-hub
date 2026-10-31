import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useEffect, useRef, useState } from 'react'
import BlobPhotoCard from '../components/BlobPhotoCard'
import Reveal from '../components/Reveal.jsx'
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
        <Reveal as="h2" className="section-title why-matters__title" direction="left" duration={650}>
          {t('common.whyThisMatters')}
        </Reveal>
        <Reveal as="p" className="why-intro" direction="up" delay={120} duration={650}>
          {t('common.whyIntro')}
        </Reveal>

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
