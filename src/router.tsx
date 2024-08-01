import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts';
import {ForgotPasswordPage, LoginPage, MainPage, RegisterPage, ResetPasswordPage} from "./pages";

const router = createBrowserRouter([
    {
        path: '', element: <MainLayout />, children: [
            { path: '', element: <Navigate to="/auth/login" replace /> },
            { path: 'auth/register', element: <RegisterPage /> },
            { path: 'auth/login', element: <LoginPage /> },
            { path: 'auth/recovery', element: <ForgotPasswordPage /> },
            { path: 'auth/reset-password/:token', element: <ResetPasswordPage /> },
            { path: 'main', element: <MainPage /> },
        ],
    },
]);

export { router };
