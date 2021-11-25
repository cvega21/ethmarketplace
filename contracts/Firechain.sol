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

    mapping (uint256 => Listing) public items;

    constructor() ERC721("Firechain", "FIRE") {}

    function mintNFT(string memory tokenURI) public payable returns (uint256) {
        _tokenIds.increment();

        require(msg.value >= 100000000000000, "Not enough ETH sent. Minting price is 0.0001!");

        uint256 newItemId = _tokenIds.current();
        _safeMint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);

        items[newItemId].tokenID = newItemId;
        items[newItemId].forSale = false;
        items[newItemId].price = 0;

        return newItemId;
    }

    function listForSale(uint256 tokenID, uint256 price) public returns(bool) {
        require(msg.sender == this.ownerOf(tokenID));

        items[tokenID].tokenID = tokenID;
        items[tokenID].forSale = true;
        items[tokenID].price = price;

        return true;
    }

    function mintNFTAndListForSale(string memory tokenURI, uint256 price) public payable returns (uint256) {
        _tokenIds.increment();

        require(msg.value >= 100000000000000, "Not enough ETH sent. Minting price is 0.0001!");

        uint256 newItemId = _tokenIds.current();
        _safeMint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);

        items[newItemId].tokenID = newItemId;
        items[newItemId].forSale = true;
        items[newItemId].price = price;

        return newItemId;
    }

    function itemIsForSale(uint256 tokenID) public view returns (bool) {
        return items[tokenID].forSale;
    }

    function getItemInfo(uint256 tokenID) public view returns (Listing memory) {
        return items[tokenID];
    }

    function buyItem(uint256 tokenID) external payable returns (bool) {
        require(items[tokenID].forSale == true, "Item is not for sale.");
        require(msg.value >= items[tokenID].price, "Not enough ETH sent. Check the item's selling price.");
        require(msg.sender != this.ownerOf(tokenID), "You cannot buy your own NFT!");

        address owner = this.ownerOf(tokenID);

        _safeTransfer(this.ownerOf(tokenID), msg.sender, tokenID, "buying thing!");

        items[tokenID].forSale = false;
        items[tokenID].price = 0;

        (bool success, ) = owner.call{value: msg.value}("");
        require(success, "Transfer failed.");

        return success;

    }




}