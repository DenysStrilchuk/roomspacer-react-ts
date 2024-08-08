import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import css from './ResetPassword.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch } from '../../../hooks';
import { authActions } from '../../../store';

interface IFormErrors {
    password?: string;
    confirmPassword?: string;
}

const ResetPassword = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { token } = useParams<{ token: string }>();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [successMessage, setSuccessMessage] = useState('');
    const [formErrors, setFormErrors] = useState<IFormErrors>({});

    const validatePassword = () => {
        const errors: IFormErrors = {};
        if (!/\W/.test(newPassword) || newPassword.length < 8) {
            errors.password = 'The password must be at least 8 characters long and contain at least one special character.';
        }
        if (newPassword !== confirmPassword) {
            errors.confirmPassword = 'Passwords do not match.';
        }
        return errors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationErrors = validatePassword();
        if (Object.keys(validationErrors).length > 0) {
            setFormErrors(validationErrors);
            return;
        }

        if (token) {
            setStatus('loading');
            try {
                await dispatch(authActions.resetPassword({ token, newPassword })).unwrap();
                setStatus('success');
                setSuccessMessage("Password changed successfully");
                setTimeout(() => {
                    navigate('/auth/login');
                }, 2000); // Redirect after 2 seconds
            } catch (error) {
                setStatus('error');
                console.error("An error occurred when changing the password", error);
            }
        } else {
            console.error("The token is missing");
        }
    };

    return (
        <div className={css.resetPasswordContainer}>
            <form onSubmit={handleSubmit} className={css.resetPasswordForm}>
                <h2>Password change</h2>

                <div className={css.inputContainer}>
                    <FontAwesomeIcon icon={faLock} className={css.icon} />
                    <input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="New password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className={css.resetPasswordInput}
                    />
                    <FontAwesomeIcon
                        icon={showNewPassword ? faEye : faEyeSlash}
                        className={css.eyeIcon}
                        onClick={() => setShowNewPassword(!showNewPassword)}
                    />
                </div>
                {formErrors.password && <p className={css.errorText}>{formErrors.password}</p>}

                <div className={css.inputContainer}>
                    <FontAwesomeIcon icon={faLock} className={css.icon} />
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className={css.resetPasswordInput}
                    />
                    <FontAwesomeIcon
                        icon={showConfirmPassword ? faEye : faEyeSlash}
                        className={css.eyeIcon}
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    />
                </div>
                {formErrors.confirmPassword && <p className={css.errorText}>{formErrors.confirmPassword}</p>}

                <button
                    type="submit"
                    className={css.resetPasswordButton}
                    disabled={status === 'loading'}
                >
                    {status === 'loading' ? 'Change...' : 'Change password'}
                </button>
                {status === 'success' && (
                    <p className={css.successMessage}>{successMessage}</p>
                )}
                {status === 'error' && (
                    <p className={css.errorMessage}>Failed to change password. Try again.</p>
                )}
            </form>
        </div>
    );
};

export { ResetPassword };
