import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { authService } from '../../../services';
import css from './ConfirmEmail.module.css';

const ConfirmEmail: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const [message, setMessage] = useState<string>('');

    useEffect(() => {
        const confirmEmail = async () => {
            try {
                if (token) {
                    await authService.confirmEmail(token);
                    setMessage('Електронна пошта успішно підтверджена!');
                } else {
                    setMessage('Токен відсутній або недійсний.');
                }
            } catch (error) {
                setMessage('Недійсний або прострочений токен.');
            }
        };

        confirmEmail().catch((error) => {
            console.error('Unhandled error in confirmEmail:', error);
        });
    }, [token]);

    return (
        <div className={css.confirmEmail}>
            <h1>{message}</h1>
        </div>
    );
};

export { ConfirmEmail };
