import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import PageLayout from '../constants/PageLayout';
import ActionButton from '../components/ActionButton';
import Web3 from "web3";
import Web3Modal from "web3modal";
import { useAppContext } from '../contexts/AppContext';
import Image from 'next/image';
import BN from 'bn.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch, faEdit, faUserAstronaut, faLocationArrow, faUser } from '@fortawesome/free-solid-svg-icons';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import { getShortAddress, getMediumAddress } from '../utils/utils';
import { IProduct, IUser } from '../types/types';
import { changeInput } from '../utils/utils';
import { db } from '../constants/firebase';
import { collection, getFirestore, doc, setDoc, addDoc, query, where, getDocs  } from "firebase/firestore";
import Product from '../components/Product';
import ConnectMetamask from '../components/ConnectMetamask'
import ModalView from '../components/ModalView';
import MetamaskFox from '../public/MetaMask_Fox.svg'

const Account = () => {
  const appContext = useAppContext();
  const [shortAccount, setShortAccount] = useState<string>('');
  const [newUser, setNewUser] = useState<boolean>(true);
  const [userID, setUserID] = useState<string>('');
  const [infoHasChanged, setInfoHasChanged] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [twitter, setTwitter] = useState<string>('');
  const [ethBalance, setEthBalance] = useState<string>('');
  const [productsArr, setProductsArr] = useState<Array<IProduct>>([]);
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
      }
    }

    initEthereum();
    
    appContext?.addWalletListener();

    if (appContext?.account === '') {
      setShortAccount('');
      setNewUser(true);
      setUserID('');
      setInfoHasChanged(false);
      appContext.setName('');
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
            
      querySnapshot.forEach((doc) => {
        const { name, twitter } = doc.data();
        
        if (counter === 0) {
          setUserID(doc.id)
          // setName(name);
          appContext?.setName(name);
          setTwitter(twitter);
          setNewUser(false);
        }
      })
    })()
    
    setIsLoading(false);
  }, [appContext])

  useEffect(() => {

    (async () => {
      if (appContext?.account && productsArr.length === 0) {
        const productsQuery = query(collection(db, 'products'), where('ownerAddress','==',appContext?.account));
        const productsDocs = await getDocs(productsQuery);
      
        productsDocs.forEach((doc) => {
          const product = doc.data();
          setProductsArr(productsArr => [...productsArr, product as IProduct])
        });
      }
    })()
    
    return () => {
    }
  }, [appContext?.account, productsArr])


  const saveChanges = async () => {
    setIsLoading(true);  
    
    try {
      const newUserRef = doc(collection(db, 'users'));
      const newUser: IUser = {
        address: appContext?.account as string,
        permissions: 'user',
        name: appContext?.name as string,
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

  return (
    <PageLayout>
      <div className="text-center flex w-full flex-col lg:flex-1 justify-center items-center h-full">
        <div className="flex flex-col items-center w-full overflow-hidden h-full">
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
           
          <div className='flex flex-col w-full items-center fadeDown lg:mt-20 mt-12'>
            <div className='flex flex-col w-full h-auto items-center justify-center md:flex-row lg:flex-row'>
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
              <div className='flex lg:w-auto  px-8 flex-col justify-center text-left mt-4'>
                <div className="flex items-center text-white">
                  <input 
                    className='text-gray-100 font-bold lg:text-5xl text-3xl my-2 bg-transparent focus:ring-0 outline-none focus:ring-indigo-800 focus:border-transparent placeholder-indigo-400 placeholder-opacity-40 w-full' 
                    placeholder="enter your name"
                    onChange={e => {
                      changeInput(e, appContext.setName);
                      setInfoHasChanged(true);
                    }}
                    disabled={newUser ? false : true}
                    value={appContext.name}
                    ></input>
                </div>
                {!newUser ? 

                  <div className="flex items-center text-indigo-200">
                    <div className='lg:pr-6 pr-4'>
                      <FontAwesomeIcon 
                        icon={faTwitter}
                        className={`lg:text-3xl text-xl transition-all duration-300`}
                      />
                    </div>
                    <a 
                      className='text-indigo-400 font-thin lg:text-4xl text-2xl my-2 bg-transparent outline-none focus:ring-indigo-800'
                      href={`https://www.twitter.com/${twitter}`}
                      target="_blank"
                      rel="noreferrer"
                      >
                      {`@${twitter}`}
                    </a>
                  </div>
                  
                  : 
                  
                  <div className='flex items-center group text-gray-500 focus-within:text-white'>
                    <div className='lg:pr-6 pr-4'>
                      <FontAwesomeIcon 
                        icon={faTwitter}
                        className={`lg:text-3xl text-xl ${twitter ? 'text-indigo-200' : ''} transition-all duration-300`}
                        />
                    </div>
                    <h2 className={`text-indigo-400 text-opacity-40 font-thin lg:text-4xl text-xl ${twitter ? 'text-opacity-100' : ''}`}>@</h2>
                    <input 
                      className='text-indigo-400 font-thin lg:text-4xl text-xl my-2 bg-transparent focus:ring-0 outline-none focus:ring-indigo-800 focus:border-transparent placeholder-indigo-400 placeholder-opacity-40 w-full group-focus:text-white' 
                      placeholder="enter your twitter"
                      onChange={e => {
                        changeInput(e, setTwitter);
                        setInfoHasChanged(true);
                      }}
                      disabled={newUser ? false : true}
                      value={twitter}
                    />
                  </div>
                }
                <div className="flex items-center text-indigo-200">
                  <div className='lg:pr-6 pr-4 flex justify-start'>
                    <FontAwesomeIcon 
                      icon={faLocationArrow}
                      className={`lg:text-3xl text-xl transition-all duration-300`}
                    />
                  </div>
                  <a 
                    className='text-indigo-400 font-thin lg:text-xl text-lg my-2 bg-transparent outline-none focus:ring-indigo-800 break-all'
                    href={`https://etherscan.io/address/${appContext?.account}`} 
                    target="_blank" 
                    rel="noreferrer"
                    >
                    {appContext?.account}
                  </a>
                </div>
                {infoHasChanged ? 
                  <button 
                    className='w-full lg:w-1/2 bg-indigo-700 rounded-lg hover:bg-indigo-800 text-gray-100 hover:text-white font-medium text-xl py-2 px-8 my-4 shadow-indigo transition-all duration-200 ease-in-out'
                    onClick={() => saveChanges()}
                    >
                    <p>save changes</p>
                  </button>

                  :

                  <></>
                  
                }
              </div>
            </div>
            <div className='flex my-6 lg:my-12 items-center justify-center w-10/12 lg:w-1/4 bg-black p-4 border border-gray-500 rounded-3xl text-2xl'>
              <h1 className='text-gray-300 font-medium mr-2'>total balance: </h1>
              <h1 className='text-gray-500 font-light mt-1 flex items-center justify-center'>
                <Image src="/eth.svg" height={28} width={28} alt="ethereum" />
                {ethBalance}
              </h1>
            </div>
            <div className='w-full text-xl flex border-b border-gray-700 justify-center lg:mb-14 h-14'>
              <div className={` border-indigo-400 hover:text-indigo-400 p-4 lg:mx-4 border-b-2 h-14 transition duration-200 ease-in-out text-gray-300 font-thin cursor-pointer`}>
                <h2>Featured</h2>
              </div>
              <div className={` hover:border-indigo-400 hover:text-indigo-400 p-4 lg:mx-4 border-b-2 border-opacity-0 h-14 transition duration-200 ease-in-out text-gray-300 font-thin cursor-pointer`}>
                <h2>Selling</h2>
              </div>
              <div className={` hover:border-indigo-400 hover:text-indigo-400 p-4 lg:mx-4 border-b-2 border-opacity-0 h-14 transition duration-200 ease-in-out text-gray-300 font-thin cursor-pointer`}>
                <h2>All NFTs</h2>
              </div>
            </div>
            <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-12 w-6/12 mt-4 items-center fadeDown">
              {productsArr.map((product: IProduct) => {
                return (
                  <Product
                    buyNowPrice={product.buyNowPrice}
                    condition={''}
                    deliveryOpts={''}
                    description={product.description}
                    forSale={product.forSale}
                    imagePath={product.imagePath}
                    key={product.imagePath}
                    listedSince={product.listedSince}
                    location={product.location}
                    ownerAddress={''}
                    ownerName={''}
                    refString={product.refString}
                    title={product.title}
                    tokenURI={product.tokenURI}
                    tokenID={1}
                  />
                )
              })}
            </div>
          </div>
          :
          <>          
            <div className='w-auto bg-black rounded-2xl py-8 px-16 flex flex-col items-center justify-between  shadow-indigoDark m-8'>
              <Image src={MetamaskFox} width={200} height={200} alt={'fox'}/>
              <div className='h-full '>
                <ConnectMetamask/>
              </div>
            </div>
          </>
        }
        </div>
      </div>
    </PageLayout>
  )
}

export const AccountBox = ({ name, twitter, address}: IUser) => {
  return (
    <div className='flex flex-col items-center fadeDown mt-8 w-full justify-center'>
      <div className='flex flex-col w-full h-auto items-center justify-center md:flex-row lg:flex-row'>
        <div className='rounded-full relative group cursor-pointer h-full lg:mr-12'>
          <Image 
            src='/avi_placeholder.png' 
            height='200' 
            width='200' 
            alt='avatar placeholder'
            className='rounded-full min-w-full min-h-full'
          />
        </div>
        <div className='flex  lg:w-auto px-8 flex-col justify-center text-left mt-4'>
          <div className="flex items-center text-white">
            <h1 className='text-gray-100 font-bold text-5xl my-2 bg-transparent focus:ring-0 outline-none focus:ring-indigo-800 focus:border-transparent placeholder-gray-600'>
              {name}
            </h1>
          </div>
          <div className="flex items-center text-indigo-200">
            <div className='lg:pr-6 pr-4'>
              <FontAwesomeIcon 
                icon={faTwitter}
                className={`lg:text-3xl text-xl transition-all duration-300`}
              />
            </div>
            <a 
              className='text-indigo-400 font-thin lg:text-4xl text-2xl my-2 bg-transparent outline-none focus:ring-indigo-800'
              href={`https://www.twitter.com/${twitter}`}
              target="_blank"
              rel="noreferrer"
              >
              {`@${twitter}`}
            </a>
          </div>
          <div className="flex items-center text-indigo-200">
            <div className='lg:pr-6 pr-4 flex justify-start'>
              <FontAwesomeIcon 
                icon={faLocationArrow}
                className={`lg:text-3xl text-xl transition-all duration-300`}
              />
            </div>
            <a 
              className='text-indigo-400 font-thin lg:text-xl text-lg my-2 bg-transparent outline-none focus:ring-indigo-800 break-all'
              href={`https://etherscan.io/address/${address}`} 
              target="_blank" 
              rel="noreferrer"
              >
              {address}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Account