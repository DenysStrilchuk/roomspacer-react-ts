import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { authActions, RootState } from '../../../store';
import { useAppDispatch } from '../../../hooks';
import css from './Register.module.css';
import { faEnvelope, faUser, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

interface IFormErrors {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    global?: string;
}

const Register: React.FC = () => {
    const dispatch = useAppDispatch();
    const { isRegistered, loading, error } = useSelector((state: RootState) => state.auth);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formErrors, setFormErrors] = useState<IFormErrors>({});
    const [showConfirmationMessage, setShowConfirmationMessage] = useState(false);
    const [agreeToTerms, setAgreeToTerms] = useState(false);

    const validateForm = () => {
        const newErrors: IFormErrors = {};
        if (name.length < 3) {
            newErrors.name = 'Name must be at least 3 characters long';
        }
        if (!/\W/.test(password) || password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters long and contain at least one special character';
        }
        if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        if (!agreeToTerms) {
            newErrors.global = 'You must agree to the terms and policies';
        }
        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setFormErrors(validationErrors);
            return;
        }
        setFormErrors({});
        try {
            await dispatch(authActions.register({ email, password, name })).unwrap();
            setShowConfirmationMessage(true);
        } catch (err) {
            console.error('Error during registration:', err);
        }
    };

    const handleGoogleSignUp = async () => {
        try {
            const { user, token } = await dispatch(authActions.registerWithGoogle()).unwrap();
            if (user) {
                // Зберігаємо токен у стані додатку
                dispatch(authActions.setToken(token));

                console.log('User registered and logged in with Google:', user);
            } else {
                setFormErrors({ global: 'Google registration failed' });
            }
        } catch (error) {
            console.error('Error during Google sign-up:', error);
            setFormErrors({ global: 'Google sign-up failed' });
        }
    };



    useEffect(() => {
        if (isRegistered) {
            setShowConfirmationMessage(true);
        }
    }, [isRegistered]);

    useEffect(() => {
        if (error) {
            const newErrors: IFormErrors = { global: error.message || 'Registration failed' };

            if (error.errors) {
                if (error.errors.email) {
                    newErrors.email = error.errors.email;
                }
                if (error.errors.password) {
                    newErrors.password = error.errors.password;
                }
            }

            setFormErrors(newErrors);
        }
    }, [error]);

    return (
        <div className={css.registerContainer}>
            <form onSubmit={handleSubmit} className={css.registerForm}>
                <h2>Sign Up</h2>
                <div className={css.inputContainer}>
                    <FontAwesomeIcon icon={faUser} className={css.icon} />
                    <input
                        type="text"
                        placeholder="Full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className={css.registerInput}
                    />
                </div>
                <div className={css.inputContainer}>
                    <FontAwesomeIcon icon={faEnvelope} className={css.icon} />
                    <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className={css.registerInput}
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
                        className={css.registerInput}
                    />
                    <FontAwesomeIcon
                        icon={showPassword ? faEye : faEyeSlash}
                        className={css.togglePassword}
                        onClick={() => setShowPassword(!showPassword)}
                    />
                </div>
                <div className={css.inputContainer}>
                    <FontAwesomeIcon icon={faLock} className={css.icon} />
                    <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className={css.registerInput}
                    />
                    <FontAwesomeIcon
                        icon={showConfirmPassword ? faEye : faEyeSlash}
                        className={css.togglePassword}
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    />
                </div>
                <div className={css.checkboxContainer}>
                    <input
                        type="checkbox"
                        id="agreeToTerms"
                        checked={agreeToTerms}
                        onChange={(e) => setAgreeToTerms(e.target.checked)}
                        className={css.checkboxInput}
                    />
                    <label htmlFor="agreeToTerms" className={css.checkboxLabel}>
                        I agree to <a href="/terms" className={css.link}>Terms</a>, <a href="/privacy" className={css.link}>Privacy</a>, and <a href="/cookies" className={css.link}>Cookie policies</a>.
                    </label>
                </div>
                {formErrors.name && <p className={css.errorText}>{formErrors.name}</p>}
                {formErrors.email && <p className={css.errorText}>{formErrors.email}</p>}
                {formErrors.password && <p className={css.errorText}>{formErrors.password}</p>}
                {formErrors.confirmPassword && <p className={css.errorText}>{formErrors.confirmPassword}</p>}
                {formErrors.global && <p className={css.errorText}>{formErrors.global}</p>}

                <button type="submit" className={css.registerButton} disabled={loading || !agreeToTerms}>
                    {loading ? 'Creating...' : 'Create your free account'}
                </button>

                <div className={css.divider}>
                    <span className={css.line}></span>
                    <span className={css.orText}>Or</span>
                    <span className={css.line}></span>
                </div>

                <div className={css.googleButtonContainer}>
                    <button type="button" className={css.googleButton} onClick={handleGoogleSignUp}>
                        <FontAwesomeIcon icon={faGoogle} className={css.googleIcon}/>
                        Sign up with Google
                    </button>
                </div>

                <div className={css.signInContainer}>
                    <p className={css.haveAccountText}>Already have an account?</p>
                    <Link to="/auth/login" className={css.signInLink}>Sign In</Link>
                </div>
            </form>

            {showConfirmationMessage && (
                <div className={css.modalOverlay}>
                    <div className={`${css.confirmationMessage} ${css.fadeIn}`}>
                        <h2>Registration Successful!</h2>
                        <p>A confirmation email has been sent. Please check your inbox to verify your email address.</p>
                        <button className={css.modalButton} onClick={() => setShowConfirmationMessage(false)}>
                            Ok
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export { Register };
