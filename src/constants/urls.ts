const baseURL = 'http://localhost:3001';

const login = '/auth/login';
const register = '/auth/register';
const confirmEmail = '/auth/confirm';
const forgotPassword = '/auth/forgot-password';
const resetPassword = '/auth/reset-password';

const urls = {
    login: {
        base: login
    },
    register: {
        base: register
    },
    confirmEmail: {
        base: confirmEmail
    },
    forgotPassword: {
        base: forgotPassword
    },
    resetPassword: {
        base: resetPassword
    }
};

export {
    baseURL,
    urls
};
