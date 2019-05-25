import React, { Component } from 'react';
import { DrizzleContext } from "drizzle-react";

class AccountStatsBlock extends Component {

  constructor(props) {
    super(props);

    this.state = {
      ethBalance: 0,
      seanTokenBalanceKey: null,
      moonTokenBalanceKey: null,
      consensysTokenBalanceKey: null
    }
  }

  componentDidMount() {
    const { drizzle, drizzleState } = this.context;
    const account = drizzleState.accounts[0];

    drizzle.web3.eth.getBalance(account)
      .then(ethBalance => {
        this.setState({ ethBalance });
      })

    const seanTokenContract = drizzle.contracts.SeanToken;
    const moonTokenContract = drizzle.contracts.MoonToken;
    const consensysTokenContract = drizzle.contracts.ConsensysToken;

    const seanTokenBalanceKey = seanTokenContract.methods["balanceOf"].cacheCall(account);
    const moonTokenBalanceKey = moonTokenContract.methods["balanceOf"].cacheCall(account);
    const consensysTokenBalanceKey = consensysTokenContract.methods["balanceOf"].cacheCall(account);
    this.setState({ seanTokenBalanceKey, moonTokenBalanceKey, consensysTokenBalanceKey });
  }

  componentDidUpdate() {
    const { drizzle, drizzleState } = this.context;

    drizzle.web3.eth.getBalance(drizzleState.accounts[0])
      .then(ethBalance => {
        this.setState({ ethBalance });
      })
  }

  render() {
    const { ethBalance, seanTokenBalanceKey, moonTokenBalanceKey, consensysTokenBalanceKey } = this.state;
    const { drizzle, drizzleState } = this.context;

    const seanTokenBalance = drizzleState.contracts.SeanToken.balanceOf[seanTokenBalanceKey];
    const moonTokenBalance = drizzleState.contracts.MoonToken.balanceOf[moonTokenBalanceKey];
    const consensysTokenBalance = drizzleState.contracts.ConsensysToken.balanceOf[consensysTokenBalanceKey];

    return (
      <div className="accountStatsBlock">
        <strong>Your account</strong>
        <div className="address">
          {drizzleState.accounts[0]}
        </div>
        <div className="balance">
          ETH available: {drizzle.web3.utils.fromWei(ethBalance.toString(), 'ether')} ETH
        </div>
        <div className="sjc-balance">
          SJC balance: {seanTokenBalance && seanTokenBalance.value} SJC
        </div>
        <div className="mnu-balance">
          MNU balance: {moonTokenBalance && moonTokenBalance.value} MNU
        </div>
        <div className="lub-balance">
          LUB balance: {consensysTokenBalance && consensysTokenBalance.value} LUB
        </div>
      </div>
    );
  }
}

AccountStatsBlock.contextType = DrizzleContext.Context;

export default AccountStatsBlock;
