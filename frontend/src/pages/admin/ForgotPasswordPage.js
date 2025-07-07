import React, { useState } from "react";
import axios from "axios";
import "./ForgotPasswordPage.scss";
import logo from "../../assets/logo_School Management system.avif";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import { Helmet } from "react-helmet";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); 
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);     
    setMessage("");       

    try {
      await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/auth/ForgotPassword`,
        { email }
      );
      setMessage(t("forgotPassword.success"));
    } catch (error) {
      setMessage(t("forgotPassword.error"));
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="forgot-password-bg">
      <LanguageSwitcher />
      <Helmet>
        <title>{t("forgotPassword.title")}</title>
      </Helmet>

      <div className="forgot-password-card">
        <div className="forgot-password-logo">
          <img
            src={logo}
            alt="School Management System Logo"
            className="forgot-password-logo-img"
          />
        </div>

        <h2 className="forgot-password-title">{t("forgotPassword.title")}</h2>
        <p className="forgot-password-desc">{t("forgotPassword.desc")}</p>

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <input
            type="email"
            placeholder={t("forgotPassword.emailPlaceholder")}
            className="forgot-password-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            type="submit"
            className="forgot-password-btn"
            disabled={loading} 
          >
            {loading
              ? t("forgotPassword.sendingBtn")
              : t("forgotPassword.sendBtn")}  
          </button>
        </form>

        {message && <p className="forgot-password-message">{message}</p>}

        <a href="/Adminlogin" className="forgot-password-link">
          {t("forgotPassword.backToLogin")}
        </a>

        <div className="forgot-password-note">{t("forgotPassword.note")}</div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
