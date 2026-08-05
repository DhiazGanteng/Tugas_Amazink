import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { authService } from "../services/authService";
import { roleLabel } from "../utils/roles";

import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaUserTie,
  FaBuilding,
  FaCalendarAlt,
} from "react-icons/fa";

import "../styles/Profile.css";

const Profile = () => {
  const user = authService.getStoredUser();

  return (
    <div className="dashboard-layout">

      <Sidebar />

      <div className="dashboard-content">

        <Navbar title="Profile" userName={user?.name} userRole={roleLabel(user?.role)} />

        <main className="profile-page">

          <div className="profile-card">

            <div className="profile-header">

              <img
                src="https://i.pinimg.com/736x/cd/0f/37/cd0f3766a090b12a86ef165a613c17fa.jpg"
                alt="Profile"
              />

              <div>

                <h2>{user?.name || "Pengguna"}</h2>

                <span>{roleLabel(user?.role)}</span>

              </div>

            </div>

            <div className="profile-info">

              <div className="info-item">
                <FaEnvelope />
                <span>{user?.email || "-"}</span>
              </div>

              <div className="info-item">
                <FaPhone />
                <span>-</span>
              </div>

              <div className="info-item">
                <FaBuilding />
                <span>Wahana Solusi Indonesia</span>
              </div>

              <div className="info-item">
                <FaUserTie />
                <span>{roleLabel(user?.role) === "User" ? "Pelapor" : "Information Technology"}</span>
              </div>

              <div className="info-item">
                <FaMapMarkerAlt />
                <span>Jakarta, Indonesia</span>
              </div>

              <div className="info-item">
                <FaCalendarAlt />
                <span>Akun aktif</span>
              </div>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
};

export default Profile;
