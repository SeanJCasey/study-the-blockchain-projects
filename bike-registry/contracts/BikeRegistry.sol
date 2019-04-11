pragma solidity ^0.4.24;

import '../node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721.sol';

contract BikeRegistry is ERC721 {

    address internal minter;

    struct BikeInfo {
        uint16 year;
        string color;
    }

    mapping(uint256 => BikeInfo) public bikeIdToBikeInfo;

    // Set the creator of the contract as the "minter" of new tokens
    constructor() public {
        minter = msg.sender;
    }

    function createBike(uint256 _bikeId, uint16 _year, string _color) public {
        // Only the bike store owner can create bikes
        require(msg.sender == minter);

        // Add bike data
        BikeInfo memory newBike = BikeInfo(_year, _color);
        bikeIdToBikeInfo[_bikeId] = newBike;

        // Issue token
        _mint(msg.sender, _bikeId);
    }

    function lookupBike(uint256 _bikeId) view public returns (address owner_, uint16 year_, string color_) {
        // Get the owner
        owner_ = this.ownerOf(_bikeId);

        // Get the bike info
        BikeInfo memory bikeInfo = bikeIdToBikeInfo[_bikeId];

        return (owner_, bikeInfo.year, bikeInfo.color);
    }
}
