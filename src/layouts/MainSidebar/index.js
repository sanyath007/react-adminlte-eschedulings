import React from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const MainSidebar = () => {

  useEffect(() => {
    window.$(function () {
      /** menu */
      window.$(".nav-sidebar > .nav-item.has-treeview > .nav-link").on("click", function (e) {
        e.preventDefault();
        console.log('On menu is clicked!!');
        /** Set display style of .nav-treeview that is child of previous opened .nav-item to none */
        window.$(".nav-sidebar").find(".menu-open").children(".nav-treeview").css("display", "none");
        /** Remove .menu-open class from previous opened .nav-item */
        window.$(".nav-sidebar").find(".menu-open").removeClass("menu-open");

        /** Remove .active class from previous actived .nav-link that is child of .nav-item */
        window.$(".nav-sidebar .nav-item").find(".active").removeClass("active");
        /** Set .active class to clicked .nav-link */
        window.$(this).addClass("active");
      });

      /** submenu */
      window.$(".nav-treeview .nav-link").on("click", function (e) {
        console.log('On submenu is clicked!!');

        window.$(".nav-treeview").find(".active").removeClass("active");
        window.$(this).addClass("active");
      });
    });
  }, []);

  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-4">
      {/* Brand Logo */}
      <Link to="/" className="brand-link">
        <img
          src="/img/AdminLTELogo.png"
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
            <img src="/img/user2-160x160.jpg" className="img-circle" alt="User Image" />
          </div>
          <div className="info">
            <Link to="/profile">Alexander Pierce</Link>
          </div>
        </div>

        {/* Sidebar Menu */}
        <nav className="mt-2">
          <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
            <li className="nav-item">
              <Link to="/" className="nav-link active">
                <i className="nav-icon fas fa-tachometer-alt"></i>
                <p>Dashboard</p>
              </Link>
            </li>
            <li className="nav-item has-treeview">
              <a href="#" className="nav-link">
                <i className="nav-icon far fa-calendar-alt"></i>
                <p>
                  ตารางเวร
                  <i className="right fas fa-angle-left"></i>
                </p>
              </a>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <Link to="/schedules/list" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>รายการตารางเวร</p>
                  </Link>
                </li>
                {/* <li className="nav-item">
                  <Link to="/charts/flot" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Flot</p>
                  </Link>
                </li> */}
              </ul>
            </li>
            <li className="nav-item has-treeview">
              <a href="#" className="nav-link">
                <i className="nav-icon fas fa-chart-pie"></i>
                <p>
                  รายงาน
                  <i className="right fas fa-angle-left"></i>
                </p>
              </a>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <Link to="/charts/chartjs" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>ChartJS</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/charts/flot" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Flot</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/charts/inline" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Inline</p>
                  </Link>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <Link to="/profile" className="nav-link">
                <i className="nav-icon fas fa-user"></i>
                <p>
                  Profile
                  <span className="right badge badge-danger">New</span>
                </p>
              </Link>
            </li>
          </ul>
        </nav>
      </section>
    </aside>
  );
};

export default MainSidebar;
