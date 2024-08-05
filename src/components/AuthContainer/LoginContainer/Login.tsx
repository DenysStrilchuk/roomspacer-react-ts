import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { authActions, RootState } from '../../../store';
import { useAppDispatch } from '../../../hooks';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import css from './Login.module.css';

const Login = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isLogin, loading, error } = useSelector((state: RootState) => state.auth);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(authActions.login({ email, password }));
    };

    const handleForgotPassword = () => {
        navigate('/auth/recovery');
    };

    useEffect(() => {
        if (isLogin) {
            navigate('/main');
        }
    }, [isLogin, navigate]);

    return (
        <div className={css.loginContainer}>
            <form onSubmit={handleSubmit} className={css.loginForm}>
                <h2>Sign In</h2>
                <div className={css.inputContainer}>
                    <FontAwesomeIcon icon={faEnvelope} className={css.icon} />
                    <input
                        type="email"
                        placeholder="E-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className={css.loginInput}
                    />
                </div>
                <div className={css.inputContainer}>
                    <FontAwesomeIcon icon={faLock} className={css.icon} />
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={css.loginInput}
                    />
                    <FontAwesomeIcon
                        icon={showPassword ? faEye : faEyeSlash}
                        className={css.eyeIcon}
                        onClick={() => setShowPassword(!showPassword)}
                    />
                </div>
                {error && <p className={css.errorMessage}>{error}</p>}
                <p className={css.forgotPassword} onClick={handleForgotPassword}>
                    Forgot your password?
                </p>
                <div className={css.loginButtonContainer}>
                    <button type="submit" disabled={loading} className={css.loginButton}>Sign In</button>
                </div>
            </form>
        </div>
    );
};

export { Login };
