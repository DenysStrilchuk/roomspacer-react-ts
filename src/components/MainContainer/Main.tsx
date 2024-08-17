import React from 'react';
import { useDispatch } from 'react-redux';
import {useNavigate} from "react-router-dom";
import {authActions} from "../../store";

const Main = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(authActions.logout());
        navigate('/auth/login');
        // Додатково, можна також здійснити редірект на сторінку входу або іншу
    };

    return (
        <div>
            <h2>Main Page</h2>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export { Main };
