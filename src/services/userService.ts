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

const getUsersStatus = async (): Promise<Array<{ uid: string; email: string; online: boolean; lastOnline: Date | null }>> => {
    try {
        const token = localStorage.getItem('token');
        console.log('Token in storage:', token);
        const url = urls.usersStatus.base; // Перевірте, чи правильно вказано URL
        const response = await axiosInstance.get(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        return response.data; // Очікуємо масив з інформацією про статус користувачів
    } catch (error) {
        console.error('Error fetching users status:', error);
        throw error;
    }
};

const userService = {
    findAllUsers,
    getUsersStatus
}

export {
    userService
}