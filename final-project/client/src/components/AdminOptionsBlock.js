import React, { Component } from 'react';
import { DrizzleContext } from "drizzle-react";
import { newContextComponents } from "drizzle-react-components";

class AdminOptionsBlock extends Component {
  render() {
    const { ContractData, ContractForm } = newContextComponents;
    const { drizzle, drizzleState } = this.context;

    return (
      <div className="adminOptionsBlock">

        <div className="section">
          <h2>Fees and Balance</h2>
          <div className="withdrawFees">
            <h3>Withdraw Fees</h3>
            <strong>Fee Balance: </strong>
            <ContractData
              contract="CostAverageOrderBook"
              method="getFeeBalance"
              render={value => `${parseFloat(drizzle.web3.utils.fromWei(value, 'ether')).toFixed(4)} ETH`}
              drizzle={drizzle}
              drizzleState={drizzleState}
            />
            <ContractForm
              contract="CostAverageOrderBook"
              method="withdrawFees"
              drizzle={drizzle}
              drizzleState={drizzleState}
            />
          </div>
        </div>

        <div className="section">
          <h2>Access and Ownership</h2>
          <div className="owner">
            <h3>Transfer Ownership</h3>
            <ContractForm
              contract="CostAverageOrderBook"
              method="transferOwnership"
              drizzle={drizzle}
              drizzleState={drizzleState}
            />
          </div>
          <div className="remote-caller">
            <h3>Change Remote Caller</h3>
            <ContractForm
              contract="CostAverageOrderBook"
              method="setRemoteCaller"
              drizzle={drizzle}
              drizzleState={drizzleState}
            />
          </div>
        </div>

        <div className="section">
          <h2>Min/max values</h2>
          <div className="amount">
            <h3>Amount</h3>
            <strong>Min: </strong>
            <ContractData
              contract="CostAverageOrderBook"
              method="minAmount"
              render={value => `${value} wei (${parseFloat(drizzle.web3.utils.fromWei(value, 'ether')).toFixed(4)} ETH)`}
              drizzle={drizzle}
              drizzleState={drizzleState}
            />
            <ContractForm
              contract="CostAverageOrderBook"
              method="setMinAmount"
              labels={['in wei']}
              drizzle={drizzle}
              drizzleState={drizzleState}
            />
          </div>
          <div className="batches">
            <h3>Batches</h3>
            <strong>Min: </strong>
            <ContractData
              contract="CostAverageOrderBook"
              method="minBatches"
              drizzle={drizzle}
              drizzleState={drizzleState}
            />
            <ContractForm
              contract="CostAverageOrderBook"
              method="setMinBatches"
              drizzle={drizzle}
              drizzleState={drizzleState}
            />
            <strong>Max: </strong>
            <ContractData
              contract="CostAverageOrderBook"
              method="maxBatches"
              drizzle={drizzle}
              drizzleState={drizzleState}
            />
            <ContractForm
              contract="CostAverageOrderBook"
              method="setMaxBatches"
              drizzle={drizzle}
              drizzleState={drizzleState}
            />
          </div>
          <div className="frequency">
            <h3>Frequency</h3>
            <strong>Min: </strong>
            <ContractData
              contract="CostAverageOrderBook"
              method="minFrequency"
              render={value => `${value} secs`}
              drizzle={drizzle}
              drizzleState={drizzleState}
            />
            <ContractForm
              contract="CostAverageOrderBook"
              method="setMinFrequency"
              labels={['in secs']}
              drizzle={drizzle}
              drizzleState={drizzleState}
            />
          </div>

        </div>

      </div>
    );
  }
}

AdminOptionsBlock.contextType = DrizzleContext.Context;

export default AdminOptionsBlock;
