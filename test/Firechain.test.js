// test/Box.test.js
// Load dependencies
// import Web3 from "web3";
const { accounts, contract, web3 } = require('@openzeppelin/test-environment');
const { expect } = require('chai');

// Load compiled artifacts
const Firechain = contract.fromArtifact('Firechain');
const sellingPrice = '1000000000000000000'
const mintingPrice = '100000000000000'

describe('Firechain', () => {
  const [ owner, minter, buyer ] = accounts;

  beforeEach(async () => {
    this.contract = await Firechain.new({ from: owner });
  })

  it('mints NFTs at .0001 ETH', async () => {
    const item = await this.contract.mintNFT('https://gateway.pinata.cloud/ipfs/QmRAgikmBpNAErmZ4L6vqkabQVzTgFBgAmrUDy8fxAMFdQ', { from: minter, value: 100000000000000 });
    
    expect((await this.contract.ownerOf(1)).toString()).to.equal(minter);
  })
  
  it('minter can list their NFT for sale', async () => {
    const item = await this.contract.mintNFT('https://gateway.pinata.cloud/ipfs/QmRAgikmBpNAErmZ4L6vqkabQVzTgFBgAmrUDy8fxAMFdQ', { from: minter, value: 100000000000000 });

    await this.contract.listForSale(1, sellingPrice, { from: minter });
    
    expect((await this.contract.itemIsForSale(1))).to.equal(true);
  })

  it('has a listing struct', async () => {
    const item = await this.contract.mintNFT('https://gateway.pinata.cloud/ipfs/QmRAgikmBpNAErmZ4L6vqkabQVzTgFBgAmrUDy8fxAMFdQ', { from: minter, value: 100000000000000 });

    await this.contract.listForSale(1, sellingPrice, { from: minter });
    const testArr = ['1',true,sellingPrice]
    testArr.tokenID = '1';
    testArr.forSale = true;
    testArr.price = sellingPrice;

    expect((await this.contract.getItemInfo(1))).to.eql(testArr);
  })
  
  it('random person cannot list someone elses NFT for sale', async () => {
    const item = await this.contract.mintNFT('https://gateway.pinata.cloud/ipfs/QmRAgikmBpNAErmZ4L6vqkabQVzTgFBgAmrUDy8fxAMFdQ', { from: minter, value: 100000000000000 });

    try {
      await this.contract.listForSale(1, { from: buyer });
    } catch (e) {
      // [EXPECTED] the transaction above will revert and throw an error, since someone else other than the owner is trying to list the NFT for sale
      void(0)
    }
    
    expect((await this.contract.itemIsForSale(1))).to.equal(false);
  })
  
  it('can mint an NFT, list for sale, and someone else can buy it', async () => {
    // const web3 = new Web3;
    // const allAccounts = await web3.eth.getAccounts();
    // const buyerBalance = await web3.eth.getBalance(buyer)
    // const minterBalance = await web3.eth.getBalance(minter)
    // const ownerBalance = await web3.eth.getBalance(owner)
    
    // console.log(allAccounts)
    // console.log('buyer: ', buyer, buyerBalance)
    // console.log('minter: ', minter, minterBalance)
    // console.log('owner: ', owner, ownerBalance)

    // allAccounts.forEach( async (account) => {
    //   const balance = await web3.eth.getBalance(account);
    //   console.log(account, balance);
    // })
    
    // console.log('minting...')
    const item = await this.contract.mintNFT('https://gateway.pinata.cloud/ipfs/QmRAgikmBpNAErmZ4L6vqkabQVzTgFBgAmrUDy8fxAMFdQ', { from: minter, value: 100000000000000 });
    
    // const isForSale = await this.contract.itemIsForSale(1);
    // console.log('is item 1 for sale?', isForSale);
    // console.log('listing for sale...')

    await this.contract.listForSale(1, sellingPrice, { from: minter });
    
    // const isForSale2 = await this.contract.itemIsForSale(1);
    // console.log('is item 1 for sale?', isForSale2);
    // const ownerOfItem = await this.contract.ownerOf(1);
    // console.log('item 1 is owned by: ', ownerOfItem);
    // const ownerStruct = await this.contract.getItemInfo(1);
    // console.log('old item struct:');
    // console.log(ownerStruct.price);
    
    // console.log('submitting buy...');
    try {
      // console.log('is price === msg.value?', ownerStruct.price === sellingPrice);
      const success = await this.contract.buyItem(1, {from: buyer, value: sellingPrice});
      // console.log('new item struct:');
      // const ownerStruct2 = await this.contract.getItemInfo(1);
      // console.log(ownerStruct2);
      // const ownerOfItem = await this.contract.ownerOf(1);
      // console.log('item 1 is owned by: ', ownerOfItem);
      // const buyerBalance2 = await web3.eth.getBalance(buyer)
      // const minterBalance2 = await web3.eth.getBalance(minter)
      // const ownerBalance2 = await web3.eth.getBalance(owner)

      // console.log()
      // console.log('balance after buy....')
      // console.log('buyer: ', buyer, buyerBalance2)
      // console.log('minter: ', minter, minterBalance2)
      // console.log('owner: ', owner, ownerBalance2)
      // console.log()
      // console.log('effective cost for buyer: ')
      // console.log(buyerBalance - buyerBalance2)
      // console.log('effective profit for minter: ')
      // console.log(minterBalance2 - minterBalance)
      // console.log()

      // const allAccounts = await web3.eth.getAccounts();      
      // allAccounts.forEach( async (account) => {
      //   const balance = await web3.eth.getBalance(account);
      //   console.log(account, balance);
      // })
    } catch (e) {
      console.error('oh no!', e)
    }
    
    expect((await this.contract.ownerOf(1))).to.equal(buyer);
  })
})