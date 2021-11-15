// test/Box.test.js
// Load dependencies
const { accounts, contract } = require('@openzeppelin/test-environment');
const { expect } = require('chai');

// Load compiled artifacts
const Firechain = contract.fromArtifact('Firechain');

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

    await this.contract.listForSale(1, { from: minter });
    
    expect((await this.contract.itemIsForSale(1))).to.equal(true);
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