import React, { useEffect } from 'react';
import { authActions } from '../../store';
import { UsersList } from "../UsersContainer";
import { useAppDispatch } from "../../hooks";
import css from './Main.module.css';


const Main = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

        if (token && storedUser) {
            dispatch(authActions.setToken(token));
            dispatch(authActions.setUser(storedUser));  // Налаштування користувача з локального сховища
        }
    }, [dispatch]);

    const handleLogout = () => {
        dispatch(authActions.logoutAndRedirect()); // Виклик екшену для логауту та перенаправлення
    };


    return (
        <div className={css.mainContainer}>
            <UsersList />
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export { Main };
