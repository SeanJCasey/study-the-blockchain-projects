import React, { Component } from 'react';
import { Link } from "react-router-dom";

class Navbar extends Component {
  render() {
    return (
      <nav className="navbar navbar-dark bg-dark">
        <div className="container">
          <Link to={'/'} className="navbar-brand">Vulcanizer</Link>
          <div className="admin-links">
            <div className="account-info">
              <Link
                to={'/admin'}
              >
              Admin
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }
}

export default Navbar;
