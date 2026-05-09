import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getToken } from '../utils/auth'
import Sidebar from './Sidebar'
import Post from './Post'
import PostFeed from './PostFeed'
import '../styles/Home.css'
import { BiBell } from 'react-icons/bi'
import AnimalSearch from './AnimalSearch'

export default function Home() {
  const [userInitials, setUserInitials]   = useState('?')
  const [showPostModal, setShowPostModal] = useState(false)
  const [feedRefresh, setFeedRefresh] = useState(0)
  const [searchActive, setSearchActive]   = useState(false)
  const [currentUserId, setCurrentUserId] = useState(null) 
  const navigate = useNavigate()

  useEffect(() => {
    const token = getToken()
    if (!token) { navigate('/login'); return }

    const userData = JSON.parse(sessionStorage.getItem('userData') || '{}')
    if (userData.firstname && userData.lastname) {
      setUserInitials(`${userData.firstname[0]}${userData.lastname[0]}`.toUpperCase())
    }
    setCurrentUserId(userData.id)
  }, [navigate])

  const handlePostSuccess = (data) => {
    console.log('Post created:', data)
    setFeedRefresh(prev => prev + 1)
  }

  return (
    <>
      <div style={{ display: 'flex' }}>
        <Sidebar />

        <div className="home-page">

          {/* Fixed Navigation Bar */}
          <nav className="home-navbar">
            <div className="home-navbar-logo">Paws!</div>
            <div className="home-navbar-right">
              <button className="home-navbar-notifications" title="Notifications (coming soon)">
                <BiBell size={24} />
              </button>
              <div
                className="home-navbar-profile"
                onClick={() => navigate('/profile')}
                title="Go to profile"
              >
                {userInitials}
              </div>
            </div>
          </nav>

          {/* Banner Section */}
          <div className="home-banner">
            <div className="home-banner-content">
              <div className="home-banner-logo"></div>
            </div>
          </div>

          {/* Search */}
          <AnimalSearch onSearchActive={setSearchActive} />

          {/* Feed — hidden while search is active */}
          {!searchActive && (
            <PostFeed
              refresh={feedRefresh}
              currentUserId={currentUserId}
              onRefresh={() => setFeedRefresh(prev => prev + 1)}
            />
          )}

          {/* Publish button */}
          <button className="home-publish-btn" onClick={() => setShowPostModal(true)}>
            + Publish animal
          </button>

          {/* Post Modal */}
          {showPostModal && (
            <div className="modal-overlay" onClick={() => setShowPostModal(false)}>
              <div className="modal-container" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                  <h2 className="modal-title">New post</h2>
                  <button className="modal-close" onClick={() => setShowPostModal(false)}>✕</button>
                </div>
                <Post
                  onSuccess={handlePostSuccess}
                  onClose={() => setShowPostModal(false)}
                />
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  )
}
