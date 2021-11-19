import axios from 'axios';
// import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

api.interceptors.request.use((config) => {
  const token = JSON.parse(localStorage.getItem('access_token'));

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => Promise.reject(error));

// api.interceptors.response.use((res) => {
//   return res;
// }, (err) => {
  /** Check on network error */
  // if (err.message === 'Network Error' && !err.response) {
  //   toast.error('Network error !!');
  // }

  /** Get original request */
  // const originalRequest = err.config;

  /** Call refresh access token */
  // if (err.response.status === 403 && !originalRequest._retry) {
  //   originalRequest._retry = true;
  //   const access_token = await refreshAccessToken();

  //   axios.defaults.headers.common['Authorization'] = 'Bearer ' + access_token;

  //   return axiosApiInstance(originalRequest);
  // }

//   return Promise.reject(err);
// });

export default api;
