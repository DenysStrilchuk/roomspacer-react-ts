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
    global?: string;
}

const Register: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isRegistered, loading, error } = useSelector((state: RootState) => state.auth);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formErrors, setFormErrors] = useState<IFormErrors>({});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
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
                    {formErrors.name && <p className={css.errorText}>{formErrors.name}</p>}
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
                    {formErrors.email && <p className={css.errorText}>{formErrors.email}</p>}
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
                    {formErrors.password && <p className={css.errorText}>{formErrors.password}</p>}
                </div>
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

export {Register};

