import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {authActions, RootState} from '../../../store';
import {useAppDispatch} from '../../../hooks';
import {useNavigate} from 'react-router-dom';
import Modal from 'react-modal';
import css from './Register.module.css';
import {faEnvelope, faUser, faLock, faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

const Register: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {isRegistered, loading, error} = useSelector((state: RootState) => state.auth);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormErrors({}); // Reset errors before each submission
        try {
            await dispatch(authActions.register({email, password, name})).unwrap();
            setModalIsOpen(true);
        } catch (e) {
            if (e && typeof e === 'string') {
                // Assuming the error message is a string with the error details
                setFormErrors({
                    global: e,
                });
            }
        }
    };

    useEffect(() => {
        if (isRegistered) {
            setModalIsOpen(true);
        }
    }, [isRegistered]);

    const closeModal = () => {
        setModalIsOpen(false);
        navigate('/auth/login');
    };

    return (
        <div className={css.registerContainer}>
            <form onSubmit={handleSubmit} className={css.registerForm}>
                <h2>Sign Up</h2>
                <div className={css.inputContainer}>
                    <FontAwesomeIcon icon={faUser} className={css.icon}/>
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
                    <FontAwesomeIcon icon={faEnvelope} className={css.icon}/>
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
                    <FontAwesomeIcon icon={faLock} className={css.icon}/>
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={css.registerInput}
                    />
                    <FontAwesomeIcon
                        icon={showPassword ? faEye : faEyeSlash}
                        className={css.eyeIcon}
                        onClick={() => setShowPassword(!showPassword)}
                    />
                    {formErrors.password && <p className={css.errorText}>{formErrors.password}</p>}
                </div>
                {formErrors.global && <p className={css.errorText}>{formErrors.global}</p>}
                <button type="submit" disabled={loading} className={css.registerButton}>Register</button>
            </form>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Email Confirmation Modal"
                ariaHideApp={false}
            >
                <h2>Registration Successful</h2>
                <p>Please check your email for confirmation.</p>
                <button onClick={closeModal}>OK</button>
            </Modal>
        </div>
    );
};

export {
    Register
}
