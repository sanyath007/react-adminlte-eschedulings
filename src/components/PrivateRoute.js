import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import jwt from 'jwt-decode';
import { fetchUser } from '../features/users';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const dispatch = useDispatch();
  const now = new Date();
  const exp = localStorage.getItem('access_token')
    ? jwt(JSON.parse(localStorage.getItem('access_token')))?.exp
    : null;

  /** Check token expiration */
  let isExpired = false;
  isExpired = exp * 1000 < now.getTime();

  /** if token expired have to clear localStorage and auth data in store */
  if (isExpired) {
    toast.error("Your access token has expired.", { autoClose: 1000, hideProgressBar: true });

    localStorage.removeItem('access_token');
  } else {
    const decoded = jwt(JSON.parse(localStorage.getItem('access_token')));

    if (decoded) {
      dispatch(fetchUser({ id: decoded.sub }));
    }
  }

  return (
      <Route
        {...rest}
        render={(props) => (
          !isExpired
            ? <Component {...props} />
            : <Redirect to={{ pathname: '/signin', state: { from: props.location } }} />
        )}
      />
  );
};

export default PrivateRoute;
