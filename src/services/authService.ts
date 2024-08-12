import axios from 'axios';
import { baseURL, urls } from '../constants';
import { ILoginResponse, IRegisterResponse } from "../interfaces";

// Створення екземпляру axios
const axiosInstance = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Збереження токену для авторизації
const setAuthToken = (token: string | null) => {
    if (token) {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete axiosInstance.defaults.headers.common['Authorization'];
    }
};

// Реєстрація
const register = async (email: string, password: string, name: string): Promise<IRegisterResponse> => {
    try {
        const response = await axiosInstance.post(urls.register.base, { email, password, name });
        return response.data;
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
};

// Підтвердження електронної пошти
const confirmEmail = async (token: string) => {
    try {
        const response = await axiosInstance.get(`${urls.confirmEmail.base}/${token}`);
        return response.data;
    } catch (error) {
        console.error('Email confirmation error:', error);
        throw error;
    }
};

// Логін
const login = async (email: string, password: string): Promise<ILoginResponse> => {
    try {
        const response = await axiosInstance.post(urls.login.base, { email, password });
        setAuthToken(response.data.token); // Зберігаємо токен після успішного логіну
        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

// Забули пароль
const forgotPassword = async (email: string) => {
    try {
        await axiosInstance.post(urls.forgotPassword.base, { email });
    } catch (error) {
        console.error('Forgot password error:', error);
        throw error;
    }
};

// Скидання пароля
const resetPassword = async (token: string, newPassword: string) => {
    try {
        await axiosInstance.post(urls.resetPassword.base, { token, newPassword });
    } catch (error) {
        console.error('Reset password error:', error);
        throw error;
    }
};

const authService = {
    register,
    confirmEmail,
    login,
    forgotPassword,
    resetPassword
};

export { authService, setAuthToken };
