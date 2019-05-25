import React, { Component } from 'react';

import StatsContainer from './StatsContainer';
import OrderBuilderContainer from './OrderBuilderContainer';
import OrderTableContainer from './OrderTableContainer';

class CostAverageOrderBookPage extends Component {
  render() {
    return (
      <div className="costAverageOrderBook">
        <div className="container">
          <h1>Ethereum Cost Average Orders</h1>
          <StatsContainer />
          <OrderBuilderContainer drizzle={this.props.drizzle} drizzleState={this.props.drizzleState} />
          <OrderTableContainer />
        </div>
      </div>
    );
  }
}

export default CostAverageOrderBookPage;
