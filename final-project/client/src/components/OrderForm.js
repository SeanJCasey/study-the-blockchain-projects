import React from 'react';
import { TOKENTABLE, TIMETABLE } from '../constants';

const OrderForm = ({ formErrors, onInputChange, onSubmit }) =>
  <form id="createCostAverageOrderForm" onSubmit={onSubmit}>
    <div className="form-group">
      <label htmlFor="createCostAverageOrderQuantityInput">Amount to Convert</label>
      <input
        name="quantity"
        type="text"
        placeholder="No of ETH"
        className={`form-control ${formErrors && formErrors.quantity ? 'is-invalid' : ''}`}
        id="createCostAverageOrderQuantityInput"
        onChange={onInputChange}
        required
      />
      {formErrors && formErrors.quantity &&
        <div className="invalid-feedback">
          {formErrors.quantity.message}
        </div>
      }
    </div>
    <div className="form-group">
      <label htmlFor="createCostAverageOrderTokenAddressInput">Target Currency</label>
      <select
        name="tokenAddress"
        className="form-control"
        id="createCostAverageOrderTokenAddressInput"
        onChange={onInputChange}
        defaultValue=""
        required
      >
        <option value="" disabled>Choose a currency...</option>
        {Object.keys(TOKENTABLE).map(address =>
          <option value={address} key={address}>{TOKENTABLE[address].name}</option>
        )}
      </select>
    </div>
    <div className="form-group">
      <label htmlFor="createCostAverageOrderFrequencyInput">Conversion Frequency</label>
      <select
        name="frequency"
        className="form-control"
        id="createCostAverageOrderFrequencyInput"
        onChange={onInputChange}
        defaultValue=""
        required
      >
        <option value="" disabled>Choose frequency...</option>
        {Object.keys(TIMETABLE).map(seconds =>
          <option value={seconds} key={seconds}>{TIMETABLE[seconds]}</option>
        )}
      </select>
    </div>
    <div className="form-group">
      <label htmlFor="createCostAverageOrderTranchesInput">Batches</label>
      <input
        name="batches"
        type="number"
        placeholder="number of orders"
        className={`form-control ${formErrors && formErrors.batches ? 'is-invalid' : ''}`}
        id="createCostAverageOrderTranchesInput"
        onChange={onInputChange}
        required
      />
      {formErrors && formErrors.batches &&
        <div className="invalid-feedback">
          {formErrors.batches.message}
        </div>
      }
    </div>

    <button type="submit" className="btn btn-primary" id="createCostAverageOrderButton">Vulcanize!</button>
  </form>

export default OrderForm;
