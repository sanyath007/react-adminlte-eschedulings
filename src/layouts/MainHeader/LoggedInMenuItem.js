import React from 'react';
import { useDispatch } from 'react-redux';
import * as authService from '../../features/auth';

const LoggedInMenuItem = ({ user }) => {
  const dispatch = useDispatch();

  return (
    <li className="nav-item dropdown user-menu">
      <a href="#" className="nav-link dropdown-toggle" data-toggle="dropdown">
        <img
          src={`${process.env.PUBLIC_URL}/img/user2-160x160.jpg`}
          className="user-image img-circle elevation-2"
          alt="User Image"
        />
        <span className="d-none d-md-inline">{user?.username}</span>
      </a>
      <ul className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
          {/* User image */}
          <li className="user-header bg-primary">
            <img
              src={`${process.env.PUBLIC_URL}/img/user2-160x160.jpg`}
              className="img-circle elevation-2"
              alt="User Image"
            />

            <p>
            {user?.name}<br />
            {user?.position}
            {/* <small>Member since Nov. 2012</small> */}
            </p>
          </li>
          {/* Menu Body */}
          {/* <li className="user-body">
            <div className="row">
              <div className="col-4 text-center">
                <a href="#">Followers</a>
              </div>
              <div className="col-4 text-center">
                <a href="#">Sales</a>
              </div>
              <div className="col-4 text-center">
                <a href="#">Friends</a>
              </div>
            </div>
          </li> */}
          {/* Menu Footer */}
          <li className="user-footer">
            <a
              href="#"
              className="btn btn-default btn-flat"
            >
              Profile
            </a>
            <a 
              href="#"
              onClick={() => dispatch(authService.logout())}
              className="btn btn-default btn-flat float-right"
            >
              Sign out
            </a>
          </li>
      </ul>
    </li>
  );
};

export default LoggedInMenuItem;
