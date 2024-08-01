import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import css from './ResetPassword.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch } from '../../hooks';
import { authActions } from '../../store';

const ResetPassword = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { token } = useParams<{ token: string }>();
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (token) {
            dispatch(authActions.resetPassword({ token, newPassword }));
            navigate('/auth/login');
        } else {
            console.error("Token is missing");
        }
    };

    return (
        <div className={css.resetPasswordContainer}>
            <form onSubmit={handleSubmit} className={css.resetPasswordForm}>
                <h2>Reset Password</h2>
                <div className={css.inputContainer}>
                    <FontAwesomeIcon icon={faLock} className={css.icon} />
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className={css.resetPasswordInput}
                    />
                    <FontAwesomeIcon
                        icon={showPassword ? faEye : faEyeSlash}
                        className={css.eyeIcon}
                        onClick={() => setShowPassword(!showPassword)}
                    />
                </div>
                <button type="submit" className={css.resetPasswordButton}>
                    Reset Password
                </button>
            </form>
        </div>
    );
};

export { ResetPassword };
