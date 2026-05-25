import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { resetPassword } from '../services/api'
import '../styles/Login.css'

export default function ResetPassword() {
  const [searchParams]          = useSearchParams()
  const token                   = searchParams.get('token')
  const navigate                = useNavigate()

  const [newPassword, setNew]   = useState('')
  const [confirm, setConfirm]   = useState('')
  const [error, setError]       = useState('')
  const [success, setSuccess]   = useState(false)

  const handleSubmit = async () => {
    if (!newPassword.trim() || !confirm.trim()) { setError('Please fill in both fields.'); return }
    if (newPassword !== confirm)                 { setError('Passwords do not match.'); return }
    if (!token)                                  { setError('Invalid or missing reset token.'); return }

    try {
      const res = await resetPassword(token, newPassword)
      if (!res.ok) { setError('This link is invalid or has expired.'); return }
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2500)
    } catch {
      setError('Connection error. Please try again.')
    }
  }

  return (
    <div className="login-page">
      <div className="login-image-side" />
      <div className="login-form-side">
        <div className="login-container">
          <h1 className="login-logo" />
          <h2 className="login-title">Reset password</h2>

          {success ? (
            <p style={{ color: '#33a366', background: 'rgba(51,163,102,0.1)',
                        padding: '12px', borderRadius: '8px' }}>
              Password updated! Redirecting to login...
            </p>
          ) : (
            <>
              {error && <p className="login-error">{error}</p>}
              <input
                className="login-input"
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={e => setNew(e.target.value)}
              />
              <input
                className="login-input"
                type="password"
                placeholder="Confirm new password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
              />
              <button className="login-button" onClick={handleSubmit}>
                Update password
              </button>
              <p className="login-footer">
                <Link to="/login">Back to login</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}