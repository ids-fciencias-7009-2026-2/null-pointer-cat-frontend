import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getToken } from '../utils/auth'
import Sidebar from './Sidebar'
import PostFeed from './PostFeed'
import '../styles/Home.css'
import { BiBell } from 'react-icons/bi'

export default function MyFavorites() {
  const [userInitials, setUserInitials] = useState('?')
  const navigate = useNavigate()

  useEffect(() => {
    const token = getToken()
    if (!token) { navigate('/login'); return }
    const userData = JSON.parse(sessionStorage.getItem('userData') || '{}')
    if (userData.firstname && userData.lastname) {
      setUserInitials(`${userData.firstname[0]}${userData.lastname[0]}`.toUpperCase())
    }
  }, [navigate])

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div className="home-page">

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

        <div className="my-posts-header" style={{ marginTop: '90px', padding: '0 32px 16px' }}>
          <h1 className="my-posts-title">My Favorites</h1>
        </div>

        <PostFeed
          endpoint="http://localhost:8080/favorites/me"
          currentUserId={null}
        />

      </div>
    </div>
  )
}