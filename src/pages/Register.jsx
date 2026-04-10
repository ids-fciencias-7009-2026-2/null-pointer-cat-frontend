import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/api";
import "../styles/Register.css";

const INITIAL_FORM = {
  username: "",
  email: "",
  password: "",
  firstname: "",
  lastname: "",
  zipcode: "",
};

export default function Register() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async () => {
    const hasEmpty = Object.values(form).some((v) => v.trim() === "");
    if (hasEmpty) {
      setError("All fields are required.");
      return;
    }

    if (!/^\d{5}$/.test(form.zipcode.trim())) {
        setError("Zip code must be exactly 5 digits.");
        return;
    }
    
    if (!form.email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    
    try {
      const res = await registerUser(form);
      if (res.status === 409) {
        setError("This email is already registered.");
        return;
      }
      if (!res.ok) {
        setError("Registration failed. Please try again.");
        return;
      }
      setError("");
      setSuccess("Account created! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch {
      setError("Connection error. Please try again.");
    }
  };


return (
  <div className="register-container">
    <h2 className="register-title">Create account</h2>

    {error && <p className="register-error">{error}</p>}
    {success && <p className="register-success">{success}</p>}

    <input
      className="register-input"
      name="username"
      placeholder="Username"
      onChange={handleChange}
    />

    <input
      className="register-input"
      name="firstname"
      placeholder="First name"
      onChange={handleChange}
    />

    <input
      className="register-input"
      name="lastname"
      placeholder="Last name"
      onChange={handleChange}
    />

    <input
      className="register-input"
      name="email"
      placeholder="Email"
      type="email"
      onChange={handleChange}
    />

    <input
      className="register-input"
      name="password"
      placeholder="Password"
      type="password"
      onChange={handleChange}
    />

    <input
      className="register-input"
      name="zipcode"
      placeholder="Zip code"
      onChange={handleChange}
    />

    <button className="register-button" onClick={handleRegister}>
      Sign up
    </button>

    <p className="register-footer">
      Already have an account? <Link to="/login">Log in</Link>
    </p>
  </div>
);

}