import { useState, useEffect } from 'react'
import { getToken } from '../utils/auth'
import '../styles/PostFeed.css'

export default function PostFeed({ refresh }) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      try {
        const token = getToken()
        const response = await fetch('http://localhost:8080/post', {
          headers: { Authorization: `Bearer ${token}` },
        })
        console.log('Status:', response.status)

        if (!response.ok) {
          setError('No se pudieron cargar las publicaciones.')
          return
        }

        const data = await response.json()
        setPosts(data)
      } catch (err) {
        setError('Error de conexión.')
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [refresh]) 

  if (loading) return <p className="feed-message">Loading posts...</p>
  if (error)   return <p className="feed-message feed-error">{error}</p>
  if (posts.length === 0) return <p className="feed-message">No hay publicaciones aún.</p>

  return (
    <div className="feed-container">
      {posts.map((post) => (
        <div key={post.idPost} className="feed-card">

          {/* Foto */}
          {post.photos.length > 0 && (
            <div className="feed-card-image">
              <img src={post.photos[0]} alt={post.animalName} />
            </div>
          )}

          {/* Info */}
          <div className="feed-card-body">
            <div className="feed-card-header">
              <h3 className="feed-card-name">{post.animalName}</h3>
              <span className={`feed-card-species ${post.species.toLowerCase()}`}>
                {post.species === 'DOG' ? '🐶 DOG' : '🐱 CAT'}
              </span>
            </div>

            {post.breedName && (
              <p className="feed-card-breed">{post.breedName}</p>
            )}

            {post.description && (
              <p className="feed-card-description">{post.description}</p>
            )}

            <div className="feed-card-footer">
              {post.size && <span className="feed-card-tag">{post.size}</span>}
              <span className="feed-card-tag">📍 {post.animalZipcode}</span>
            </div>
          </div>

        </div>
      ))}
    </div>
  )
}