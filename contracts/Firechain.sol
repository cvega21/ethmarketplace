//Contract based on https://docs.openzeppelin.com/contracts/3.x/erc721
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Firechain is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct Listing {
        uint256 tokenID;
        bool forSale;
        uint256 price;
    }

    // mapping (uint256 => bool) public listingStatus;
    mapping (uint256 => bool) public listingPrice;

    mapping (uint256 => Listing) public items;

    constructor() ERC721("Firechain", "FIRE") {}

    function mintNFT(address recipient, string memory tokenURI) public payable returns (uint256) {
        _tokenIds.increment();

        require(msg.value >= 100000000000000, "Not enough ETH sent. Minting price is 0.0001!");

        uint256 newItemId = _tokenIds.current();
        _safeMint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }

    function listForSale(uint256 tokenID, uint256 price) public returns(bool) {
        require(msg.sender == this.ownerOf(tokenID));
        // listingStatus[tokenID] = true;

        items[tokenID].tokenID = tokenID;
        items[tokenID].forSale = true;
        items[tokenID].price = price;
        return true;
    }

    function itemIsForSale(uint256 tokenID) public view returns (bool) {
        return items[tokenID].forSale;
    }

    function itemStruct(uint256 tokenID) public view returns (Listing memory) {
        // return (items[tokenID].tokenID, items[tokenID].forSale, items[tokenID].price);
        return items[tokenID];
    }




}