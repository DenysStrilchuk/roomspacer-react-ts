import axios from 'axios';
import { baseURL, urls } from '../constants';
import {ILoginResponse, IRegisterResponse, IUser} from "../interfaces";
import { signInWithPopup } from "firebase/auth";
import {auth, provider} from "../firebase/firebaseConfig";

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

const registerWithGoogle = async (): Promise<{ user: IUser; token: string }> => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Отримання токену доступу користувача
        const idToken = await user.getIdToken();

        // Відправка токену на бекенд для реєстрації користувача
        const response = await axiosInstance.post(urls.registerWithGoogle.base, { idToken });

        // Перетворення відповіді бекенду у відповідність до інтерфейсу IUser
        const transformedUser: IUser = {
            id: response.data.user.id,
            name: response.data.user.name,
            email: response.data.user.email,
            createdAt: new Date(response.data.user.createdAt),
            updatedAt: new Date(response.data.user.updatedAt),
        };

        // Зберігаємо токен для подальших запитів
        setAuthToken(response.data.token);

        return { user: transformedUser, token: response.data.token };
    } catch (error) {
        console.error('Google Sign-Up error:', error);
        throw error;
    }
};

const loginWithGoogle = async (): Promise<{ user: IUser; token: string }> => {
    try {
        // Використання Firebase для аутентифікації користувача через Google
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Отримання токену доступу від Firebase
        const idToken = await user.getIdToken();

        // Відправка `idToken` на бекенд для входу
        const response = await axiosInstance.post(urls.loginWithGoogle.base, { idToken });

        // Перетворюємо відповідь бекенду у відповідність до інтерфейсу IUser
        const transformedUser: IUser = {
            id: response.data.user.uid,
            name: response.data.user.displayName,
            email: response.data.user.email,
            createdAt: new Date(response.data.user.metadata.creationTime),
            updatedAt: new Date(response.data.user.metadata.lastSignInTime),
        };

        // Зберігаємо токен для подальших запитів
        setAuthToken(response.data.token);

        return { user: transformedUser, token: response.data.token };
    } catch (error) {
        console.error('Google Sign-In error:', error);
        throw error;
    }
};

const authService = {
    register,
    confirmEmail,
    login,
    forgotPassword,
    resetPassword,
    registerWithGoogle,
    loginWithGoogle,
};

export { authService, setAuthToken };
