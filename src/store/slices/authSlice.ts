import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

import { authService } from "../../services";
import { IUser } from "../../interfaces/userInterface";

interface IAuthState {
    user: IUser | null;
    token: string | null;
    loading: boolean;
    error: string | null;
}

const initialState: IAuthState = {
    user: null,
    token: null,
    loading: false,
    error: null,
};

const login = createAsyncThunk<{ user: IUser, token: string }, { email: string, password: string }>(
    'authSlice/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const { data } = await authService.login(credentials);
            return { user: data.user, token: data.token };
        } catch (e) {
            const err = e as AxiosError;
            return rejectWithValue(err.response?.data || 'Login failed');
        }
    }
);

const register = createAsyncThunk<{ user: IUser, token: string }, { email: string, password: string, name: string }>(
    'authSlice/register',
    async (userInfo, { rejectWithValue }) => {
        try {
            const { data } = await authService.register(userInfo);
            return { user: data.user, token: data.token };
        } catch (e) {
            const err = e as AxiosError;
            return rejectWithValue(err.response?.data || 'Registration failed');
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
        }
    },
    extraReducers: builder => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.loading = false;
            })
            .addCase(login.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.loading = false;
            })
            .addCase(register.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            });
    }
});

const { reducer: authReducer, actions } = authSlice;
const authActions = {
    ...actions,
    login,
    register
};

export {
    authReducer,
    authActions
};
