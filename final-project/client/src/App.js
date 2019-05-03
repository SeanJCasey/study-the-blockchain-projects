import React, { Component } from 'react';

import OrderBuilderContainer from './OrderBuilderContainer';
import OrderTableContainer from './OrderTableContainer';

class App extends Component {

  render() {
    return (
      <div className="App">
        <div className="container">
          <h1>Vulcanizer</h1>
          <OrderTableContainer />
          <OrderBuilderContainer />
        </div>
      </div>
    );
  }
}

export default App;
