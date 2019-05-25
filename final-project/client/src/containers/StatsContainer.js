import React, { Component } from 'react';

import AccountStatsBlock from '../components/AccountStatsBlock';
import ContractStatsBlock from "../components/ContractStatsBlock";

class StatsContainer extends Component {
  render() {
    return (
      <div className="contractStatsContainer">
        <div className="row">
          <div className="col-sm-6">
            <AccountStatsBlock />
          </div>
          <div className="col-sm-6">
            <ContractStatsBlock />
          </div>
        </div>
      </div>
    );
  }
}

export default StatsContainer;
