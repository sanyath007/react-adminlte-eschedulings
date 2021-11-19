import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import MainLayout from './layouts/MainLayout';
import Signin from './views/Signin';
import Signup from './views/Signup';
import './App.css';

function App() {
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
