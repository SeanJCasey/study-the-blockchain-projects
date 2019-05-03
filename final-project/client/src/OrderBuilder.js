import React, { Component } from 'react';
// import PropTypes from 'prop-types';

class CostAverageOrderBuilder extends Component {
  constructor(props) {
    super(props);

    this.state = {
      'newOrderInputs': {
        'tokenAddress': '0xDc91e91b28B8200EA836E27f8a8416E665E22d17',
        'quantity': '',
        'frequency': '',
        'batches': ''
      },
      'newOrderStackId': ''
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  createOrder() {
    const { drizzle, drizzleState } = this.props;
    const contract = drizzle.contracts.CostAverageOrderBook;

    const amount = drizzle.web3.utils.toWei(String(this.state.newOrderInputs.quantity), 'ether');

    const newOrderStackId = contract.methods["createOrder"].cacheSend(
      amount,
      this.state.newOrderInputs.tokenAddress,
      Number(this.state.newOrderInputs.frequency),
      Number(this.state.newOrderInputs.batches),
      { from: drizzleState.accounts[0], value: amount }
    );

    this.setState({ newOrderStackId });
  }

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

    this.createOrder()
  }

  render() {

    return (
      <div className="costAverageOrderBuilder">
        <h2>Create an Order</h2>
        <form id="createCostAverageOrderForm" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <input
              name="quantity"
              type="text"
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
      </div>
    );
  }
}

// CostAverageOrderBuilder.contextTypes = {
//   drizzle: PropTypes.object
// }

export default CostAverageOrderBuilder;
