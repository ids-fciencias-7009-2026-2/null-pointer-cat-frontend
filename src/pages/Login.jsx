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
      setError("Por favor completa todos los campos.");
      return;
    }

    try {
      const res = await loginUser({ email, password });

      if (res.status === 401) {
        setError("Credenciales incorrectas. Verifica tu correo y contraseña.");
        return;
      }

      if (!res.ok) {
        setError("Error al iniciar sesión. Intenta de nuevo.");
        return;
      }

      const data = await res.json();
      saveToken(data.token); 
      setError("");
      navigate("/home");
    } catch {
      setError("Error de conexión con el servidor.");
    }
  };

  return (
    <div>
      <h2>Iniciar sesión</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        placeholder="Correo electrónico"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        placeholder="Contraseña"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Entrar</button>
      <p>¿No tienes cuenta? <Link to="/register">Regístrate</Link></p>
    </div>
  );
}