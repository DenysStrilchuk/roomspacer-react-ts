import axios, { AxiosError } from 'axios';
import { baseURL, urls } from '../constants';

const register = async (email: string, password: string, name: string) => {
    try {
        const url = `${baseURL}${urls.register.base}`;
        const response = await axios.post(url, { email, password, name });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error('Axios error:', error);
            console.error('Server error data:', error.response?.data);
            throw error.response?.data || { message: 'Registration failed' };
        } else {
            console.error('Unexpected error:', error);
            throw { message: 'Unexpected error occurred' };
        }
    }
};

const login = async (email: string, password: string) => {
    try {
        const url = `${baseURL}${urls.login.base}`;
        const response = await axios.post(url, { email, password });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error('Axios error:', error);
            console.error('Server error data:', error.response?.data);
            throw error.response?.data || { message: 'Login failed' };
        } else {
            console.error('Unexpected error:', error);
            throw { message: 'Unexpected error occurred' };
        }
    }
};

const forgotPassword = async (email: string) => {
    try {
        const url = `${baseURL}${urls.forgotPassword.base}`;
        await axios.post(url, { email });
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error('Axios error:', error);
            console.error('Server error data:', error.response?.data);
            throw error.response?.data || { message: 'Failed to send reset link' };
        } else {
            console.error('Unexpected error:', error);
            throw { message: 'Unexpected error occurred' };
        }
    }
};

const resetPassword = async (token: string, newPassword: string) => {
    try {
        const url = `${baseURL}${urls.resetPassword.base}`;
        await axios.post(url, { token, newPassword });
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error('Axios error:', error);
            console.error('Server error data:', error.response?.data);
            throw error.response?.data || { message: 'Failed to reset password' };
        } else {
            console.error('Unexpected error:', error);
            throw { message: 'Unexpected error occurred' };
        }
    }
};

const authService = {
    register,
    login,
    forgotPassword,
    resetPassword
};

export {
    authService,
};
