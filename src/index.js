import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import App from './App';
import store from './features';
import 'react-toastify/dist/ReactToastify.css';
import './utils/loader.js';

ReactDOM.render(
  <Provider store={store}>
    <App />    
    <ToastContainer />
  </Provider>,
  document.getElementById('root')
);
