import './OurPartners.css'

/**
 * Our Partners — a strip of logo slots shown directly below Get Involved.
 *
 * HOW TO ADD A REAL LOGO LATER:
 *   1. Drop the logo image into the `public/` folder, e.g. `public/partner-acme.png`.
 *   2. Set that partner's `logo` to the public URL, e.g. `logo: '/partner-acme.png'`.
 *      (If the file name contains spaces, URL-encode them, e.g. `/partner%20acme.png`.)
 *   3. Optionally set `url` to the partner's website; the box becomes a link
 *      that opens in a new tab (target="_blank", rel="noopener noreferrer").
 * When `logo` is null, the box shows the dashed "Partner logo" placeholder.
 */
const PARTNERS = [
  { name: 'Partner 1', logo: null, url: null },
  { name: 'Partner 2', logo: null, url: null },
  { name: 'Partner 3', logo: null, url: null },
  { name: 'Partner 4', logo: null, url: null },
  { name: 'Partner 5', logo: null, url: null },
  { name: 'Partner 6', logo: null, url: null },
]

/** A single logo slot: real image when provided, otherwise a placeholder. */
function PartnerSlot({ partner }) {
  const inner = partner.logo ? (
    <img
      className="ourpartners__img"
      src={partner.logo}
      alt={partner.name}
      loading="lazy"
    />
  ) : (
    <span>Partner logo</span>
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
        <p className="ourpartners__subtitle">Trusted by Global Partners and Funders</p>

        <div className="ourpartners__grid">
          {PARTNERS.map((partner) => (
            <PartnerSlot key={partner.name} partner={partner} />
          ))}
        </div>

        <p className="ourpartners__note">Partner logos are under development.</p>
      </div>
    </section>
  )
}