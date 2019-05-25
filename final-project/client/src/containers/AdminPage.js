import React, { Component } from 'react';
import { DrizzleContext } from "drizzle-react";

import AdminOptionsBlock from '../components/AdminOptionsBlock';

class AdminPage extends Component {
  render() {
    const { initialized } = this.context;

    if (!initialized) {
        return "Loading...";
    }

    return (
      <div className="adminPage">
        <div className="container">
          <h1>Admin Options</h1>
          <AdminOptionsBlock />
        </div>
      </div>
    );
  }
}

AdminPage.contextType = DrizzleContext.Context;

export default AdminPage;
