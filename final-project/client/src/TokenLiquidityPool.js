import React, { Component } from 'react';

class TokenLiquidityPool extends Component {
  state = { exchangeKey: null };

  componentDidMount() {
    // const { drizzle, drizzleState } = this.props;
    this.updateExchange();

    // use web3 to get factory and exchange info?
    // drizzle.contracts contains the deployed contract info, e.g., address
    // const FactoryContract = drizzle.contracts.UniswapFactoryInterface;

    // let drizzle know we want to watch this var method
    // const exchangeKey = FactoryContract.methods['getExchange'].cacheCall(tokenAddress);
  }

  componentDidUpdate(prevProps) {
    // TODO: should token go in DrizzleState?
    if (this.props.tokenAddress !== prevProps.tokenAddress) {
      this.updateExchange();
    }
  }

  updateExchange() {
    const { drizzle, drizzleState } = this.props;

    const tokenAddress = '0xDc91e91b28B8200EA836E27f8a8416E665E22d17';
    const factory = drizzle.contracts.UniswapFactoryInterface;
    const exchangeAddress = factory.methods['getExchange'].cacheCall(tokenAddress);

    console.log(exchangeAddress);

    this.setState({ exchangeKey: exchangeAddress });
  }

  render() {
    // drizzleState.contracts just contains the interface
    const { drizzle, drizzleState } = this.props;
    const { UniswapFactoryInterface } = drizzleState.contracts;

    console.log(this.state.exchangeKey);
    const exchangeAddress = UniswapFactoryInterface.getExchange[this.state.exchangeKey];
    console.log(exchangeAddress);

    return (
      <div className="TokenLiquidityPool">
        <p>Factory address is: { this.props.drizzle.contracts.UniswapFactoryInterface.address }</p>
        <p>Exchange address is: {exchangeAddress.value} </p>
      </div>
    );
  }
}

export default TokenLiquidityPool;
