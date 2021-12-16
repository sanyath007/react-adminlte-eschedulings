import { configureStore } from '@reduxjs/toolkit';
import authSlice from './auth';
import schedulesSlice from './schedules';

export default configureStore({
  reducer: {
    auth: authSlice,
    schedules: schedulesSlice
  }
});
