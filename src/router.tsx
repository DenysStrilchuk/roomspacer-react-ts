import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts';
import { LoginPage, MainPage, RegisterPage } from './pages';

const router = createBrowserRouter([
    {
        path: '', element: <MainLayout />, children: [
            { path: '', element: <Navigate to="/auth/login" replace /> },
            { path: 'auth/login', element: <LoginPage /> },
            { path: 'auth/register', element: <RegisterPage /> },
            { path: 'main', element: <MainPage /> },
        ],
    },
]);

export { router };
