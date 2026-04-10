import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/api";
import { saveToken } from "../utils/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
      setError("");
      navigate("/home");
    } catch {
      setError("Connection error. Please try again.");
    }
  };

  return (
    <div>
      <h2>Log in</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Log in</button>
      <p>Don't have an account? <Link to="/register">Sign up</Link></p>
    </div>
  );
}