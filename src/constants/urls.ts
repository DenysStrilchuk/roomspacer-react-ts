const baseURL = 'http://localhost:3001';

const login = '/auth/login';
const register = '/auth/register';
const confirmEmail = '/auth/confirm';
const forgotPassword = '/auth/forgot-password';
const resetPassword = '/auth/reset-password';
const registerWithGoogle = '/auth/register-with-google';
const loginWithGoogle = '/auth/login-with-google';
const checkToken = '/auth/check-token';
const checkUserExists = 'auth/check-user-exists'

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
    },
    registerWithGoogle: {
        base: registerWithGoogle
    },
    loginWithGoogle: {
        base: loginWithGoogle
    },
    checkToken: {
        base: checkToken
    },
    checkUserExists: {
        base: checkUserExists
    }
};

export {
    baseURL,
    urls
};
