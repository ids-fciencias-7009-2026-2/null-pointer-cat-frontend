import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/api";

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
    // Validar que ningún campo esté vacío(?)
    const hasEmpty = Object.values(form).some((v) => v.trim() === "");
    if (hasEmpty) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    try {
      const res = await registerUser(form);

      if (res.status === 409) {
        setError("Este correo ya está registrado.");
        return;
      }

      if (!res.ok) {
        setError("Error al registrar. Intenta de nuevo.");
        return;
      }

      setError("");
      setSuccess("¡Cuenta creada! Redirigiendo al login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch {
      setError("Error de conexión con el servidor.");
    }
  };

  return (
    <div>
      <h2>Crear cuenta</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <input
        name="username"
        placeholder="Nombre de usuario"
        onChange={handleChange}
      />
      <input
        name="firstname"
        placeholder="Nombre"
        onChange={handleChange}
      />
      <input
        name="lastname"
        placeholder="Apellido"
        onChange={handleChange}
      />
      <input
        name="email"
        placeholder="Correo electrónico"
        type="email"
        onChange={handleChange}
      />
      <input
        name="password"
        placeholder="Contraseña"
        type="password"
        onChange={handleChange}
      />
      <input
        name="zipcode"
        placeholder="Código postal"
        onChange={handleChange}
      />

      <button onClick={handleRegister}>Registrarse</button>
      <p>¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
    </div>
  );
}