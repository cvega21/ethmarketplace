import React, { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import PageLayout from '../constants/PageLayout';
import ActionButton from '../components/ActionButton';
import Web3 from "web3";
import Web3Modal from "web3modal";
import { useAppContext } from '../contexts/AppContext'
import Image from 'next/image';
import BN from 'bn.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { getShortAddress, getMediumAddress } from '../utils/utils';
const ModelViewer = require('@metamask/logo');
const meshJson = require('../misc/metamask-logo/flask-fox.json');

const MetamaskLogo = () => {
  let fox = useRef();

  useEffect(() => {
    fox.current = ModelViewer({
      pxNotRatio: true,
      width: 500,
      height: 400,
      followMouse: true,
      slowDrift: false,
      meshJson
    }).container  

    return () => {
    }
  }, [])

  // ReactDOM.render(fox.current,)
}

const Account = () => {
  const appContext = useAppContext();
  const [shortAccount, setShortAccount] = useState<String>('');
  const [ethBalance, setEthBalance] = useState<Number>();
  const [MetamaskLogo, setMetamaskLogo] = useState<any>();
  const metamask = useRef(null);
  
  useEffect(() => {
    const initEthereum = async () => {
      if (window.ethereum.selectedAddress) {
        const web3 = new Web3;
        
        await appContext?.connectMetamask();
        const weiBalance = await window.ethereum.request({ method: 'eth_getBalance', params: [appContext?.account, 'latest'] });
        const ethBalance = web3.utils.fromWei(weiBalance, 'ether')
        setEthBalance(parseInt(ethBalance));
        setShortAccount(getMediumAddress(appContext?.account as string));
        const metamaskSVG = document.getElementById('metamask-svg');
      }
    }

    initEthereum();
    
    appContext?.addWalletListener();

  }, [appContext])
  
  // useEffect(() => {
  //   if (metamask.current && !window.ethereum.selectedAddress) {
  //     const viewer = ModelViewer({
  //       pxNotRatio: true,
  //       width: 500,
  //       height: 400,
  //       followMouse: true,
  //       slowDrift: false,
  //       meshJson
  //     });

  //     viewer.container.setAttribute('id', 'metamask-svg');
  //     console.log(viewer.container);
  //     // @ts-ignore: Object is possibly 'null'.
  //     metamask.current.appendChild(viewer.container);
  //   } else if (window.ethereum.selectedAddress) {
  //     try {
  //       const metamaskContainer = document.getElementById('metamask-container');
  //       // @ts-ignore: Object is possibly 'null'.
  //       metamaskContainer.removeChild(metamask.current);
  //       const metamaskSVG = document.getElementById('metamask-svg');
  //       // @ts-ignore: Object is possibly 'null'.
  //       // metamask.current.removeChild(metamaskSVG);
  //     } catch (e) {
  //       console.error(e);
  //     }
  //   }
  // }, [appContext])

  

  return (
    <PageLayout>
      <div className="text-center flex w-full flex-col lg:flex-1 justify-center items-center h-full">
        <div className="flex flex-col w-6/12 min-w-min md:w-3/12 lg:w-2/12">
          {appContext?.account ? 
          <div className='flex flex-col items-center'>
            <div className='flex w-6/12 min-w-full'>
              <div className='rounded-full relative group cursor-pointer w-72 flex'>
                <Image 
                  src='/avi_placeholder.png' 
                  height='200' 
                  width='200' 
                  alt='avatar placeholder'
                  className='rounded-full group-hover:opacity-60 min-w-full min-h-full'
                />
                <FontAwesomeIcon 
                  icon={faEdit}
                  className='absolute left-1/2 top-1/2 text-white text-3xl opacity-0 group-hover:opacity-100 transform -translate-x-6 -translate-y-2'
                />
              </div>
              <div className='flex flex-col justify-center text-left'>
                <h1 className='text-gray-100 font-bold text-5xl my-2'>Vitalik Buterin</h1>
                <h2 className='text-indigo-400 font-thin text-4xl'>@vbuterin</h2>
                <h1 className='text-gray-500 font-light text-xl my-2'>{appContext?.account}</h1>
              </div>
            </div>
            <div className='flex mt-12 items-center w-full h-24 border-t border-gray-500'>
              <h1 className='text-gray-300 font-medium text-4xl mr-2'>total balance: </h1>
              <h1 className='text-gray-500 font-light text-3xl mt-1 flex items-center justify-center'>
                <Image src="/eth.svg" height={28} width={28} alt="ethereum" />
                {ethBalance}
              </h1>
            </div>
          </div>
          :

          <>
          <div id='metamask-container'>
            <div ref={metamask}/>
          </div>
            <button 
              className='bg-indigo-700 rounded-lg hover:bg-indigo-800 text-gray-100 hover:text-white font-medium text-xl py-2 px-8 my-4 shadow-indigo w-full transition-all duration-200 ease-in-out'
              onClick={() => appContext?.connectMetamask()}
            >
                <p>connect to metamask</p>
            </button>
          </>
          }
        </div>
      </div>
    </PageLayout>
  )
}

export default Account
