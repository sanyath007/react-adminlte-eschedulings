import { configureStore } from '@reduxjs/toolkit';
import authSlice from './auth';
import usersSlice from './users';
import schedulesSlice from './schedules';
import scheduleDetailsSlice from './scheduleDetails';

export default configureStore({
  reducer: {
    auth: authSlice,
    users: usersSlice,
    schedules: schedulesSlice,
    scheduleDetails: scheduleDetailsSlice,
  }
});
