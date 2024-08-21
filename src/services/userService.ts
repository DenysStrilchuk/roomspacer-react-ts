import {baseURL, urls} from "../constants";
import axios from "axios";
import {IUser} from "../interfaces";

const axiosInstance = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    }
});

const findAllUsers = async (email: string, name: string): Promise<IUser[]> => {
    try {
        const token = localStorage.getItem('token');
        console.log('Token in storage:', token);
        const url = urls.findAllUsers.base;
        const response = await axiosInstance.get(url, {
            params: { email, name },
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        return response.data;  // Очікуємо масив користувачів
    } catch (error) {
        console.error('Finding error:', error);
        throw error;
    }
};



const userService = {
    findAllUsers
}

export {
    userService
}