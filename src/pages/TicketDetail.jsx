import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaPaperclip, FaUpload } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import StatusBadge from "../components/StatusBadge";
import { ticketService } from "../services/ticketService";
import { userService } from "../services/userService";
import { authService } from "../services/authService";
import { isProjectManager, isStaffIt, roleLabel } from "../utils/roles";
import "../styles/TicketDetail.css";

const label = (value = "") => value.toLowerCase().split("_").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
const nextStatus = { OPEN: "ASSIGNED", ASSIGNED: "IN_PROGRESS", IN_PROGRESS: "QA", QA: "DONE" };

const TicketDetail = () => {
  const { id } = useParams();
  const user = authService.getStoredUser();
  const isPm = isProjectManager(user);
  const [ticket, setTicket] = useState(null);
  const [staff, setStaff] = useState([]);
  const [comments, setComments] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [comment, setComment] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [loadingAction, setLoadingAction] = useState(false);

  const refreshTicket = async () => {
    const [ticketData, commentData, attachmentData] = await Promise.all([
      ticketService.getTicket(id),
      ticketService.getComments(id),
      ticketService.getAttachments(id),
    ]);
    setTicket(ticketData);
    setComments(commentData || []);
    setAttachments(attachmentData || []);
  };

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [ticketData, staffData, commentData, attachmentData] = await Promise.all([
          ticketService.getTicket(id),
          isPm ? userService.getUsers({ role: "STAFF_IT", limit: 100 }) : Promise.resolve([]),
          ticketService.getComments(id),
          ticketService.getAttachments(id),
        ]);
        if (!cancelled) {
          setTicket(ticketData);
          setStaff(staffData || []);
          setComments(commentData || []);
          setAttachments(attachmentData || []);
        }
      } catch (err) { if (!cancelled) setErrorMsg(err.message || "Gagal memuat detail ticket."); }
    }
    load();
    return () => { cancelled = true; };
  }, [id, isPm]);

  const runAction = async (action) => {
    setLoadingAction(true); setErrorMsg("");
    try { await action(); await refreshTicket(); }
    catch (err) { setErrorMsg(err.message || "Perubahan ticket gagal disimpan."); }
    finally { setLoadingAction(false); }
  };

  const canProgress = ticket && nextStatus[ticket.status] && (isProjectManager(user) || (isStaffIt(user) && ticket.pic_id === user?.id));
  const handleComment = (event) => {
    event.preventDefault();
    if (!comment.trim()) return;
    runAction(async () => {
      await ticketService.addComment(ticket.id, comment.trim());
      setComment("");
    });
  };

  const handleAttachment = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg("Ukuran lampiran maksimal 10 MB.");
      event.target.value = "";
      return;
    }
    setAttachment(file);
  };

  const uploadAttachment = () => {
    if (!attachment) return;
    runAction(async () => {
      await ticketService.uploadAttachment(ticket.id, attachment);
      setAttachment(null);
    });
  };

  const attachmentUrl = (item) => item.url || item.file_url || item.download_url;
  const attachmentName = (item) => item.original_name || item.filename || item.file_name || "Lampiran";
  return <div className="ticket-detail-page"><Sidebar /><div className="ticket-detail-content"><Navbar title="Ticket Detail" userName={user?.name} userRole={roleLabel(user?.role)} /><main className="ticket-detail-wrapper">
    {errorMsg && <div className="form-error" role="alert">{errorMsg}</div>}
    {!errorMsg && !ticket && <p className="ticket-list-status">Memuat detail ticket...</p>}
    {ticket && <>
      <div className="detail-header"><div><h1>Ticket Detail</h1><p>{ticket.ticket_number || `#${ticket.id}`}</p></div><StatusBadge type="status" value={label(ticket.status)} /></div>
      {isProjectManager(user) && ticket.status !== "DONE" && <section className="detail-card role-actions"><h2>Manajemen Ticket</h2><div className="role-action-grid"><label>Assign PIC<select value={ticket.pic_id || ""} disabled={loadingAction} onChange={(e) => runAction(() => ticketService.assignTicket(ticket.id, Number(e.target.value)))}><option value="">Pilih Staff IT</option>{staff.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}</select></label><label>Prioritas<select value={ticket.priority} disabled={loadingAction} onChange={(e) => runAction(() => ticketService.updatePriority(ticket.id, e.target.value))}>{["LOW", "MEDIUM", "HIGH", "CRITICAL"].map((priority) => <option key={priority} value={priority}>{label(priority)}</option>)}</select></label></div></section>}
      {canProgress && <section className="detail-card role-actions"><h2>Progress Pengerjaan</h2><p>Lanjutkan ticket sesuai alur status yang ditetapkan.</p><button className="workflow-btn" disabled={loadingAction} onClick={() => runAction(() => ticketService.updateStatus(ticket.id, nextStatus[ticket.status]))}>Ubah status menjadi {label(nextStatus[ticket.status])}</button></section>}
      <section className="detail-card"><h2>Information</h2><div className="detail-grid"><div className="detail-item"><label>Title</label><p>{ticket.title}</p></div><div className="detail-item"><label>Ticket Type</label><p>{label(ticket.type)}</p></div><div className="detail-item"><label>Priority</label><p>{label(ticket.priority)}</p></div><div className="detail-item"><label>Reporter</label><p>{`User #${ticket.reporter_id ?? "-"}`}</p></div><div className="detail-item"><label>PIC</label><p>{ticket.pic_id ? `Staff #${ticket.pic_id}` : "Belum ditugaskan"}</p></div><div className="detail-item"><label>Created At</label><p>{ticket.created_at ? new Date(ticket.created_at).toLocaleString("id-ID") : "-"}</p></div></div></section>
      <section className="detail-card"><h2>Description</h2><p className="description">{ticket.description || "-"}</p></section>
      <section className="detail-card">
        <h2>Lampiran</h2>
        {attachments.length > 0 && <ul className="attachment-list">
          {attachments.map((item) => <li key={item.id || item.filename}>
            <FaPaperclip />
            {attachmentUrl(item) ? <a href={attachmentUrl(item)} target="_blank" rel="noreferrer">{attachmentName(item)}</a> : <span>{attachmentName(item)}</span>}
          </li>)}
        </ul>}
        <div className="attachment-upload">
          <label className="attachment-picker"><FaUpload /> Pilih file<input type="file" onChange={handleAttachment} disabled={loadingAction} hidden /></label>
          <span>{attachment?.name || "Maks. 10 MB"}</span>
          <button type="button" className="workflow-btn" disabled={!attachment || loadingAction} onClick={uploadAttachment}>Unggah</button>
        </div>
      </section>
      <section className="detail-card">
        <h2>Komentar</h2>
        <div className="comment-list">
          {comments.length === 0 ? <p className="empty-note">Belum ada komentar.</p> : comments.map((item) => <article className="comment" key={item.id}>
            <h4>{item.user?.name || item.author_name || `User #${item.user_id ?? "-"}`}</h4>
            <p>{item.content}</p>
            <span>{item.created_at ? new Date(item.created_at).toLocaleString("id-ID") : ""}</span>
          </article>)}
        </div>
        <form onSubmit={handleComment}>
          <textarea value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Tulis komentar atau pembaruan pekerjaan..." disabled={loadingAction} />
          <button className="btn-comment" disabled={loadingAction || !comment.trim()} type="submit">Kirim komentar</button>
        </form>
      </section>
    </>}
  </main></div></div>;
};

export default TicketDetail;
