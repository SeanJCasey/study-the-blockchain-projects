import React, { Component } from 'react';

import { TOKENTABLE, TIMETABLE } from '../constants';
import { dateObjDisplayFormatter } from '../utils';

class OrderTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      'orderCountKey': null,
      'orderKeys': [],
    }

    this.handleCancelOrderClick = this.handleCancelOrderClick.bind(this);
  }

  componentDidMount() {
    const { drizzle, drizzleState } = this.props;
    const contract = drizzle.contracts.CostAverageOrderBook;

    const orderCountKey = contract.methods["getOrderCountForAccount"].cacheCall(drizzleState.accounts[0]);

    this.setState({ orderCountKey });
  }

  componentDidUpdate() {
    this.getNewOrdersForUser();
  }

  getNewOrdersForUser() {
    const { drizzle, drizzleState } = this.props;
    const orderCount = drizzleState.contracts.CostAverageOrderBook.getOrderCountForAccount[this.state.orderCountKey];
    const { orderKeys } = this.state;

    if (orderCount && orderCount.value > orderKeys.length) {
      const newOrderKeys = []
      for (let i = orderKeys.length; i < orderCount.value; i++) {
        newOrderKeys.push(drizzle.contracts.CostAverageOrderBook.methods["getOrderForAccountIndex"].cacheCall(drizzleState.accounts[0], i));
      }
      this.setState({ orderKeys: [...this.state.orderKeys, ...newOrderKeys] })
    }
  }

  handleCancelOrderClick(event) {
    const orderId = event.target.value;
    const contract = this.props.drizzle.contracts.CostAverageOrderBook;

    contract.methods.cancelOrder(orderId).send()
      .then(res => console.log(res))
      .catch(err => console.log(err));
  }

  render() {
    const { drizzle, drizzleState } = this.props;
    const { orderKeys } = this.state;

    let orders = [];
    let ordersFinished = [];
    for (const orderKey of orderKeys) {
      const orderState = drizzleState.contracts.CostAverageOrderBook.getOrderForAccountIndex[orderKey];
      if (orderState) {
        const order = {
          'id': orderState.value.id_,
          'amount': drizzle.web3.utils.fromWei(orderState.value.amount_, 'ether'),
          'targetCurrency': orderState.value.targetCurrency_,
          'frequency': Number(orderState.value.frequency_),
          'batches': Number(orderState.value.batches_),
          'batchesExecuted': Number(orderState.value.batchesExecuted_),
          'targetCurrencyConverted': Number(orderState.value.targetCurrencyConverted_),
          'lastConversionTimestamp': Number(orderState.value.lastConversionTimestamp_),
          'sourceCurrencyBalance': Number(orderState.value.sourceCurrencyBalance_)
        }
        order['nextConversionTimestamp'] = order['lastConversionTimestamp'] > 0 ? order['lastConversionTimestamp'] + order['frequency'] : 0;
        order['isActive'] = order['sourceCurrencyBalance'] > 0;
        order['isActive'] ? orders.push(order) : ordersFinished.push(order);
      }
    }
    const activeOrderMap = orders.map((order, i) => {
      return (
        <tr key={order.id}>
          <td>{order.id}</td>
          <td>{order.amount}</td>
          <td>{TOKENTABLE[order.targetCurrency] ? TOKENTABLE[order.targetCurrency].name : order.targetCurrency}</td>
          <td>{TIMETABLE[order.frequency] ? TIMETABLE[order.frequency] : `${order.frequency} seconds `}</td>
          <td>{order.batchesExecuted} / {order.batches}</td>
          <td>{order.targetCurrencyConverted} {TOKENTABLE[order.targetCurrency] ? TOKENTABLE[order.targetCurrency].symbol : ""}</td>
          <td>{order.lastConversionTimestamp > 0 ? dateObjDisplayFormatter(new Date(order.lastConversionTimestamp * 1000)) : "n/a"}</td>
          <td>{order.nextConversionTimestamp > 0 ? dateObjDisplayFormatter(new Date(order.nextConversionTimestamp * 1000)) : "overdue!"}</td>
          <td>
            <button
              className="btn btn-outline-danger btn-sm"
              value={order.id}
              style={{ padding: "0px 5px" }}
              onClick={this.handleCancelOrderClick}
            >
              Cancel
            </button>
          </td>
        </tr>
      );
    })
    const archivedOrderMap = ordersFinished.map((order, i) => {
      return (
        <tr key={order.id}>
          <td>{order.id}</td>
          <td>{order.amount}</td>
          <td>{TOKENTABLE[order.targetCurrency] ? TOKENTABLE[order.targetCurrency].name : order.targetCurrency}</td>
          <td>{TIMETABLE[order.frequency] ? TIMETABLE[order.frequency] : `${order.frequency} seconds `}</td>
          <td>{order.batchesExecuted} / {order.batches}</td>
          <td>{order.targetCurrencyConverted} {TOKENTABLE[order.targetCurrency] ? TOKENTABLE[order.targetCurrency].symbol : ""}</td>
          <td>{order.lastConversionTimestamp > 0 ? dateObjDisplayFormatter(new Date(order.lastConversionTimestamp * 1000)) : "n/a"}</td>
          <td>{order.batchesExecuted < order.batches ? 'cancelled' : 'completed'}</td>
        </tr>
      );
    })

    if (!(orders.length > 0 || ordersFinished.length > 0)) return(<div></div>);

    return (
      <div className="orderTables">
        {orders.length > 0 &&
          <div className="active-orders">
            <h3>Active Orders</h3>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">Order #</th>
                  <th scope="col">No of ETH</th>
                  <th scope="col">Target Token</th>
                  <th scope="col">Frequency</th>
                  <th scope="col">Batches</th>
                  <th scope="col">Converted</th>
                  <th scope="col">Last Trade</th>
                  <th scope="col">Next Trade</th>
                </tr>
              </thead>
              <tbody>
                {activeOrderMap}
              </tbody>
            </table>
          </div>
        }
        {ordersFinished.length > 0 &&
          <div className="archived-orders">
          <h3>Archived Orders</h3>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">Order #</th>
                  <th scope="col">No of ETH</th>
                  <th scope="col">Target Token</th>
                  <th scope="col">Frequency</th>
                  <th scope="col">Batches</th>
                  <th scope="col">Converted</th>
                  <th scope="col">Last Trade</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {archivedOrderMap}
              </tbody>
            </table>
          </div>
        }
      </div>
    );
  }
}

export default OrderTable;
