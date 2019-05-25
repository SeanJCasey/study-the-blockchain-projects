import React, { Component } from 'react';
import { DrizzleContext } from "drizzle-react";

import OrderTable from "../components/OrderTable";

class OrderTableContainer extends Component {
  render() {
    const { drizzle, drizzleState } = this.context;

    return (
      <div className="orderTableContainer">
        <OrderTable drizzle={drizzle} drizzleState={drizzleState} />
      </div>
    );
  }
}

OrderTableContainer.contextType = DrizzleContext.Context;

export default OrderTableContainer;
