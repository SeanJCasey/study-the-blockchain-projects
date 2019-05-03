import React from "react";
import { DrizzleContext } from "drizzle-react";

import OrderBuilder from "./OrderBuilder";

export default () => (
  <DrizzleContext.Consumer>
    {drizzleContext => {
      const { drizzle, drizzleState, initialized } = drizzleContext;

      if (!initialized) {
        return "Loading...";
      }

      return (
        <OrderBuilder drizzle={drizzle} drizzleState={drizzleState} />
      );
    }}
  </DrizzleContext.Consumer>
)



// import OrderBuilder from "./OrderBuilder";
// import { drizzleConnect } from "drizzle-react";

// const mapStateToProps = state => {
//   return {
//     accounts: state.accounts,
//     CostAverageOrderBook: state.contracts.CostAverageOrderBook,
//     drizzleStatus: state.drizzleStatus,
//     web3: state.web3
//   };
// };

// const OrderBuilderContainer = drizzleConnect(OrderBuilder, mapStateToProps);

// export default OrderBuilderContainer;
