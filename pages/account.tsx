import React, { useEffect, useRef, useState } from 'react';
import { getAuth } from 'firebase/auth';
import Image from 'next/image';
import Head from 'next/head'
import { collection, doc, setDoc, query, where, getDocs, getDoc  } from "firebase/firestore";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch, faEdit, faLocationArrow } from '@fortawesome/free-solid-svg-icons';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import ConnectMetamask from '../components/ConnectMetamask'
import ChromeLink from '../components/ChromeLink';
import Footer from '../components/Footer';
import ModalView from '../components/ModalView';
import Product from '../components/Product';
import WarningBanner from '../components/WarningBanner';
import PageLayout from '../constants/PageLayout';
import { db, firebase } from '../constants/firebase';
import { useAppContext } from '../contexts/AppContext';
import MetamaskFox from '../public/MetaMask_Fox.svg';
import { IProduct, IUser } from '../types/types';
import { changeInput, useEthereum } from '../utils/utils';

const Account = () => {
  const appContext = useAppContext();
  const [newUser, setNewUser] = useState<boolean>(true);
  const [infoHasChanged, setInfoHasChanged] = useState<boolean>(false);
  const [twitter, setTwitter] = useState<string>('');
  const [productsArr, setProductsArr] = useState<Array<IProduct>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { ethBalance } = useEthereum();
  const auth = getAuth(firebase);

  useEffect(() => {
    console.log('inside useeffect')

    // when context account is updated after metamask injects the object, search for the user's info in Firestore
    if (appContext?.account) {
      setIsLoading(true);
      
      (async () => {
        console.log('checking if user exists...')
        const userRef = doc(db, 'users', appContext?.account as string);
        const userDoc = await getDoc(userRef);
        
        // use 'name' field as proxy for user existence (there will be a record with the userID on first login, with only a nonce field populated under /metadata/auth)
        if (userDoc.exists() && userDoc.data().name) {
          // if existing user, load their data. 
          const { name, twitter } = userDoc.data();
          appContext?.setName(name);
          setTwitter(twitter);
          setNewUser(false);
        } else if (userDoc.exists()) {
          // if new user, leave fields empty
          setNewUser(true);
          setInfoHasChanged(false);
          appContext.setName('');
          setTwitter('');
        }
        
        // after getting user's info, get their products 
        // can this be moved to get static props for SSR? yes but it would require a change from account page for user's own profile -> using public profile page
        if (productsArr.length === 0) {
          const productsQuery = query(collection(db, 'products'), where('ownerAddress','==',appContext?.account));
          const productsDocs = await getDocs(productsQuery);
          productsDocs.forEach((doc) => {
            const product = doc.data();
            setProductsArr(productsArr => [...productsArr, product as IProduct])
          });
        }

      })()
      setIsLoading(false);
    }

  }, [appContext?.account])


  const saveChanges = async () => {
    setIsLoading(true);  
    
    try {
      const newUserRef = doc(db, 'users', appContext?.account as string);
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
      <Head>
        <title>firechain | account</title>
      </Head>
      <WarningBanner/>
      <div className="text-center flex w-full flex-col justify-center items-center h-full mb-10">
        <div className="flex flex-col items-center text-center w-full relative overflow-hidden h-full">
          {isLoading ? 
            <ModalView>
              {/* <div className='absolute overflow-hidden z-40'>
                <div className='bg-gray-900 w-screen h-screen opacity-50'></div>
              </div> */}
              <FontAwesomeIcon icon={faCircleNotch} className='text-indigo-500 text-7xl animate-spin absolute z-50 top-48'/>
            </ModalView>
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
                      className='text-indigo-400 font-thin text-2xl my-2 bg-transparent outline-none focus:ring-indigo-800'
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
                    <h2 className={`text-indigo-400 text-opacity-40 font-thin text-2xl ${twitter ? 'text-opacity-100' : ''}`}>@</h2>
                    <input 
                      className='text-indigo-400 font-thin text-2xl my-2 bg-transparent focus:ring-0 outline-none focus:ring-indigo-800 focus:border-transparent placeholder-indigo-400 placeholder-opacity-40 w-full group-focus:text-white' 
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
                    className='text-indigo-400 font-thin lg:text-xl md:text-md text-sm my-2 bg-transparent outline-none focus:ring-indigo-800 break-all'
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
            <div className="flex-col grid lg:grid-cols-3 md:grid-cols-2 gap-12 w-9/12 lg:w-9/12 mt-12 items-center fadeDown">
              {productsArr.map((product: IProduct) => {
                return (
                  <Product
                    buyNowPrice={product.buyNowPrice}
                    condition={''}
                    deliveryOpts={''}
                    description={product.description}
                    forSale={product.forSale}
                    imagePath={product.imagePath}
                    key={product.refString}
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
            <div className='w-auto bg-black rounded-2xl py-8 px-16 flex flex-col items-center justify-between shadow-indigoDark m-8'>
              <Image src={MetamaskFox} width={200} height={200} alt={'fox'}/>
              <div className='h-full my-4'>
                <ConnectMetamask/>
              </div>
              <ChromeLink/>
            </div>
          </>
        }
        </div>
      </div>
      <Footer/>
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
              className='text-indigo-400 font-thin lg:text-xl my-2 bg-transparent outline-none focus:ring-indigo-800 break-all md:text-md text-sm'
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