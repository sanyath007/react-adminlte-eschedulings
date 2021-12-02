import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import api from '../../api';

const scheduleSlice = createSlice({
  name: 'schedule',
  initialState: {
    schedules: [],
    schedule: null,
  },
  reducers: {
    getSchedulesSuccess: (state, action) => {
      state.schedules = action.payload;

      toast.success('Fetch data successfully !!!', { autoClose: 1000, hideProgressBar: true });
    },
    getScheduleSuccess: (state, action) => {
      state.schedule = action.payload;

      toast.success('Fetch data successfully !!!', { autoClose: 1000, hideProgressBar: true });
    },
  }
});

export default scheduleSlice.reducer;

// Actions
export const {
  getSchedulesSuccess,
  getScheduleSuccess,
} = scheduleSlice.actions;

