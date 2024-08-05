import axios, { AxiosError } from 'axios';
import { baseURL, urls } from '../constants';

const handleAxiosError = (error: any): never => {
    if (error instanceof AxiosError) {
        console.error('Axios error:', error);
        console.error('Server error data:', error.response?.data);
        throw error.response?.data || { message: 'Request failed' };
    } else {
        console.error('Unexpected error:', error);
        throw { message: 'Unexpected error occurred' };
    }
};

const register = async (email: string, password: string, name: string) => {
    try {
        const url = `${baseURL}${urls.register.base}`;
        const response = await axios.post(url, { email, password, name });
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

const confirmEmail = async (token: string) => {
    try {
        const url = `${baseURL}${urls.confirmEmail.base}/${token}`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

const login = async (email: string, password: string) => {
    try {
        const url = `${baseURL}${urls.login.base}`;
        const response = await axios.post(url, { email, password });
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

const forgotPassword = async (email: string) => {
    try {
        const url = `${baseURL}${urls.forgotPassword.base}`;
        await axios.post(url, { email });
    } catch (error) {
        handleAxiosError(error);
    }
};

const resetPassword = async (token: string, newPassword: string) => {
    try {
        const url = `${baseURL}${urls.resetPassword.base}`;
        await axios.post(url, { token, newPassword });
    } catch (error) {
        handleAxiosError(error);
    }
};

const authService = {
    register,
    confirmEmail,
    login,
    forgotPassword,
    resetPassword
};

export {
    authService,
};
