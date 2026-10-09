/** Post items for the Impact "All" combined list.
 *
 * Single source of truth: both Post cards read their title, preview,
 * full text, image and link from the shared `updates` data in
 * CommunityUpdates.jsx, so any edit there shows up here automatically.
 * The dates below are the posts' own publish dates (kept as they were);
 * the "weeks ago" badge is counted live from them on every render, and
 * the read time is derived from the shared full text (~200 words/min).
 */
import { updates } from '../sections/CommunityUpdates.jsx'

const WORDS_PER_MINUTE = 200

function readTimeFor(fullText) {
  const words = fullText.trim().split(/\s+/).filter(Boolean).length
  return `${Math.max(1, Math.round(words / WORDS_PER_MINUTE))} min read`
}

function postFromUpdate(slug, { id, date }) {
  const update = updates.find((u) => u.slug === slug)
  return {
    id,
    type: 'Post',
    title: update.title,
    caption: 'Community Updates',
    // Card preview: first paragraph only (CSS clamps it to 3 lines).
    excerpt: update.fullText.split('\n\n')[0].trim(),
    date,
    image: update.image,
    alt: update.alt,
    readTime: readTimeFor(update.fullText),
    to: update.to,
    button: 'Read more',
  }
}

export const postPosts = [
  postFromUpdate('graduation-celebration-skills', {
    id: 'post-1',
    date: '2026-06-18',
  }),
  postFromUpdate('building-pathways-for-women-and-girls', {
    id: 'post-2',
    date: '2026-05-30',
  }),
]
