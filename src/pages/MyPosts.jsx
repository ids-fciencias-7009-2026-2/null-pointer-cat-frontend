import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getToken } from '../utils/auth'
import Sidebar from './Sidebar'
import PostFeed from './PostFeed'
import Post from './Post'
import '../styles/Home.css'
import { BiBell } from 'react-icons/bi'

/**
 * MyPosts page — shows only the posts published by the authenticated user.
 * Reuses PostFeed with a custom fetch URL (GET /post/me).
 */
export default function MyPosts() {
  const [userInitials, setUserInitials] = useState('?')
  const [showPostModal, setShowPostModal] = useState(false)
  const [feedRefresh, setFeedRefresh] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const token = getToken()
    if (!token) { navigate('/login'); return }

    const userData = JSON.parse(sessionStorage.getItem('userData') || '{}')
    if (userData.firstname && userData.lastname) {
      setUserInitials(
        `${userData.firstname[0]}${userData.lastname[0]}`.toUpperCase()
      )
    }
  }, [navigate])

  const handlePostSuccess = () => {
    setFeedRefresh(prev => prev + 1)
  }

  return (
    <>
      <div style={{ display: 'flex' }}>
        <Sidebar />

        <div className="home-page">

          {/* ── Navbar ── */}
          <nav className="home-navbar">
            <div className="home-navbar-logo" />
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

          {/* ── Page header ── */}
          <div className="my-posts-header">
            <h1 className="my-posts-title">My posts</h1>
            <button
              className="my-posts-new-btn"
              onClick={() => setShowPostModal(true)}
            >
              + New post
            </button>
          </div>

          {/* ── Feed filtered to current user ── */}
          <PostFeed refresh={feedRefresh} endpoint="http://localhost:8080/post/me" />

          {/* ── New post modal ── */}
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
