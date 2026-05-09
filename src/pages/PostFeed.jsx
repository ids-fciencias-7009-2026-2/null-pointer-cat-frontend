import { useState, useEffect } from 'react'
import { getToken } from '../utils/auth'
import '../styles/PostFeed.css'
import EditPost from './EditPost'

// ─── Helpers ────────────────────────────────────────────────────────────────

const SPECIES_EMOJI = { DOG: '🐶', CAT: '🐱' }

const SIZE_LABELS = {
  small:       'Small',
  medium:      'Medium',
  large:       'Large',
  extra_large: 'Extra Large',
}

function formatDate(isoDate) {
  if (!isoDate) return ''
  return new Date(isoDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function getInitials(firstname, lastname) {
  return `${firstname?.[0] ?? ''}${lastname?.[0] ?? ''}`.toUpperCase()
}

/**
 * Calculates age as "X years, Y months" from a date of birth ISO string.
 */
function calcAge(dateOfBirth) {
  if (!dateOfBirth) return null
  const birth = new Date(dateOfBirth)
  const now   = new Date()
  let years  = now.getFullYear() - birth.getFullYear()
  let months = now.getMonth() - birth.getMonth()
  if (months < 0) { years--; months += 12 }
  if (years === 0) return `${months} month${months !== 1 ? 's' : ''}`
  if (months === 0) return `${years} year${years !== 1 ? 's' : ''}`
  return `${years} year${years !== 1 ? 's' : ''}, ${months} month${months !== 1 ? 's' : ''}`
}

// ─── Carousel ───────────────────────────────────────────────────────────────

function PhotoCarousel({ photos, animalName }) {
  const [current, setCurrent] = useState(0)
  const [imgErrors, setImgErrors] = useState({})

  if (!photos || photos.length === 0) {
    return (
      <div className="pf-carousel pf-carousel-placeholder">
        <span>Oops... There are no photos to show</span>
      </div>
    )
  }

  const prev = () => setCurrent(i => (i - 1 + photos.length) % photos.length)
  const next = () => setCurrent(i => (i + 1) % photos.length)

  return (
    <div className="pf-carousel">
      {imgErrors[current] ? (
        <div className="pf-carousel-placeholder"><span>Oops... Photos aren't loading</span></div>
      ) : (
        <img
          className="pf-carousel-img"
          src={photos[current]}
          alt={`${animalName} - photo ${current + 1}`}
          onError={() => setImgErrors(prev => ({ ...prev, [current]: true }))}
        />
      )}

      {photos.length > 1 && (
        <>
          <button className="pf-carousel-btn pf-carousel-btn-prev" onClick={prev}>‹</button>
          <button className="pf-carousel-btn pf-carousel-btn-next" onClick={next}>›</button>
          <div className="pf-carousel-dots">
            {photos.map((_, i) => (
              <button
                key={i}
                className={`pf-dot ${i === current ? 'pf-dot-active' : ''}`}
                onClick={() => setCurrent(i)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ─── Single post card ────────────────────────────────────────────────────────

function PostCard({ post, currentUserId, onRefresh }) {
  const [expanded, setExpanded] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)

  const isOwner = String(post.publisherId) === String(currentUserId)
  console.log('publisherId:', post.publisherId, 'currentUserId:', currentUserId, 'isOwner:', isOwner)
  const age = calcAge(post.dateOfBirth)

  const handleEditSuccess = () => {
    setShowEditModal(false)
    onRefresh?.()
  }

  return (
    <article className="pf-card">

      <div className="pf-card-header">
        <div className="pf-avatar">
          {getInitials(post.publisherFirstname, post.publisherLastname)}
        </div>
        <div className="pf-publisher-info">
          <span className="pf-publisher-name">
            {post.publisherFirstname} {post.publisherLastname}
          </span>
          <span className="pf-publisher-date">{formatDate(post.createdAt)}</span>
        </div>
        <div className="pf-header-right">
          <span className="pf-zipcode">📍 {post.animalZipcode}</span>
        </div>
      </div>

      <PhotoCarousel photos={post.photos} animalName={post.animalName} />

      <div className="pf-card-body">
        <h3 className="pf-animal-name">{post.animalName}</h3>

        {post.description && (
          <p className="pf-description">{post.description}</p>
        )}

        <div className={`pf-extra-info ${expanded ? 'pf-extra-info-open' : ''}`}>
          <div className="pf-extra-info-inner">

            {/*Size*/}
            {post.size && (
              <div className="pf-info-row">
                <span className="pf-info-label">Size</span>
                <span className="pf-info-value">{SIZE_LABELS[post.size] ?? post.size}</span>
              </div>
            )}

            {/*Age*/}
            {age && (
              <div className="pf-info-row">
                <span className="pf-info-label">Age</span>
                <span className="pf-info-value">{age}</span>
              </div>
            )}

            {/*Animal description (distinct from post description)*/}
            {post.animalDescription && (
              <div className="pf-info-row pf-info-row-column">
                <span className="pf-info-label">About</span>
                <span className="pf-info-value">{post.animalDescription}</span>
              </div>
            )}

          </div>
        </div>

        {/*Footer*/}
        <div className="pf-card-footer">
          <span className="pf-species-tag">
            {SPECIES_EMOJI[post.species] ?? '🐾'} {post.species}
          </span>
          <button
            className="pf-more-btn"
            onClick={() => setExpanded(prev => !prev)}
          >
            {expanded ? 'Less info' : 'More info'}
          </button>
        </div>
      </div>

      {/* Edit Button */}
      {isOwner && (
        <button
          className="pf-edit-btn"
          onClick={() => setShowEditModal(true)}
        >
          Edit
        </button>
      )}

      {/* Edition Modal  */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Edit post</h2>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>✕</button>
            </div>
            <EditPost
              post={post}
              onSuccess={handleEditSuccess}
              onClose={() => setShowEditModal(false)}
            />
          </div>
        </div>
      )}

    </article>
  )
}

// Feed

export default function PostFeed({ refresh, currentUserId, onRefresh }) {
  const [posts, setPosts]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      setError(null)
      try {
        const token = getToken()
        const response = await fetch('http://localhost:8080/post', {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!response.ok) {
          setError('Could not load posts. Please try again.')
          return
        }

        const data = await response.json()
        setPosts(data)
      } catch {
        setError('Connection error. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [refresh])

  if (loading) return <p className="pf-message">Loading posts...</p>
  if (error)   return <p className="pf-message pf-message-error">{error}</p>
  if (posts.length === 0) return (
    <div className="pf-empty">
      <span>🐾</span>
      <p>No posts yet.</p>
    </div>
  )

  return (
    <div className="pf-grid">
      {posts.map(post => (
        
      <PostCard key={post.idPost} post={post} currentUserId={currentUserId} onRefresh={onRefresh} />
      ))}
    </div>
  )
}
