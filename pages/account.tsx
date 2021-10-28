import React, { useEffect, useState } from 'react'
import PageLayout from '../constants/PageLayout';
import ActionButton from '../components/ActionButton';
import Web3 from "web3";
import Web3Modal from "web3modal";
import { useAppContext } from '../contexts/AppContext'
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
<<<<<<< HEAD
import { faEdit } from '@fortawesome/free-solid-svg-icons'
=======
import { faList, faQuoteLeft } from '@fortawesome/free-solid-svg-icons'
>>>>>>> 2b229a6879c537551e0f3367203209f7c3640658

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
          <div className='rounded-full relative group cursor-pointer'>
            <Image 
              src='/avi_placeholder.png' 
              height='200' 
              width='200' 
              alt='avatar placeholder'
              className='rounded-full group-hover:opacity-60'
            />
          <FontAwesomeIcon 
            icon={faEdit}
            className='absolute left-1/2 top-1/2 text-white text-3xl opacity-0 group-hover:opacity-100'
          />
          <h1 className='text-gray-100 font-medium text-5xl my-2'>Vitalik Buterin</h1>
          <h2 className='text-indigo-400 font-thin text-4xl'>@vbuterin</h2>
          <h1 className='text-gray-400 font-light text-xl my-2'>{appContext?.account}</h1>
          </div>
          
          {appContext?.account ? 
          <div className='text-white'>
            {/* <p>{appContext?.account}</p> */}
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
