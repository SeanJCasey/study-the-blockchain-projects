import CostAverageOrderBook from "./contracts/CostAverageOrderBook.json";
import UniswapFactoryInterface from "./contracts/UniswapFactoryInterface.json";

import Web3 from 'web3';
const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");

const uniswapFactoryAddress = '0x89bD7AEf4aD2089567831e09038886B355B42d48';

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
  // events: {
  //   SimpleStorage: ["StorageSet"],
  // },
  // polls: {
  //   accounts: 1500,
  // },
  web3: {
    fallback: {
      type: "ws",
      url: "ws://127.0.0.1:7545",
    },
  },
};

export default options;
