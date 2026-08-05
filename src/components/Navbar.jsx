import { FaChevronDown, FaMoon, FaSun } from "react-icons/fa";
import { useEffect, useState } from "react";

import "../styles/Navbar.css";

function Navbar({ title = "WSS Ticketing", userName = "Dhiaz Alfiansyah Ganteng", userRole = "User" }) {
  const [isDark, setIsDark] = useState(() => localStorage.getItem("theme") === "dark");

  useEffect(() => {
    document.documentElement.dataset.theme = isDark ? "dark" : "light";
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  return (
    <header className="navbar">

      <div className="navbar-left">
        <h3>{title}</h3>
      </div>

      <div className="navbar-right">
        <button type="button" className="theme-toggle" onClick={() => setIsDark((value) => !value)} aria-label={isDark ? "Aktifkan tema terang" : "Aktifkan tema gelap"} title={isDark ? "Tema terang" : "Tema gelap"}>
          {isDark ? <FaSun /> : <FaMoon />}
        </button>
        <div className="user-profile">
          <img
            src="https://i.pinimg.com/736x/cd/0f/37/cd0f3766a090b12a86ef165a613c17fa.jpg"
            alt="User"
            className="user-avatar"
          />
          <div className="user-info">
            <span className="user-name">{userName}</span>
            <span className="user-role">{userRole}</span>
          </div>
          <FaChevronDown className="user-arrow" />
        </div>
      </div>

    </header>
  );
}

export default Navbar;
