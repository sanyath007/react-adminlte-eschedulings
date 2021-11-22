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
const {
  getSchedulesSuccess,
} = scheduleSlice.actions;

export const getSchedules = (data) => async (dispatch) => {
  try {
    const res = await api.get('/schedulings', data);

    dispatch(getSchedulesSuccess(res.data));
  } catch (error) {
    console.log(error);
  }
};

