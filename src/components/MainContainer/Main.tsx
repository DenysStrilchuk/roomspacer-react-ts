import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authActions } from '../../store';
import {UsersList} from "../UsersContainer/UsersListContainer/UsersList";

const Main = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        dispatch(authActions.logout());
        navigate('/auth/login');
    };

    return (
        <div>
            <h2>Main Page</h2>
            <button onClick={handleLogout}>Logout</button>
            <UsersList />
        </div>
    );
};

export { Main };
