if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
} else {
    // Truffle
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
}

// Set 1st account as the default user
web3.eth.defaultAccount = web3.eth.accounts[0];
const account = web3.eth.defaultAccount;

// Load smart contract ABI
const Web3ContractABI = web3.eth.contract(abi);

// Define the contract address
const contract = Web3ContractABI.at(contract_address);
console.log(contract);

const $orderQuantityInput = $('#createCostAverageOrderQuantityInput');
const $orderTargetTokenInput = $('#createCostAverageOrderTokenAddressInput');
const $orderFrequencyInput = $('#createCostAverageOrderFrequencyInput');
const $orderTranchesInput = $('#createCostAverageOrderTranchesInput');

const $orderLookupQuantity = $('#lookupCostAverageOrderQuantityResult');
const $orderLookupTargetToken = $('#lookupCostAverageOrderTokenAddressResult');
const $orderLookupFrequency = $('#lookupCostAverageOrderFrequencyResult');
const $orderLookupTranches = $('#lookupCostAverageOrderTranchesResult');
const $orderLookupTranchesExecuted = $('#lookupCostAverageOrderTranchesExecutedResult');
const $orderLookupLastConversion = $('#lookupCostAverageOrderLastConversionResult');
const $orderLookupTargetCurrencyConverted = $('#lookupCostAverageOrderTargetCurrencyConvertedResult');

const $orderCheckConverstionDueIdInput = $('#checkOrderConversionDueIdInput');
const $orderConversionDueResult = $('#checkCostAverageOrderConversionDueBoolResult')

function lookupCostAverageOrderButtonClicked() {
    event.preventDefault();

    contract.getCostAverageOrder.call(
        $('#lookupCostAverageOrderIdInput').val(),
        (error, result) => {
            if (!error){
                $orderLookupQuantity.text(result[0]);
                $orderLookupTargetToken.text(result[1]);
                $orderLookupFrequency.text(result[2]);
                $orderLookupTranches.text(result[3]);
                $orderLookupTranchesExecuted.text(result[4]);
                $orderLookupLastConversion.text(result[5]);
                $orderLookupTargetCurrencyConverted.text(result[6]);
                $('#lookupCostAverageOrderResult').css({'display': 'block'});
            } else {
                console.log(error);
                $('#errors').text(error.toString());
            }
        }
    );
};

function createCostAverageOrderButtonClicked() {
    event.preventDefault();

    web3.eth.getAccounts(function(error, accounts) {
        if (error) {
            console.log(error);
            $('#errors').text(error.toString());
            return
        }
        const account = accounts[0]

        const amount = web3.toWei(parseFloat($orderQuantityInput.val()), 'ether');

        contract.createCostAverageOrder(
            amount,
            $orderTargetTokenInput.val(),
            $orderFrequencyInput.val(),
            $orderTranchesInput.val(),
            {from: account, value: amount, gas: 1000000}, // WHY NEED TO SPECIFY GAS?
            (error, result) => {
                if (!error){
                    console.log(result);
                    $('#successes').text('Order created!');
                } else {
                    console.log(error);
                    $('#errors').text(error.toString());
                }
            }
        );

    })
};

function checkOrderConversionDueButtonClicked() {
    event.preventDefault();

    contract.checkConversionDue.call(
        $orderCheckConverstionDueIdInput.val(),
        (error, result) => {
            if (!error){
                $orderConversionDueResult.text(result);
            } else {
                console.log(error);
                $('#errors').text(error.toString());
            }
        }
    );
};
