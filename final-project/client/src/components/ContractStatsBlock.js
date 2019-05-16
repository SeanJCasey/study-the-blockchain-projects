import React, { Component } from 'react';

class ContractStatsBlock extends Component {

  constructor(props) {
    super(props);

    this.state = {
      feesCollectedKey: null,
      orderIdKey: null,
      contractBalance: 0,
    }
  }

  componentDidMount() {
    const { drizzle } = this.props;
    const contract = drizzle.contracts.CostAverageOrderBook;

    const feesCollectedKey = contract.methods["getTotalFeesCollected"].cacheCall();
    const orderIdKey = contract.methods["id"].cacheCall();

    drizzle.web3.eth.getBalance(contract.address)
      .then(contractBalance => {
        this.setState({ feesCollectedKey, orderIdKey, contractBalance });
      })
  }

  render() {
    const { feesCollectedKey, orderIdKey, contractBalance } = this.state;
    const { drizzle, drizzleState } = this.props;

    const feesCollected = drizzleState.contracts.CostAverageOrderBook.getTotalFeesCollected[feesCollectedKey];
    const nextOrderId = drizzleState.contracts.CostAverageOrderBook.id[orderIdKey];

    return (
      <div className="contractStatsBlock">
        <div className="orders">
          Orders created: {nextOrderId && nextOrderId.value}
        </div>
        <div className="conversions">
          Trades executed:
        </div>
        <div className="balance">
          ETH under management: {drizzle.web3.utils.fromWei(contractBalance.toString(), 'ether')} ETH
        </div>
        <div className="fees">
          Fees collected: {feesCollected && drizzle.web3.utils.fromWei(feesCollected.value, 'ether')} ETH
        </div>
      </div>
    );
  }
}

export default ContractStatsBlock;
