import React, { useEffect, useState } from 'react'
import PageLayout from '../constants/PageLayout';
import ActionButton from '../components/ActionButton';
import Web3 from "web3";
import Web3Modal from "web3modal";
import { useAppContext } from '../contexts/AppContext'

const providerOptions = {
  /* See Provider Options Section */
};




const Account = () => {
  const appContext = useAppContext();

  const [account, setAccount] = useState('');

  const connectMetamask = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts'});
    const account = accounts[0];
    setAccount(account);
  }


  

  return (
    <PageLayout>
      <div className="text-center flex w-full flex-col lg:flex-1 justify-center items-center h-full">
        <div className="flex flex-col w-6/12 min-w-min md:w-3/12 lg:w-2/12">
          {appContext?.account ? 
          <div className='text-white'>
            <p>{appContext?.account}</p>
          </div>
          :
          <></>
          }
          <button 
            className='bg-indigo-700 rounded-lg hover:bg-indigo-800 text-gray-100 hover:text-white font-medium text-xl py-2 px-8 my-4 shadow-indigo w-full transition-all duration-200 ease-in-out'
            onClick={() => appContext?.connectMetamask()}
            >
              connect to metamask
          </button>
        </div>
      </div>
    </PageLayout>
  )
}

export default Account
