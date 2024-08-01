const baseURL = 'http://localhost:3001';

const login = '/auth/login';

const register = '/auth/register';

const forgotPassword = '/auth/forgot-password'

const resetPassword = '/auth/reset-password';

const urls = {
    login: {
        base: login
    },
    register: {
        base: register
    },
    forgotPassword: {
        base: forgotPassword
    },
    resetPassword: {
        base: resetPassword
    }
}

export {
    baseURL,
    urls
}