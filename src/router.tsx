import { createBrowserRouter } from 'react-router-dom';

import {MainLayout} from "./layouts";
import {LoginPage, MainPage, RegisterPage} from "./pages";

const router = createBrowserRouter([
    {
        path: '', element: <MainLayout />, children: [
            { path: '', element: <LoginPage /> },
            { path: 'auth/login', element: <LoginPage /> },
            { path: 'auth/register', element: <RegisterPage /> },
            { path: 'main', element: <MainPage /> },
        ],
    },
]);

export { router };
