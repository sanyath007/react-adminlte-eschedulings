import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import api from '../../api';

const scheduleSlice = createSlice({
  name: 'schedule',
  initialState: {
    schedules: []
  },
  reducers: {
    getSchedulesSuccess: (state, action) => {
      state.schedules = action.payload;

      toast.success('Signin successfully !!!', { autoClose: 1000, hideProgressBar: true });
    },
  }
});

export default scheduleSlice.reducer;

// Actions
export const {
  getSchedulesSuccess,
} = scheduleSlice.actions;

