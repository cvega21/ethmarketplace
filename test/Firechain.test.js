// test/Box.test.js
// Load dependencies
const { accounts, contract } = require('@openzeppelin/test-environment');
const { expect } = require('chai');

// Load compiled artifacts
const Firechain = contract.fromArtifact('Firechain');

describe('Firechain', () => {
  const [ owner, minter ] = accounts;

  beforeEach(async () => {
    this.contract = await Firechain.new({ from: minter });
  })

  it('mints NFTs at .0001 ETH', async () => {
    const item = await this.contract.mintNFT(minter, 'https://gateway.pinata.cloud/ipfs/QmRAgikmBpNAErmZ4L6vqkabQVzTgFBgAmrUDy8fxAMFdQ', { from: minter, value: 100000000000000 });

    expect((await this.contract.ownerOf(1)).toString()).to.equal(minter);
  })
})