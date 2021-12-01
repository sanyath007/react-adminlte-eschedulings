import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoggedInMenuItem from './LoggedInMenuItem';

const MainHeader = () => {
  const { auth } = useSelector(state => state.auth);

  return (
    <nav className="main-header navbar navbar-expand navbar-white navbar-light">
      {/* Left navbar links */}
      <ul className="navbar-nav">
        <li className="nav-item">
          <a className="nav-link" data-widget="pushmenu" href="#"><i className="fas fa-bars"></i></a>
        </li>
        <li className="nav-item d-none d-sm-inline-block">
          <Link to="/" className="nav-link">Home</Link>
        </li>
        <li className="nav-item d-none d-sm-inline-block">
          <Link to="/" className="nav-link">Contact</Link>
        </li>
      </ul>

      {/* SEARCH FORM */}

      {/* Right navbar links */}
      <ul className="navbar-nav ml-auto">
        {/* Messages Dropdown Menu */}

        {/* Notifications Dropdown Menu */}

        {/* Expand Menu */}
        {/* <li className="nav-item">
          <a className="nav-link" data-widget="control-sidebar" data-slide="true" href="#">
            <i className="fas fa-th-large"></i>
          </a>
        </li> */}

        {auth && <LoggedInMenuItem user={auth} />}
      </ul>
    </nav>
  );
};

export default MainHeader;
