import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaTicketAlt, FaTachometerAlt, FaListUl, FaPlusCircle, FaUserCircle, FaQuestionCircle, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";
import { authService } from "../services/authService";
import { canCreateTicket, isProjectManager, isStaffIt, roleLabel } from "../utils/roles";
import "../styles/Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const user = authService.getStoredUser();
  const menus = [
    { title: "Dashboard", icon: <FaTachometerAlt />, path: "/dashboard" },
    { title: isProjectManager(user) ? "All Tickets" : isStaffIt(user) ? "Tugas Saya" : "Tiket Saya", icon: <FaListUl />, path: "/tickets" },
    ...(canCreateTicket(user) ? [{ title: "Create Ticket", icon: <FaPlusCircle />, path: "/create-ticket" }] : []),
    { title: "Profile", icon: <FaUserCircle />, path: "/profile" },
  ];

  const closeMenu = () => setIsOpen(false);
  const handleLogout = async () => {
    closeMenu();
    await authService.logout();
    navigate("/");
  };

  return (
    <>
      <button type="button" className="mobile-menu-toggle" onClick={() => setIsOpen((open) => !open)} aria-label={isOpen ? "Tutup menu" : "Buka menu"} aria-expanded={isOpen}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>
      {isOpen && <button type="button" className="sidebar-overlay" aria-label="Tutup menu" onClick={closeMenu} />}
      <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-top">
          <div className="sidebar-logo"><div className="logo-icon"><FaTicketAlt /></div><div><h2>WSS Ticketing</h2><span>{roleLabel(user?.role)}</span></div></div>
          <p className="menu-label">Menu Utama</p>
          <ul className="sidebar-menu">
            {menus.map((menu) => <li key={menu.path}><NavLink to={menu.path} className={({ isActive }) => (isActive ? "active" : "")} onClick={closeMenu}><span className="menu-icon">{menu.icon}</span><span className="menu-title">{menu.title}</span>{menu.badge && <span className="menu-badge">{menu.badge}</span>}</NavLink></li>)}
            <li><NavLink to="/help" className={({ isActive }) => (isActive ? "active" : "")} onClick={closeMenu}><span className="menu-icon"><FaQuestionCircle /></span><span className="menu-title">Bantuan</span></NavLink></li>
          </ul>
        </div>
        <div className="sidebar-footer"><button onClick={handleLogout}><FaSignOutAlt /><span>Keluar</span></button></div>
      </aside>
    </>
  );
};

export default Sidebar;
