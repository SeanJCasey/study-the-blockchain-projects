import React, { Component } from 'react';
import { DrizzleContext } from "drizzle-react";

import OrderBuilderContainer from './OrderBuilderContainer';
import OrderTableContainer from './OrderTableContainer';

class CostAverageOrderApp extends Component {

  render() {
    return (
      <DrizzleContext.Consumer>
        {drizzleContext => {
          const { drizzle, drizzleState, initialized } = drizzleContext;

          if (!initialized) {
            return "Loading...";
          }

          return (
            <div className="App">
              <div className="container">
                <h1>Vulcanizer</h1>
                <OrderBuilderContainer drizzle={drizzle} drizzleState={drizzleState} />
                <OrderTableContainer />
              </div>
            </div>
          );
        }}
      </DrizzleContext.Consumer>
    )
  }
}

export default CostAverageOrderApp;
