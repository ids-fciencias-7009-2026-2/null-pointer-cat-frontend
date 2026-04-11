import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Sidebar.css";
import { FiMenu } from "react-icons/fi";

/**
 * Sidebar component.
 * 
 * Provides navigation and user options.
 * Includes a "More" dropdown with actions like Profile and Logout.
 */
export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  /**
   * Handles logout navigation.
   */
  const handleLogout = () => {
    navigate("/logout");
  };

  /**
   * Closes the dropdown of more-menu when clicking outside of it.
   */
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
      {/* Upper options, later to be added*/}
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

        {/* Dropdown menu */}
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