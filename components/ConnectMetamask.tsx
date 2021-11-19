import React, { useEffect, useRef, useState } from 'react'
import { useAppContext } from '../contexts/AppContext';


const ConnectMetamask = () => {
  const appContext = useAppContext();

  useEffect(() => {
    const initEthereum = async () => {
      if (window.ethereum.selectedAddress) {        
        await appContext?.connectMetamask();
      }
    }

    initEthereum();
    
    appContext?.addWalletListener();
    
  }, [appContext])

  return (
    <button 
      className='bg-indigo-700 rounded-lg hover:bg-indigo-800 text-gray-100 hover:text-white font-light text-xl py-2 px-8 shadow-indigo w-full transition-all duration-200 ease-in-out'
      onClick={() => appContext?.connectMetamask()}
    >
      <p>connect to metamask</p>
    </button>
  )
}

export default ConnectMetamask