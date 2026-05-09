import { useState, useEffect } from 'react'
import { getToken } from '../utils/auth'
import '../styles/PostFeed.css'

export default function PostFeed({ refresh }) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [selectedAnimal, setSelectedAnimal] = useState(null)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)

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

  const handleOpenDetail = async (id) => {
    setLoadingDetail(true)
    try {
      const token = getToken()
      const response = await fetch(`http://localhost:8080/animals/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setSelectedAnimal(data)
      }
    } catch (err) {
      console.error("Error fetching detail:", err)
    } finally {
      setLoadingDetail(false)
    }
  }

  const nextPhoto = () => {
    if (selectedAnimal && selectedAnimal.photos.length > 0) {
      setCurrentPhotoIndex((prev) => (prev + 1) % selectedAnimal.photos.length)
    }
  }

  const prevPhoto = () => {
    if (selectedAnimal && selectedAnimal.photos.length > 0) {
      setCurrentPhotoIndex((prev) => (prev - 1 + selectedAnimal.photos.length) % selectedAnimal.photos.length)
    }
  }

  if (loading) return <p className="feed-message">Cargando publicaciones...</p>
  if (error)   return <p className="feed-message feed-error">{error}</p>
  if (posts.length === 0) return <p className="feed-message">No hay publicaciones aún.</p>

  return (
      <div className="feed-container">
        {loadingDetail && (
            <div className="loading-overlay">
              <div className="spinner"></div>
              <p>Cargando ficha informativa...</p>
            </div>
        )}
        {posts.map((post) => (
            <div
                key={post.idPost}
                className="feed-card"
                onClick={() => handleOpenDetail(post.idAnimal)}
                style={{ cursor: 'pointer' }}
            >

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
      {/* Para mostrar ficha del animal. */}
      {selectedAnimal && (
          <div className="detail-card-overlay" onClick={() => setSelectedAnimal(null)}>
            <div className="detail-card-content" onClick={e => e.stopPropagation()}>
              <button className="detail-card-close" onClick={() => setSelectedAnimal(null)}>&times;</button>

              <div className="detail-card-image-container">
                <img
                    src={selectedAnimal.photos[currentPhotoIndex]}
                    alt={`${selectedAnimal.animalName} - ${currentPhotoIndex + 1}`}
                />

                {/* Controles de la galería si hay más de una foto por mascota. */}
                {selectedAnimal.photos.length > 1 && (
                    <>
                      <button className="gallery-nav prev" onClick={prevPhoto}>&#10094;</button>
                      <button className="gallery-nav next" onClick={nextPhoto}>&#10095;</button>
                      <div className="gallery-indicator">
                        {currentPhotoIndex + 1} / {selectedAnimal.photos.length}
                      </div>
                    </>
                )}
              </div>

              <div className="detail-card-info">
                <div className="detail-card-header-detail">
                  <h2>{selectedAnimal.animalName}</h2>
                  <span className={`feed-card-species ${selectedAnimal.species.toLowerCase()}`}>
                {selectedAnimal.species === 'DOG' ? '🐶 DOG' : '🐱 CAT'}
                  </span>
                </div>

                <div className="detail-card-grid">
                  <span><strong>Raza:</strong> {selectedAnimal.breedName || 'Sin información'}</span>
                  <span><strong>Tamaño:</strong> {selectedAnimal.size}</span>
                  <span><strong>Código Postal:</strong> {selectedAnimal.animalZipcode}</span>
                  <span><strong>Fecha de nacimiento:</strong> {selectedAnimal.dateOfBirth || 'Sin información'}</span>
                </div>

                <hr className="detail-card-divider" />

                <h3>Descripción de {selectedAnimal.animalName}</h3>
                <p className="detail-card-description">{selectedAnimal.description}</p>
              </div>
            </div>
          </div>
      )}
    </div>
  )
}