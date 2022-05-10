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
        <span className="d-none d-md-inline">{user?.person_firstname}</span>
      </a>
      <ul className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
        <li className="user-header bg-primary">
          <img
            src={`${process.env.PUBLIC_URL}/img/user2-160x160.jpg`}
            className="img-circle elevation-2"
            alt="User Image"
          />

          <p>
            {`${user?.person_firstname} ${user?.person_lastname}`}<br />
            {user?.position?.position_name}
          </p>
        </li>
        <li className="user-footer">
          {/* <a href="#" className="btn btn-default btn-flat">
            Profile
          </a> */}
          <a 
            href="#"
            onClick={() => dispatch(authService.logout())}
            className="btn btn-default btn-flat float-right"
          >
            ลงชื่อออก
          </a>
        </li>
      </ul>
    </li>
  );
};

export default LoggedInMenuItem;
