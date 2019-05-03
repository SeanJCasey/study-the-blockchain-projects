pragma solidity ^0.5.2;

// import safemath & use for division calc

import './UniswapFactoryInterface.sol';
import './UniswapExchangeInterface.sol';

contract CostAverageOrderBook {
    uint256 public id;
    // address private remoteCaller; // TODO

    // address internal uniswapFactoryAddress;
    UniswapFactoryInterface internal factory;

    struct OrderInfo {
        address owner;
        address targetCurrency;
        // address contribCurrency; // either ETH or DAI // consider enum
        uint256 amount;
        uint256 frequency; // in seconds
        uint256 lastConversionTimestamp;
        uint256 sourceCurrencyBalance;
        uint256 targetCurrencyConverted;
        uint8 batches; // number of batches, up to 255
        uint8 batchesExecuted;
        // bool isActive; // wait until need this
    }
    mapping(uint256 => OrderInfo) public idToCostAverageOrder; // internal or public?
    mapping(address => uint256[]) public ownerToOrderIds;

    constructor (address _uniswapFactoryAddress) public payable { // I think we need payable to instantiate the contract with ETH
        // uniswapFactoryAddress = _uniswapFactoryAddress;
        factory = UniswapFactoryInterface(_uniswapFactoryAddress);
    }

    function createOrder (uint256 _amount, address _targetCurrency, uint256 _frequency, uint8 _batches) public payable returns (uint256 id_) {
        require(_amount == msg.value); // Can't use this if they send DAI

        OrderInfo memory newOrder = OrderInfo({
            amount: _amount,
            targetCurrency: _targetCurrency,
            frequency: _frequency,
            batches: _batches,
            owner: msg.sender,
            sourceCurrencyBalance: _amount, // take fee from here
            targetCurrencyConverted: 0,
            batchesExecuted: 0,
            lastConversionTimestamp: 0
        });

        idToCostAverageOrder[id] = newOrder;
        ownerToOrderIds[msg.sender].push(id);

        id++;

        return id-1;
    }

    function getOrder (uint256 _id) view public returns (
        uint256 id_, uint256 amount_, address targetCurrency_, uint256 frequency_, uint8 batches_,
        uint8 batchesExecuted_, uint256 lastConversionTimestamp_, uint256 targetCurrencyConverted_) {
        OrderInfo memory order = idToCostAverageOrder[_id];

        return (_id, order.amount, order.targetCurrency, order.frequency, order.batches,
            order.batchesExecuted, order.lastConversionTimestamp, order.targetCurrencyConverted);
    }

    function getOrderForOwnerIndex (address _owner, uint256 _index) view public returns (
        uint256 id_, uint256 amount_, address targetCurrency_, uint256 frequency_, uint8 batches_,
        uint8 batchesExecuted_, uint256 lastConversionTimestamp_, uint256 targetCurrencyConverted_) {
        return getOrder(ownerToOrderIds[_owner][_index]);
    }

    function getOrderCountForOwner (address _owner) view public returns (
        uint256 count_) {
        count_ = ownerToOrderIds[_owner].length;
    }

    // Q: should this be done by the server since it does not cost gas? Prob not b/c need to know within the current block...
    function checkConversionDue (uint256 _id) view public returns (bool) {
        OrderInfo memory order = idToCostAverageOrder[_id];

        // Check if there should be batches remaining
        if (order.batchesExecuted >= order.batches) return false;

        // Make sure order is still active
        // if (idIsActive[_id] == false) { return false; }

        // Check if the first conversion has been executed
        if (order.lastConversionTimestamp == 0) return true;

        // Check if enough time has lapsed to execute the next conversion
        uint256 timeDelta = now - order.lastConversionTimestamp;
        if (timeDelta < order.frequency) return false;

        return true;
    }

    // THIS IS THE FUNCTION OUR SERVER WILL CALL TO EXECUTE ORDERS
    function executeDueConversions () external {
        // require(msg.sender == remoteCaller);

        // Is it going to be super expensive to loop? Is there a better way to
        // do this? Should I return indexes to the server and have it call them one by one?
        for (uint256 i=0; i<=id; i++) {
            if (checkConversionDue(i) == true) {
                convertCurrency(i);
            }
        }
    }

    function convertCurrency(uint256 _id) private {
        OrderInfo storage order = idToCostAverageOrder[_id];

        uint256 batchValue = valuePerBatch(order.amount, order.batches);

        // Sanity checks
        require(order.sourceCurrencyBalance >= batchValue);

        // Update values before performing conversion
        order.sourceCurrencyBalance -= batchValue;
        order.batchesExecuted += 1;

        // ** CONVERT HERE **
        uint256 amountReceived = exchangeCurrency(order.targetCurrency, batchValue);

        // ** GET THE NO. TOKENS RECEIVED HERE **
        // uint256 amountReceived = 10;
        order.targetCurrencyConverted += amountReceived;
    }


    // TODO: can also use ethToTokenTransferInput with `recipient` param to transfer tokens directly to the user
    function exchangeCurrency(address _targetCurrency, uint256 _amountSourceCurrency) private returns (uint256 amountReceived_) {
        // Set up the Uniswap exchange interface by finding the token's address via the factory
        address exchangeAddress = factory.getExchange(_targetCurrency);
        UniswapExchangeInterface exchange = UniswapExchangeInterface(exchangeAddress);

        uint256 min_tokens = 1; // TODO: implement this correctly, see "sell order" logic in docs
        uint256 deadline = now + 300; // this is the value in the docs; used so nodes can't hold off on unsigned txs and wait for optimal times to sell/arbitrage
        amountReceived_ = exchange.ethToTokenSwapInput.value(_amountSourceCurrency)(min_tokens, deadline); // change from swap to transfer and add recipient
    }

    // TODO: deal with uneven divisibility
    function valuePerBatch(uint256 _amount, uint8 _batches) pure internal returns (uint256) {
        return _amount / _batches;
    }
}
