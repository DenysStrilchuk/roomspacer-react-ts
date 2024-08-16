import axios from 'axios';
import { baseURL, urls } from '../constants';
import { ILoginResponse, IRegisterResponse, IUser } from "../interfaces";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { auth, provider } from "../firebase/firebaseConfig";

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

// Перевірка токена
const checkToken = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token not found');
            throw new Error('Token not found');
        }

        const response = await axiosInstance.post(urls.checkToken.base, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Помилка перевірки токена: ', error);
        throw error;
    }
};

// Реєстрація
const register = async (email: string, password: string, name: string): Promise<IRegisterResponse> => {
    try {
        const response = await axiosInstance.post(urls.register.base, { email, password, name });
        return response.data;
    } catch (error) {
        console.error('Помилка реєстрації:', error);
        throw error;
    }
};

// Підтвердження електронної пошти
const confirmEmail = async (token: string) => {
    try {
        const response = await axiosInstance.get(`${urls.confirmEmail.base}/${token}`);
        return response.data;
    } catch (error) {
        console.error('Помилка підтвердження електронної пошти:', error);
        throw error;
    }
};

// Логін
const login = async (email: string, password: string): Promise<ILoginResponse> => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const idToken = await userCredential.user.getIdToken();
        localStorage.setItem('token', idToken); // Збереження токена
        console.log('Token from localStorage:', idToken);
        const response = await axiosInstance.post(urls.login.base, { email, password });
        setAuthToken(response.data.token);
        return response.data;
    } catch (error) {
        console.error('Помилка входу:', error);
        throw error;
    }
};

// Забули пароль
const forgotPassword = async (email: string) => {
    try {
        const response = await axiosInstance.post(urls.forgotPassword.base, { email });
        return response.data;
    } catch (error: any) {
        console.error('Помилка відновлення паролю:', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || error.message);
    }
};

// Скидання пароля
const resetPassword = async (token: string, newPassword: string) => {
    try {
        await axiosInstance.post(urls.resetPassword.base, { token, newPassword });
    } catch (error) {
        console.error('Помилка скидання паролю:', error);
        throw error;
    }
};

// Реєстрація через Google
const registerWithGoogle = async (): Promise<{ user: IUser; token: string }> => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const idToken = await user.getIdToken(); // Отримання ID токена

        console.log('ID Token (Google Registration):', idToken); // Логування токена

        const response = await axiosInstance.post(urls.registerWithGoogle.base, { idToken });

        const transformedUser: IUser = {
            uid: response.data.user.uid,
            name: response.data.user.name,
            email: response.data.user.email,
            picture: response.data.user.picture,
        };

        setAuthToken(response.data.token); // Збереження токена

        return { user: transformedUser, token: response.data.token };
    } catch (error) {
        console.error('Помилка реєстрації через Google:', error);
        throw error;
    }
};

// Вхід через Google
const loginWithGoogle = async (): Promise<{ user: IUser; token: string }> => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const idToken = await user.getIdToken(); // Отримання ID токена

        console.log('ID Token (Google Login):', idToken); // Логування токена

        const response = await axiosInstance.post(urls.loginWithGoogle.base, { idToken });

        const transformedUser: IUser = {
            uid: response.data.user.uid,
            name: response.data.user.displayName,
            email: response.data.user.email,
        };

        setAuthToken(response.data.token); // Збереження токена

        return { user: transformedUser, token: response.data.token };
    } catch (error) {
        console.error('Помилка входу через Google:', error);
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
    checkToken
};

export { authService, setAuthToken };
