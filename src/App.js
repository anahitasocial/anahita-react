import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {

      let title = "Welcome to Anahita React"
      let description = "This project is a front-end for Anahita. We've just started this repository. Give us some time to finish this app"

    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>{title}</h2>
        </div>
        <p className="App-intro">
          {description}
        </p>
      </div>
    );
  }
}

export default App;
