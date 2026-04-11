/**
 * Profile edit page component.
 *
 * Loads the current user's data from GET /users/me and pre-fills
 * a form with the editable fields: username, first name, last name,
 * and zip code.
 *
 * On submit, sends a PUT /users request with only the fields that
 * changed. On success, redirects back to /profile.
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, updateProfile } from "../services/api";
import { getToken } from "../utils/auth";
import Sidebar from "./Sidebar";
import "../styles/ProfileEdit.css";

const EDITABLE_FIELDS = ["username", "firstname", "lastname", "zipcode"];

export default function ProfileEdit() {
  const [form, setForm] = useState({
    username: "",
    firstname: "",
    lastname: "",
    zipcode: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /** Pre-fill form with current user data on mount */
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
          setLoading(false);
          return;
        }

        const data = await res.json();
        setForm({
          username: data.username ?? "",
          firstname: data.firstname ?? "",
          lastname: data.lastname ?? "",
          zipcode: data.zipcode ?? "",
        });
      } catch {
        setError("Connection error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /**
   * Validates and submits the update.
   *
   * Validates that no field is empty and that zip code is exactly
   * 5 digits, then sends PUT /users with the updated data.
   */
  const handleSubmit = async () => {
    const hasEmpty = EDITABLE_FIELDS.some((f) => !form[f].trim());
    if (hasEmpty) {
      setError("All fields are required.");
      return;
    }

    if (!/^\d{5}$/.test(form.zipcode.trim())) {
      setError("Zip code must be exactly 5 digits.");
      return;
    }

    try {
      const res = await updateProfile(form);

      if (res.status === 401) {
        navigate("/login");
        return;
      }

      if (!res.ok) {
        setError("Update failed. Please try again.");
        return;
      }

      setError("");
      setSuccess("Profile updated! Redirecting...");
      setTimeout(() => navigate("/profile"), 1500);
    } catch {
      setError("Connection error. Please try again.");
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div className="profile-edit-page">
        {loading && <p className="profile-edit-loading">Loading...</p>}

        {!loading && (
          <div className="profile-edit-card">
            <h2 className="profile-edit-title">Edit profile</h2>

            {error && <p className="profile-edit-error">{error}</p>}
            {success && <p className="profile-edit-success">{success}</p>}

            <div className="profile-edit-field">
              <label className="profile-edit-label">Username</label>
              <input
                className="profile-edit-input"
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
              />
            </div>
            <div className="profile-edit-field">
              <label className="profile-edit-label">First name</label>
              <input
                className="profile-edit-input"
                name="firstname"
                placeholder="First name"
                value={form.firstname}
                onChange={handleChange}
              />
            </div>
            <div className="profile-edit-field">
              <label className="profile-edit-label">Last name</label>
              <input
                className="profile-edit-input"
                name="lastname"
                placeholder="Last name"
                value={form.lastname}
                onChange={handleChange}
              />
            </div>
            <div className="profile-edit-field">
              <label className="profile-edit-label">Zip code</label>
              <input
                className="profile-edit-input"
                name="zipcode"
                placeholder="Zip code"
                value={form.zipcode}
                onChange={handleChange}
              />
            </div>

            <button className="profile-edit-button" onClick={handleSubmit}>
              Save changes
            </button>

            <button
              className="profile-edit-cancel"
              onClick={() => navigate("/profile")}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}