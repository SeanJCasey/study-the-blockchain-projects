import React, { Component } from 'react';
import { DrizzleContext } from "drizzle-react";

import ContractStatsContainer from './ContractStatsContainer';
import OrderBuilderContainer from './OrderBuilderContainer';
import OrderTableContainer from './OrderTableContainer';

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
            <div className="App">
              <div className="container">
                <h1>Vulcanizer</h1>
                <ContractStatsContainer />
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

export default App;
