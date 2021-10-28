import React, { useEffect, useState } from 'react'
import PageLayout from '../constants/PageLayout';
import ActionButton from '../components/ActionButton';
import Web3 from "web3";
import Web3Modal from "web3modal";
import { useAppContext } from '../contexts/AppContext'
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'

const providerOptions = {
  /* See Provider Options Section */
};




const Account = () => {
  const appContext = useAppContext();

  useEffect(() => {
    window.ethereum.selectedAddresses ? appContext?.connectMetamask() : void(0);

    return () => {
    }
  }, [appContext])

  

  return (
    <PageLayout>
      <div className="text-center flex w-full flex-col lg:flex-1 justify-center items-center h-full">
        <div className="flex flex-col w-6/12 min-w-min md:w-3/12 lg:w-2/12">
          <div className='flex w-6/12 min-w-full'>
            <div className='rounded-full relative group cursor-pointer w-60 flex'>
              <Image 
                src='/avi_placeholder.png' 
                height='200' 
                width='200' 
                alt='avatar placeholder'
                className='rounded-full group-hover:opacity-60 min-w-full min-h-full'
              />
              <FontAwesomeIcon 
                icon={faEdit}
                className='absolute left-1/2 top-1/2 text-white text-3xl opacity-0 group-hover:opacity-100 transform -translate-x-2 -translate-y-2'
              />
            </div>
            <div className='flex flex-col justify-center'>
              <h1 className='text-gray-100 font-bold text-5xl my-2 text-left'>Vitalik Buterin</h1>
              <h2 className='text-indigo-400 font-thin text-4xl text-left'>@vbuterin</h2>
              <h1 className='text-gray-500 font-light text-xl my-2'>{appContext?.account}</h1>
            </div>
          </div>
          
          {appContext?.account ? 
          <div className='text-white'>
            {/* <p>{appContext?.account}</p> */}
          </div>
          :
          <button 
            className='bg-indigo-700 rounded-lg hover:bg-indigo-800 text-gray-100 hover:text-white font-medium text-xl py-2 px-8 my-4 shadow-indigo w-full transition-all duration-200 ease-in-out'
            onClick={() => appContext?.connectMetamask()}
            >
              connect to metamask
          </button>
          }
        </div>
      </div>
    </PageLayout>
  )
}

export default Account
