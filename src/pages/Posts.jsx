import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import PageHeader from '../components/PageHeader.jsx'
import api from '../api/axios.js'
import './ImpactSectionPages.css'
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

export default function Posts() {
  const { t } = useTranslation()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    api.get('/api/posts')
      .then((response) => {
        if (!active) return
        setPosts(response.data.posts || [])
      })
      .catch((err) => {
        if (!active) return
        setError(err.response?.data?.message || 'Unable to load posts.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => { active = false }
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
        <p className="impall-empty">{t('common.willBeUpdatedSoon')}</p>
      ) : (
        <div className="impall-grid">
          {posts.map((post) => (
            <article key={post._id} className="impall-card">
              <div className="impall-card__image">
                {post.imageUrl ? (
                  <img
                    src={convertGoogleDriveUrl(post.imageUrl)}
                    alt={getField(post, 'imageAlt', 'alt') || post.topic || post.title || ''}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                ) : (
                  <span className="impall-card__placeholder">
                    {t('common.photoComingSoon')}
                  </span>
                )}
              </div>
              <div className="impall-card__body">
                <p className="impall-card__label">
                  <span aria-hidden="true" className="impall-card__label-dot" />
                  {t('impact.sections.post')}
                </p>
                <h3 className="impall-card__title">{getField(post, 'topic', 'title')}</h3>
                {getField(post, 'imageCaption', 'caption') && (
                  <p className="impall-card__caption">{getField(post, 'imageCaption', 'caption')}</p>
                )}
                <p className="impall-card__text">{getField(post, 'content')}</p>
                {getField(post, 'date', 'createdAt') && (
                  <p className="impall-card__date">{formatDate(getField(post, 'date', 'createdAt'))}</p>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}