import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';

const initialState = {
  schedules: [],
  pager: null,
  status: 'idle',
  error: null
};

export const fetchSchedules = createAsyncThunk('schedules/fetchSchedules', async ({ url, month }) => {
  try {
    const endpoint = url === '' ? '/schedulings?page=' : url;
    const res = await api.get(`${endpoint}&month=${month}`);

    return res.data.schedulings;
  } catch (error) {
    console.log(error);
  }
});

const schedulesSlice = createSlice({
  name: 'schedules',
  initialState,
  reducers: {
    storeSchedule: (state, action) => {
      state.schedule = action.payload;
    },
    updateSchedule: (state, action) => {
      state.schedule = action.payload;
    },
    deleteSchedule: (state, action) => {
      state.schedule = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchSchedules.pending, (state, action) => {
        state.status = 'loadiing'
      })
      .addCase(fetchSchedules.fulfilled, (state, action) => {
        state.status = 'succeeded'

        const { data, ...pager } = action.payload;
        state.schedules = data;
        state.pager = pager;
      })
      .addCase(fetchSchedules.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  }
});

export default schedulesSlice.reducer;

// Actions
export const { storeSchedule, updateSchedule, deleteSchedule } = schedulesSlice.actions;

export const getAllSchedules = state => state.schedules;

export const getScheduleById = (state, id) => {
  return state.schedules.schedules.find(schedule => schedule.id === parseInt(id))
};
