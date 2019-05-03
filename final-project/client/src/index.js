import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
// import './index.css';
import App from './App';

import { Drizzle, generateStore } from "drizzle";
import { DrizzleContext } from "drizzle-react";
import drizzleOptions from "./drizzleOptions";

const drizzleStore = generateStore(drizzleOptions);
const drizzle = new Drizzle(drizzleOptions, drizzleStore);

ReactDOM.render(
  (<DrizzleContext.Provider drizzle={drizzle}>
    <App />
  </DrizzleContext.Provider>),
  document.getElementById('root')
);
