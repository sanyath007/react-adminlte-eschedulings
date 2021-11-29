import React, { useEffect } from 'react'
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';
import routes from '../../routes';
import AppHeader from '../MainHeader';
import AppSidebar from '../MainSidebar';
import AppFooter from '../MainFooter';
import { addBodyClass, removeBodyClass } from '../../utils';

const MainLayout = () => {
  /** Get the current route from location */
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/') {
      removeBodyClass('login-page');

      addBodyClass('sidebar-mini');
      addBodyClass('layout-fixed');
    }
  }, []);

  const currentRoute = routes.find(rt => rt.path === location.pathname);

  return (
    <div className="wrapper">
      <AppHeader />

      <AppSidebar />

      {/* Content Wrapper. Contains page content */}
      <div className="content-wrapper">

        {/* Content Header (Page header) */}
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0 text-dark">{currentRoute ? currentRoute?.name : 'Error404'}</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item"><a href="#">Home</a></li>
                  <li className="breadcrumb-item active">{currentRoute ? currentRoute?.name : 'Error404'}</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <section className="content">

          <Switch>
            {routes.map((route, idx) => {
              return route.component ? (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  render={props => <route.component {...props} />}
                />
              ) : (null);
            })}
            <Redirect from="/" to="/dashboard" />
          </Switch>

        </section>

      </div>

      <AppFooter />

    </div>
  );
};

export default MainLayout;
