import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authActions } from '../../store';
import { UsersList } from "../UsersContainer";
import {useAppDispatch} from "../../hooks";

const Main = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

        if (token && storedUser) {
            dispatch(authActions.setToken(token));
            dispatch(authActions.setUser(storedUser));  // Налаштування користувача з локального сховища
        }
    }, [dispatch]);

    const handleLogout = async () => {
        try {

            localStorage.removeItem('token');
            localStorage.removeItem('user');  // Видалення користувача з локального сховища
            dispatch(authActions.logout());
            navigate('/auth/login');
        } catch (error) {
            console.error('Помилка під час логауту:', error);
            // Можливо, виведіть повідомлення користувачу або виконайте інші дії
        }
    };

    return (
        <div>
            <UsersList />
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export { Main };
