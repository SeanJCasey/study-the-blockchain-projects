import React, { Component } from 'react';

import OrderForm from "../components/OrderForm";
import TokenLiquidityBlock from "../components/TokenLiquidityBlock";


class OrderBuilderContainer extends Component {

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

    this.createOrder()
  }

  render() {
    return (
      <div className="orderBuilderContainer">
        <h2>Create an Order</h2>
        <div className="row">
          <div className="col-sm-8">
            <OrderForm
              onSubmit={this.handleSubmit}
              onInputChange={this.handleInputChange}
            />
          </div>
          <div className="col-sm-4">
            <TokenLiquidityBlock
              drizzle={this.props.drizzle}
              drizzleState={this.props.drizzleState}
              targetTokenAddress={this.state.newOrderInputs.tokenAddress}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default OrderBuilderContainer;
