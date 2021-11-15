//Contract based on https://docs.openzeppelin.com/contracts/3.x/erc721
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Firechain is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    mapping (uint256 => bool) public listingStatus;

    constructor() ERC721("Firechain", "FIRE") {}

    function mintNFT(address recipient, string memory tokenURI) public payable returns (uint256) {
        _tokenIds.increment();

        require(msg.value >= 100000000000000, "Not enough ETH sent. Minting price is 0.0001!");

        uint256 newItemId = _tokenIds.current();
        _safeMint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }

    function listForSale(uint256 tokenID) public {
        require(msg.sender == this.ownerOf(tokenID));
        listingStatus[tokenID] = true;
    }

    function itemIsForSale(uint256 tokenID) public view returns (bool) {
        return listingStatus[tokenID];
    }


}