import axios from "axios";
import {baseURL, urls} from "../constants/urls";

const register = async (email: string, password: string, name: string) => {
    const response = await axios.post(`${baseURL}${urls.register.base}`, { email, password, name });
    return response.data;
};

const login = async (email: string, password: string) => {
    const response = await axios.post(`${baseURL}${urls.login.base}`, { email, password });
    return response.data;
};

const authService = {
    register,
    login
}

export {
    authService
}