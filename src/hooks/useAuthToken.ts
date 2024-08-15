import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {setAuthToken} from "../services";

const useAuthToken = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            setAuthToken(token);  // Встановлюємо токен для авторизаційного заголовка
        } else {
            navigate('/auth/login');  // Якщо токена немає, перенаправляємо на сторінку входу
        }
    }, [navigate]);

    return;
};

export { useAuthToken };
