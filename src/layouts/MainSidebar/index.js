import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

const MainSidebar = () => {
  const { user } = useSelector(state => state.users);

  const handleMenuClicked = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const navLink = e.currentTarget;
    const treeView = navLink.nextElementSibling;
    const parent = navLink.parentElement;

    if (parent.classList.contains('menu-is-opening') || parent.classList.contains('menu-open')) {
      parent.classList.remove('menu-is-opening', 'menu-open')
      treeView.style.display = "none";
    } else {
      parent.classList.add('menu-is-opening', 'menu-open')
      treeView.style.display = "block";
    }
  };

  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-4">
      {/* Brand Logo */}
      <Link to="/" className="brand-link">
        <img
          src={`${process.env.PUBLIC_URL}/img/AdminLTELogo.png`}
          alt="AdminLTE Logo"
          className="brand-image img-circle elevation-3"
          style={{ opacity: '.8' }}
        />
        <span className="brand-text font-weight-light">E-Scheduling</span>
      </Link>

      {/* Sidebar */}
      <section className="sidebar">
        {/* Sidebar user panel (optional) */}
        <div className="user-panel mt-3 pb-3 mb-3 d-flex">
          <div className="image">
            <img src={`${process.env.PUBLIC_URL}/img/user2-160x160.jpg`} className="img-circle" alt="User Image" />
          </div>
          <div className="info">
            <Link to="/profile">
              {`${user?.person_firstname} ${user?.person_lastname}`}
            </Link>
          </div>
        </div>

        {/* Sidebar Menu */}
        <nav className="mt-2">
          <ul
            className="nav nav-pills nav-sidebar flex-column"
            data-widget="treeview"
            role="menu"
            data-accordion="false"
          >
            <li className="nav-item">
              <NavLink to="/" className="nav-link">
                <i className="nav-icon fas fa-tachometer-alt"></i>
                <p>Dashboard</p>
              </NavLink>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link" onClick={handleMenuClicked}>
                <i className="nav-icon far fa-calendar-alt"></i>
                <p>
                  ตารางเวร
                  <i className="right fas fa-angle-left"></i>
                </p>
              </a>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <NavLink to="/schedules/list" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>รายการตารางเวร</p>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/schedules/swap-list" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>เปลี่ยนเวร</p>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/schedules/off-list" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Off เวร</p>
                  </NavLink>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link" onClick={handleMenuClicked}>
                <i className="nav-icon fas fa-chart-pie"></i>
                <p>
                  รายงาน
                  <i className="right fas fa-angle-left"></i>
                </p>
              </a>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <NavLink to="/reports/chartjs" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>ChartJS</p>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/reports/flot" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Flot</p>
                  </NavLink>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </section>
    </aside>
  );
};

export default MainSidebar;
