import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'

export default function Safeguarding() {
  return (
    <>
      <PageHeader
        title="Safeguarding"
        intro="Keeping women, girls, volunteers and staff safe is non-negotiable. These are our commitments and how to raise a concern."
      />

      <section className="section container prose">
        <h2>Our commitment</h2>
        <p>
          We operate a zero-tolerance policy on exploitation, abuse and
          harassment. Every team member, volunteer and partner completes
          safeguarding training and is bound by our code of conduct.
        </p>

        <h2>How we work</h2>
        <ul>
          <li>Safer recruitment including background checks</li>
          <li>Trained safeguarding focal points in every programme</li>
          <li>Confidential reporting channels with protection from retaliation</li>
          <li>Survivor-centred response, referring to specialist services</li>
        </ul>

        <h2>Raise a concern</h2>
        <p>
          If you have a concern about the safety of a participant or staff
          member, contact our safeguarding team immediately via the{' '}
          <Link to="/contact/">contact page</Link>. Reports are treated
          confidentially.
        </p>
      </section>
    </>
  )
}
