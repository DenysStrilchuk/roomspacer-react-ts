import React, { useState } from 'react';
import css from './ForgotPassword.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch } from '../../../hooks';
import { authActions } from '../../../store';

const ForgotPassword = () => {
    const dispatch = useAppDispatch();
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(authActions.forgotPassword({ email }));
    };

    return (
        <div className={css.forgotPasswordContainer}>
            <form onSubmit={handleSubmit} className={css.forgotPasswordForm}>
                <h2>Forgot Password</h2>
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
                <button type="submit" className={css.forgotPasswordButton}>
                    Send Reset Link
                </button>
            </form>
        </div>
    );
};

export { ForgotPassword };
