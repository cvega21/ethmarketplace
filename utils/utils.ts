import BN from "bn.js";
import Router from 'next/router';
import Web3 from "web3";
const web3 = new Web3();
import { useAppContext } from '../contexts/AppContext';
import contractABI from '../build/contracts/Firechain.json';
import { useEffect, useState } from "react";
var Contract = require('web3-eth-contract');
export const CONTRACT_ADDRESS = '0x652f6b7bDaD2E4f59152b3D8e16d74F150E7962C';
export const CONTRACT_LINK = `https://ropsten.etherscan.io/address/${CONTRACT_ADDRESS}`;
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

// use wallet listener
// use ethereum
// use contract

export const useEthereum = () => {
  const appContext = useAppContext();
  const [ethBalance, setEthBalance] = useState('');
  const [shortAccount, setShortAccount] = useState('');

  useEffect(() => {
    appContext?.addWalletListener();
    
    return () => {
      // remove wallet listener
    }
  }, [])

  useEffect(() => {
    const initEthereum = async () => {
      
      if (window.ethereum.selectedAddress) {
        console.log('inside useEthereum Hook')
        console.log(`window.ethereum.selectedAddress: ${window.ethereum.selectedAddress}`)
        
        try {
          await appContext?.refreshMetamask();
          const weiBalance = await window.ethereum.request({ method: 'eth_getBalance', params: [window.ethereum.selectedAddress, 'latest'] });
          const ethBalance = web3.utils.fromWei(weiBalance, 'ether')
          setEthBalance(parseFloat(ethBalance).toFixed(2));
          setShortAccount(getMediumAddress(appContext?.account as string));

          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x3' }],
          });

        } catch (e) {
          console.log('error inside initEthereum useeffect')
          console.error(e);

        }
      }
    }

    initEthereum();

    return () => {
      // appContext?.removeWalletListener
    }

  }, [appContext?.account])

  return {
    ethBalance: ethBalance, 
    shortAccount: shortAccount
  }
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