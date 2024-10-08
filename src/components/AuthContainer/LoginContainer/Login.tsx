import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { authActions, RootState } from '../../../store';
import { useAppDispatch } from '../../../hooks';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { ClipLoader } from 'react-spinners';
import css from './Login.module.css';
import {setAuthToken} from "../../../services";

const Login: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isLogin, error } = useSelector((state: RootState) => state.auth);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [googleLoginError, setGoogleLoginError] = useState<string | null>(null);
    const [loadingEmail, setLoadingEmail] = useState(false);
    const [loadingGoogle, setLoadingGoogle] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingEmail(true);
        try {
            const { token } = await dispatch(authActions.login({ email, password })).unwrap();
            // Store token in localStorage and set it in auth headers
            localStorage.setItem('token', token);
            setAuthToken(token);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingEmail(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoadingGoogle(true);
        try {
            const { user, token } = await dispatch(authActions.loginWithGoogle()).unwrap();
            if (!user) {
                setGoogleLoginError('User not found. Please register first.');
            } else {
                // Store token in localStorage and set it in auth headers
                localStorage.setItem('token', token);
                setAuthToken(token);
            }
        } catch (error) {
            if (error instanceof Error) {
                setGoogleLoginError(error.message || 'Sign in with Google failed.');
            } else {
                setGoogleLoginError('Sign in with Google failed.');
            }
        } finally {
            setLoadingGoogle(false);
        }
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
                    <button type="submit" disabled={loadingEmail} className={css.loginButton}>
                        {loadingEmail ? (
                            <div className={css.loadingContainer}>
                                <span>Signing in...</span>
                                <ClipLoader size={20} color={"#ffffff"} loading={true} />
                            </div>
                        ) : (
                            'Sign In'
                        )}
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
                        onClick={handleGoogleLogin}
                        disabled={loadingGoogle}
                    >
                        <img src={"https://img.icons8.com/?size=100&id=17949&format=png&color=000000"}
                             alt={'googleIcon'} className={css.googleIcon}/>
                        {loadingGoogle ? (
                            <div className={css.loadingContainer}>
                                <span>Signing in with Google...</span>
                                <ClipLoader size={20} color={"rgb(70, 77, 97)"} loading={true} />
                            </div>
                        ) : (
                            'Sign in with Google'
                        )}
                    </button>
                    {googleLoginError && <p className={css.errorMessage}>{googleLoginError}</p>}
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
