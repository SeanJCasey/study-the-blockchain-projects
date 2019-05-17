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
      'newOrderStackId': '',
      'orderParamLimitsKey': null,
      'formErrors': {}
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const { drizzle } = this.props;
    const contract = drizzle.contracts.CostAverageOrderBook;
    const orderParamLimitsKey = contract.methods["getOrderParamLimits"].cacheCall();

    this.setState({ orderParamLimitsKey });
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

  handleFormValidation() {
    const { orderParamLimitsKey } = this.state;
    const { drizzle, drizzleState } = this.props;
    const orderParamLimits = drizzleState.contracts.CostAverageOrderBook.getOrderParamLimits[orderParamLimitsKey];

    const formErrors = {};

    const minAmount = drizzle.web3.utils.fromWei(String(orderParamLimits.value.minAmount_), 'ether');
    const minBatches = orderParamLimits.value.minBatches_;

    if (this.state.newOrderInputs.quantity < minAmount) formErrors['quantity'] = { message: `Must be greater than ${minAmount} ETH` };
    if (this.state.newOrderInputs.batches < minBatches) formErrors['batches'] = { message: `Must be greater than ${minBatches}` };

    return formErrors;
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

    const formErrors = this.handleFormValidation();

    if (Object.keys(formErrors).length) {
      this.setState({ formErrors });
    }
    else {
      this.createOrder();
    }
  }

  render() {
    return (
      <div className="orderBuilderContainer">
        <h2>Create an Order</h2>
        <div className="row">
          <div className="col-sm-8">
            <OrderForm
              formErrors={this.state.formErrors}
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
