import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import './ResetPasswordPage.scss';

const ResetPasswordPage = () => {
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();

    const baseURL = process.env.REACT_APP_BASE_URL;

    const handleReset = async () => {
        if (!password) {
            setMessage(t('resetPassword.enterNewPassword'));
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post(`${baseURL}/api/auth/ResetPassword`, {
                token,
                newPassword: password,
            });

            setMessage(res.data.message || t('resetPassword.success'));
        } catch (err) {
            setMessage(
                err.response?.data?.message || t('resetPassword.error')
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reset-password-bg">
            <div className="reset-password-card">
                <h2 className="reset-password-title">{t('resetPassword.title')}</h2>
                <input
                    type="password"
                    className="reset-password-input"
                    placeholder={t('resetPassword.placeholder')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    className="reset-password-btn"
                    onClick={handleReset}
                    disabled={loading}
                >
                    {loading ? t('resetPassword.loading') : t('resetPassword.confirm')}
                </button>
                {message && <p className="reset-password-message">{message}</p>}
            </div>
        </div>
    );
};

export default ResetPasswordPage;