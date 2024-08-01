const baseURL = 'http://localhost:3001';

const login = '/auth/login';

const register = '/auth/register';

const resetPassword = '/auth/reset-password';

const urls = {
    login: {
        base: login
    },
    register: {
        base: register
    },
    resetPassword: {
        base: resetPassword
    }
}

export {
    baseURL,
    urls
}