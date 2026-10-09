import './Stories.css'

/**
 * Home section: Stories & News (auvd-).
 * Three themed cards (Story / News / Report). Cards are not linked;
 * each shows a "Will be updated soon" notice.
 */
const posts = [
  {
    tag: 'Story',
    title: 'From dropout to developer',
    excerpt: 'How Amara completed our digital skills bootcamp and hired four.',
    theme: 'teal',
    icon: (
      <svg
        viewBox="0 0 32 32"
        width="32"
        height="32"
        fill="none"
        stroke="#ffffff"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        <rect x="5" y="7" width="22" height="14" rx="2" />
        <path d="M3 24h26" />
        <path d="M12.5 11.5 10 14l2.5 2.5" />
        <path d="M19.5 11.5 22 14l-2.5 2.5" />
        <path d="M16.8 11l-1.6 6" />
      </svg>
    ),
  },
  {
    tag: 'News',
    title: 'New mentorship cohort opens',
    excerpt: 'Applications are open for 200 places across five regions.',
    theme: 'yellow',
    icon: (
      <svg
        viewBox="0 0 32 32"
        width="32"
        height="32"
        fill="none"
        stroke="#ffffff"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M6 13h5l13-6v18l-13-6H6a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2z" />
        <path d="M11 18v3a2 2 0 0 0 2 2h1" />
        <path d="M27.5 13c1.4 1.2 1.4 5.8 0 7" />
      </svg>
    ),
  },
  {
    tag: 'Report',
    title: 'Menstrual dignity in schools',
    excerpt: 'Our latest WASH programme results, now available to download.',
    theme: 'coral',
    icon: (
      <svg
        viewBox="0 0 32 32"
        width="32"
        height="32"
        fill="none"
        stroke="#ffffff"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M8 4.5h10.5L24 10v17.5H8z" />
        <path d="M18.5 4.5V10H24" />
        <path d="M11.5 23v-3" />
        <path d="M15.5 23v-7" />
        <path d="M19.5 23v-5" />
      </svg>
    ),
  },
]

export default function StoriesSection() {
  return (
    <section className="auvd-stories">
      <i className="auvd-stories-brush auvd-stories-brush--teal" aria-hidden="true" />
      <i className="auvd-stories-brush auvd-stories-brush--yellow" aria-hidden="true" />
      <i className="auvd-stories-brush auvd-stories-brush--coral" aria-hidden="true" />

      <div className="auvd-stories-inner">
        <h2 className="auvd-stories-title">
          Stories <span className="auvd-stories-amp">&amp;</span> News
        </h2>

        <div className="auvd-stories-grid">
          {posts.map((post) => (
            <article
              key={post.title}
              className={`auvd-story-card auvd-story-card--${post.theme}`}
            >
              <span className="auvd-story-icon" aria-hidden="true">
                {post.icon}
              </span>
              <p className="auvd-story-label">{post.tag}</p>
              <h3 className="auvd-story-title">{post.title}</h3>
              <p className="auvd-story-text">{post.excerpt}</p>
              <p className="stories-soon-notice">Will be updated soon</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

