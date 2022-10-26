import React, { useEffect, useState } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import jwt from 'jwt-decode';
import { fetchUser } from '../features/users';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const now = new Date();
  const dispatch = useDispatch();
  const { auth } = useSelector(state => state.auth);
  const [isExpired, setIsExpired] = useState(false);

  const token = localStorage.getItem('access_token') ? JSON.parse(localStorage.getItem('access_token')) : null;
  const decoded = token ? jwt(token) : null;

  useEffect(() => {
    /** Check token expiration */
    setIsExpired(decoded ? decoded?.exp * 1000 < now.getTime() : true);

    /** if token expired have to clear localStorage and auth data in store */
    if (isExpired) {
      toast.error("Your access token has expired.", { autoClose: 1000, hideProgressBar: true });

      localStorage.removeItem('access_token');
    } else {
      if (decoded) {
        dispatch(fetchUser({ id: decoded?.sub }));
      }
    }
  }, [auth]);

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
