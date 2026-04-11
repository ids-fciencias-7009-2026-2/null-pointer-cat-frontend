import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Sidebar.css";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/logout");
  };

  return (
    <div className="sidebar">
      {/* Opciones arriba */}
      <div className="sidebar-top">
        <h2>Home</h2>
        {/* luego agregas más */}
      </div>

      {/* Parte de abajo */}
      <div className="sidebar-bottom">
        <button 
          className="more-button"
          onClick={() => setOpen(!open)}
        >
          More
        </button>

        {open && (
          <div className="dropdown">
            <button onClick={() => navigate("/profile")}>
              Profile
            </button>

            <button onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}