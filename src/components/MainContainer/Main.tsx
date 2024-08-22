import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authActions } from '../../store';
import {UsersList} from "../UsersContainer/UsersListContainer/UsersList";

const Main = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

        if (token && storedUser) {
            dispatch(authActions.setToken(token));
            dispatch(authActions.setUser(storedUser));  // Налаштування користувача з локального сховища
        }
    }, [dispatch]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');  // Видалення користувача з локального сховища
        dispatch(authActions.logout());
        navigate('/auth/login');
    };

    return (
        <div>
            <UsersList />
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export { Main };
