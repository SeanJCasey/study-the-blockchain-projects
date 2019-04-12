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

function lookupRecordButtonClicked() {
    event.preventDefault();

    contract.addressToRecord.call(
        $('#lookupRecordAddressInput').val(),
        (error, result) => {
            if (!error){
                $('#lookupRecordProblemsResult').text(result[0]);
                $('#lookupRecordMedicationsResult').text(result[1]);
                $('#lookupRecordAllergiesResult').text(result[2]);
                $('#lookupRecordWeightResult').text(result[3]);
                $('#lookupRecordHeightResult').text(result[4]);
                $('#lookupRecordResult').css({'display': 'block'});
            } else {
                console.log(error);
                $('#errors').text(error.toString());
            }
        }
    );
};

function createRecordButtonClicked() {
    event.preventDefault();

    contract.createRecord(
        $('#createRecordProblemsInput').val(),
        $('#createRecordMedicationsInput').val(),
        $('#createRecordAllergiesInput').val(),
        Number($('#createRecordWeightInput').val()),
        Number($('#createRecordHeightInput').val()),
        {from: web3.eth.defaultAccount, gas: 1000000},
        (error, result) => {
            if (!error){
                console.log(result);
                $('#successes').text('Record created!');
                // Use this to set values for update form and hide create form
                getOwnRecord();
            } else {
                console.log(error);
                $('#errors').text(error.toString());
            }
        }
    );
};

function updateRecordProblemsButtonClicked() {
    event.preventDefault();

    contract.updateRecordProblems(
        $('#updateRecordProblemsInput').val(),
        (error, result) => {
            if (!error){
                console.log(result);
                $('#successes').text('Record updated!');
            } else {
                console.log(error);
                $('#errors').text(error.toString());
            }
        }
    );
};

function updateRecordMedicationsButtonClicked() {
    event.preventDefault();

    contract.updateRecordMedications(
        $('#updateRecordMedicationsInput').val(),
        (error, result) => {
            if (!error){
                console.log(result);
                $('#successes').text('Record updated!');
            } else {
                console.log(error);
                $('#errors').text(error.toString());
            }
        }
    );
};

function updateRecordAllergiesButtonClicked() {
    event.preventDefault();

    contract.updateRecordAllergies(
        $('#updateRecordAllergiesInput').val(),
        (error, result) => {
            if (!error){
                console.log(result);
                $('#successes').text('Record updated!');
            } else {
                console.log(error);
                $('#errors').text(error.toString());
            }
        }
    );
};

function updateRecordWeightButtonClicked() {
    event.preventDefault();

    contract.updateRecordWeight(
        Number($('#updateRecordWeightInput').val()),
        (error, result) => {
            if (!error){
                console.log(result);
                $('#successes').text('Record updated!');
            } else {
                console.log(error);
                $('#errors').text(error.toString());
            }
        }
    );
};

function updateRecordHeightButtonClicked() {
    event.preventDefault();

    contract.updateRecordHeight(
        Number($('#updateRecordHeightInput').val()),
        (error, result) => {
            if (!error){
                console.log(result);
                $('#successes').text('Record updated!');
            } else {
                console.log(error);
                $('#errors').text(error.toString());
            }
        }
    );
};

function getOwnRecord() {
    contract.addressToRecord.call(
        account,
        (error, result) => {
            if (!error){
                if (result[0] || result[1] || result[2]) {
                    $('#createRecord').css({'display': 'none'});
                    $('#updateRecordProblemsInput').val(result[0]);
                    $('#updateRecordMedicationsInput').val(result[1]);
                    $('#updateRecordAllergiesInput').val(result[2]);
                    $('#updateRecordWeightInput').val(result[3]);
                    $('#updateRecordHeightInput').val(result[4]);
                    $('#updateRecord').css({'display': 'block'});
                }
            } else {
                console.log(error);
                $('#errors').text(error.toString());
            }
        }
    );
}

// Get own record to populate "update your record" and hide "create your record"
getOwnRecord();
