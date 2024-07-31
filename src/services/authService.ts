import axios, {AxiosError} from "axios";
import {baseURL, urls} from "../constants";

const register = async (email: string, password: string, name: string) => {
    try {
        const url = `${baseURL}${urls.register.base}`;
        const response = await axios.post(url, { email, password, name });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error('Axios error:', error);
            console.error('Server error data:', error.response?.data);
        } else {
            console.error('Unexpected error:', error);
        }
        throw error;
    }
};

const login = async (email: string, password: string) => {
    const url = `${baseURL}${urls.login.base}`;
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