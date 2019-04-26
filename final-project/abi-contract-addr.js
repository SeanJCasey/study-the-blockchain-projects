const contract_address = "0x20E460f0003E6B4E023d035d2F9c53869Ecf2f0C";

const abi = [
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "idToCostAverageOrder",
    "outputs": [
      {
        "name": "owner",
        "type": "address"
      },
      {
        "name": "targetCurrency",
        "type": "address"
      },
      {
        "name": "amount",
        "type": "uint256"
      },
      {
        "name": "frequency",
        "type": "uint256"
      },
      {
        "name": "lastConversionTimestamp",
        "type": "uint256"
      },
      {
        "name": "sourceCurrencyBalance",
        "type": "uint256"
      },
      {
        "name": "targetCurrencyConverted",
        "type": "uint256"
      },
      {
        "name": "batches",
        "type": "uint8"
      },
      {
        "name": "batchesExecuted",
        "type": "uint8"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x5c70e154"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "id",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0xaf640d0f"
  },
  {
    "inputs": [
      {
        "name": "_uniswapFactoryAddress",
        "type": "address"
      }
    ],
    "payable": true,
    "stateMutability": "payable",
    "type": "constructor",
    "signature": "constructor"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_amount",
        "type": "uint256"
      },
      {
        "name": "_targetCurrency",
        "type": "address"
      },
      {
        "name": "_frequency",
        "type": "uint256"
      },
      {
        "name": "_batches",
        "type": "uint8"
      }
    ],
    "name": "createCostAverageOrder",
    "outputs": [
      {
        "name": "id_",
        "type": "uint256"
      }
    ],
    "payable": true,
    "stateMutability": "payable",
    "type": "function",
    "signature": "0x92365c7e"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_id",
        "type": "uint256"
      }
    ],
    "name": "getCostAverageOrder",
    "outputs": [
      {
        "name": "amount_",
        "type": "uint256"
      },
      {
        "name": "targetCurrency_",
        "type": "address"
      },
      {
        "name": "frequency_",
        "type": "uint256"
      },
      {
        "name": "batches_",
        "type": "uint8"
      },
      {
        "name": "batchesExecuted_",
        "type": "uint8"
      },
      {
        "name": "lastConversionTimestamp_",
        "type": "uint256"
      },
      {
        "name": "targetCurrencyConverted_",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x2c62a7ef"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_id",
        "type": "uint256"
      }
    ],
    "name": "checkConversionDue",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x838bac1e"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "executeDueConversions",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x2e84767e"
  }
]