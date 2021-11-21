import React, { useState, useEffect, useContext } from 'react'
import NavBar from '../components/NavBar'
import TextInput from '../components/TextInput'
import EthInput from '../components/EthInput'
import ConnectMetamask from '../components/ConnectMetamask'
import ModalView from '../components/ModalView'
import Image from 'next/image'
import Typed from 'typed.js';
import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { collection, getFirestore, doc, setDoc, addDoc, query, where, getDocs  } from "firebase/firestore";
import { db } from '../constants/firebase'
import { useAppContext } from '../contexts/AppContext';
import PageLayout from '../constants/PageLayout'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Router from 'next/router';
import { IProduct, INFTMetadata } from '../types/types'
import pinJSONToIPFS from '../utils/pinJSONToIPFS';
import axios from 'axios';
import MetamaskFox from '../public/MetaMask_Fox.svg'
import { mintNFT } from '../utils/utils'

const storage = getStorage();

const Sell = () => {
  const appContext = useAppContext();
  const [buyNowPrice, setBuyNowPrice] = useState(0.0005);
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File|null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [condition, setCondition] = useState('brand new');
  const [deliveryOpts, setDeliveryOpts] = useState('shipping + pickup');
  const [isLoading, setIsLoading] = useState(false);
  const [productUploaded, setProductUploaded] = useState(false);
  const [errorUploading, setErrorUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  
 useEffect(() => {
  const initEthereum = async () => {
    if (window.ethereum.selectedAddress) {
      await appContext?.connectMetamask();
      console.log('inside useeffect. account:', appContext?.account);
      console.log('inside useeffect. name:', appContext?.name);
    }
  }

  initEthereum();
  
  appContext?.addWalletListener();

  const q = query(collection(db, 'users'), where('address','==',appContext?.account));
    
    (async () => {
      const queryRef = await getDocs(q);
      const querySnapshot = queryRef.docs;
      let counter = 0;
            
      querySnapshot.forEach((doc) => {
        const { name, twitter } = doc.data();
        
        if (counter === 0) {
          appContext?.setName(name);
        }
      })
    })()
  
  }, [appContext])

  const listItem = async () => {
    setIsLoading(true);  
    
    try {
      window.scrollTo(0, 0);

      const productsQuery = query(collection(db, 'products'), where('ownerAddress','==',appContext?.account), where('forSale','==',true));
      const productsDocs = await getDocs(productsQuery);

      productsDocs.forEach((doc) => {
        console.log(doc.data());
      })

      if (productsDocs.size >= 4) {
        setErrorUploading(true);
        setIsLoading(false);
        setErrorMessage('you have hit the limit of 4 active listings.')
        setTimeout(() => {
          setErrorUploading(false)
        }, 5000)
        return
      }

      const currentDate = new Date().toLocaleDateString();
      const filePath = `listed-products/${image?.name}`;
      const storageRef = ref(storage, filePath);
      const fileUpload = await uploadBytes(storageRef, image as File);
      const downloadURL = await getDownloadURL(ref(storageRef));
      const newProductRef = doc(collection(db, 'products'));



      const pinataResponse = await axios.post(`/api/metadata/post`, {
        title: title,
        description: description,
        imagePath: downloadURL
      })

      // const pinataResponse = await pinJSONToIPFS(NFTMetadata);
      if (pinataResponse.status !== 200) {
          return {
              success: false,
              status: "😢 Something went wrong while uploading your tokenURI.",
          }
      }

      
      if (appContext?.account === '' || appContext?.name === '') {
        setErrorUploading(true);
        setIsLoading(false);
        setErrorMessage('could not find eth account. please refresh page or re-connect to metamask.')
        setTimeout(() => {
          setErrorUploading(false)
        }, 5000)
        return
      }
      
      
      const product: IProduct = {
        title: title,
        description: description,
        buyNowPrice: buyNowPrice,
        location: location,
        imagePath: downloadURL,
        refString: newProductRef.id,
        tokenURI: pinataResponse.data.tokenURI,
        listedSince: currentDate,
        ownerAddress: appContext?.account as string,
        ownerName: appContext?.name as string,
        condition: condition,
        deliveryOpts: deliveryOpts,
        forSale: true
      }
      
      await setDoc(newProductRef, product);
      console.log('set doc. minting NFT...')
      console.log('account:', appContext?.account);
      console.log('tokenURI:', pinataResponse.data.tokenURI);
      await mintNFT(appContext?.account as string, pinataResponse.data.tokenURI);
      setProductUploaded(true);
      setIsLoading(false);
      setTimeout(() => {
        Router.push('/buy');
      }, 2500)
    } catch (e) {
      console.error('error!!!' + e)
    }
  }

  const changeInput = (e: React.ChangeEvent<HTMLInputElement>, setState: React.Dispatch<React.SetStateAction<any>>) => {
    let newValue = e.currentTarget.value;
    setState(newValue);
  }

  const changeTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>, setState: React.Dispatch<React.SetStateAction<any>>) => {
    let newValue = e.currentTarget.value;
    setState(newValue);
  }

  const changeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;
    setImagePreview(URL.createObjectURL(fileList[0]));
    setImage(fileList[0]);
  }

  return (
    <PageLayout>
      <div className="flex flex-col w-full items-center text-center">
        <div className="flex flex-col items-center text-center w-full relative overflow-hidden min-h-screen h-full">
          <h1 className="text-white text-4xl font-light my-14">sell your stuff</h1>
          {isLoading ? 
          <>
          <div className='text-white absolute overflow-hidden z-40'>
            <div className='bg-gray-900 w-screen opacity-50 h-screen'></div>
          </div>
          <FontAwesomeIcon icon={faCircleNotch} className='text-indigo-500 z-50 absolute top-64 text-7xl animate-spin'/>
          </>
          : productUploaded ?
          <>
            <div className='text-white absolute overflow-hidden z-40'>
              <div className='bg-gray-900 w-screen opacity-50 h-screen'></div>
            </div>
            <div className='text-white font-extralight absolute top-64 text-6xl bg-green-600 z-50 rounded-xl p-4 w-10/12 lg:w-auto lg:max-w-2xl'>
              <h2 className='pb-4'>🎉</h2>  
              <h2><p className='font-normal'>{`${title}`}</p> is now live!</h2>
            </div>
          </>
          : errorUploading ?
          <>
            <div className='text-white absolute overflow-hidden z-40'>
              <div className='bg-gray-900 w-screen opacity-50 h-screen'></div>
            </div>
            <div className='text-white font-extralight absolute top-64 text-4xl bg-red-300 z-50 rounded-xl p-4 w-10/12 lg:w-auto lg:max-w-2xl'>
              <h2>error listing item. </h2>
              <h2>{errorMessage}</h2>
            </div>
          </>
          : !appContext?.account ? 
              <ModalView>
              <div className='w-full bg-black rounded-2xl py-8 px-16 flex flex-col items-center justify-between shadow-indigoDark'>
                <Image src={MetamaskFox} width={200} height={200} alt={'fox'}/>
                <div className='my-6'>
                  <ConnectMetamask/>
                </div>
              </div>
            </ModalView>
          :
          <></>
          }
          <div className="md:mt-0 w-11/12 lg:w-5/12 fadeDown">
            <form action="#" method="POST">
              <div className="shadow sm:rounded-md sm:overflow-hidden">
                <div className="px-4 py-5 space-y-6 sm:p-6">
                  <TextInput 
                    changeInput={changeInput} 
                    setState={setTitle}
                    currentState={title} 
                    title={"i'm selling a..."} 
                    placeholder={'e.g. louis bag'} 
                    options={[]} 
                    textArea={false}
                  />
                  <TextInput 
                    changeInput={changeInput} 
                    setState={setCondition}
                    currentState={condition} 
                    title={"condition"} 
                    placeholder={''} 
                    options={['brand new', 'like new', 'decent', 'rugged', 'near death']} 
                    textArea={false}
                  />
                  <TextInput 
                    changeInput={changeInput} 
                    setState={setDescription}
                    currentState={description} 
                    title={"description"} 
                    placeholder={'e.g. These sneakers are straight fire'} 
                    options={[]} 
                    textArea={true} 
                  />
                  <EthInput
                    changeInput={changeInput}
                    setState={setBuyNowPrice}
                    currentState={buyNowPrice}
                    title={'price'}
                    defaultVal={'0.0001'}
                  />
                  <TextInput 
                    changeInput={changeInput} 
                    setState={setLocation}
                    currentState={location} 
                    title={"location"} 
                    placeholder={'e.g. Austin, TX'} 
                    options={[]} 
                    textArea={false} 
                  />
                  <TextInput 
                    changeInput={changeInput} 
                    setState={setDeliveryOpts}
                    currentState={deliveryOpts} 
                    title={"delivery options"} 
                    placeholder={''} 
                    options={['shipping + pickup', 'shipping only', 'pickup only']} 
                    textArea={false}
                  />
                  <div>
                    <label className="block text-md text-left font-medium text-white mb-2">
                      Photo
                    </label>
                    <div className="relative min-h-48">
                      {
                        imagePreview ?
                        <div className="mt-1 flex flex-col items-center pt-6 h-auto">
                          <div className="relative h-40 w-full">
                            <Image src={imagePreview} alt={imagePreview} layout='fill' objectFit='cover'></Image>
                          </div>
                        </div>
                            :
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                              <div className="space-y-1 text-center">
                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <div className="relative flex text-sm text-gray-600 justify-center">
                                  <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-indigo-400 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                    <input accept="image/*" id="file-upload" name="file-upload" type="file" className="sr-only" onChange={changeImage}/>
                                    <span>Upload a file</span>
                                    </label>
                                </div>
                                <p className="text-xs text-gray-500">
                                  PNG, JPG, GIF up to 10MB
                                </p>
                              </div>
                            </div>
                      }
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 text-right sm:px-6 mb-10">
                  <button 
                    type='button'
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    onClick={listItem}  
                    disabled={isLoading}
                    >
                    List For Sale
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

export default Sell