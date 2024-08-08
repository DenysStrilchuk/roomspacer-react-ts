import React, { useState } from 'react';
import css from './ForgotPassword.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch } from '../../../hooks';
import { authActions } from '../../../store';

const ForgotPassword = () => {
    const dispatch = useAppDispatch();
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('');

        try {
            await dispatch(authActions.forgotPassword({ email })).unwrap();
            setStatus('success');
            setMessage('Password reset link sent successfully.');
        } catch (error) {
            setStatus('error');
            setMessage('An error occurred. Please try again.');
        }
    };

    return (
        <div className={css.forgotPasswordContainer}>
            <form onSubmit={handleSubmit} className={css.forgotPasswordForm}>
                <h2>Forgot password</h2>
                <div className={css.inputContainer}>
                    <FontAwesomeIcon icon={faEnvelope} className={css.icon} />
                    <input
                        type="email"
                        placeholder="E-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className={css.forgotPasswordInput}
                    />
                </div>
                <button
                    type="submit"
                    className={css.forgotPasswordButton}
                    disabled={status === 'loading'}
                >
                    {status === 'loading' ? 'Sending...' : 'Send a link'}
                </button>
                {message && (
                    <p
                        className={
                            status === 'success'
                                ? css.successMessage
                                : css.errorMessage
                        }
                    >
                        {message}
                    </p>
                )}
            </form>
        </div>
    );
};

export { ForgotPassword };
