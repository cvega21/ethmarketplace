import React, { useEffect } from 'react'
import PageLayout from '../constants/PageLayout';
import ActionButton from '../components/ActionButton';
import Web3 from "web3";
import Web3Modal from "web3modal";

const providerOptions = {
  /* See Provider Options Section */
};


let web3Modal: any;
if (typeof window !== 'undefined') {
  web3Modal = new Web3Modal({
    network: 'mainnet', // optional
    cacheProvider: true,
    providerOptions, // required
  })
}


const Account = () => {
  

  return (
    <PageLayout>
      <div className="text-center flex w-full flex-col lg:flex-1 justify-center items-center h-full">
        <div className="flex flex-col w-6/12 min-w-min md:w-3/12 lg:w-2/12">
          <ActionButton theme='dark' link='#'>
          </ActionButton>
          <button className='text-white'>
            <div>
              connect to metamask
            </div>
          </button>
        </div>
      </div>
    </PageLayout>
  )
}

export default Account
