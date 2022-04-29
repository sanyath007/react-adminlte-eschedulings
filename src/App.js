import React, { useEffect } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import MainLayout from './layouts/MainLayout';
import Signin from './views/Signin';
import Signup from './views/Signup';
import './App.css';
import "react-datepicker/dist/react-datepicker.css";

function App() {
  useEffect(() => {
    window.$(function() {
      /** menu */
      window.$(".nav-sidebar > .nav-item > .nav-link").on("click", function (e) {
        console.log('sidebar click...');
    
        /** Remove .menu-open class from previous opened .nav-item */
        window.$(".nav-sidebar").find(".menu-open").removeClass("menu-is-opening menu-open");
    
        /** Set class and style to clicked .nav-item */
        if(window.$(this).parent().hasClass("has-treeview")) {
          window.$(this).parent().addClass("menu-is-opening menu-open");
        }
    
        /** Remove .active class from previous actived .nav-link that is child of .nav-item */
        window.$(".nav-sidebar .nav-item").find(".active").removeClass("active");
        /** Set .active class to clicked .nav-link */
        window.$(this).addClass("active");
      });
    
      /** submenu */
      window.$(".nav-treeview .nav-link").on("click", function (e) {
        window.$(".nav-treeview").find(".active").removeClass("active");
        window.$(this).addClass("active");
      });
    });
  }, []);

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/signin" name="Sign In Page" render={props => <Signin {...props} />} />
        <Route exact path="/signup" name="Sign Up Page" render={props => <Signup {...props} />} />
        <PrivateRoute path="/" name="Home" component={MainLayout} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
