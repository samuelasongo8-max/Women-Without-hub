import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { maluaLugazoPersonSchema } from '../data/seo.js'
import { ORG_NAME } from '../config/site.js'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import './MaluaLugazoProfile.css'

/**
 * MaLua Lugazo — Founder & Executive Director profile.
 * Rendered at /about/our-team/malua-lugazo/ inside the shared Layout,
 * so the normal nav bar and footer are shown.
 *
 * The photo is the same optimized portrait used on her team card.
 */

const PHOTO = '/images/team/malua-lugazo.jpg'

const HERO_INTRO =
  `MaLua Lugazo is the Founder and Executive Director of ${ORG_NAME}, a community-led initiative based in Kakuma Refugee Camp, Kenya. The Hub works to create opportunities for refugee and marginalized women and girls to learn, build skills and shape their own futures.`

const FEATURE_PARAGRAPHS = [
  'MaLua brings more than nine years of experience in humanitarian and community development. She served for five years as a Project Coordinator with Wings to Fly Initiative – CBO, and for four years as a Facilitator with the Norwegian Refugee Council, where she implemented the Accelerated Education Programme and served as a Better Learning Programme Champion.',
  'She holds a Diploma in Social Work and Community Development and is pursuing a Bachelor’s Degree in Social Work and Administration. Her work has strengthened her commitment to education, community development, child protection, and creating opportunities for vulnerable and marginalized populations, particularly refugee women and girls.',
]

const BARRIERS = [
  'Interrupted education and limited opportunities to return to school',
  'Financial constraints',
  'Limited access to digital skills and vocational training',
  'Few pathways to sustainable livelihoods',
  'For teenage mothers: childcare responsibilities, stigma, and the difficulty of balancing motherhood with education and personal development',
  'Risks of gender-based violence',
  'Limited access to health information and services',
  'Social barriers that restrict participation in decision-making',
]

const FOCUS_AREAS = [
  {
    title: 'Education',
    text: 'A foundation for personal growth, informed decisions and future opportunities, with a chance for girls and young women whose learning was interrupted to continue their studies and pursue their ambitions.',
  },
  {
    title: 'Mentorship',
    text: 'Helps women and girls build confidence, identify their strengths, develop leadership skills and learn from people who can guide and encourage them.',
  },
  {
    title: 'Digital skills',
    text: 'Help women access information, communicate, join online learning, explore employment and develop or market small businesses in a digital world.',
  },
  {
    title: 'Health awareness',
    text: 'Helps women and girls make informed decisions about their wellbeing, menstrual health, sexual and reproductive health, hygiene and available support services.',
  },
  {
    title: 'Women’s economic empowerment',
    text: 'Builds practical and entrepreneurial skills and income-generating opportunities, toward greater financial independence.',
  },
]

const LEADING_CHALLENGES = [
  'Mobilizing the financial and material resources needed to start programmes, reach more women and girls and sustain activities over time',
  'Building partnerships with organizations that understand the community-led approach and are willing to invest in locally driven solutions',
  'Developing the systems, policies and monitoring and evaluation processes needed to grow responsibly, with accountability and safeguarding',
  'Balancing the urgent needs of the community with the long-term work of building a sustainable organization',
]

export default function MaluaLugazoProfile() {
  const { pathname } = useLocation()
  const [photoFailed, setPhotoFailed] = useState(false)

  // Land at the top of the page, like the other detail pages.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [pathname])

  return (
    <main className="mlp">
      {/* Person structured data for this profile page. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(maluaLugazoPersonSchema()),
        }}
      />

      {/* ---------- 1. HERO ---------- */}
      <section className="mlp-hero">
        <Breadcrumbs />
        <p className="mlp-eyebrow">{ORG_NAME} Leadership</p>
        <h1 className="mlp-title">
          MaLua Lugazo - Founder & Executive Director of {ORG_NAME}
        </h1>
        <p className="mlp-intro">{HERO_INTRO}</p>
      </section>

      <hr className="mlp-rule" />

      {/* ---------- 2. PHOTO + ROLE FEATURE ---------- */}
      <section className="mlp-feature">
        <div className="mlp-feature__media">
          {photoFailed ? (
            <div className="mlp-photo mlp-photo--fallback" aria-hidden="true">
              ML
            </div>
          ) : (
            <img
              className="mlp-photo"
              src={PHOTO}
              alt={`MaLua Lugazo, Founder and Executive Director of ${ORG_NAME}`}
              loading="eager"
              decoding="async"
              width="280"
              height="375"
              onError={() => setPhotoFailed(true)}
            />
          )}
        </div>

        <div className="mlp-feature__body">
          <h2 className="mlp-h2">Founder and organizational leader</h2>
          {FEATURE_PARAGRAPHS.map((text) => (
            <p key={text.slice(0, 32)} className="mlp-p">
              {text}
            </p>
          ))}
          <hr className="mlp-rule" />
          <p className="mlp-role">
            <strong>Official role:</strong> Founder | Executive Director
          </p>

          <div className="mlp-links">
            <Link className="mlp-link" to="/about/our-team/">
              Meet the leadership team
            </Link>
            <Link className="mlp-link" to="/about/our-story/">
              Read our story
            </Link>
          </div>
        </div>
      </section>

      <hr className="mlp-rule" />

      {/* ---------- 3. MOTIVATION ---------- */}
      <section className="mlp-section">
        <h2 className="mlp-h2">What motivated her to start the Hub</h2>
        <p className="mlp-p">
          MaLua started {ORG_NAME} after years of working alongside refugee
          and marginalized women and girls in Kakuma. She repeatedly saw the same
          pattern: women and girls were willing and ready to learn, to lead and to
          build a life for themselves, but they were held back by barriers that
          were never addressed by short-term responses.
        </p>
        <p className="mlp-p">
          Rather than run another short-term activity, she founded the Hub to build
          a space where women and girls are treated as partners and leaders in
          their own development. That decision is at the heart of everything the
          organization does today.
        </p>
      </section>

      <hr className="mlp-rule" />

      {/* ---------- 4. KAKUMA BARRIERS ---------- */}
      <section className="mlp-section">
        <h2 className="mlp-h2">The barriers women and girls face in Kakuma</h2>
        <p className="mlp-p">
          Living in Kakuma Refugee Camp means that opportunities are limited and
          competition for the few that exist is intense. The main barriers
          observed by the Hub are:
        </p>
        <ul className="mlp-list">
          {BARRIERS.map((item) => (
            <li key={item.slice(0, 32)}>{item}</li>
          ))}
        </ul>
      </section>

      <hr className="mlp-rule" />

      {/* ---------- 5. PROBLEM ADDRESSED ---------- */}
      <section className="mlp-section">
        <h2 className="mlp-h2">The problem the Hub addresses</h2>
        <p className="mlp-p">
          Women and girls in Kakuma are often excluded from the decisions that
          affect their lives. Programmes are designed for them rather than with
          them, and support stops once a project ends. As a result, the same
          barriers return year after year and leadership potential stays
          untapped.
        </p>
        <p className="mlp-p">
          {ORG_NAME} responds to this gap with a community-led approach
          that strengthens practical skills, restores access to learning, and
          positions women and girls as leaders of their own solutions.
        </p>
      </section>

      <hr className="mlp-rule" />

      {/* ---------- 6. FIVE FOCUS AREAS ---------- */}
      <section className="mlp-section">
        <h2 className="mlp-h2">The five focus areas of the Hub</h2>
        <div className="mlp-focus">
          {FOCUS_AREAS.map((area) => (
            <article key={area.title} className="mlp-focus__card">
              <h3 className="mlp-focus__title">{area.title}</h3>
              <p className="mlp-focus__text">{area.text}</p>
            </article>
          ))}
        </div>
      </section>

      <hr className="mlp-rule" />

      {/* ---------- 7. MISSION ---------- */}
      <section className="mlp-section mlp-section--mission">
        <h2 className="mlp-h2">The mission of {ORG_NAME}</h2>
        <p className="mlp-mission">
          To empower refugee and marginalized women and girls in Kakuma by
          strengthening education, skills, confidence and leadership, so that
          they can shape their own futures and lead change in their community.
        </p>
      </section>

      <hr className="mlp-rule" />

      {/* ---------- 8. ORGANIZATIONAL CHALLENGES ---------- */}
      <section className="mlp-section">
        <h2 className="mlp-h2">Leading the organization: current challenges</h2>
        <p className="mlp-p">
          As Founder and Executive Director, MaLua leads the organization day to
          day while also shaping its long-term direction. The main challenges
          she leads on are:
        </p>
        <ul className="mlp-list">
          {LEADING_CHALLENGES.map((item) => (
            <li key={item.slice(0, 32)}>{item}</li>
          ))}
        </ul>
      </section>

      <hr className="mlp-rule" />

      {/* ---------- 9. DESIRED CHANGE ---------- */}
      <section className="mlp-section">
        <h2 className="mlp-h2">The change she wants to see</h2>
        <p className="mlp-p">
          MaLua wants to see women and girls in Kakuma move from being seen only
          as beneficiaries to being recognized as partners and leaders. She wants
          the barriers that stop girls from returning to school, from learning
          new skills and from earning their own income to weaken, and she wants
          more women included in the decisions that shape their community.
        </p>
        <p className="mlp-p">
          For the Hub, this means young women leaving school with new skills and
          confidence, women earning a steady income, and girls stepping into
          leadership roles in their families, schools and community.
        </p>
      </section>

      <hr className="mlp-rule" />

      {/* ---------- 10. LONG-TERM VISION ---------- */}
      <section className="mlp-section">
        <h2 className="mlp-h2">The long-term vision</h2>
        <p className="mlp-p">
          MaLua envisions {ORG_NAME} growing into a strong, self-sustaining
          community organization that is led by the women and girls it serves.
          The long-term goal is for the Hub to become a model of community-led
          change in Kakuma and beyond, proving that local leadership is the most
          powerful force for lasting change, and inspiring other organizations to
          work differently.
        </p>
      </section>

      {/* ---------- 11. CLOSING CTA BAND ---------- */}
      <section className="mlp-cta">
        <h2 className="mlp-cta__title">Support this work</h2>
        <p className="mlp-cta__text">
          Every contribution helps more women and girls in Kakuma access
          education, skills and the space to lead.
        </p>
        <div className="mlp-cta__actions">
          <Link className="mlp-btn mlp-btn--primary" to="/get-involved/donate/">
            Donate
          </Link>
          <Link className="mlp-btn mlp-btn--ghost" to="/get-involved/partner/">
            Partner with us
          </Link>
        </div>
      </section>
    </main>
  )
}
