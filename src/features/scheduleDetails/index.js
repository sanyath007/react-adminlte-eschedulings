import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';

const initialState = {
  scheduleDetails: [],
  status: 'idle',
  error: null
};

export const fetchAll = createAsyncThunk('scheduleDetails/fetchAll', async (id) => {
  try {
    console.log(id);
    const res = await api.get(`/api/schedule-details/${id}/scheduling`);
    return res.data.details;
  } catch (error) {
    console.log(error);
  }
});

const scheduleDetailsSlice = createSlice({
  name: 'scheduleDetails',
  initialState,
  reducers: {
    storeSchedule: (state, action) => {
      state.scheduleDetails = action.payload;
    },
    updateSchedule: (state, action) => {
      state.scheduleDetails = action.payload;
    },
    deleteSchedule: (state, action) => {
      state.scheduleDetails = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchAll.pending, (state, action) => {
        state.status = 'loadiing'
      })
      .addCase(fetchAll.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.scheduleDetails = action.payload
      })
      .addCase(fetchAll.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  }
});

export default scheduleDetailsSlice.reducer;

// Actions
export const { storeSchedule, updateSchedule, deleteSchedule } = scheduleDetailsSlice.actions;

export const getAllScheduleDetails = state => state.scheduleDetails.scheduleDetails;

export const getScheduleDetailsById = (state, id) => {
  return state.scheduleDetails.scheduleDetails.find(detail => detail.id === parseInt(id))
};
