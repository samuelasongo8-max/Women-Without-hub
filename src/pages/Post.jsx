import { useEffect, useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import api from '../api/axios.js'
import './PostsInstagram.css'
import { convertGoogleDriveUrl } from '../utils/driveUrl.js'

function getField(post, ...names) {
  for (const name of names) {
    if (post[name] !== undefined && post[name] !== null && post[name] !== '') {
      return post[name]
    }
  }
  return ''
}

function formatDate(value) {
  if (!value) return ''
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString()
}

export default function Post() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const fetchRef = useRef(false)

  useEffect(() => {
    if (fetchRef.current) return
    fetchRef.current = true

    setLoading(true)
    setError('')

    api.get('/api/posts')
      .then((res) => {
        const raw = res.data.posts || []

        // Deduplicate by _id
        const seen = new Set()
        const unique = raw.filter((p) => {
          const key = p._id?.toString() || p.id
          if (seen.has(key)) return false
          seen.add(key)
          return true
        })

        // Sort newest first
        unique.sort((a, b) =>
          new Date(b.date || b.createdAt) -
          new Date(a.date || a.createdAt)
        )

        setPosts(unique)
      })
      .catch((err) => {
        setError(
          err.response?.data?.message ||
          'Unable to load posts.'
        )
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="impact-section-page">
        <PageHeader
          title={t('post.title')}
          intro={t('post.subtitle')}
          className="impact-image-header post-page-header"
          minHeight={null}
        />
        <p>Loading posts…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="impact-section-page">
        <PageHeader
          title={t('post.title')}
          intro={t('post.subtitle')}
          className="impact-image-header post-page-header"
          minHeight={null}
        />
        <p className="impall-empty">{error}</p>
      </div>
    )
  }

  return (
    <div className="impact-section-page">
      <PageHeader
        title={t('post.title')}
        intro={t('post.subtitle')}
        className="impact-image-header post-page-header"
        minHeight={null}
      />
      {posts.length === 0 ? (
        <p className="impall-empty">
          No posts yet.
        </p>
      ) : (
        <div className="ig-grid">
          {posts.map((post) => (
            <div key={post._id} className="ig-card">
              {post.imageUrl ? (
                <img
                  className="ig-card__image"
                  src={convertGoogleDriveUrl(post.imageUrl)}
                  alt={post.imageAlt || post.topic}
                  referrerPolicy="no-referrer"
                  onError={(e) => { e.target.style.display = 'none' }}
                />
              ) : (
                <div className="ig-card__placeholder">No image</div>
              )}
              <div className="ig-card__actions">
                <a className="ig-card__action" aria-label="heart">♥</a>
                <a className="ig-card__action" aria-label="comment">💬</a>
              </div>
              <div className="ig-card__body">
                <p className="ig-card__topic">{post.topic}</p>
                <p className="ig-card__content">{post.content}</p>
                {post.imageCaption && <p className="ig-card__caption">{post.imageCaption}</p>}
                <p className="ig-card__date">{formatDate(post.date)}</p>
                <button
                  className="ig-card__readmore"
                  onClick={() => navigate(`/impact/post/${post._id}`)}
                >
                  Read More
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
