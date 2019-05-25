import React, { Component } from 'react';
import { DrizzleContext } from "drizzle-react";

class OrderConversionActions extends Component {

  constructor(props) {
    super(props);

    this.handleCoversionQueueClick = this.handleCoversionQueueClick.bind(this);
  }

  handleCoversionQueueClick() {
    const { drizzle } = this.context;
    const contract = drizzle.contracts.CostAverageOrderBook;

    contract.methods.executeDueConversions().send()
      .then(res => console.log(res))
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div className="orderConversionActions">
          <button className="btn btn-primary" onClick={this.handleCoversionQueueClick}>Queue overdue conversions</button>
      </div>
    );
  }
}

OrderConversionActions.contextType = DrizzleContext.Context;

export default OrderConversionActions;
