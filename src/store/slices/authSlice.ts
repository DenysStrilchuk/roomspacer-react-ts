import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {AxiosError} from 'axios';
import {authService} from '../../services';
import {IErrorResponse, IUser} from '../../interfaces';

interface IAuthState {
    user: IUser | null;
    token: string | null;
    loading: boolean;
    error: IErrorResponse | null;
    isRegistered: boolean;
    isLogin: boolean;
}

const initialState: IAuthState = {
    user: null,
    token: null,
    loading: false,
    error: null,
    isRegistered: false,
    isLogin: false,
};

const handleAxiosError = (e: unknown): IErrorResponse => {
    const error = e as AxiosError<IErrorResponse>;
    return error.response?.data || {message: 'An error occurred'};
};

// Async thunks for email/password authentication
const login = createAsyncThunk<
    { user: IUser; token: string },
    { email: string; password: string },
    { rejectValue: IErrorResponse }
>(
    'authSlice/login',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const data = await authService.login(email, password);

            // Збереження користувача та токена в localStorage
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token', data.token);

            return { user: data.user, token: data.token };
        } catch (e) {
            return rejectWithValue(handleAxiosError(e));
        }
    }
);

const register = createAsyncThunk<
    { user: IUser; token: string },
    { email: string; password: string; name: string },
    { rejectValue: IErrorResponse }
>(
    'authSlice/register',
    async ({email, password, name}, {rejectWithValue}) => {
        try {
            const data = await authService.register(email, password, name);
            return {user: data.user, token: data.token};
        } catch (e) {
            return rejectWithValue(handleAxiosError(e));
        }
    }
);

const forgotPassword = createAsyncThunk<
    void,
    { email: string },
    { rejectValue: IErrorResponse }
>(
    'authSlice/forgotPassword',
    async ({ email }, { rejectWithValue }) => {
        try {
            await authService.forgotPassword(email);
        } catch (e: any) {
            // Return an object with a message instead of just a string
            return rejectWithValue({ message: e.message || 'Помилка відновлення паролю' });
        }
    }
);

const resetPassword = createAsyncThunk<
    void,
    { token: string; newPassword: string },
    { rejectValue: IErrorResponse }
>(
    'authSlice/resetPassword',
    async ({token, newPassword}, {rejectWithValue}) => {
        try {
            await authService.resetPassword(token, newPassword);
        } catch (e) {
            return rejectWithValue(handleAxiosError(e));
        }
    }
);

// Async thunks for Google authentication
const loginWithGoogle = createAsyncThunk<
    { user: IUser; token: string },
    void,
    { rejectValue: IErrorResponse }
>(
    'authSlice/loginWithGoogle',
    async (_, {rejectWithValue}) => {
        try {
            const data = await authService.loginWithGoogle();
            const transformedUser: IUser = {
                uid: data.user.uid,
                name: data.user.name,
                email: data.user.email,
                picture: data.user.picture,
            };
            return {user: transformedUser, token: data.token};
        } catch (e) {
            return rejectWithValue(handleAxiosError(e));
        }
    }
);

const registerWithGoogle = createAsyncThunk<
    { user: IUser; token: string },
    void,
    { rejectValue: IErrorResponse }
>(
    'authSlice/registerWithGoogle',
    async (_, {rejectWithValue}) => {
        try {
            const data = await authService.registerWithGoogle();
            const transformedUser: IUser = {
                uid: data.user.uid,
                name: data.user.name,
                email: data.user.email,
                picture: data.user.picture,
            };
            return {user: transformedUser, token: data.token};
        } catch (e) {
            return rejectWithValue(handleAxiosError(e));
        }
    }
);

const checkToken = createAsyncThunk<
    boolean,
    void,
    { rejectValue: IErrorResponse }
>(
    'authSlice/checkToken',
    async (_, { rejectWithValue }) => {
        try {
            return await authService.checkToken();
        } catch (e) {
            return rejectWithValue(handleAxiosError(e));
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isLogin = false;
        },
        setToken: (state, action) => {
            state.token = action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.isLogin = false;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.user = action.payload.user;
                state.token = action.payload.token;
                localStorage.setItem('user', JSON.stringify(action.payload.user));  // Збереження користувача в локальне сховище
                localStorage.setItem('token', action.payload.token);  // Збереження токена в локальне сховище
                state.loading = false;
                state.isLogin = true;
            })
            .addCase(login.rejected, (state, action) => {
                state.error = action.payload || {message: 'Login failed'};
                state.loading = false;
                state.isLogin = false;
            })
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.isRegistered = false;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.isRegistered = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || {message: 'Registration failed'};
            })
            .addCase(forgotPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(forgotPassword.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || { message: 'Помилка відновлення паролю' };
            })
            .addCase(resetPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resetPassword.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.error = action.payload || {message: 'Failed to reset password'};
                state.loading = false;
            })
            .addCase(loginWithGoogle.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.isLogin = false;
            })
            .addCase(loginWithGoogle.fulfilled, (state, action) => {
                state.user = action.payload.user;
                state.token = action.payload.token;
                localStorage.setItem('user', JSON.stringify(action.payload.user));  // Збереження користувача в локальне сховище
                state.loading = false;
                state.isLogin = true;
            })
            .addCase(loginWithGoogle.rejected, (state, action) => {
                state.error = action.payload || {message: 'Login with Google failed'};
                state.loading = false;
                state.isLogin = false;
            })
            .addCase(registerWithGoogle.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerWithGoogle.fulfilled, (state, action) => {
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.loading = false;
                state.isRegistered = true;
            })
            .addCase(registerWithGoogle.rejected, (state, action) => {
                state.error = action.payload || {message: 'Registration with Google failed'};
                state.loading = false;
            })
            .addCase(checkToken.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(checkToken.fulfilled, (state, action) => {
                state.loading = false;
                state.isLogin = action.payload;
            })
            .addCase(checkToken.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || { message: 'Token check failed' };
            });
    },
});

const {reducer: authReducer, actions} = authSlice;
const authActions = {
    ...actions,
    login,
    register,
    forgotPassword,
    resetPassword,
    loginWithGoogle,
    registerWithGoogle,
    checkToken,
};

export {
    authReducer,
    authActions,
};
