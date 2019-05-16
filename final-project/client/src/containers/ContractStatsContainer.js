import React, { Component } from 'react';
import { DrizzleContext } from "drizzle-react";

import ContractStatsBlock from "../components/ContractStatsBlock";

class ContractStatsContainer extends Component {
  render() {
    return (
      <DrizzleContext.Consumer>
        {drizzleContext => {
          const { drizzle, drizzleState, initialized } = drizzleContext;

          if (!initialized) {
            return "Loading...";
          }

          return (
            <div className="contractStatsContainer">
              <ContractStatsBlock drizzle={drizzle} drizzleState={drizzleState} />
            </div>
          );
        }}
      </DrizzleContext.Consumer>

    );
  }
}

export default ContractStatsContainer;
