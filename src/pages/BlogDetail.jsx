import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import DOMPurify from 'dompurify'
import api from '../api/axios.js'
import { normalizeBlog } from '../utils/blogFields.js'
import './BlogDetail.css'

const BLOG_CONTENT_SANITIZE_CONFIG = {
  ALLOWED_TAGS: [
    'p', 'br', 'strong', 'b', 'em', 'i', 'u',
    'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'span',
  ],
  ALLOWED_ATTR: ['class', 'style'],
  ADD_ATTR: ['style'],
  ALLOW_DATA_ATTR: false,
}

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

export default function BlogDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [featuredImageFailed, setFeaturedImageFailed] = useState(false)
  const [contentImageFailed, setContentImageFailed] = useState(false)
  const [shareMessage, setShareMessage] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    setFeaturedImageFailed(false)
    setContentImageFailed(false)

    api.get(`/api/blogs/${id}`)
      .then((res) => {
        setBlog(normalizeBlog(res.data.blog))
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Blog not found.')
      })
      .finally(() => setLoading(false))
  }, [id])

  async function handleShare() {
    const shareData = {
      title: blog?.title || 'Blog',
      url: window.location.href,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
        setShareMessage('Shared.')
      } else {
        await navigator.clipboard.writeText(shareData.url)
        setShareMessage('Link copied.')
      }
    } catch {
      setShareMessage('')
    }
  }

  if (loading) {
    return (
      <div className="blog-detail-page">
        <p className="blog-detail__state">Loading blog…</p>
      </div>
    )
  }

  if (error || !blog) {
    return (
      <div className="blog-detail-page">
        <p className="blog-detail__state blog-detail__state--error">
          {error || 'Blog not found.'}
        </p>
        <button
          className="blog-detail__back"
          type="button"
          onClick={() => navigate('/impact/blogs')}
        >
          ← Back to Blogs
        </button>
      </div>
    )
  }

  const hasContentImage = Boolean(blog.contentImage && !contentImageFailed)
  const contentIsHtml = String(blog.content || '').includes('<')
  const safeContent = contentIsHtml
    ? DOMPurify.sanitize(blog.content, BLOG_CONTENT_SANITIZE_CONFIG)
    : ''
  const heroStyle = blog.featuredImage && !featuredImageFailed
    ? { backgroundImage: `url("${blog.featuredImage}")` }
    : undefined

  return (
    <div className="blog-detail-page">
      <section
        className="blog-detail__hero"
        style={heroStyle}
        aria-label={blog.title}
      >
        <div className="blog-detail__hero-overlay">
          <div className="blog-detail__hero-content">
            <p className="blog-detail__eyebrow">BLOG</p>
            <h1 className="blog-detail__hero-title">{blog.title}</h1>
          </div>
        </div>
        {blog.featuredImage && (
          <img
            className="blog-detail__image-preload"
            src={blog.featuredImage}
            alt=""
            aria-hidden="true"
            referrerPolicy="no-referrer"
            onError={() => setFeaturedImageFailed(true)}
          />
        )}
      </section>

      <div className="blog-detail__actions">
        <button
          className="blog-detail__back"
          type="button"
          onClick={() => navigate('/impact/blogs')}
        >
          ← Back to Blogs
        </button>
        <div className="blog-detail__share-wrap">
          <button
            className="blog-detail__share"
            type="button"
            onClick={handleShare}
          >
            Share
          </button>
          {shareMessage && (
            <span className="blog-detail__share-message" role="status">
              {shareMessage}
            </span>
          )}
        </div>
      </div>

      <section className={`blog-detail__content-section${hasContentImage ? '' : ' blog-detail__content-section--no-image'}`}>
        {hasContentImage && (
          <div className="blog-detail__media">
            <img
              className="blog-detail__content-image"
              src={blog.contentImage}
              alt={blog.imageAlt || blog.title}
              referrerPolicy="no-referrer"
              onError={() => setContentImageFailed(true)}
            />
          </div>
        )}
        <article className="blog-detail__article">
          <p className="blog-detail__date">{formatDate(blog.date)}</p>
          {contentIsHtml ? (
            <div
              className="blog-detail__content"
              dangerouslySetInnerHTML={{ __html: safeContent }}
            />
          ) : (
            <div className="blog-detail__content">{blog.content}</div>
          )}
        </article>
      </section>
    </div>
  )
}
