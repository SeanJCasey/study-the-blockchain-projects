import React, { Component } from 'react';
import { TOKENTABLE, TIMETABLE } from './constants';

class CostAverageOrderBuilder extends Component {
  constructor(props) {
    super(props);

    this.state = {
      'newOrderInputs': {
        'tokenAddress': '',
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
            <label htmlFor="createCostAverageOrderQuantityInput">Amount to Convert</label>
            <input
              name="quantity"
              type="text"
              placeholder="No of ETH"
              className="form-control"
              id="createCostAverageOrderQuantityInput"
              onChange={this.handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="createCostAverageOrderTokenAddressInput">Target Currency</label>
            <select
              name="tokenAddress"
              className="form-control"
              id="createCostAverageOrderTokenAddressInput"
              onChange={this.handleInputChange}
              defaultValue=""
              required
            >
              <option value="" disabled>Choose a currency...</option>
              {Object.keys(TOKENTABLE).map(address =>
                <option value={address} key={address}>{TOKENTABLE[address].name}</option>
              )}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="createCostAverageOrderFrequencyInput">Conversion Frequency</label>
            <select
              name="frequency"
              className="form-control"
              id="createCostAverageOrderFrequencyInput"
              onChange={this.handleInputChange}
              defaultValue=""
              required
            >
              <option value="" disabled>Choose frequency...</option>
              {Object.keys(TIMETABLE).map(seconds =>
                <option value={seconds} key={seconds}>{TIMETABLE[seconds]}</option>
              )}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="createCostAverageOrderTranchesInput">Batches</label>
            <input
              name="batches"
              type="number"
              placeholder="number of orders"
              className="form-control"
              id="createCostAverageOrderTranchesInput"
              onChange={this.handleInputChange}
              required
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
