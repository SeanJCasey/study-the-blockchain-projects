import React, { Component } from 'react';
import { DrizzleContext } from "drizzle-react";

import OrderTable from "./OrderTable";

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
            </div>
          );
        }}
      </DrizzleContext.Consumer>

    );
  }
}

export default OrderTableContainer;
