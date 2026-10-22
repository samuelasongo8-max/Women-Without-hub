import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import PageHeader from '../components/PageHeader.jsx'
import './OurTeam.css'

/** 
 * Our Team — subpage of About at /about/our-term. 
 * Roster of 8 team members of Women Without Borders Hub in Kakuma, Kenya.
 * Photos live in public/ (URL-encoded paths for filenames with spaces).
 */

const team = [
  {
    name: 'MaLua Lugazo',
    role: 'Founder & Executive Director',
    photo: '/Chairperson%20Maluo%20Lugazo.png',
    alt: 'MaLua Lugazo, Founder & Executive Director',
    objectPosition: 'center top',
    // Only the Chairperson card links to a profile page.
    profile: '/about/our-team/malua-lugazo/',
  },
  {
    name: 'Hawa Musa',
    role: 'Vice Chairperson',
    photo: '/Hawa%20Musa.jpg',
    alt: 'Hawa Musa, Vice Chairperson',
    objectPosition: 'center top',
  },
  {
    name: 'Rukundo Mercie',
    role: 'Treasurer',
    photo: '/Rukundo%20Mercie.jpg',
    alt: 'Rukundo Mercie, Treasurer',
    objectPosition: 'center top',
  },
  {
    name: 'Abir Zakaria',
    role: 'Secretary',
    photo: '/Abir%20Zakaria.jpg',
    alt: 'Abir Zakaria, Secretary',
    objectPosition: 'center top',
  },
  {
    name: 'Kalo Atahir',
    role: 'Member',
    photo: '/Kalo%20Atahir.jpg',
    alt: 'Kalo Atahir, Member',
    objectPosition: 'center top',
  },
  {
    name: 'Khadijoh Mahamed',
    role: 'Member',
    photo: '/Khadijoh%20Mahamed.jpg',
    alt: 'Khadijoh Mahamed, Member',
    objectPosition: 'center top',
  },
  {
    name: 'Fatuma Abdulahi',
    role: 'Member',
    photo: '/Fatuma%20ABdulahi.jpg',
    alt: 'Fatuma Abdulahi, Member',
    objectPosition: 'center top',
  },
  {
    name: 'Mzigwa Murjani',
    role: 'Member',
    photo: '/Mzigwa_Murjani-removebg.png',
    alt: 'Mzigwa Murjani, Member',
    objectPosition: 'center top',
  },
]

export default function OurTeam() {
  const { t } = useTranslation()
  return (
    <div className="ourteam-page">
      <PageHeader
        title="Our Team"
        intro="The community leaders, educators and mentors behind Women Without Borders Hub in Kakuma."
      />

      <div className="ourteam-grid">
        {team.map((member, index) => (
          <article key={`ourteam-${member.name}-${index}`} className="ourteam-card">
            <div
              className="ourteam-photo"
              style={{ background: '#F2F2F0' }}
              aria-label={`Photo of ${member.name}`}
            >
              <img
                className="ourteam-photo-img"
                src={member.photo}
                alt={member.alt}
                loading="lazy"
                decoding="async"
                width="400"
                height="400"
                style={{ objectPosition: member.objectPosition }}
                onError={(e) => {
                  // Hide the broken image and reveal the initials fallback.
                  e.currentTarget.classList.add('error')
                  const fallback = e.currentTarget.parentElement?.querySelector(
                    '.ourteam-fallback',
                  )
                  if (fallback) fallback.style.display = 'flex'
                }}
              />
              <div
                className="ourteam-fallback"
                style={{
                  display: 'none',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: '100%',
                  color: '#888888',
                  fontFamily: "'Source Sans 3', 'Segoe UI', system-ui, sans-serif",
                  fontSize: '0.9rem',
                }}
              >
                {member.name.split(' ').map((part, i) => (i === 0 ? part[0] : '')).join('')}
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
