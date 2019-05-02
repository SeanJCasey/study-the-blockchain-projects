import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
// import * as serviceWorker from './serviceWorker';

// import drizzle functions and contract artifact
import { Drizzle } from "drizzle";
import CostAverageOrderBook from "./contracts/CostAverageOrderBook.json";
import UniswapFactoryInterface from "./contracts/UniswapFactoryInterface.json";

// import web3
import Web3 from 'web3';

const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
// web3.eth.getAccounts().then(console.log);

// TODO: create environment vars to set this dynamically
const uniswapFactoryAddress = '0x89bD7AEf4aD2089567831e09038886B355B42d48';


// let drizzle know what contracts we want and how to access our test blockchain
const options = {
  contracts: [
    CostAverageOrderBook,
    {
        contractName: 'UniswapFactoryInterface',
        web3Contract: new web3.eth.Contract(
            UniswapFactoryInterface.abi,
            uniswapFactoryAddress,
            {data: 'deployedBytecode' }
        )
    }
  ],
  web3: {
    fallback: {
      type: "ws",
      url: "ws://127.0.0.1:7545",
    },
  },
};

// setup drizzle
const drizzle = new Drizzle(options);

ReactDOM.render(<App drizzle={drizzle} />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
