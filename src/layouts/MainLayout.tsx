import React from 'react';
import { Outlet } from 'react-router-dom';
import {useAuthToken} from "../hooks/useAuthToken";

const MainLayout = () => {
    useAuthToken(); // Викликаємо хук для перевірки токена

    return (
        <div>
            <Outlet />
        </div>
    );
};

export {MainLayout};
