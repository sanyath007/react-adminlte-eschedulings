import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';

const initialState = {
    user: null,
    users: [],
    loading: '',
    error: '',
};

export const fetchUser = createAsyncThunk('users/fetchUser', async ({ id }) => {
    const res = await api.get(`/users/${id}`);

    return res.data.user;
});

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers: {
        [fetchUser.pending]: (state) => {
            state.loading = true;
        },
        [fetchUser.fulfilled]: (state, action) => {
            state.loading = false;
            state.user = action.payload;
        },
        [fetchUser.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        }
    }
});

export default usersSlice.reducer;
