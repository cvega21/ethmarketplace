import BN from "bn.js";
import Router from 'next/router';
import Web3 from "web3";
const web3 = new Web3();

import contractABI from '../build/contracts/Firechain.json';
var Contract = require('web3-eth-contract');
export const CONTRACT_ADDRESS = '0x652f6b7bDaD2E4f59152b3D8e16d74F150E7962C';
export const MINT_PRICE = web3.utils.toWei('0.0001', "ether");

export const getShortAddress = (address: string) => {
  return address.substr(0,5) + '...' + address.substr(-4,4);
}

export const getMediumAddress = (address: string) => {
  return address.substr(0,7) + '...' + address.substr(-4,4);
}

export const getMdTokenURI = (address: string) => {
  return address.substr(8,14) + '...' + address.substr(-6,6);
}

export const toHex = (stringToConvert: string) => {
  return stringToConvert
    .split('')
    .map((c) => c.charCodeAt(0).toString(16).padStart(2, '0'))
    .join('');
}

export const changeInput = (e: React.ChangeEvent<HTMLInputElement>, setState: React.Dispatch<React.SetStateAction<any>>) => {
  let newValue = e.currentTarget.value;
  setState(newValue);
}

export const exitPage = () => {
  setTimeout(() => {
    Router.push('/buy');
  }, 2500);
}

export const mintNFT = async (account: string, tokenURI: string) => {
  window.contract = await new web3.eth.Contract(contractABI.abi as any, CONTRACT_ADDRESS);//loadContract();

  const transactionParameters = {
    to: CONTRACT_ADDRESS, // Required except during contract publications.
    from: account, // must match user's active address.,
    value: web3.utils.toHex(MINT_PRICE),
    'data': window.contract.methods.mintNFT(tokenURI).encodeABI() //make call to NFT smart contract 
  };
  
  
  try {
    const txHash = await window.ethereum
        .request({
            method: 'eth_sendTransaction',
            params: [transactionParameters],
        });
    console.log(`success?!?! check out transaction on Etherscan: https://ropsten.etherscan.io/tx/${txHash}`);
    return {
      success: true,
      status: "✅ Check out your transaction on Etherscan: https://ropsten.etherscan.io/tx/" + txHash
    }
  } catch (error) {
    console.log('error', error);
      return {
          success: false,
          status: "😥 Something went wrong: " + error.message
      }
  }
}

export const buyNFT = async (tokenID: number, price: string, account: string) => {
  window.contract = await new web3.eth.Contract(contractABI.abi as any, CONTRACT_ADDRESS);//loadContract();
  const amountToSend = web3.utils.toWei(price, "ether");

  const transactionParameters = {
    to: CONTRACT_ADDRESS, // Required except during contract publications.
    from: account, // must match user's active address.,
    value: web3.utils.toHex(amountToSend),
    'data': window.contract.methods.buyItem(tokenID).encodeABI() //make call to NFT smart contract 
  };
  
  
  try {
    const txHash = await window.ethereum
        .request({
            method: 'eth_sendTransaction',
            params: [transactionParameters],
        });
    console.log(`success?!?! check out transaction on Etherscan: https://ropsten.etherscan.io/tx/${txHash}`);
    return {
      success: true,
      status: "✅ Check out your transaction on Etherscan: https://ropsten.etherscan.io/tx/" + txHash
    }
  } catch (error) {
    console.log('error', error);
      return {
          success: false,
          status: "😥 Something went wrong: " + error.message
      }
  }
}