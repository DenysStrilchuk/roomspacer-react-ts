import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { authService } from '../../services';
import { IUser } from '../../interfaces';

// Інтерфейс для обробки помилок
interface IErrorResponse {
    message: string;
}

interface IAuthState {
    user: IUser | null;
    token: string | null;
    loading: boolean;
    error: string | null;
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

const login = createAsyncThunk<{ user: IUser, token: string }, { email: string, password: string }>(
    'authSlice/login',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const data = await authService.login(email, password);
            return { user: data.user, token: data.token };
        } catch (e) {
            const err = e as AxiosError<IErrorResponse>;
            return rejectWithValue(err.response?.data.message || 'Login failed');
        }
    }
);

const register = createAsyncThunk<{ user: IUser, token: string }, { email: string, password: string, name: string }>(
    'authSlice/register',
    async ({ email, password, name }, { rejectWithValue }) => {
        try {
            const data = await authService.register(email, password, name);
            return { user: data.user, token: data.token };
        } catch (e) {
            const err = e as AxiosError<IErrorResponse>;
            return rejectWithValue(err.response?.data.message || 'Registration failed');
        }
    }
);

const forgotPassword = createAsyncThunk<void, { email: string, password: string }>(
    'authSlice/forgotPassword',
    async ({ email }, { rejectWithValue }) => {
        try {
            await authService.forgotPassword(email);
        } catch (e) {
            const err = e as AxiosError<IErrorResponse>;
            return rejectWithValue(err.response?.data.message || 'Failed to send reset link');
        }
    }
);

const authSlice = createSlice({
    name: 'authSlice',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
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
                state.loading = false;
                state.isLogin = true;
            })
            .addCase(login.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
                state.isLogin = false;
            })
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.isRegistered = false;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.loading = false;
                state.isRegistered = true;
            })
            .addCase(register.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
                state.isRegistered = false;
            })
            .addCase(forgotPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(forgotPassword.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            });
    },
});

const { reducer: authReducer, actions } = authSlice;
const authActions = {
    ...actions,
    login,
    register,
    forgotPassword
};

export {
    authReducer,
    authActions,
};
