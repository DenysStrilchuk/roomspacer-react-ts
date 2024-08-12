import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { authActions, RootState } from '../../../store';
import { useAppDispatch } from '../../../hooks';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import css from './Login.module.css';

const Login: React.FC = () => {
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

    const handleGoogleLogin = () => {
        dispatch(authActions.loginWithGoogle());
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
                        type={showPassword ? 'text' : 'password'}
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
                <p className={css.forgotPassword} onClick={handleForgotPassword}>
                    Forgot your password?
                </p>
                {error?.message && <p className={css.errorMessage}>{error.message}</p>}

                <div className={css.loginButtonContainer}>
                    <button type="submit" disabled={loading} className={css.loginButton}>
                        Sign In
                    </button>
                </div>

                <div className={css.divider}>
                    <span className={css.line}></span>
                    <span className={css.orText}>Or</span>
                    <span className={css.line}></span>
                </div>

                <div className={css.googleButtonContainer}>
                    <button
                        type="button"
                        className={css.googleButton}
                        onClick={handleGoogleLogin} // Виклик логіна через Google
                    >
                        <FontAwesomeIcon icon={faGoogle} className={css.googleIcon} />
                        Sign in with Google
                    </button>
                </div>

                <div className={css.signUpContainer}>
                    <p className={css.noAccountText}>Don't have an account?</p>
                    <Link to="/auth/register" className={css.signUpLink}>Sign Up</Link>
                </div>
            </form>
        </div>
    );
};

export { Login };
