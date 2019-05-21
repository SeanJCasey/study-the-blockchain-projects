import React, { Component } from 'react';
import { DrizzleContext } from "drizzle-react";

import AccountStatsBlock from '../components/AccountStatsBlock';
import ContractStatsBlock from "../components/ContractStatsBlock";

class StatsContainer extends Component {
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
              <div className="row">
                <div className="col-sm-6">
                  <AccountStatsBlock drizzle={drizzle} drizzleState={drizzleState} />
                </div>
                <div className="col-sm-6">
                  <ContractStatsBlock drizzle={drizzle} drizzleState={drizzleState} />
                </div>
              </div>
            </div>
          );
        }}
      </DrizzleContext.Consumer>

    );
  }
}

export default StatsContainer;
