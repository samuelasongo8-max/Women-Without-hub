import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import './OurTeam.css'

/**
 * Our Team — subpage of About at /about/our-team/.
 * PLACEHOLDER ROSTER — replace each entry with a real team member.
 * Photos live in public/ (e.g. "/team-photo.png" — spaces as %20).
 */
const team = [
  {
    name: 'Team Member Name',
    role: 'Role / Title',
    photo: null,
    bio: 'Short bio goes here — one or two sentences about this team member.',
  },
  {
    name: 'Team Member Name',
    role: 'Role / Title',
    photo: null,
    bio: 'Short bio goes here — one or two sentences about this team member.',
  },
  {
    name: 'Team Member Name',
    role: 'Role / Title',
    photo: null,
    bio: 'Short bio goes here — one or two sentences about this team member.',
  },
  {
    name: 'Team Member Name',
    role: 'Role / Title',
    photo: null,
    bio: 'Short bio goes here — one or two sentences about this team member.',
  },
  {
    name: 'Team Member Name',
    role: 'Role / Title',
    photo: null,
    bio: 'Short bio goes here — one or two sentences about this team member.',
  },
  {
    name: 'Team Member Name',
    role: 'Role / Title',
    photo: null,
    bio: 'Short bio goes here — one or two sentences about this team member.',
  },
]

export default function OurTeam() {
  return (
    <div className="ourteam-page">
      <PageHeader
        title="Our Team"
        intro="The community leaders, educators and mentors behind Women Without Borders Hub in Kakuma."
      />

      <div className="ourteam-grid">
        {team.map((member, index) => (
          <article key={`${member.name}-${index}`} className="ourteam-card">
            {member.photo ? (
              <img
                className="ourteam-photo-img"
                src={member.photo}
                alt={member.name}
                loading="lazy"
              />
            ) : (
              <div className="ourteam-photo" aria-label="Team photo under development">
                Under development
              </div>
            )}
            <h2 className="ourteam-name">{member.name}</h2>
            <p className="ourteam-role">{member.role}</p>
            <p className="ourteam-bio">{member.bio}</p>
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