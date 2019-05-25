import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import Navbar from '../components/Navbar';
import AdminPage from './AdminPage';
import CostAverageOrderBookPage from './CostAverageOrderBookPage';

class App extends Component {

  render() {
    return (
      <Router>
        <div className="App">
          <Navbar />
          <Route
            path='/'
            exact
            component={CostAverageOrderBookPage}
          />
          <Route
            path='/admin'
            exact
            component={AdminPage}
          />
        </div>
      </Router>
    );
  }
}

export default App;
