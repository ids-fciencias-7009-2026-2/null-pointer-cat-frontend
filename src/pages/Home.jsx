import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getToken } from '../utils/auth'
import Sidebar from './Sidebar'
import '../styles/Home.css'
import { BiBell } from 'react-icons/bi'

export default function Home() {
  const [userInitials, setUserInitials] = useState('?')
  const navigate = useNavigate()

  useEffect(() => {
    const token = getToken()
    if (!token) {
      navigate('/login')
      return
    }

    const userData = JSON.parse(sessionStorage.getItem('userData') || '{}')
    if (userData.firstname && userData.lastname) {
      const initials = `${userData.firstname[0]}${userData.lastname[0]}`.toUpperCase()
      setUserInitials(initials)
    }
  }, [navigate])

  const handleProfileClick = () => {
    navigate('/profile')
  }

  return (
    <>
      <div style={{ display: 'flex' }}>
    <Sidebar />

      <div className="home-page">
        
        {/* Fixed Navigation Bar */}
        <nav className="home-navbar">
          <div className="home-navbar-logo">AdoptaPet</div>
          
          <div className="home-navbar-right">
            <button 
              className="home-navbar-notifications"
              title="Notifications (coming soon)"
            >
              <BiBell size={24} />
            </button>
            
            <div 
              className="home-navbar-profile"
              onClick={handleProfileClick}
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
    </div>
  </div>
    </>
  )
}
