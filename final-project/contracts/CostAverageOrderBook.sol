pragma solidity ^0.5.2;

import '../node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol';
import '../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol';
import './UniswapFactoryInterface.sol';
import './UniswapExchangeInterface.sol';

contract CostAverageOrderBook is Ownable {
    using SafeMath for uint256;

    uint256 public nextId;
    address private remoteCaller;
    uint256 private feeBalance;
    uint256 private feesWithdrawn;
    uint256 public minAmount = 0.1 ether;
    uint32 public minFrequency = 3600;
    uint8 public minBatches = 1;
    uint8 public maxBatches = 255;

    UniswapFactoryInterface internal factory;

    struct OrderInfo {
        address account;
        address targetCurrency;
        uint256 amount;
        uint256 frequency; // in seconds
        uint256 lastConversionTimestamp;
        uint256 sourceCurrencyBalance;
        uint256 targetCurrencyConverted;
        uint8 batches;
        uint8 batchesExecuted;
    }
    mapping(uint256 => OrderInfo) public idToCostAverageOrder;
    mapping(address => uint256[]) public accountToOrderIds;

    event NewOrder(
        address indexed _account,
        uint256 _orderId
    );

    event OrderConversion(
        address indexed _account,
        uint256 _orderId
    );

    event CancelOrder(
        address indexed _account,
        uint256 _orderId
    );

    constructor (address _uniswapFactoryAddress) public payable { // I think we need payable to instantiate the contract with ETH
        factory = UniswapFactoryInterface(_uniswapFactoryAddress);
        remoteCaller = msg.sender; // TODO: CHANGE TO SERVER'S WALLET
        nextId = 1; // Set first order as 1 instead of 0
    }

    function cancelOrder (uint256 _id) public {
        OrderInfo storage order = idToCostAverageOrder[_id];

        require(order.account == msg.sender);
        require(order.sourceCurrencyBalance > 0);

        uint256 refundAmount = order.sourceCurrencyBalance;
        order.sourceCurrencyBalance = 0;

        msg.sender.transfer(refundAmount);

        emit CancelOrder(order.account, _id);
    }

    function createOrder (uint256 _amount, address _targetCurrency, uint256 _frequency, uint8 _batches) public payable returns (uint256 id_) {
        require(_amount == msg.value); // Can't use this if they send DAI

        // Enforce minimums for params
        require(_frequency >= minFrequency);
        require(_batches >= minBatches);
        require(_amount >= minAmount);

        OrderInfo memory newOrder = OrderInfo({
            amount: _amount,
            targetCurrency: _targetCurrency,
            frequency: _frequency,
            batches: _batches,
            account: msg.sender,
            sourceCurrencyBalance: _amount,
            targetCurrencyConverted: 0,
            batchesExecuted: 0,
            lastConversionTimestamp: 0
        });

        idToCostAverageOrder[nextId] = newOrder;
        accountToOrderIds[msg.sender].push(nextId);

        emit NewOrder(msg.sender, nextId);

        nextId++;

        return nextId-1;
    }

    function getOrder (uint256 _id) view public returns (
        uint256 id_, uint256 amount_, address targetCurrency_, uint256 frequency_, uint8 batches_,
        uint8 batchesExecuted_, uint256 lastConversionTimestamp_, uint256 targetCurrencyConverted_,
        uint256 sourceCurrencyBalance_) {
        OrderInfo memory order = idToCostAverageOrder[_id];

        return (_id, order.amount, order.targetCurrency, order.frequency, order.batches,
            order.batchesExecuted, order.lastConversionTimestamp, order.targetCurrencyConverted,
            order.sourceCurrencyBalance);
    }

    function getOrderCount () view public returns (uint256) {
        return nextId-1;
    }

    function getOrderCountForAccount (address _account) view public returns (uint256 count_) {
        return accountToOrderIds[_account].length;
    }

    function getOrderForAccountIndex (address _account, uint256 _index) view public returns (
        uint256 id_, uint256 amount_, address targetCurrency_, uint256 frequency_, uint8 batches_,
        uint8 batchesExecuted_, uint256 lastConversionTimestamp_, uint256 targetCurrencyConverted_,
        uint256 sourceCurrencyBalance_) {
        require(_index < getOrderCountForAccount(_account));

        return getOrder(accountToOrderIds[_account][_index]);
    }

    function getOrderParamLimits() view public returns (uint256 minAmount_, uint32 minFrequency_,
        uint8 minBatches_, uint8 maxBatches_) {
        return (minAmount, minFrequency, minBatches, maxBatches);
    }

    // Convenience function for dapp display of contract stats
    function getStatTotals () view external returns (uint256 orders_, uint256 conversions_, uint256 managedEth_, uint256 fees_) {
        orders_ = getOrderCount();

        conversions_ = 0;
        for (uint256 i=1; i<=getOrderCount(); i++) {
            OrderInfo memory order = idToCostAverageOrder[i];
            conversions_ += order.batchesExecuted;
        }

        managedEth_ = address(this).balance.sub(feeBalance);
        fees_ = getTotalFeesCollected();
    }

    function getTotalFeesCollected () view public returns (uint256) {
        return feeBalance.add(feesWithdrawn);
    }

    function setRemoteCaller (address _remoteCaller) public onlyOwner {
        remoteCaller = _remoteCaller;
    }

    function withdrawFees () public onlyOwner {
        require (feeBalance > 0);

        uint256 withdrawalAmount = feeBalance;
        feeBalance = 0;
        feesWithdrawn.add(withdrawalAmount);

        msg.sender.transfer(withdrawalAmount);
    }


    /*** Uniswap conversion logic ***/

    function checkConversionDue (uint256 _id) view public returns (bool) {
        OrderInfo memory order = idToCostAverageOrder[_id];

        // Check if there is a balance of source currency
        if (order.sourceCurrencyBalance <= 0) return false;

        // Check if there should be batches remaining
        if (order.batchesExecuted >= order.batches) return false;

        // Check if the first conversion has been executed
        if (order.lastConversionTimestamp == 0) return true;

        // Check if enough time has elapsed to execute the next conversion
        uint256 timeDelta = now - order.lastConversionTimestamp;
        if (timeDelta < order.frequency) return false;

        return true;
    }

    function checkConversionDueAll() view public returns (uint256[] memory) {
        require(msg.sender == remoteCaller);

        uint256 totalOrderCount = getOrderCount();
        require(totalOrderCount > 0);

        uint256[] memory coversionDueMap = new uint256[](totalOrderCount);

        for (uint256 i=1; i<=totalOrderCount; i++) {
            if (checkConversionDue(i) == true) coversionDueMap[i-1] = i;
        }

        return coversionDueMap;
    }

    function checkConversionDueBatch(uint256 _idStart, uint16 _count) view public returns (uint256[] memory) {
        require(msg.sender == remoteCaller);

        uint256 totalOrderCount = getOrderCount();
        require(_idStart > 0);
        require(_idStart <= totalOrderCount);

        uint256[] memory coversionDueMap = new uint256[](_count);

        for (uint256 i=0; i<_count && _idStart.add(i) <= totalOrderCount; i++) {
            if (checkConversionDue(_idStart.add(i)) == true) coversionDueMap[i] = _idStart.add(i);
        }

        return coversionDueMap;
    }

    function convertCurrency(uint256 _id) private {
        OrderInfo storage order = idToCostAverageOrder[_id];

        uint256 batchValue = valuePerBatch(order.amount, order.batches);

        // In case the batchValue is somehow more than the balance, use the remainder
        if (order.sourceCurrencyBalance < batchValue) batchValue = order.sourceCurrencyBalance;

        // Update all values possible before performing conversion
        order.sourceCurrencyBalance -= batchValue;
        order.batchesExecuted += 1;
        order.lastConversionTimestamp = now;

        // Impose the fee here
        uint256 fee = batchValue.div(200); // 0.5%
        feeBalance += fee;

        // ETH converted to tokens here
        uint256 amountReceived = exchangeCurrency(order.account, order.targetCurrency, batchValue.sub(fee));

        // Update total tokens converted
        order.targetCurrencyConverted += amountReceived;

        emit OrderConversion(order.account, _id);
    }

    function exchangeCurrency(address _account, address _targetCurrency, uint256 _amountSourceCurrency) private returns (uint256 amountReceived_) {
        // Set up the Uniswap exchange interface by finding the token's address via the factory
        address exchangeAddress = factory.getExchange(_targetCurrency);
        UniswapExchangeInterface exchange = UniswapExchangeInterface(exchangeAddress);

        uint256 min_tokens = 1; // TODO: implement this correctly, see "sell order" logic in docs
        uint256 deadline = now + 300; // this is the value in the docs; used so nodes can't hold off on unsigned txs and wait for optimal times to sell/arbitrage
        amountReceived_ = exchange.ethToTokenTransferInput.value(_amountSourceCurrency)(min_tokens, deadline, _account);
    }

    // Remote server calls to execute converstions 1-by-1
    function executeDueConversion (uint256 _id) public {
        require(msg.sender == remoteCaller);

        if (checkConversionDue(_id) == true) {
            convertCurrency(_id);
        }
    }

    // Remote server calls to execute conversions en masse
    function executeDueConversions () external {
        require(msg.sender == remoteCaller);

        for (uint256 i=1; i<=getOrderCount(); i++) {
            if (checkConversionDue(i) == true) {
                convertCurrency(i);
            }
        }
    }

    function valuePerBatch(uint256 _amount, uint8 _batches) pure internal returns (uint256) {
        return _amount.div(_batches);
    }
}
