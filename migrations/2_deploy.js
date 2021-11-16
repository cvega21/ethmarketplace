// migrations/2_deploy.js
const Firechain = artifacts.require('Firechain');

module.exports = async function (deployer) {
  await deployer.deploy(Firechain);
};
