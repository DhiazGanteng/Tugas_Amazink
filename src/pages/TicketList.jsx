import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCalendarAlt, FaColumns, FaList, FaSearch } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import TicketCard from "../components/TicketCard";
import { ticketService } from "../services/ticketService";
import { authService } from "../services/authService";
import { canCreateTicket, isProjectManager, isStaffIt } from "../utils/roles";
import "../styles/TicketList.css";

const formatDate = (value) => value ? new Date(value).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) : "-";
const toTitleCase = (value = "") => value.toLowerCase().split("_").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
const statusColumns = ["open", "assigned", "in_progress", "qa", "done"];
const statusLabel = (status) => ({ open: "Open", assigned: "Assigned", in_progress: "In Progress", qa: "QA", done: "Done", closed: "Done", resolved: "Done" }[status?.toLowerCase()] || toTitleCase(status));
const ticketColumn = (status = "open") => ({ closed: "done", resolved: "done", completed: "done", inprogress: "in_progress", progress: "in_progress" }[status.toLowerCase()] || status.toLowerCase());

const TicketList = () => {
  const navigate = useNavigate();
  const user = authService.getStoredUser();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [search, setSearch] = useState("");
  const [view, setView] = useState("table");

  const loadTickets = async (searchTerm = "") => {
    setLoading(true); setErrorMsg("");
    try {
      const params = { search: searchTerm || undefined, limit: 50 };
      if (isStaffIt(user)) params.pic_id = user.id;
      const data = await ticketService.getTickets(params);
      const visibleTickets = isProjectManager(user) || isStaffIt(user) ? data : data.filter((ticket) => ticket.reporter_id === user?.id);
      setTickets(visibleTickets || []);
    } catch (err) { setErrorMsg(err.message || "Gagal memuat data ticket."); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    // Menunda pemuatan satu tick agar perubahan state berasal dari callback async,
    // bukan langsung dari body effect.
    const timer = window.setTimeout(() => { loadTickets(); }, 0);
    return () => window.clearTimeout(timer);
    // user berasal dari sesi lokal dan tidak berubah selama halaman ini terbuka.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const heading = isProjectManager(user) ? "All Tickets" : isStaffIt(user) ? "Tugas Saya" : "Tiket Saya";
  const description = isProjectManager(user) ? "Kelola seluruh ticket dan penugasan tim IT." : isStaffIt(user) ? "Daftar ticket yang ditugaskan kepada Anda." : "Pantau ticket yang Anda laporkan.";

  return <div className="dashboard-layout"><Sidebar /><div className="dashboard-content"><Navbar title={heading} userName={user?.name} userRole={user?.role} />
    <main className="ticket-list-main">
      <button className="back-link" onClick={() => navigate("/dashboard")}><FaArrowLeft /> Back to Dashboard</button>
      <div className="ticket-list"><div className="ticket-list-header"><div><h2>{heading}</h2><p>{description}</p></div>
        {canCreateTicket(user) && <button className="create-btn" onClick={() => navigate("/create-ticket")}>+ Create Ticket</button>}</div>
        <div className="ticket-toolbar">
          <div className="view-switcher" role="group" aria-label="Pilih tampilan tiket">
            <button type="button" className={view === "table" ? "active" : ""} onClick={() => setView("table")}><FaList /> Table</button>
            <button type="button" className={view === "kanban" ? "active" : ""} onClick={() => setView("kanban")}><FaColumns /> Kanban</button>
            <button type="button" className={view === "calendar" ? "active" : ""} onClick={() => setView("calendar")}><FaCalendarAlt /> Calendar</button>
          </div>
        </div>
        <form className="ticket-search" onSubmit={(e) => { e.preventDefault(); loadTickets(search); }}><FaSearch /><input type="text" placeholder="Cari nomor atau judul ticket..." value={search} onChange={(e) => setSearch(e.target.value)} /><button type="submit">Cari</button></form>
        {errorMsg && <div className="form-error">{errorMsg}</div>}
        {loading ? <p className="ticket-list-status">Memuat ticket...</p> : tickets.length === 0 ? <p className="ticket-list-status">Belum ada ticket.</p> : view === "kanban" ? <Kanban tickets={tickets} navigate={navigate} /> : view === "calendar" ? <Calendar tickets={tickets} navigate={navigate} /> : <div className="ticket-list-body">{tickets.map((ticket) => <TicketCard key={ticket.id} id={ticket.ticket_number} title={ticket.title} category={toTitleCase(ticket.type)} status={toTitleCase(ticket.status)} priority={toTitleCase(ticket.priority)} reporter={`User #${ticket.reporter_id}`} date={formatDate(ticket.created_at)} onClick={() => navigate(`/tickets/${ticket.id}`)} />)}</div>}
      </div>
    </main>
  </div></div>;
};

function Kanban({ tickets, navigate }) {
  return <div className="kanban-board">{statusColumns.map((status) => {
    const items = tickets.filter((ticket) => ticketColumn(ticket.status) === status);
    return <section className="kanban-column" key={status}><header><h3>{statusLabel(status)}</h3><span>{items.length}</span></header><div className="kanban-cards">{items.length ? items.map((ticket) => <button type="button" className="kanban-card" key={ticket.id} onClick={() => navigate(`/tickets/${ticket.id}`)}><div><span>{ticket.ticket_number}</span><em className={`priority-${ticket.priority?.toLowerCase()}`}>{toTitleCase(ticket.priority)}</em></div><strong>{ticket.title}</strong><p>{toTitleCase(ticket.type)}</p><small>{formatDate(ticket.created_at)}</small></button>) : <p className="kanban-empty">Belum ada tiket</p>}</div></section>;
  })}</div>;
}

function Calendar({ tickets, navigate }) {
  const today = new Date();
  const year = today.getFullYear(); const month = today.getMonth();
  const firstDay = new Date(year, month, 1).getDay(); const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = Array.from({ length: Math.ceil((firstDay + daysInMonth) / 7) * 7 }, (_, index) => index - firstDay + 1);
  const ticketDate = (ticket) => { const date = new Date(ticket.created_at); return date.getFullYear() === year && date.getMonth() === month ? date.getDate() : -1; };
  return <section className="calendar-view"><div className="calendar-title">{today.toLocaleDateString("id-ID", { month: "long", year: "numeric" })}</div><div className="calendar-weekdays">{["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((day) => <span key={day}>{day}</span>)}</div><div className="calendar-grid">{cells.map((day, index) => <div className={`calendar-day ${day === today.getDate() ? "today" : ""}`} key={index}>{day > 0 && day <= daysInMonth && <><span>{day}</span>{tickets.filter((ticket) => ticketDate(ticket) === day).slice(0, 3).map((ticket) => <button type="button" key={ticket.id} onClick={() => navigate(`/tickets/${ticket.id}`)}>{ticket.ticket_number}: {ticket.title}</button>)}</>}</div>)}</div></section>;
}

export default TicketList;
