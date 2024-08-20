import axios from 'axios';
import { baseURL, urls } from '../constants';
import { ILoginResponse, IRegisterResponse, IUser } from "../interfaces";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
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
            console.error('Token not found');
            new Error('Token not found');
        }

        const response = await axiosInstance.post(urls.checkToken.base, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Token validation error:', error);
        throw error;
    }
};

const register = async (email: string, password: string, name: string): Promise<IRegisterResponse> => {
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

const login = async (email: string, password: string): Promise<ILoginResponse> => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const idToken = await userCredential.user.getIdToken();

        if (idToken) {
            localStorage.setItem('token', idToken); // Збереження токена з Firebase
            console.log('Token from localStorage:', idToken);
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

const loginWithGoogle = async (): Promise<{ user: IUser; token: string }> => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const idToken = await user.getIdToken();

        console.log('ID Token (Google Login):', idToken);

        const response = await axiosInstance.post(urls.loginWithGoogle.base, { idToken });

        const transformedUser: IUser = {
            uid: response.data.user.uid,
            name: response.data.user.displayName,
            email: response.data.user.email,
        };

        setAuthToken(response.data.token);

        return { user: transformedUser, token: response.data.token };
    } catch (error) {
        console.error('Google login error:', error);
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
