import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {userService} from '../../services';
import {IUser, IErrorResponse} from '../../interfaces';
import {AxiosError} from "axios";

interface IUserState {
    users: IUser[];
    loading: boolean;
    error: IErrorResponse | null;
    selectedUser: IUser | null;
}

const initialState: IUserState = {
    users: [],
    loading: false,
    error: null,
    selectedUser: null,
};

const handleAxiosError = (e: unknown): IErrorResponse => {
    const error = e as AxiosError<IErrorResponse>;
    return error.response?.data || { message: 'An error occurred' };
};

// Async thunk for fetching all users
const fetchAllUsers = createAsyncThunk<
    IUser[],
    { email: string; name: string },
    { rejectValue: IErrorResponse }
>(
    'userSlice/fetchAllUsers',
    async ({ email, name }, { rejectWithValue }) => {
        try {
            return await userService.findAllUsers(email, name);
        } catch (e) {
            return rejectWithValue(handleAxiosError(e));
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload;
        },
        clearSelectedUser: (state) => {
            state.selectedUser = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                state.users = action.payload;
                state.loading = false;
            })
            .addCase(fetchAllUsers.rejected, (state, action) => {
                state.error = action.payload || {message: 'Failed to fetch users'};
                state.loading = false;
            });
    },
});

const {reducer: userReducer, actions} = userSlice;
const userActions = {
    ...actions,
    fetchAllUsers,
};

export {
    userReducer,
    userActions,
};
