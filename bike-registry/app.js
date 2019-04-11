if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
} else {
    // Truffle
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:9545"));
}

// Set 1st account as the default user
web3.eth.defaultAccount = web3.eth.accounts[0];
const account = web3.eth.defaultAccount;

// Load smart contract ABI
const Web3ContractABI = web3.eth.contract(abi);

// Define the contract address
const contract = Web3ContractABI.at(contract_address);
console.log(contract);

function lookupBikeButtonClicked() {
    event.preventDefault();

    contract.lookupBike.call(
        $('#lookupBikeIdInput').val(),
        (error, result) => {
            if (!error){
                $('#lookupBikeOwnerResult').text(result[0]);
                $('#lookupBikeYearResult').text(result[1]);
                $('#lookupBikeColorResult').text(result[2]);
                $('#lookupBikeResult').css({'display': 'block'});
            } else {
                console.log(error);
                $('#errors').text(error.toString());
            }
        }
    );
};

function transferBikeButtonClicked() {
    // TODO: client side validation to see if valid Ethereum address
    event.preventDefault();

    contract.safeTransferFrom(
        web3.eth.defaultAccount,
        $('#transferBikeToAddressInput').val(),
        $('#transferBikeIdInput').val(),
        (error, result) => {
            if (!error){
                const transferEvent = contract.Transfer({account: account});
                transferEvent.watch((error, result) => {
                    if (!error) {
                        $('#successes').text('Bike transfered!');
                    } else {
                        console.log('watching for transfer event is failing')
                    }
                });
            } else {
                console.log(error);
                $('#errors').text(error.toString());
            }
        }
    );
};

function createBikeButtonClicked() {
    event.preventDefault();

    contract.createBike(
        Number($('#createBikeIdInput').val()),
        Number($('#createBikeYearInput').val()),
        $('#createBikeColorInput').val(),
        {from: web3.eth.defaultAccount, gas: 1000000},
        (error, result) => {
            if (!error){
                console.log(result);
                const transferEvent = contract.Transfer({account: account}); // Does this work now that I'm ussing account like this?
                transferEvent.watch((error, result) => {
                    if (!error) {
                        $('#successes').text('Bike created!');
                    } else {
                        console.log('watching for transfer event is failing')
                    }
                });
            } else {
                console.log(error);
                $('#errors').text(error.toString());
            }
        }
    );
};
