import axios, {AxiosError} from "axios";
import {baseURL, urls} from "../constants";

const register = async (email: string, password: string, name: string) => {
    try {
        const url = `${baseURL}${urls.register.base}`;
        console.log('Registration URL:', url); // Додайте цей рядок для перевірки URL
        const response = await axios.post(url, { email, password, name });
        console.log('Server response:', response.data); // Додайте цей рядок для перевірки відповіді сервера
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error('Axios error:', error); // Лог для повного об'єкта помилки
            console.error('Server error data:', error.response?.data); // Лог для даних помилки
        } else {
            console.error('Unexpected error:', error); // Лог для непередбачених помилок
        }
        throw error;
    }
};

const login = async (email: string, password: string) => {
    const url = `${baseURL}${urls.login.base}`;
    console.log('Login URL:', url); // Додайте цей рядок для перевірки URL
    const response = await axios.post(url, { email, password });
    return response.data;
};

const authService = {
    register,
    login
}

export {
    authService
}