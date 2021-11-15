// test/Box.test.js
// Load dependencies
const { accounts, contract } = require('@openzeppelin/test-environment');
const { expect } = require('chai');

// Load compiled artifacts
const Firechain = contract.fromArtifact('Firechain');
const sellingPrice = '690000000000000000'
const mintingPrice = '100000000000000'

describe('Firechain', () => {
  const [ owner, minter, buyer ] = accounts;

  beforeEach(async () => {
    this.contract = await Firechain.new({ from: owner });
  })

  it('mints NFTs at .0001 ETH', async () => {
    const item = await this.contract.mintNFT(minter, 'https://gateway.pinata.cloud/ipfs/QmRAgikmBpNAErmZ4L6vqkabQVzTgFBgAmrUDy8fxAMFdQ', { from: minter, value: 100000000000000 });
    
    expect((await this.contract.ownerOf(1)).toString()).to.equal(minter);
  })
  
  it('minter can list their NFT for sale', async () => {
    const item = await this.contract.mintNFT(minter, 'https://gateway.pinata.cloud/ipfs/QmRAgikmBpNAErmZ4L6vqkabQVzTgFBgAmrUDy8fxAMFdQ', { from: minter, value: 100000000000000 });

    await this.contract.listForSale(1, sellingPrice, { from: minter });
    
    expect((await this.contract.itemIsForSale(1))).to.equal(true);
  })

  it('has a listing struct', async () => {
    const item = await this.contract.mintNFT(minter, 'https://gateway.pinata.cloud/ipfs/QmRAgikmBpNAErmZ4L6vqkabQVzTgFBgAmrUDy8fxAMFdQ', { from: minter, value: 100000000000000 });

    await this.contract.listForSale(1, sellingPrice, { from: minter });
    const test = await this.contract.itemStruct(1);
    const testArr = ['1',true,sellingPrice]
    testArr.tokenID = '1';
    testArr.forSale = true;
    testArr.price = sellingPrice;

    // console.log(Object.getOwnPropertyNames(test));
    // console.log(Object.getOwnPropertyNames(testArr));
    // console.log(test);
    // console.log(testArr);
    // console.log(testArr.length);
    // console.log(test === testArr)
    // console.log(test[2]);
    // test.forEach((thing) => {
    //   console.log(thing);
    // })
    // console.log(test[3]);
    // console.log(test.tokenID);
    // console.log(test.forSale);
    // console.log(test.price);
    // console.log(Object.keys(test));
    // console.log('type of test:', typeof(test))
    
    expect((await this.contract.itemStruct(1))).to.eql(testArr);
  })
  
  it('random person cannot list someone elses NFT for sale', async () => {
    const item = await this.contract.mintNFT(minter, 'https://gateway.pinata.cloud/ipfs/QmRAgikmBpNAErmZ4L6vqkabQVzTgFBgAmrUDy8fxAMFdQ', { from: minter, value: 100000000000000 });

    try {
      await this.contract.listForSale(1, { from: buyer });
    } catch (e) {
      // [EXPECTED] the transaction above will revert and throw an error, since someone else other than the owner is trying to list the NFT for sale

      void(0)
    }
    
    expect((await this.contract.itemIsForSale(1))).to.equal(false);
  })
})