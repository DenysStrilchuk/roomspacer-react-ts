import { createBrowserRouter } from 'react-router-dom';

import { MainLayout } from './layouts/MainLayout';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { MainPage } from './pages/MainPage';

const router = createBrowserRouter([
    {
        path: '', element: <MainLayout />, children: [
            { path: '', element: <LoginPage /> },
            { path: 'login', element: <LoginPage /> },
            { path: 'register', element: <RegisterPage /> },
            { path: 'chat', element: <MainPage /> },
        ],
    },
]);

export { router };
