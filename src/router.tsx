import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts';
import { LoginPage, MainPage, RegisterPage } from './pages';
import {ForgotPasswordPage} from "./pages/ForgotPasswordPage";

const router = createBrowserRouter([
    {
        path: '', element: <MainLayout />, children: [
            { path: '', element: <Navigate to="/auth/login" replace /> },
            { path: 'auth/register', element: <RegisterPage /> },
            { path: 'auth/login', element: <LoginPage /> },
            { path: 'auth/recovery', element: <ForgotPasswordPage /> },
            { path: 'main', element: <MainPage /> },
        ],
    },
]);

export { router };
