import { configureStore } from '@reduxjs/toolkit';
import authSlice from './auth';
import scheduleSlice from './schedule';

export default configureStore({
  reducer: {
    auth: authSlice,
    schedule: scheduleSlice
  }
});
