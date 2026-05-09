/**
 * Login page component.
 *
 * Renders a form that allows a registered user to authenticate
 * by providing their email and password.
 *
 * Validates that both fields are filled before sending the request
 * to the backend. Handles error responses from the server and
 * displays feedback messages to the user.
 *
 * On successful authentication, stores the session token in
 * sessionStorage and redirects the user to the home page.
 */

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/api";
import { saveToken } from "../utils/auth";
import "../styles/Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  /**
   * Handles the login form submission.
   *
   * Validates that neither field is empty, then sends the credentials
   * to the backend. Handles the following responses:
   * - 401: Invalid credentials.
   * - Other non-ok responses: Generic login error.
   * - Network errors: Connection error message.
   *
   * On success, saves the token returned by the backend into
   * sessionStorage and navigates to the home page.
   */
  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const res = await loginUser({ email, password });

      if (res.status === 401) {
        setError("Invalid credentials. Please check your email and password.");
        return;
      }

      if (!res.ok) {
        setError("Login failed. Please try again.");
        return;
      }

      const data = await res.json();
      saveToken(data.token);

      // Fetch user data and save to sessionStorage
      const meRes = await fetch('http://localhost:8080/users/me', {
        headers: { Authorization: `Bearer ${data.token}` },
      })
      if (meRes.ok) {
        const userData = await meRes.json()
        sessionStorage.setItem('userData', JSON.stringify(userData))
      } 

      setError("");
      window.location.href = "/home";
      } catch {
        setError("Connection error. Please try again.");
      }
  };


return (
  <div className="login-page">
      <div className="login-image-side"></div>

      <div className="login-form-side">
          <div className="login-container">
              <h1 className="login-logo"></h1>
              <h2 className="login-title">Sign in</h2>

              {error && <p className="login-error">{error}</p>}

              <input
              className="login-input"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              />

              <input
              className="login-input"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              />

            <button className="login-button" onClick={handleLogin}>
            Log in
            </button>

            <p className="login-footer">
            Don't have an account? <Link to="/register"><span style={{ textDecoration: 'underline' }}>
            Sign up
            </span></Link>
            </p>
           </div>
       </div>
  </div>
);
}