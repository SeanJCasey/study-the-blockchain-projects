import React, { Component } from 'react';

class OrderConversionActions extends Component {

  constructor(props) {
    super(props);

    this.handleCoversionQueueClick = this.handleCoversionQueueClick.bind(this);
  }

  handleCoversionQueueClick() {
    // run conversion due function
    const contract = this.props.drizzle.contracts.CostAverageOrderBook;

    contract.methods.executeDueConversions().send()
      .then(res => console.log(res))
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div className="orderConversionActions">
          <button className="btn btn-primary" onClick={this.handleCoversionQueueClick}>Queue overdue conversions</button>
      </div>
    );
  }
}

export default OrderConversionActions;
