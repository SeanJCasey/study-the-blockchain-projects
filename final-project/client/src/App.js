import React, { Component } from 'react';

import CostAverageOrderBuilder from './CostAverageOrderBuilder';

class App extends Component {
  // TODO: move 'token' to another component
  state = {
    loading: true,
    drizzleState: null,
    tokenAddress: '0xDc91e91b28B8200EA836E27f8a8416E665E22d17'
  };

  componentDidMount() {
    const { drizzle } = this.props;

    // subscribe to changes in the store
    this.unsubscribe = drizzle.store.subscribe(() => {

      // every time the store updates, grab the state from drizzle
      const drizzleState = drizzle.store.getState();

      // check to see if it's ready, if so, update local component state
      if (drizzleState.drizzleStatus.initialized) {
        this.setState({ loading: false, drizzleState });
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    if (this.state.loading) return "Loading Drizzle...";
    return (
      <div className="App">
        <h1>Vulcan Trade</h1>
        <CostAverageOrderBuilder
          drizzle={this.props.drizzle}
          drizzleState={this.state.drizzleState}
        />
      </div>
    );
  }
}

export default App;
