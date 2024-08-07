import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { authActions, RootState } from '../../../store';
import { useAppDispatch } from '../../../hooks';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import css from './Register.module.css';
import { faEnvelope, faUser, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface IFormErrors {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    global?: string;
}

const Register: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isRegistered, loading, error } = useSelector((state: RootState) => state.auth);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Додано для підтвердження пароля
    const [formErrors, setFormErrors] = useState<IFormErrors>({});

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
            setModalIsOpen(true);
        } catch (err) {
            console.error('Error during registration:', err);
        }
    };

    useEffect(() => {
        if (isRegistered) {
            setModalIsOpen(true);
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

    const closeModal = () => {
        setModalIsOpen(false);
        navigate('/auth/login');
    };

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
                {formErrors.name && <p className={css.errorText}>{formErrors.name}</p>}
                {formErrors.email && <p className={css.errorText}>{formErrors.email}</p>}
                {formErrors.password && <p className={css.errorText}>{formErrors.password}</p>}
                {formErrors.confirmPassword && <p className={css.errorText}>{formErrors.confirmPassword}</p>}
                {formErrors.global && <p className={css.errorText}>{formErrors.global}</p>}
                <button type="submit" className={css.registerButton} disabled={loading}>
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Registration Confirmation"
                className={css.modal}
                overlayClassName={css.overlay}
            >
                <h2>Registration Successful!</h2>
                <p>A confirmation email has been sent. Please check your inbox to verify your email address.</p>
                <button onClick={closeModal} className={css.modalButton}>OK</button>
            </Modal>
        </div>
    );
};

export { Register };
