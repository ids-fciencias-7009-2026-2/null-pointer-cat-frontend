/**
 * Profile page component.
 *
 * Displays the authenticated user's profile information:
 * first name, last name, email, and birth date.
 *
 * Fetches data from GET /users/me using the token stored in
 * sessionStorage. Redirects to /login if no token is found
 * or if the server returns 401.
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../services/api";
import { getToken } from "../utils/auth";
import Sidebar from "./Sidebar";
import "../styles/Profile.css";
import { BiArrowBack } from "react-icons/bi";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
  const fetchProfile = async () => {
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const res = await getProfile(); 
      if (res.status === 401) {
        navigate("/login");
        return;
      }
      if (!res.ok) {
        setError("Could not load profile. Please try again.");
        return;
      }
      const data = await res.json();
      setProfile(data);
    } catch {
      setError("Connection error. Please try again.");
    }
  };

  fetchProfile();
}, [navigate]);

  function getInitials(firstname, lastname) {
    return `${firstname?.[0] ?? ""}${lastname?.[0] ?? ""}`.toUpperCase();
  }

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div className="profile-page">
      {/* Back Button */}
              <button
                className="profile-back-button"
                onClick={() => navigate("/home")}
                title="Back to home"
              >
                <BiArrowBack size={20} />
                Back
              </button>

        {error && <p className="profile-error">{error}</p>}

        {!profile && !error && (
          <p className="profile-loading">Loading profile...</p>
        )}

        {profile && (
          <div className="profile-card">
            {/* Avatar*/}
            <div className="profile-header">
              <div className="profile-avatar">
                {getInitials(profile.firstname, profile.lastname)}
              </div>
              <div>
                <p className="profile-name">
                  {profile.firstname} {profile.lastname}
                </p>
                <p className="profile-email">{profile.email}</p>
              </div>
            </div>

            {/* Profile Fields */}
            <div className="profile-fields">
              <div className="profile-row">
                <span className="profile-label">Username</span>
                <span className="profile-value">{profile.username}</span>
              </div>
              <div className="profile-row">
                <span className="profile-label">First name</span>
                <span className="profile-value">{profile.firstname}</span>
              </div>
              <div className="profile-row">
                <span className="profile-label">Last name</span>
                <span className="profile-value">{profile.lastname}</span>
              </div>
              <div className="profile-row">
                <span className="profile-label">Email</span>
                <span className="profile-value">{profile.email}</span>
              </div>
              <div className="profile-row">
                <span className="profile-label">Zip code</span>
                <span className="profile-value">{profile.zipcode}</span>
              </div>
            </div>

            {/* Edit button */}
            <button
              className="profile-edit-button"
              onClick={() => navigate("/profile/edit")}
            >
              Edit profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
}