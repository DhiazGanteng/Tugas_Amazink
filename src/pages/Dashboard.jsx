import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Card from "../components/Card";
import ChartCard from "../components/ChartCard";
import StatusBadge from "../components/StatusBadge";
import { dashboardService } from "../services/dashboardService";
import { ticketService } from "../services/ticketService";
import { authService } from "../services/authService";

import {
  FaTicketAlt,
  FaExclamationTriangle,
  FaUserPlus,
  FaCheckCircle,
} from "react-icons/fa";

import "../styles/Dashboard.css";

const PRIORITY_COLORS = {
  CRITICAL: "#dc2626",
  HIGH: "#f97316",
  MEDIUM: "#2563eb",
  LOW: "#94a3b8",
};

const toTitleCase = (value = "") =>
  value
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

const formatTime = (isoString) => {
  if (!isoString) return "-";
  const date = new Date(isoString);
  return date.toLocaleString("id-ID", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
};

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [activities, setActivities] = useState([]);
  const [recentTickets, setRecentTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const user = authService.getStoredUser();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setErrorMsg("");

      try {
        const [summaryData, activityData, ticketsData] = await Promise.all([
          dashboardService.getSummary(),
          dashboardService.getActivityLogs(6),
          ticketService.getTickets({ limit: 5, sort_by: "created_at", sort_order: "desc" }),
        ]);

        setSummary(summaryData);
        setActivities(activityData || []);
        setRecentTickets(ticketsData || []);
      } catch (err) {
        setErrorMsg(err.message || "Gagal memuat data dashboard.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const statusData = summary
    ? [
        { label: "OPEN", value: summary.open_count },
        { label: "ASSIGNED", value: summary.assigned_count },
        { label: "IN PROGRESS", value: summary.in_progress_count },
        { label: "QA", value: summary.qa_count },
        { label: "DONE", value: summary.done_count },
      ]
    : [];

  const priorityData = summary?.by_priority?.length
    ? summary.by_priority.map((p) => ({
        label: p.priority,
        value: p.count,
        color: PRIORITY_COLORS[p.priority] || "#94a3b8",
      }))
    : [];

  const total = priorityData.reduce((sum, d) => sum + d.value, 0) || 1;
  let cumulative = 0;
  const gradientStops = priorityData.length
    ? priorityData
        .map((d) => {
          const start = (cumulative / total) * 360;
          cumulative += d.value;
          const end = (cumulative / total) * 360;
          return `${d.color} ${start}deg ${end}deg`;
        })
        .join(", ")
    : "#e2e8f0 0deg 360deg";

  const maxValue = Math.max(...statusData.map((d) => d.value), 1);

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-content">
        <Navbar title="WSS Ticketing" userName={user?.name} userRole={user?.role} />

        <main className="dashboard-main">

          <div className="dashboard-header">
            <div>
              <h2>Dashboard</h2>
              <p>Selamat datang kembali, <strong>{user?.name || "User"}</strong></p>
            </div>
          </div>

          {errorMsg && <div className="form-error">{errorMsg}</div>}

          {loading ? (
            <p className="ticket-list-status">Memuat data dashboard...</p>
          ) : (
            <>
              <div className="summary-grid">
                <Card title="Total Tickets" value={summary?.total_tickets ?? 0} icon={<FaTicketAlt />} color="blue" />
                <Card title="Open" value={summary?.open_count ?? 0} icon={<FaExclamationTriangle />} color="orange" />
                <Card title="Assigned" value={summary?.assigned_count ?? 0} icon={<FaUserPlus />} color="purple" />
                <Card title="Done" value={summary?.done_count ?? 0} icon={<FaCheckCircle />} color="green" />
              </div>

              <div className="dashboard-grid">

                <ChartCard title="Tiket per Status">
                  <div className="bar-chart">
                    {statusData.map((d) => (
                      <div className="bar-column" key={d.label}>
                        <div
                          className="bar-fill"
                          style={{ height: `${(d.value / maxValue) * 100}%` }}
                        />
                        <span className="bar-label">{d.label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="chart-legend">
                    <span className="legend-dot current" /> Current
                  </div>
                </ChartCard>

                <ChartCard title="Tiket per Prioritas">
                  <div className="donut-wrapper">
                    <div
                      className="donut"
                      style={{ background: `conic-gradient(${gradientStops})` }}
                    >
                      <div className="donut-hole">
                        <h3>{summary?.total_tickets ?? 0}</h3>
                        <span>TOTAL TIKET</span>
                      </div>
                    </div>
                  </div>
                  <div className="chart-legend priority-legend">
                    {priorityData.map((d) => (
                      <span key={d.label}>
                        <i style={{ background: d.color }} /> {d.label}
                      </span>
                    ))}
                  </div>
                </ChartCard>

              </div>

              <div className="dashboard-grid bottom-grid">

                <div className="panel-card">
                  <div className="panel-header">
                    <h3>Tiket Terbaru</h3>
                    <Link to="/tickets">Lihat semua</Link>
                  </div>

                  {recentTickets.length === 0 ? (
                    <p className="ticket-list-status">Belum ada ticket.</p>
                  ) : (
                    <table className="mini-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Subjek</th>
                          <th>Status</th>
                          <th>Prioritas</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentTickets.map((t) => (
                          <tr key={t.id}>
                            <td>{t.ticket_number}</td>
                            <td>{t.title}</td>
                            <td><StatusBadge type="status" value={toTitleCase(t.status)} /></td>
                            <td><StatusBadge type="priority" value={toTitleCase(t.priority)} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>

                <div className="panel-card">
                  <div className="panel-header">
                    <h3>Aktivitas Terbaru</h3>
                  </div>

                  {activities.length === 0 ? (
                    <p className="ticket-list-status">Belum ada aktivitas.</p>
                  ) : (
                    <ul className="activity-list">
                      {activities.map((a) => (
                        <li key={a.id}>
                          <span className="activity-icon">•</span>
                          <div>
                            <p>User #{a.user_id} {a.action} {a.description}</p>
                            <span className="activity-time">{formatTime(a.timestamp)}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

              </div>
            </>
          )}

        </main>
      </div>
    </div>
  );
};

export default Dashboard;
