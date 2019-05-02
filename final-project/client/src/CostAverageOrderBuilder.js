import React, { Component } from 'react';

class CostAverageOrderBuilder extends Component {
  constructor(props) {
    super(props);

    this.state = {
      'newOrderInputs': {
        'quantity': '',
        'tokenAddress': '',
        'frequency': '',
        'batches': ''
      },
      'newOrderStackId': ''
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    // const { drizzle, drizzleState } = this.props;

    // use web3 to get factory and exchange info?
    // drizzle.contracts contains the deployed contract info, e.g., address
    // const FactoryContract = drizzle.contracts.UniswapFactoryInterface;

    // let drizzle know we want to watch this var method
    // const exchangeKey = FactoryContract.methods['getExchange'].cacheCall(tokenAddress);
  }

  createCostAverageOrder() {
    const { drizzle, drizzleState } = this.props;
    const orderContract = drizzle.contracts.CostAverageOrderBook;

    console.log(drizzle);
    const amount = drizzle.web3.utils.toWei(String(this.state.newOrderInputs.quantity), 'ether');
    console.log(amount);
    // let drizzle know we want to call the `set` method with `value`
    const newOrderStackId = orderContract.methods['createCostAverageOrder'].cacheSend(
      amount,
      this.state.newOrderInputs.tokenAddress,
      Number(this.state.newOrderInputs.frequency),
      Number(this.state.newOrderInputs.batches),
      {
        from: drizzleState.accounts[0],
        value: amount
      }
    );

    // save the `stackId` for later reference
    this.setState({ newOrderStackId });
  }

  // from Drizzle docs
  getTxStatus() {
    // get the transaction states from the drizzle state
    const { transactions, transactionStack } = this.props.drizzleState;

    // get the transaction hash using our saved `stackId`
    const txHash = transactionStack[this.state.newOrderStackId];

    // if transaction hash does not exist, don't display anything
    if (!txHash) return null;

    // otherwise, return the transaction status
    return `Transaction status: ${transactions[txHash] && transactions[txHash].status}`;
  };

  handleInputChange(event) {
    this.setState({
      newOrderInputs: {
        ...this.state.newOrderInputs,
        [event.target.name]: event.target.value
      }
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    console.log(this.state.newOrderInputs);

    this.createCostAverageOrder()
  }

  render() {

    return (
      <div className="costAverageOrderBuilder">
        <h2>Create an Order</h2>
        <form id="createCostAverageOrderForm" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <input
              name="quantity"
              type="number"
              placeholder="No of ETH"
              className="form-control"
              id="createCostAverageOrderQuantityInput"
              onChange={this.handleInputChange}
            />
          </div>
          <div className="form-group">
            <input
              name="tokenAddress"
              type="text"
              placeholder="target ERC20 token"
              className="form-control"
              id="createCostAverageOrderTokenAddressInput"
              onChange={this.handleInputChange}
            />
          </div>
          <div className="form-group">
            <input
              name="frequency"
              type="number"
              placeholder="time interval"
              className="form-control"
              id="createCostAverageOrderFrequencyInput"
              onChange={this.handleInputChange}
            />
          </div>
          <div className="form-group">
            <input
              name="batches"
              type="number"
              placeholder="number of orders"
              className="form-control"
              id="createCostAverageOrderTranchesInput"
              onChange={this.handleInputChange}
            />
          </div>

          <button type="submit" className="btn btn-primary" id="createCostAverageOrderButton">Vulcanize!</button>
        </form>
        <div>{this.getTxStatus()}</div>
      </div>
    );
  }
}

export default CostAverageOrderBuilder;
