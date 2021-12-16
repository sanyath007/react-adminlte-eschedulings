import { configureStore } from '@reduxjs/toolkit';
import authSlice from './auth';
import schedulesSlice from './schedules';
import scheduleDetailsSlice from './scheduleDetails';

export default configureStore({
  reducer: {
    auth: authSlice,
    schedules: schedulesSlice,
    scheduleDetails: scheduleDetailsSlice,
  }
});
