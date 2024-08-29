import axios, {AxiosError} from 'axios';
import { baseURL, urls } from '../constants';
import {IResponse, IUser} from "../interfaces";
import {signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { auth, provider } from "../firebase/firebaseConfig";


const axiosInstance = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    }
});

const setAuthToken = (token: string | null) => {
    if (token) {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete axiosInstance.defaults.headers.common['Authorization'];
    }
};

const checkToken = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Token not found');
        }

        const response = await axiosInstance.post(urls.checkToken.base, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log('Token is valid:', response.data);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.response && error.response.status === 401) {
                console.error('Token is invalid or expired, logging out...');
                localStorage.removeItem('token');
                throw new Error('Unauthorized: Token is invalid or expired');
            } else {
                console.error('An error occurred:', error.message);
                throw new Error('An unexpected error occurred');
            }
        } else {
            // Якщо помилка не від Axios
            console.error('An unexpected error occurred:', (error as Error).message);
            throw new Error('An unexpected error occurred');
        }
    }
};

const register = async (email: string, password: string, name: string): Promise<IResponse> => {
    try {
        const response = await axiosInstance.post(urls.register.base, { email, password, name });
        return response.data;
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
};

const confirmEmail = async (token: string) => {
    try {
        const response = await axiosInstance.get(`${urls.confirmEmail.base}/${token}`);
        return response.data;
    } catch (error) {
        console.error('Email verification error:', error);
        throw error;
    }
};

const login = async (email: string, password: string): Promise<IResponse> => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const idToken = await userCredential.user.getIdToken();

        if (idToken) {
            localStorage.setItem('token', idToken);
            localStorage.setItem('userUid', userCredential.user.uid); // Додаємо uid у локальне сховище
        } else {
            console.error('The received token is undefined or null');
            new Error('Token not received');
        }

        const response = await axiosInstance.post(urls.login.base, { email, password, token: idToken });

        if (response.data.token) {
            setAuthToken(response.data.token);
        } else {
            console.error('The server token is missing');
        }

        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};


const logout = async (): Promise<void> => {
    try {
        const token = localStorage.getItem('token');
        const uid = localStorage.getItem('userUid');

        if (!token && !uid) {
            console.error('Token and User UID not found in localStorage');
            return;
        } else if (!token) {
            console.error('Token not found in localStorage');
            return;
        } else if (!uid) {
            console.error('User UID not found in localStorage');
            return;
        }

        console.log(`Logout initiated. Token: ${token}, UID: ${uid}`);

        const response = await axiosInstance.post(urls.logout.base, { uid });

        if (response.status === 201) {
            console.log(`User with uid ${uid} logged out successfully`);
            localStorage.removeItem('token');
            localStorage.removeItem('userUid');
            setAuthToken(null);
        } else {
            console.error('Failed to logout. Server response:', response);
            throw new Error('Failed to logout');
        }
    } catch (error) {
        console.error('Logout error:', error);
        throw error;
    }
};



const forgotPassword = async (email: string) => {
    try {
        const response = await axiosInstance.post(urls.forgotPassword.base, { email });
        return response.data;
    } catch (error: any) {
        console.error('Password recovery error:', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || error.message);
    }
};

const resetPassword = async (token: string, newPassword: string) => {
    try {
        await axiosInstance.post(urls.resetPassword.base, { token, newPassword });
    } catch (error) {
        console.error('Password reset error:', error);
        throw error;
    }
};

const registerWithGoogle = async (): Promise<{ user: IUser; token: string }> => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const idToken = await user.getIdToken();

        console.log('ID Token (Google Registration):', idToken);

        const response = await axiosInstance.post(urls.registerWithGoogle.base, { idToken });

        const transformedUser: IUser = {
            uid: response.data.user.uid,
            name: response.data.user.name,
            email: response.data.user.email,
            picture: response.data.user.picture,
        };

        setAuthToken(response.data.token);

        return { user: transformedUser, token: response.data.token };
    } catch (error) {
        console.error('Google registration error:', error);
        throw error;
    }
};

const checkIfUserExists = async (email: string): Promise<boolean> => {
    try {
        const response = await axiosInstance.get(`${urls.checkUserExists.base}?email=${email}`);
        return response.data.exists;
    } catch (error) {
        console.error('Error checking if user exists:', error);
        throw error;
    }
};

const loginWithGoogle = async (): Promise<{ user: IUser; token: string }> => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const email = user.email;

        if (!email) {
            return Promise.reject(new Error('Google account does not have an email address associated. Please use a different account.'));
        }

        const userExists = await checkIfUserExists(email);

        if (!userExists) {
            await user.delete();
            return Promise.reject(new Error('User not registered. Please sign up first.'));
        }

        const idToken = await user.getIdToken();
        const response = await axiosInstance.post(urls.loginWithGoogle.base, { idToken });

        const transformedUser: IUser = {
            uid: response.data.user.uid,
            name: response.data.user.displayName,
            email: response.data.user.email,
        };

        localStorage.setItem('userUid', transformedUser.uid); // Додаємо uid у локальне сховище
        setAuthToken(response.data.token);

        return { user: transformedUser, token: response.data.token };
    } catch (error) {
        console.error('Google login error:', (error as Error).message || String(error));
        return Promise.reject(error);
    }
};


const authService = {
    register,
    confirmEmail,
    login,
    logout,
    forgotPassword,
    resetPassword,
    registerWithGoogle,
    loginWithGoogle,
    checkToken,
};

export { authService, setAuthToken };
