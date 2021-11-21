import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Web3 from "web3";
import { useAppContext } from '../contexts/AppContext';
import pinJSONToIPFS from '../utils/pinJSONToIPFS';
import contractABI from '../build/contracts/Firechain.json';
import { IProduct } from '../types/types';

interface IEthButton {
  buyNowPrice: Number,
  children?: React.ReactNode,
  product: IProduct,
  // refString: string
}

interface successfulPinataResponse {
  success: boolean,
  pinataUrl: string
}

const EthButton = (props: IEthButton) => {
  const appContext = useAppContext();
  const web3 = new Web3;
  const contractAddress = '0x5bB6CD5309eF94d49BeCE60D06Ad63581e5a3f10';

  // const buyNFT = async (tokenID: number, price: string) => {
  //   window.contract = await new web3.eth.Contract(contractABI.abi as any, contractAddress);//loadContract();
  //   const amountToSend = web3.utils.toWei(price, "ether");

  //   const transactionParameters = {
  //     to: contractAddress, // Required except during contract publications.
  //     from: appContext?.account, // must match user's active address.
  //     value: web3.utils.toHex(amountToSend),
  //     'data': window.contract.methods.mintNFT(1).encodeABI() //make call to NFT smart contract 
  //   };
    
    
  //   try {
  //     const txHash = await window.ethereum
  //         .request({
  //             method: 'eth_sendTransaction',
  //             params: [transactionParameters],
  //         });
  //     return {
  //         success: true,
  //         status: "✅ Check out your transaction on Etherscan: https://ropsten.etherscan.io/tx/" + txHash
  //     }
  //   } catch (error) {
  //       return {
  //           success: false,
  //           status: "😥 Something went wrong: " + error.message
  //       }
  //   }
  // }
  

  // const mintNFT = async (title: string, description: string, image: string) => {
  //   window.contract = await new web3.eth.Contract(contractABI.abi as any, contractAddress);//loadContract();

  //   const transactionParameters = {
  //     to: contractAddress, // Required except during contract publications.
  //     from: appContext?.account, // must match user's active address.
  //     'data': window.contract.methods.mintNFT(window.ethereum.selectedAddress, props.product.tokenURI).encodeABI() //make call to NFT smart contract 
  //   };
    
    
  //   try {
  //     const txHash = await window.ethereum
  //         .request({
  //             method: 'eth_sendTransaction',
  //             params: [transactionParameters],
  //         });
  //     return {
  //         success: true,
  //         status: "✅ Check out your transaction on Etherscan: https://ropsten.etherscan.io/tx/" + txHash
  //     }
  //   } catch (error) {
  //       return {
  //           success: false,
  //           status: "😥 Something went wrong: " + error.message
  //       }
  //   }
  // }

  useEffect(() => {
    const initEthereum = async () => {
      if (window.ethereum.selectedAddress) {
        await appContext?.connectMetamask();
      }
    }
    
    initEthereum();

    return () => {
    }
  }, [appContext])

  return (
    <button 
      className="bg-indigo-700 rounded-lg hover:bg-indigo-800 text-gray-100 hover:text-white font-medium text-xl py-2 px-8 my-4 shadow-indigo w-full transition-all duration-200 ease-in-out"
      onClick={() => void(0)}
      >
      <div className='flex w-full items-center justify-between h-9'>
        <p className='text-2xl font-light w-24'>buy now</p>
        <div className='flex'>
          <Image src="/eth.svg" height={28} width={28} alt="ethereum" />
          <div className='flex items-center'>
            <h1 className='text-xl font-normal ml-1'>{props.buyNowPrice}</h1>  
          </div>
        </div>
      </div>
    </button>
  )
}

export default EthButton
