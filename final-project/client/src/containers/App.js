import React, { Component } from 'react';
import { DrizzleContext } from "drizzle-react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Navbar from '../components/Navbar';
import CostAverageOrderBookPage from './CostAverageOrderBookPage';

class App extends Component {

  render() {
    return (
      <DrizzleContext.Consumer>
        {drizzleContext => {
          const { drizzle, drizzleState, initialized } = drizzleContext;

          if (!initialized) {
            return "Loading...";
          }

          return (
            <Router>
              <div className="App">
                <Navbar
                  drizzle={drizzle}
                  drizzleState={drizzleState}
                />

                <Route
                  path='/'
                  exact
                  render={(props) =>
                    <CostAverageOrderBookPage
                      {...props}
                      drizzle={drizzle}
                      drizzleState={drizzleState}
                    />}
                />
              </div>
            </Router>
          );
        }}
      </DrizzleContext.Consumer>
    )
  }
}

export default App;
