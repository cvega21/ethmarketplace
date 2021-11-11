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
import { faCircleNotch, faEdit, faUserAstronaut } from '@fortawesome/free-solid-svg-icons';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import { getShortAddress, getMediumAddress } from '../utils/utils';
import { IUser } from '../types/types'
import { changeInput } from '../utils/utils'
import { db } from '../constants/firebase'
import { collection, getFirestore, doc, setDoc, addDoc, query, where, getDocs  } from "firebase/firestore";

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
  const [shortAccount, setShortAccount] = useState<string>('');
  const [newUser, setNewUser] = useState<boolean>(true);
  const [userID, setUserID] = useState<string>('');
  const [infoHasChanged, setInfoHasChanged] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [twitter, setTwitter] = useState<string>('');
  const [ethBalance, setEthBalance] = useState<string>('');
  // const [MetamaskLogo, setMetamaskLogo] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const metamask = useRef(null);
  
  useEffect(() => {
    const initEthereum = async () => {
      if (window.ethereum.selectedAddress) {
        const web3 = new Web3;
        
        await appContext?.connectMetamask();
        const weiBalance = await window.ethereum.request({ method: 'eth_getBalance', params: [appContext?.account, 'latest'] });
        const ethBalance = web3.utils.fromWei(weiBalance, 'ether')
        setEthBalance(parseFloat(ethBalance).toFixed(2));
        setShortAccount(getMediumAddress(appContext?.account as string));
        const metamaskSVG = document.getElementById('metamask-svg');
      }
    }

    initEthereum();
    
    appContext?.addWalletListener();

    if (appContext?.account === '') {
      setShortAccount('');
      setNewUser(true);
      setUserID('');
      setInfoHasChanged(false);
      setName('');
      setTwitter('');
    }

    
  }, [appContext])
  
  useEffect(() => {
    //does the account already exist in the DB? if it does, load its info in state. If it doesn't, load empty profile and create a new record in DB
    setIsLoading(true);
    
    console.log(appContext?.account);
    const q = query(collection(db, 'users'), where('address','==',appContext?.account));
    
    (async () => {
      const queryRef = await getDocs(q);
      const querySnapshot = queryRef.docs;
      let counter = 0;
      
      localStorage.setItem('name',name);
      
      querySnapshot.forEach((doc) => {
        const { name, twitter } = doc.data();
        console.log('checking for name and twitter...')
        console.log(name);
        console.log(twitter);
        
        if (counter === 0) {
          setUserID(doc.id)
          setName(name);
          setTwitter(twitter);
          setNewUser(false);
        }
      })
    })()
    
    setIsLoading(false);
  }, [appContext])

  const saveChanges = async () => {
    setIsLoading(true);  
    
    try {
      const newUserRef = doc(collection(db, 'users'));
      const newUser: IUser = {
        address: appContext?.account as string,
        permissions: 'user',
        name: name,
        twitter: twitter
      }
  
      await setDoc(newUserRef, newUser);
    } catch (e) {
      console.error('uh-oh. error: ', e);
    }

    setInfoHasChanged(false);  
    setNewUser(false);  
    setIsLoading(false);  
  }
  
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
      <div className="text-center flex w-full flex-col lg:flex-1 justify-start items-center h-full">
        <div className="flex flex-col w-6/12 min-w-min md:w-3/12 lg:w-full items-center">
          {isLoading ? 
            <>
              <div className='absolute overflow-hidden z-40'>
                <div className='bg-gray-900 w-screen h-screen opacity-50'></div>
              </div>
              <FontAwesomeIcon icon={faCircleNotch} className='text-indigo-500 text-7xl animate-spin absolute z-50 top-48'/>
            </>
          : 
            <></>
          }
          
          {appContext?.account ? 
          <div className='flex flex-col items-center fadeDown mt-20'>
            <div className='flex w-6/12 min-w-full'>
              <div className='rounded-full relative group cursor-pointer w-72 '>
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
              <div className='flex h-60 flex-col justify-start text-left'>
                <div className="flex items-center group text-gray-500 focus-within:text-white">
                  <FontAwesomeIcon 
                    icon={faUserAstronaut}
                    className={`text-3xl mr-4 ${name ? 'text-white' : ''} transition-all duration-300`}
                  />
                  <input 
                    className='text-gray-100 font-semibold text-5xl my-2 bg-transparent focus:ring-0 outline-none focus:ring-indigo-800 focus:border-transparent placeholder-gray-600' 
                    placeholder="enter your name"
                    onChange={e => {
                      changeInput(e, setName);
                      setInfoHasChanged(true);
                    }}
                    disabled={newUser ? false : true}
                    value={name}
                    ></input>
                </div>
                <div className='flex items-center group text-gray-500 focus-within:text-white'>
                  <FontAwesomeIcon 
                    icon={faTwitter}
                    className={`text-3xl mr-4 ${twitter ? 'text-white' : ''} transition-all duration-300`}
                    />
                  <h2 className={`text-indigo-400 text-opacity-40 font-thin text-4xl ${twitter ? 'text-opacity-100' : ''}`}>@</h2>
                  <input 
                    className='text-indigo-400 font-thin text-4xl my-2 bg-transparent focus:ring-0 outline-none focus:ring-indigo-800 focus:border-transparent placeholder-indigo-400 placeholder-opacity-40 w-full group-focus:text-white' 
                    placeholder="enter your twitter handle"
                    onChange={e => {
                      changeInput(e, setTwitter);
                      setInfoHasChanged(true);
                    }}
                    disabled={newUser ? false : true}
                    value={twitter}
                    />
                </div>
                <h1 className='text-gray-500 font-light text-xl my-2'>{appContext?.account}</h1>
                {infoHasChanged ? 
                  <button 
                    className='w-1/2 bg-indigo-700 rounded-lg hover:bg-indigo-800 text-gray-100 hover:text-white font-medium text-xl py-2 px-8 my-4 shadow-indigo transition-all duration-200 ease-in-out'
                    onClick={() => saveChanges()}
                    >
                    <p>save changes</p>
                  </button>

                  :

                  <></>
                  
                }
              </div>
            </div>
            <div className='flex mt-6 items-center w-full h-24 border-t border-gray-500'>
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
