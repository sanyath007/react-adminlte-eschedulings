import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import jwt from 'jwt-decode';
import api from '../../api';

const initialAuth = localStorage.getItem('access_token')
  ? jwt(JSON.parse(localStorage.getItem('access_token')))?.sub
  : null;

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    auth: initialAuth
  },
  reducers: {
    loginSuccess: (state, action) => {
      const decoded = jwt(action.payload);

      state.auth = decoded.sub;
      localStorage.setItem('access_token', JSON.stringify(action.payload));

      toast.success('Signin successfully !!!', { autoClose: 1000, hideProgressBar: true });
    },
    logoutSucces: (state) => {
      state.auth = null;
      localStorage.removeItem('access_token');
    },
  }
});

export default authSlice.reducer;

// Actions
const {
  loginSuccess,
  logoutSucces
} = authSlice.actions;

export const login = (data, history) => async (dispatch) => {
  try {
    const res = await api.post('/auth/login', data);

    dispatch(loginSuccess(res.data.token));

    history.push('/');
  } catch (error) {
    console.log(error);
  }
};

export const logout = () => async (dispatch) => {
  try {
    dispatch(logoutSucces());
  } catch (error) {
    console.log(error);
  }
};
