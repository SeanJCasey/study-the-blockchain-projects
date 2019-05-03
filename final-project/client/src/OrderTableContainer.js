import React from "react";
import { DrizzleContext } from "drizzle-react";

import OrderTable from "./OrderTable";

export default () => (
  <DrizzleContext.Consumer>
    {drizzleContext => {
      const { drizzle, drizzleState, initialized } = drizzleContext;

      if (!initialized) {
        return "Loading...";
      }

      return (
        <OrderTable drizzle={drizzle} drizzleState={drizzleState} />
      );
    }}
  </DrizzleContext.Consumer>
)

// import OrderTable from "./OrderTable";
// import { drizzleConnect } from "drizzle-react";

// const mapStateToProps = state => {
//     console.log(state);
//   return {
//     accounts: state.accounts,
//     CostAverageOrderBook: state.contracts.CostAverageOrderBook,
//     drizzleStatus: state.drizzleStatus,
//     // drizzleState: state.store.getState()
//   };
// };

// const OrderTableContainer = drizzleConnect(OrderTable, mapStateToProps);

// export default OrderTableContainer;
