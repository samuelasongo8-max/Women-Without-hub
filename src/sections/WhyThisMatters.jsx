import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './WhyThisMatters.css'

const reasons = [
  {
    title: 'Girls miss out on education',
    text: 'Conflict, displacement and poverty interrupt schooling — and a pregnancy can end it completely. Remedial and second-chance education put learning back within reach.',
  },
  {
    title: 'Teenage mothers are left behind',
    text: 'Young mothers are often excluded from classrooms and training. Pathways back to learning, mentorship and skills restore their options.',
  },
  {
    title: 'Skills without opportunity lead nowhere',
    text: 'Digital and vocational skills only change lives when they connect to apprenticeships, market linkages and employment referrals.',
  },
]

export default function WhyThisMatters() {
  const { t } = useTranslation()
  return (
    <section className="section why-matters" id="why-this-matters">

      <div className="container">
        <h2 className="section-title why-matters__title">
          {t('common.whyThisMatters', { defaultValue: 'Why This Matters' })}
        </h2>
        <p className="why-intro">
          {t('common.whyIntro', {
            defaultValue:
              'Women and girls in Kakuma Refugee Camp face many challenges, including financial hardship, interrupted education, limited access to skills training, and barriers to employment and healthcare. For teenage mothers, these challenges can be even greater as they balance childcare with their education and personal development. At Women Without Borders Hub, we believe every girl and young woman deserves the opportunity to overcome these barriers, discover her potential, and build a better future. By promoting education, practical skills, mentorship, health awareness, and economic empowerment, we aim to create opportunities for women and girls to grow in confidence, strengthen their independence, and contribute to their communities.',
          })}
        </p>

        <div className="why-grid">
          {reasons.map((r) => (
            <article key={r.title} className="why-card">
              <h3>{t(`common.whyTitle.${r.title}`, { defaultValue: r.title })}</h3>
              <p>{t(`common.whyText.${r.title}`, { defaultValue: r.text })}</p>
            </article>
          ))}
        </div>

        <p className="section-cta">
          <Link to="/impact/">
            {t('common.ctaSeeImpact', {
              defaultValue: 'See the difference your support makes →',
            })}
          </Link>
        </p>
      </div>
    </section>
  )
}
