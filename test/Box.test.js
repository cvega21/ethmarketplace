// test/Box.test.js
// Load dependencies
const { accounts, contract } = require('@openzeppelin/test-environment');
const { expect } = require('chai');

// Load compiled artifacts
const Box = contract.fromArtifact('Box');

describe('Box', () => {
  const [ owner ] = accounts;

  beforeEach(async () => {
    this.contract = await Box.new({ from: owner});
  })

  it('retrieve returns a value previously stored', async () => {
    await this.contract.store(42, { from: owner });

    expect((await this.contract.retrieve()).toString()).to.equal('42');
  })
})