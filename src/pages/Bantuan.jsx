import { useState } from "react";
import { FaQuestionCircle, FaChevronDown, FaEnvelope, FaPhone } from "react-icons/fa";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import "../styles/Bantuan.css";

const faqs = [
  {
    q: "Bagaimana cara membuat ticket baru?",
    a: "Klik menu \"Create Ticket\" di sidebar, isi Ticket Type, Priority, Title, Module, dan Description, lalu klik \"Submit Ticket\".",
  },
  {
    q: "Bagaimana cara melihat status ticket saya?",
    a: "Buka menu \"All Tickets\" untuk melihat seluruh ticket beserta status dan prioritasnya, atau lihat ringkasan di halaman Dashboard.",
  },
  {
    q: "Berapa lama ticket biasanya diproses?",
    a: "Waktu proses tergantung prioritas: Critical dan High biasanya ditangani dalam 1x24 jam, sedangkan Medium dan Low dalam 2-3 hari kerja.",
  },
  {
    q: "Bagaimana jika saya lupa password?",
    a: "Klik \"Forgot?\" pada halaman login, atau hubungi tim DevOps Support melalui kontak di bawah ini.",
  },
];

const Bantuan = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-content">
        <Navbar title="Bantuan" />

        <main className="bantuan-main">

          <div className="bantuan-header">
            <FaQuestionCircle className="bantuan-header-icon" />
            <div>
              <h2>Pusat Bantuan</h2>
              <p>Temukan jawaban atas pertanyaan umum seputar WSS Ticketing System.</p>
            </div>
          </div>

          <div className="faq-card">
            {faqs.map((item, index) => (
              <div className="faq-item" key={index}>
                <button className="faq-question" onClick={() => toggle(index)}>
                  <span>{item.q}</span>
                  <FaChevronDown className={openIndex === index ? "rotate" : ""} />
                </button>

                {openIndex === index && (
                  <p className="faq-answer">{item.a}</p>
                )}
              </div>
            ))}
          </div>

          <div className="contact-card">
            <h3>Masih butuh bantuan?</h3>
            <p>Tim support kami siap membantu kamu setiap hari kerja, jam 08.00 - 17.00 WIB.</p>

            <div className="contact-list">
              <a href="mailto:support@wss.co.id" className="contact-item">
                <FaEnvelope /> support@wss.co.id
              </a>
              <a href="tel:+622112345678" className="contact-item">
                <FaPhone /> +62 21 1234 5678
              </a>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default Bantuan;
