import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Login from './views/Login';
import Register from './views/Register';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/login" name="Login Page" render={props => <Login {...props} />} />
        <Route exact path="/register" name="Register Page" render={props => <Register {...props} />} />
        <Route path="/" name="Home" render={props => <MainLayout {...props} />} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
