import { createSlice, createAsyncThunk, current } from '@reduxjs/toolkit';
import api from '../../api';

const initialState = {
  scheduleDetails: [],
  status: 'idle',
  error: null
};

export const fetchAll = createAsyncThunk('scheduleDetails/fetchAll', async (id) => {
  try {
    const res = await api.get(`/api/schedule-details/${id}/scheduling`);
    return res.data.details;
  } catch (error) {
    console.log(error);
  }
});

export const update = createAsyncThunk('scheduleDetails/update', async ({ id, data }) => {
  const { scheduling_id, person_id, shifts } = data;

  try {
    const res = await api.put(`/api/schedule-details/${id}`, { scheduling_id, person_id, shifts });
    return data;
  } catch (error) {
    console.log(error);
  }
});

const scheduleDetailsSlice = createSlice({
  name: 'scheduleDetails',
  initialState,
  reducers: {
    storeScheduleDetail: (state, action) => {
      state.scheduleDetails = action.payload;
    },
    updateScheduleDetail: (state, action) => {
      state.scheduleDetails = action.payload;
    },
    deleteScheduleDetail: (state, action) => {
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
      .addCase(update.fulfilled, (state, action) => {
        state.status = 'succeeded'
        let updatedData = state.scheduleDetails.map(detail => {
          if (detail.id === action.payload.id) {
            return {
              ...detail,
              shifts: action.payload.shifts
            }
          }

          return detail;
        })

        state.scheduleDetails = updatedData;
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
