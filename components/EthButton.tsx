import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Web3 from "web3";
import { useAppContext } from '../contexts/AppContext';

const EthButton = (props: any) => {
  const appContext = useAppContext();
  const web3 = new Web3;
  
  const sendTransaction = () => {
  }

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
      className="bg-indigo-200 hover:bg-indigo-300 text-indigo-800 hover:text-indigo-900 font-medium text-xl py-2 px-8 my-4 rounded-lg shadow-indigo w-full transition-all duration-200 ease-in-out"
      onClick={sendTransaction}
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
