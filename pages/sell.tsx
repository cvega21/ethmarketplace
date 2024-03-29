import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Head from 'next/head'
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { collection, doc, setDoc, query, where, getDocs, getDoc  } from "firebase/firestore";
import axios from 'axios';
import Web3 from "web3";
import detectEthereumProvider from '@metamask/detect-provider'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TextInput from '../components/TextInput'
import EthInput from '../components/EthInput'
import ConnectMetamask from '../components/ConnectMetamask'
import ModalView from '../components/ModalView'
import ChromeLink from '../components/ChromeLink';
import PageTitle from '../components/PageTitle';
import Footer from '../components/Footer';
import WarningBanner from '../components/WarningBanner';
import { db } from '../constants/firebase'
import { useAppContext } from '../contexts/AppContext';
import PageLayout from '../constants/PageLayout'
import { IProduct } from '../types/types'
import MetamaskFox from '../public/MetaMask_Fox.svg'
import { CONTRACT_ADDRESS, MINT_PRICE, exitPage } from '../utils/utils'
import contractABI from '../build/contracts/Firechain.json';
import { useEthereum } from '../utils/utils';
var Contract = require('web3-eth-contract');
const web3 = new Web3();
 
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
  const [statusMessage, setStatusMessage] = useState('');
  const [txHash, setTxHash] = useState('');
  const [tokenID, setTokenID] = useState<Number>();
  const [productsTitleArr, setProductsTitleArr] = useState<Array<string>>([]);
  const [productsArr, setProductsArr] = useState<Array<any>>([]);
  const [productToList, setProductToList] = useState<string>('');
  const storage = getStorage();
  useEthereum();
  
  const mintNFTAndListForSale = async (tokenURI: string, price: string, account: string) => {
    const fireChainContract = new Contract(contractABI.abi, CONTRACT_ADDRESS);
    const priceInWei = web3.utils.toWei(price, 'ether');
    let eventTokenID: number = 0;
    console.log('inside mintNFTAndListForSale')

    try {
      const mintEventListener = await fireChainContract.methods.mintNFTAndListForSale(tokenURI, priceInWei).send({
        to: CONTRACT_ADDRESS,
        from: account, 
        value: web3.utils.toHex(MINT_PRICE),
      })
      .on('transactionHash', (hash: any) => {
        console.log('****TX HASH EMITTED****');
        console.log(hash);
        setStatusMessage('transaction sent! awaiting confirmation...');  
        setTxHash(hash);
      })
      .on('receipt', (receipt: any) => {
        console.log('****RECEIPT EMITTED | EVENT LISTENER****');
        console.log(receipt);
        console.log('****TOKEN ID BELOW | EVENT LISTENER****');
        console.log(receipt.events.Transfer.returnValues.tokenId);
        eventTokenID = receipt.events.Transfer.returnValues.tokenId;
        setTokenID(receipt.events.Transfer.returnValues.tokenId);
      })
      .then((receipt: any) => {
        console.log('****RECEIPT EMITTED | PROMISE****');
        console.log(receipt);
        console.log('****TOKEN ID BELOW | PROMISE****');
        console.log(receipt.events.Transfer.returnValues.tokenId);
        eventTokenID = receipt.events.Transfer.returnValues.tokenId;
        setTokenID(receipt.events.Transfer.returnValues.tokenId);
      })

      return {
        sent: true,
        tokenID: eventTokenID
      }
    } catch (e) {
      setIsLoading(false);
      setErrorUploading(true);
      setErrorMessage('something went wrong, please try again')
      setTimeout(() => {
        setErrorUploading(false);
      }, 2500)
      console.error(e);
      
      return {
        sent: false,
        tokenID: 0
      }
    }
  }
            
  useEffect(() => {
    console.log('inside useeffect')
    console.log(appContext)
    
    // when context account is updated after metamask injects the object, check if user exists and get their existing products not listed for sale
    if (appContext?.account) {
      setIsLoading(true);
      
      (async () => {
        console.log('checking if user exists...')
        const userRef = doc(db, 'users', appContext?.account as string);
        const userDoc = await getDoc(userRef);
        
        // check if user exists and has fully signed up 
        if (userDoc.exists()) {
          console.log('user exists...')
          console.log(userDoc.data());
          const { name } = userDoc.data();
          appContext?.setName(name);
        } else {
          alert('there was a problem logging in.')
        }
        
        // get their products that are not listed for sale 
        if (appContext?.account && productsArr.length === 0) {
          const productsQuery = query(collection(db, 'products'), where('ownerAddress','==',appContext?.account), where('forSale','==',false));
          const productsDocs = await getDocs(productsQuery);
        
          productsDocs.forEach((doc) => {
            const product = doc.data();
            setProductsTitleArr(productsArr => [...productsArr, product.title]);
            setProductsArr(productsArr => [...productsArr, product]);
          });
        }
        
        const provider = await detectEthereumProvider();
        console.log(`provider checked!. value:`)
        console.log(provider);
        Contract.setProvider(provider);
      })()


      setIsLoading(false);
    }
  }, [appContext?.account])

  const listNewItem = async () => {
    setIsLoading(true);
    
    try {
      setStatusMessage('creating transaction...');  
      window.scrollTo(0, 0);
      
      // Check if metamask is connected with valid account

      if (appContext?.account === '' || appContext?.name === '') {
        setErrorUploading(true);
        setIsLoading(false);
        setErrorMessage('could not find eth account. please refresh page or re-connect to metamask.')
        setTimeout(() => {
          setErrorUploading(false)
        }, 5000)

        return
      }

      // Check if the user has less than 4 listed items

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
      

      // Upload image to Firebase Storage and retrieve download URL + ref to use for key in DB

      const currentDate = new Date().toLocaleDateString();
      const filePath = `listed-products/${image?.name}`;
      const storageRef = ref(storage, filePath);
      const fileUpload = await uploadBytes(storageRef, image as File);
      const downloadURL = await getDownloadURL(ref(storageRef));
      const newProductRef = doc(collection(db, 'products'));

      // Upload metadata JSON onto Pinata/IPFS 

      const pinataResponse = await axios.post(`/api/metadata/post`, {
        title: title,
        description: description,
        imagePath: downloadURL
      })

      if (pinataResponse.status !== 200) {
          return {
              success: false,
              status: "😢 Something went wrong while uploading your tokenURI.",
          }
      }

      // Prompt metamask transaction to mint NFT

      console.log('set doc. minting NFT...')
      console.log('account:', appContext?.account);
      console.log('tokenURI:', pinataResponse.data.tokenURI);
      
      const promptMint = await mintNFTAndListForSale(pinataResponse.data.tokenURI, buyNowPrice.toString(), appContext?.account as string);
      console.log('promptMint finished. return value:')
      console.log(promptMint);
      
      if (!promptMint?.sent) {
        return false
      }
      
      console.log('prompt mint finalized.');
      
      // Persist object metadata on Firestore
      let ownerName = 'anonymous';
      if (appContext?.name) {
        ownerName = appContext?.name;
      }
      
      console.log('entering set doc...');
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
        ownerName: ownerName,
        condition: condition,
        deliveryOpts: deliveryOpts,
        forSale: true,
        tokenID: promptMint.tokenID as number
      }
      await setDoc(newProductRef, product);

      // Finish transaction and return to buy page

      setProductUploaded(true);
      setIsLoading(false);
      exitPage();
    } catch (e) {
      console.error('error!!!' + e)
    }
  }

  const listExistingItem = async (productTitle: string) => {
    setIsLoading(true);
    setStatusMessage('creating transaction...'); 
    const fireChainContract = new Contract(contractABI.abi, CONTRACT_ADDRESS);
    const priceInWei = web3.utils.toWei(buyNowPrice.toString(), 'ether');
    let newProduct: IProduct = productsArr[0];
    console.log('entering loop...')

    productsArr.forEach(async (product: IProduct) => {
      console.log('inside products arr loop')

      // need to change comparison below to be between some unique key
      if (product.title === productTitle) {
        setTitle(product.title);
        console.log('inside product title == product title')
        console.log(product)

        const currentDate = new Date().toLocaleDateString();
        newProduct = JSON.parse(JSON.stringify(product));
        
        newProduct.buyNowPrice = buyNowPrice;
        newProduct.location = location;
        newProduct.listedSince = currentDate;
        newProduct.forSale = true; 
        newProduct.deliveryOpts = deliveryOpts;
      }
    })

    try {
      console.log('inside try catch...')
      console.log(`tokenID = ${newProduct.tokenID}`)
      const listEventListener = await fireChainContract.methods.listForSale(newProduct.tokenID, priceInWei).send({
        to: CONTRACT_ADDRESS,
        from: appContext?.account, 
      })
      .on('transactionHash', (hash: any) => {
        console.log('****FIRST TX HASH EMITTED****');
        console.log(hash);
        setStatusMessage('transaction sent! awaiting confirmation...');  
        setTxHash(hash);
      })
      .on('receipt', (receipt: any) => {
        console.log('****RECEIPT EMITTED | EVENT LISTENER****');
        console.log(receipt);
      })
      .then(async (receipt: any) => {
        console.log('****FINAL RECEIPT EMITTED | PROMISE****');
        console.log(receipt);
        const productRef = doc(db, 'products', newProduct.refString);

        await setDoc(productRef, newProduct);
        setProductUploaded(true);
        setIsLoading(false);
        exitPage();
      })
      
      return {
        sent: true
      }
    } catch (e) {
      setIsLoading(false);
      setErrorUploading(true);
      setErrorMessage('something went wrong, please try again')
      setTimeout(() => {
        setErrorUploading(false);
      }, 2500)

      console.error(e);
      
      return {
        sent: false,
        tokenID: 0
      }
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
      <Head>
        <title>sell stuff | firechain</title>
      </Head>
      <div className="flex flex-col w-full items-center text-center">
        <div className="flex flex-col items-center text-center w-full relative overflow-hidden h-full">
          <WarningBanner/>
          {isLoading ? 
          <>
            <ModalView>
              <div className='text-white font-extralight text-3xl bg-black z-50 rounded-xl p-6 w-full flex flex-col justify-center items-center shadow-2xl min-h-144'>
                <FontAwesomeIcon icon={faCircleNotch} className='text-indigo-500 z-50 text-7xl animate-spin'/>
                <h2 className='my-4'>
                  {statusMessage}
                </h2>
                {txHash ? 
                  <div className='text-xl'>
                    <h2 className='font-normal text-lg'>view on etherscan</h2>
                    <a 
                      className='break-all text-indigo-400 text-sm' 
                      href={`https://ropsten.etherscan.io/tx/${txHash}`}
                      rel='noreferrer'
                      target='_blank'
                      >
                        {txHash}
                    </a>
                  </div>
                  :
                  <></>
                }
              </div>
            </ModalView>
          </>
          :  productUploaded ?
              <ModalView>
                <div className='text-white font-extralight text-6xl bg-green-600 z-50 rounded-xl p-4 w-full lg:max-w-2xl'>
                  <h2 className='pb-4'>🎉</h2>  
                  <h2><p className='font-normal'>{`${title}`}</p> is now live!</h2>
                </div>
              </ModalView>
          : errorUploading ?
              <ModalView>
                <div className='text-white font-extralight absolute text-4xl bg-red-400 z-50 rounded-xl p-6 w-10/12 lg:w-auto lg:max-w-2xl flex justify-center items-center flex-col'>
                  <h2>{errorMessage}</h2>
                </div>
              </ModalView>
          : !appContext?.account  && !appContext?.navIsOpen ?
              <ModalView>
                <div className=' bg-black rounded-2xl flex flex-col items-center justify-between shadow-indigoDark m-8 py-6 px-16'>
                  <Image src={MetamaskFox} width={200} height={200} alt={'fox'}/>
                  <div className='h-full my-4'>
                    <ConnectMetamask/>
                  </div>
                  <ChromeLink/>
                </div>
              </ModalView>
          :
            <>
            </>
          }
          <>
            <div className='xl:w-4/12 w-11/12'>
              <PageTitle text='sell your stuff'/>
              <div className='w-full'>
                <h1 className="text-white text-2xl text-left w-full px-6 py-2 font-thin border-b my-4">list existing product</h1>
                <div className='my-6'>
                  <TextInput 
                    changeInput={changeInput}
                    className='bg-indigo-900 border-black' 
                    setState={setProductToList}
                    currentState={productToList} 
                    title={"product"} 
                    placeholder={'no existing products available'} 
                    options={productsTitleArr} 
                    textArea={false}
                    disabled={true}
                  />
                </div>
              </div>
              {productToList ?
                <div className="md:mt-0 w-full fadeDown space-y-6"> 
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
                </div>
                :
                <>
                  <div className="md:mt-0 w-full fadeDown">
                    <h1 className="text-white text-2xl text-left w-full px-6 py-2 font-thin border-b mt-16">or create new product</h1>
                    <form action="#" method="POST">
                      <div className="shadow sm:rounded-md sm:overflow-hidden">
                        <div className="py-5 space-y-6 ">
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
                      </div>
                    </form>
                  </div>
                </>
            }
            <button 
              type='button'
              className="inline-flex justify-center py-2 px-2 border border-transparent shadow-sm text-xl font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 w-full my-16"
              onClick={productToList ? () => listExistingItem(productToList) : listNewItem}  
              disabled={isLoading}
              >
              List For Sale
            </button>
            </div>
            </>
        </div>
      </div>
      <Footer/>
    </PageLayout>
  )
}

export default Sell