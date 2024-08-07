import axios from 'axios';
import {baseURL, urls} from '../constants';
import {ILoginResponse, IRegisterResponse} from "../interfaces";

const register = async (email: string, password: string, name: string): Promise<IRegisterResponse> => {
    const url = `${baseURL}${urls.register.base}`;
    const response = await axios.post(url, {email, password, name});
    return response.data;
};


const confirmEmail = async (token: string) => {
    try {
        const url = `${baseURL}${urls.confirmEmail.base}/${token}`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {

    }
};

const login = async (email: string, password: string):Promise<ILoginResponse> => {
    const url = `${baseURL}${urls.login.base}`;
    const response = await axios.post(url, { email, password });
    return response.data;
};

const forgotPassword = async (email: string) => {
    try {
        const url = `${baseURL}${urls.forgotPassword.base}`;
        await axios.post(url, {email});
    } catch (error) {

    }
};

const resetPassword = async (token: string, newPassword: string) => {
    try {
        const url = `${baseURL}${urls.resetPassword.base}`;
        await axios.post(url, {token, newPassword});
    } catch (error) {

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
