import React, { Component } from 'react';
import { DrizzleContext } from "drizzle-react";

import OrderConversionActions from "../components/OrderConversionActions";
import OrderTable from "../components/OrderTable";

class OrderTableContainer extends Component {
  render() {
    return (
      <DrizzleContext.Consumer>
        {drizzleContext => {
          const { drizzle, drizzleState, initialized } = drizzleContext;

          if (!initialized) {
            return "Loading...";
          }

          return (
            <div className="orderTableContainer">
              <OrderTable drizzle={drizzle} drizzleState={drizzleState} />
              <OrderConversionActions drizzle={drizzle} drizzleState={drizzleState} />
            </div>
          );
        }}
      </DrizzleContext.Consumer>

    );
  }
}

export default OrderTableContainer;
