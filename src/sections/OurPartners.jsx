import './OurPartners.css'

/** Our Partners — a centered strip of partner logos below Get Involved. */
const PARTNERS = [
  {
    name: 'Teach for Community',
    logo: '/images/partners/teach-for-community.jpg',
    alt: 'Teach for Community logo',
  },
]

function PartnerSlot({ partner }) {
  const inner = (
    <img
      className="ourpartners__img"
      src={partner.logo}
      alt={partner.alt}
      width="300"
      height="300"
      loading="lazy"
      decoding="async"
    />
  )

  return (
    <div className="ourpartners__slot">
      {partner.url ? (
        <a
          className="ourpartners__link"
          href={partner.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {inner}
        </a>
      ) : (
        inner
      )}
    </div>
  )
}

export default function OurPartners() {
  return (
    <section className="ourpartners" aria-labelledby="ourpartners-heading">
      <div className="ourpartners__inner">
        <h2 className="ourpartners__heading" id="ourpartners-heading">
          Our Partners
        </h2>
        <p className="ourpartners__subtitle">Teach for Community</p>

        <div className="ourpartners__grid">
          {PARTNERS.map((partner) => (
            <PartnerSlot key={partner.name} partner={partner} />
          ))}
        </div>

      </div>
    </section>
  )
}