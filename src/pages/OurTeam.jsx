import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ORG_NAME } from '../config/site.js'
import PageHeader from '../components/PageHeader.jsx'
import './OurTeam.css'

/** 
 * Our Team — subpage of About.
 * Roster photos live in the public images directory.
 */

const team = [
  {
    name: 'MaLua Lugazo',
    role: 'Founder & Executive Director',
    photo: '/images/team/malua-lugazo.jpg',
    photoWebp: '/images/team/malua-lugazo.webp',
    alt: 'MaLua Lugazo, Founder & Executive Director',
    objectPosition: 'center top',
    // Only the Chairperson card links to a profile page.
    profile: '/about/our-team/malua-lugazo/',
  },
  {
    name: 'Hawa Musa',
    role: 'Vice Chairperson',
    photo: '/images/team/hawa-musa.jpg',
    photoWebp: '/images/team/hawa-musa.webp',
    alt: 'Hawa Musa, Vice Chairperson',
    objectPosition: 'center top',
  },
  {
    name: 'Rukundo Mercie',
    role: 'Treasurer',
    photo: '/images/team/rukundo-mercie.jpg',
    photoWebp: '/images/team/rukundo-mercie.webp',
    alt: 'Rukundo Mercie, Treasurer',
    objectPosition: 'center top',
  },
  {
    name: 'Abir Zakaria',
    role: 'Secretary',
    photo: '/images/team/abir-zakaria.jpg',
    photoWebp: '/images/team/abir-zakaria.webp',
    alt: 'Abir Zakaria, Secretary',
    objectPosition: 'center top',
  },
  {
    name: 'Kalo Atahir',
    role: 'Member',
    photo: '/images/team/kalo-atahir.jpg',
    photoWebp: '/images/team/kalo-atahir.webp',
    alt: 'Kalo Atahir, Member',
    objectPosition: 'center top',
  },
  {
    name: 'Khadijoh Mahamed',
    role: 'Member',
    photo: '/images/team/khadijoh-mahamed.jpg',
    photoWebp: '/images/team/khadijoh-mahamed.webp',
    alt: 'Khadijoh Mahamed, Member',
    objectPosition: 'center top',
  },
  {
    name: 'Fatuma Abdulahi',
    role: 'Member',
    photo: '/images/team/fatuma-abdulahi.jpg',
    photoWebp: '/images/team/fatuma-abdulahi.webp',
    alt: 'Fatuma Abdulahi, Member',
    objectPosition: 'center top',
  },
  {
    name: 'Mzigwa Murjani',
    role: 'Member',
    photo: '/images/team/mzigwa-murjani.jpg',
    photoWebp: '/images/team/mzigwa-murjani.webp',
    alt: 'Mzigwa Murjani, Member',
    objectPosition: 'center 20%',
  },
  {
    name: 'Doctor Ali Kuku',
    role: 'Member',
    photo: '/images/team/ali-kuku.jpg',
    alt: `Doctor Ali Kuku, Member of ${ORG_NAME}`,
    objectPosition: 'center top',
    photoWebp: '/images/team/ali-kuku.webp',
  },
  {
    name: 'Mchiwa Mwaliko',
    role: 'Member',
    photo: '/images/team/mchiwa-mwaliko.jpg',
    alt: `Mchiwa Mwaliko, Member of ${ORG_NAME}`,
    objectPosition: 'center top',
    photoWebp: '/images/team/mchiwa-mwaliko.webp',
  },
]

export default function OurTeam() {
  const { t } = useTranslation()

  useEffect(() => {
    const preload = document.createElement('link')
    preload.rel = 'preload'
    preload.as = 'image'
    preload.href = '/images/team-hero.webp'
    preload.setAttribute('fetchpriority', 'high')
    document.head.appendChild(preload)

    return () => {
      preload.remove()
    }
  }, [])

  return (
    <div className="ourteam-page">
      <PageHeader
        title={t('team.title')}
        intro={t('team.subtitle')}
        className="impact-image-header team-page-header"
        minHeight={null}
      />

      <div className="ourteam-grid">
        {team.map((member, index) => (
          <article key={`ourteam-${member.name}-${index}`} className="ourteam-card">
            <div
              className="ourteam-photo"
              style={{ background: '#F2F2F0' }}
              aria-label={`Photo of ${member.name}`}
            >
              <picture
                style={{ display: 'block', width: '100%', height: '100%' }}
              >
                {member.photoWebp && (
                  <source srcSet={member.photoWebp} type="image/webp" />
                )}
                <img
                  className="ourteam-photo-img"
                  src={member.photo}
                  alt={member.alt}
                  loading="lazy"
                  decoding="async"
                  width={600}
                  height={600}
                  style={{ objectPosition: member.objectPosition }}
                  onError={(e) => {
                    // Hide the broken image and reveal the initials fallback.
                    e.currentTarget.classList.add('error')
                    const fallback = e.currentTarget
                      .closest('.ourteam-photo')
                      ?.querySelector('.ourteam-fallback')
                    if (fallback) fallback.style.display = 'flex'
                  }}
                />
              </picture>
              <div className="ourteam-fallback" aria-hidden="true">
                {member.name
                  .split(/\s+/)
                  .map((part) => part[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
            </div>
            <h2 className="ourteam-name">{member.name}</h2>
            <p className="ourteam-role">{member.role}</p>
            {member.profile && (
              <Link
                to={member.profile}
                className="ourteam-profile-btn"
                aria-label={`View the profile of ${member.name}`}
              >
                {t('about.ourTeam.viewProfile')}
              </Link>
            )}
          </article>
        ))}
      </div>

      <div className="ourteam-cta-wrap">
        <div className="ourteam-cta">
          <h2>Want to join the team?</h2>
          <p>
            <Link to="/get-involved/volunteer/">Volunteer</Link>,{' '}
            <Link to="/get-involved/mentor/">mentor</Link> or{' '}
            <Link to="/contact/">contact us</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}
