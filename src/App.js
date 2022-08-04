import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Login from './pages/Login';
import Wallet from './pages/Wallet';
import './App.css';

export default class Content extends Component {
  render() {
    return (
      <div id="App">
        <Switch>
          <Route exact path="/" component={ Login } />
          <Route pach="/carteira" component={ Wallet } />
        </Switch>
      </div>
    );
  }
}
