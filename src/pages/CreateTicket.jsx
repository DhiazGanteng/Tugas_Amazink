import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaEye, FaUpload } from "react-icons/fa";

import Sidebar from "../components/Sidebar";
import { ticketService } from "../services/ticketService";
import "../styles/CreateTicket.css";

const CreateTicket = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    type: "",
    priority: "",
    title: "",
    module: "",
    description: "",
  });
  const [file, setFile] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFile = (e) => {
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0];
      const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];

      if (!allowedTypes.includes(selectedFile.type) || selectedFile.size > 10 * 1024 * 1024) {
        setFile(null);
        setErrorMsg("Lampiran harus berupa JPG, PNG, atau PDF dengan ukuran maksimal 10 MB.");
        e.target.value = "";
        return;
      }

      setErrorMsg("");
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const ticket = await ticketService.createTicket(form);
      if (file && ticket?.id) {
        await ticketService.uploadAttachment(ticket.id, file);
      }
      navigate("/tickets");
    } catch (err) {
      setErrorMsg(err.message || "Gagal membuat ticket.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ticket-create-layout">
      <Sidebar />

      <div className="ticket-create-content">

        <button className="back-link" onClick={() => navigate("/dashboard")}>
          <FaArrowLeft /> Back to Dashboard
        </button>

        <h1>Create New Ticket</h1>
        <p className="page-subtitle">Fill in the details below to submit a new helpdesk request.</p>
        {errorMsg && <div className="form-error" role="alert">{errorMsg}</div>}

        <form className="ticket-create-grid" onSubmit={handleSubmit}>

          <div className="form-card">

            <div className="form-row">
              <div className="form-group">
                <label>Ticket Type <span>*</span></label>
                <select name="type" value={form.type} onChange={handleChange} required>
                  <option value="">Select type...</option>
                  <option value="BUG">Bug</option>
                  <option value="FEATURE_REQUEST">Feature Request</option>
                </select>
              </div>

              <div className="form-group">
                <label>Priority <span>*</span></label>
                <select name="priority" value={form.priority} onChange={handleChange} required>
                  <option value="">Select priority...</option>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Title <span>*</span></label>
              <input
                type="text"
                name="title"
                maxLength={120}
                placeholder="Brief, descriptive title for the issue"
                value={form.title}
                onChange={handleChange}
                required
              />
              <span className="char-count">{form.title.length}/120</span>
            </div>

            <div className="form-group">
              <label>Module <span>*</span></label>
              <select name="module" value={form.module} onChange={handleChange} required>
                <option value="">Select module...</option>
                <option value="Login">Login</option>
                <option value="Dashboard">Dashboard</option>
                <option value="Ticketing">Ticketing</option>
                <option value="Report">Report</option>
              </select>
            </div>

            <div className="form-group">
              <label>Description <span>*</span></label>
              <textarea
                name="description"
                rows="6"
                placeholder="Provide a detailed description of the problem or request..."
                value={form.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Attachments</label>
              <label className="dropzone">
                <input type="file" onChange={handleFile} hidden />
                <span className="dropzone-icon"><FaUpload /></span>
                <strong>Drag &amp; drop or click to upload</strong>
                <span className="dropzone-hint">Max file size 10MB. (JPG, PNG, PDF)</span>
              </label>
              {file && <p className="file-name">{file.name}</p>}
              <p className="attachment-note">Attachments can also be added after the ticket is created in the detail page.</p>
            </div>

          </div>

          <div className="preview-card">

            <div className="preview-header">
              <FaEye /> <h3>Ticket Preview</h3>
            </div>

            <div className="preview-item">
              <span>Typee</span>
              <strong>{form.type || "—"}</strong>
            </div>

            <div className="preview-item">
              <span>Priority</span>
              <strong>{form.priority || "—"}</strong>
            </div>

            <div className="preview-item">
              <span>Module</span>
              <strong>{form.module || "—"}</strong>
            </div>

            <div className="preview-item">
              <span>Attachments</span>
              <strong>{file?.name || "None"}</strong>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Submitting..." : "Submit Ticket"}
            </button>
            <button type="button" className="cancel-btn" disabled={loading} onClick={() => navigate("/dashboard")}>Cancel</button>

          </div>

        </form>

      </div>
    </div>
  );
};

export default CreateTicket;
