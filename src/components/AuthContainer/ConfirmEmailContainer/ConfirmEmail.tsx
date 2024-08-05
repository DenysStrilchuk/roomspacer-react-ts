import React, { useEffect, useState } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import { authService } from '../../../services';
import css from './ConfirmEmail.module.css';

const ConfirmEmail: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const [message, setMessage] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        const confirmEmail = async () => {
            try {
                if (token) {
                    await authService.confirmEmail(token);
                    setMessage('Email successfully verified!');
                    navigate('/auth/login');
                } else {
                    setMessage('The token is missing or invalid.');
                }
            } catch (error) {
                setMessage('Invalid or expired token.');
            }
        };

        confirmEmail().catch((error) => {
            console.error('Unhandled error in confirmEmail:', error);
        });
    }, [token, navigate]);

    return (
        <div className={css.confirmEmail}>
            <h1>{message}</h1>
        </div>
    );
};

export { ConfirmEmail };
