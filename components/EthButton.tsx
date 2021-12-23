import React, { useEffect } from 'react';
import Image from 'next/image';
import { useAppContext } from '../contexts/AppContext';
import { IProduct } from '../types/types';

declare let window: any;

interface IEthButton {
  buyNowPrice: Number,
  children?: React.ReactNode,
  product: IProduct,
  onClick: Function
}

interface successfulPinataResponse {
  success: boolean,
  pinataUrl: string
}

const EthButton = (props: IEthButton) => {
  const appContext = useAppContext();

  useEffect(() => {
    const initEthereum = async () => {
      if (window.ethereum.selectedAddress) {
        await appContext?.refreshMetamask();
      }
    }
    
    initEthereum();

    return () => {
    }
  }, [appContext])

  return (
    <button 
      className="bg-indigo-700 rounded-lg hover:bg-indigo-800 text-gray-100 hover:text-white font-medium text-xl py-2 px-8 my-4 shadow-indigo w-full transition-all duration-200 ease-in-out"
      onClick={() => props.onClick(props.product.tokenID, props.product.buyNowPrice.toString(), appContext?.account as string)}
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
