import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTicketAlt, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowRight, FaCheckCircle, FaShieldAlt } from "react-icons/fa";
import { authService } from "../services/authService";
import "../styles/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      await authService.login(email, password);
      await authService.getMe();
      navigate("/dashboard");
    } catch (err) {
      setErrorMsg(err.message || "Email atau password tidak sesuai.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <section className="login-showcase" aria-label="WSS Ticketing overview">
        <div className="showcase-brand">
          <div className="login-brand-icon"><FaTicketAlt /></div>
          <div><strong>WSS Ticketing</strong><span>WAHANA SOLUSI INDONESIA</span></div>
        </div>

        <div className="showcase-copy">
          <span className="showcase-kicker"><FaShieldAlt /> Helpdesk terpusat</span>
          <h1>Setiap masalah, <em>lebih cepat</em> selesai.</h1>
          <p>Laporkan, pantau, dan selesaikan kebutuhan IT tim Anda dalam satu ruang kerja yang rapi.</p>
        </div>

        <div className="showcase-points">
          <span><FaCheckCircle /> Pantau status tiket secara real-time</span>
          <span><FaCheckCircle /> Prioritas dan penugasan yang jelas</span>
          <span><FaCheckCircle /> Riwayat komunikasi tersimpan aman</span>
        </div>

        <p className="showcase-footer">© 2026 Wahana Solusi Indonesia</p>
      </section>

      <main className="login-panel">
        <div className="login-wrapper">
          <div className="mobile-login-brand">
            <div className="login-brand-icon"><FaTicketAlt /></div>
            <span>WSS Ticketing</span>
          </div>

          <div className="login-card">
            <div className="login-card-header">
              <span className="eyebrow">SELAMAT DATANG KEMBALI</span>
              <h2>Masuk ke akun Anda</h2>
              <p>Gunakan email perusahaan untuk mengakses portal.</p>
            </div>

            {errorMsg && <div className="login-error" role="alert">{errorMsg}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email perusahaan</label>
                <div className="input-box">
                  <FaEnvelope className="input-icon" />
                  <input id="email" type="email" placeholder="nama@perusahaan.com" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
                </div>
              </div>

              <div className="form-group">
                <div className="label-row">
                  <label htmlFor="password">Password</label>
                  <a href="mailto:support@wss.co.id" className="forgot-link">Butuh bantuan?</a>
                </div>
                <div className="input-box">
                  <FaLock className="input-icon" />
                  <input id="password" type={showPassword ? "text" : "password"} placeholder="Masukkan password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
                  <button type="button" className="show-password" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <label className="remember">
                <input type="checkbox" checked={remember} onChange={() => setRemember(!remember)} />
                Ingat perangkat ini selama 30 hari
              </label>

              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? "Memproses..." : "Masuk ke Portal"} {!loading && <FaArrowRight />}
              </button>
            </form>

            <div className="login-divider" />
            <p className="login-footer-text">Mengalami kendala? <a href="mailto:support@wss.co.id">Hubungi DevOps Support</a></p>
          </div>

          <div className="login-copyright">Sistem internal untuk tim Wahana Solusi Indonesia.</div>
        </div>
      </main>
    </div>
  );
};

export default Login;
