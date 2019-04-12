var contract_address = "0xD142e3BBf8BaE452bf9a514Ad931c7F2904543Da";

var abi = [
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "name": "addressToRecord",
      "outputs": [
        {
          "name": "problems",
          "type": "string"
        },
        {
          "name": "medications",
          "type": "string"
        },
        {
          "name": "allergies",
          "type": "string"
        },
        {
          "name": "weight",
          "type": "uint16"
        },
        {
          "name": "height",
          "type": "uint16"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function",
      "signature": "0xf94e83ed"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_problems",
          "type": "string"
        },
        {
          "name": "_medications",
          "type": "string"
        },
        {
          "name": "_allergies",
          "type": "string"
        },
        {
          "name": "_weight",
          "type": "uint16"
        },
        {
          "name": "_height",
          "type": "uint16"
        }
      ],
      "name": "createRecord",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x4c56b210"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_problems",
          "type": "string"
        }
      ],
      "name": "updateRecordProblems",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x96992fb7"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_medications",
          "type": "string"
        }
      ],
      "name": "updateRecordMedications",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0xe99e1ef7"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_allergies",
          "type": "string"
        }
      ],
      "name": "updateRecordAllergies",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x5b1a5647"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_weight",
          "type": "uint16"
        }
      ],
      "name": "updateRecordWeight",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0xc29a12c6"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_height",
          "type": "uint16"
        }
      ],
      "name": "updateRecordHeight",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x0742f993"
    }
]