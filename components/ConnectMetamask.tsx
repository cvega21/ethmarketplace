import React from 'react'
import { useAppContext } from '../contexts/AppContext';
import { isMobile } from 'react-device-detect';

const ConnectMetamask = () => {
  const appContext = useAppContext();
  const APP_DEEP_LINK = 'https://metamask.app.link/dapp/firecha.in';
  
  const mobileDeepLink = () => {
    if (window.location.href !== APP_DEEP_LINK) {
      location.assign(APP_DEEP_LINK);
    }

    appContext?.connectMetamask();
  }

  return (
    <button 
      className='bg-indigo-700 rounded-lg hover:bg-indigo-800 text-gray-100 hover:text-white font-light text-xl py-2 px-8 shadow-indigo w-full transition-all duration-200 ease-in-out'
      onClick={isMobile ? () => mobileDeepLink() : () => appContext?.connectMetamask()}
    >
      <p>connect to metamask</p>
    </button>
  )
}

export default ConnectMetamask
