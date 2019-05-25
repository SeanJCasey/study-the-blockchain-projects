import React, { Component } from 'react';
import { DrizzleContext } from "drizzle-react";

import StatsContainer from './StatsContainer';
import OrderBuilderContainer from './OrderBuilderContainer';
import OrderTableContainer from './OrderTableContainer';

class CostAverageOrderBookPage extends Component {
  render() {
    const { initialized } = this.context;

    if (!initialized) {
        return "Loading...";
    }

    return (
      <div className="costAverageOrderBook">
        <div className="container">
          <h1>Ethereum Cost Average Orders</h1>
          <StatsContainer />
          <OrderBuilderContainer />
          <OrderTableContainer />
        </div>
      </div>
    );
  }
}

CostAverageOrderBookPage.contextType = DrizzleContext.Context;

export default CostAverageOrderBookPage;
