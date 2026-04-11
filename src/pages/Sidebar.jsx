import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Sidebar.css";
import { FiMenu } from "react-icons/fi";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    navigate("/logout");
  };

  /* This handles clicks outside to close more button and others */
  useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target)
    ) {
      setOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

  return (
    <div className="sidebar">
      {/* Upper options, latter to be added*/}
      <div className="sidebar-top">
        <h2>Sidebar</h2>
      </div>

      {/* Lower menu that shows user preferences and logout button*/}
      <div className="sidebar-bottom" ref={dropdownRef}>
        <button 
          className="more-button"
          onClick={() => setOpen(!open)}
        >
          <FiMenu size={18} />
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