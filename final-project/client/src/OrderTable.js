import React, { Component } from 'react';

import { TOKENTABLE, TIMETABLE } from './constants';

class OrderTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      'orderCountKey': null,
      'orderKeys': [],
    }
  }

  componentDidMount() {
    const { drizzle, drizzleState } = this.props;
    const contract = drizzle.contracts.CostAverageOrderBook;

    const orderCountKey = contract.methods["getOrderCountForOwner"].cacheCall(drizzleState.accounts[0]);

    this.setState({ orderCountKey });
  }

  componentDidUpdate() {
    this.getNewOrdersForUser();
  }

  getNewOrdersForUser() {
    const { drizzle, drizzleState } = this.props;
    const orderCount = drizzleState.contracts.CostAverageOrderBook.getOrderCountForOwner[this.state.orderCountKey];
    const { orderKeys } = this.state;

    if (orderCount && orderCount.value > orderKeys.length) {
      const newOrderKeys = []
      for (let i = orderKeys.length; i < orderCount.value; i++) {
        newOrderKeys.push(drizzle.contracts.CostAverageOrderBook.methods["getOrderForOwnerIndex"].cacheCall(drizzleState.accounts[0], i));
      }
      this.setState({ orderKeys: [...this.state.orderKeys, ...newOrderKeys] })
    }
  }

  render() {
    const { drizzle, drizzleState } = this.props;
    const { orderKeys } = this.state;

    let orders = [];
    for (const orderKey of orderKeys) {
      const order = drizzleState.contracts.CostAverageOrderBook.getOrderForOwnerIndex[orderKey];
      if (order) {
        orders.push(
          {
            'id': order.value.id_,
            'amount': drizzle.web3.utils.fromWei(order.value.amount_, 'ether'),
            'targetCurrency': order.value.targetCurrency_,
            'frequency': order.value.frequency_,
            'batches': order.value.batches_
          }
        );
      }
    }

    return (
      <div className="orderTable">
        <h2>Your Orders</h2>
        <p>Account {drizzleState.accounts[0]}</p>
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Order #</th>
              <th scope="col">No of ETH</th>
              <th scope="col">Target Token</th>
              <th scope="col">Frequency</th>
              <th scope="col">Batches</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, i) => {
              return (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.amount}</td>
                  <td>{TOKENTABLE[order.targetCurrency] ? TOKENTABLE[order.targetCurrency].name : order.targetCurrency}</td>
                  <td>{TIMETABLE[order.frequency] ? TIMETABLE[order.frequency] : `${order.frequency} seconds `}</td>
                  <td>{order.batches}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default OrderTable;
