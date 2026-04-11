import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { removeToken } from "../utils/auth";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    removeToken(); // borrar token
    navigate("/login"); // redirigir
  }, [navigate]);

  return <p>Cerrando sesión...</p>;
}