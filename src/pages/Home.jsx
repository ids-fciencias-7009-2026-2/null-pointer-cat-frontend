import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex" }}>
      
      {/* Sidebar */}
      <Sidebar />

      {/* Contenido principal */}
      <div style={{ padding: "20px", flex: 1 }}>
        <h1>Home</h1>
        <p>Bienvenido 👋</p>

        {/* Esto ya es opcional porque tienes logout en Sidebar */}
        <button onClick={() => navigate("/logout")}>
          Cerrar sesión
        </button>
      </div>

    </div>
  );
}