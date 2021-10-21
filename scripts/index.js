module.exports = async function main (callback) {
  
  try {
    // Our code will go here
    // Retrieve accounts from the local node
    // const accounts = await web3.eth.getAccounts();
    // console.log(accounts)
    // callback(0);
    const Box = artifacts.require('Box');
    const box = await Box.deployed();
    const value = await box.retrieve();
    console.log('Box value is', value.toString());
  } catch (error) {
    console.error(error);
    callback(1);
  }
};