import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import DOMPurify from 'dompurify'
import PageHeader from '../components/PageHeader.jsx'
import api from '../api/axios.js'
import { normalizeBlog } from '../utils/blogFields.js'
import './Blogs.css'

function formatDate(value) {
  if (!value) return ''
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
}

function getExcerpt(content) {
  const text = DOMPurify
    .sanitize(String(content || ''), { ALLOWED_TAGS: [], ALLOWED_ATTR: [] })
    .replace(/\s+/g, ' ')
    .trim()
  return text.length > 140 ? `${text.slice(0, 140)}…` : text
}

export default function Blog() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [blogs, setBlogs] = useState([])
  const [failedImages, setFailedImages] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const fetchRef = useRef(false)

  useEffect(() => {
    if (fetchRef.current) return
    fetchRef.current = true

    api.get('/api/blogs')
      .then((res) => {
        const seen = new Set()
        const unique = (res.data.blogs || [])
          .map(normalizeBlog)
          .filter((blog) => {
            const key = blog._id?.toString()
            if (!key || seen.has(key)) return false
            seen.add(key)
            return true
          })
          .sort((a, b) => new Date(b.date) - new Date(a.date))

        setBlogs(unique)
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Unable to load blogs.')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  function handleImageError(blogId) {
    setFailedImages((current) => {
      const next = new Set(current)
      next.add(blogId)
      return next
    })
  }

  if (loading) {
    return (
      <div className="impact-section-page">
        <PageHeader
          title={t('blogs.title')}
          intro={t('blogs.subtitle')}
          className="impact-image-header post-page-header"
          minHeight={null}
        />
        <p className="blog-list-state">Loading blogs…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="impact-section-page">
        <PageHeader
          title={t('blogs.title')}
          intro={t('blogs.subtitle')}
          className="impact-image-header post-page-header"
          minHeight={null}
        />
        <p className="blog-list-state blog-list-state--error">{error}</p>
      </div>
    )
  }

  return (
    <div className="impact-section-page">
      <PageHeader
        title={t('blogs.title')}
        intro={t('blogs.subtitle')}
        className="impact-image-header post-page-header"
        minHeight={null}
      />
      {blogs.length === 0 ? (
        <p className="blog-list-state">No blogs yet.</p>
      ) : (
        <div className="blog-grid">
          {blogs.map((blog) => (
            <article key={blog._id} className="blog-card">
              <div className="blog-card__image-wrap">
                {blog.featuredImage && !failedImages.has(blog._id) ? (
                  <img
                    className="blog-card__image"
                    src={blog.featuredImage}
                    alt={blog.imageAlt || blog.title}
                    referrerPolicy="no-referrer"
                    onError={() => handleImageError(blog._id)}
                  />
                ) : (
                  <div className="blog-card__placeholder">
                    <span>{blog.title || 'Blog'}</span>
                  </div>
                )}
              </div>
              <div className="blog-card__body">
                <h2 className="blog-card__title">{blog.title || 'Untitled blog'}</h2>
                <p className="blog-card__excerpt">{getExcerpt(blog.content)}</p>
                <p className="blog-card__date">{formatDate(blog.date)}</p>
                <button
                  className="blog-card__readmore"
                  type="button"
                  onClick={() => navigate(`/impact/blogs/${blog._id}`)}
                >
                  Read More
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
