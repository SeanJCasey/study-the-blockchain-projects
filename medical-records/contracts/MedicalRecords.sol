pragma solidity ^0.4.24;

contract MedicalRecords {

    struct Record {
        string problems;
        string medications;
        string allergies;
        uint16 weight;
        uint16 height;
    }

    mapping(address => Record) public addressToRecord;

    function createRecord(string _problems, string _medications,
        string _allergies, uint16 _weight, uint16 _height) public {

        Record memory newRecord = Record(_problems, _medications, _allergies, _weight, _height);
        addressToRecord[msg.sender] = newRecord;
    }

    function updateRecordProblems(string _problems) public {
        Record storage record = addressToRecord[msg.sender];
        record.problems = _problems;
    }

    function updateRecordMedications(string _medications) public {
        Record storage record = addressToRecord[msg.sender];
        record.medications = _medications;
    }

    function updateRecordAllergies(string _allergies) public {
        Record storage record = addressToRecord[msg.sender];
        record.allergies = _allergies;
    }

    function updateRecordWeight(uint16 _weight) public {
        Record storage record = addressToRecord[msg.sender];
        record.weight = _weight;
    }

    function updateRecordHeight(uint16 _height) public {
        Record storage record = addressToRecord[msg.sender];
        record.height = _height;
    }

}
