import React, { useEffect, useState } from 'react'
import PageLayout from '../../constants/PageLayout'
import { useRouter } from 'next/router'
import Router from 'next/router'
import Image from 'next/image'
import { db } from '../../constants/firebase'
import { collection, doc, getDoc, getDocs, query } from 'firebase/firestore'
import { IProduct } from '../../types/types'
import styles from './[id].module.css'
import EthButton from '../../components/EthButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'
import { getMediumAddress, getMdTokenURI } from '../../utils/utils'
import { useAppContext } from '../../contexts/AppContext';
import { CONTRACT_ADDRESS, exitPage } from '../../utils/utils'
import Link from 'next/link'
import contractABI from '../../build/contracts/Firechain.json';
import Web3 from "web3";
import detectEthereumProvider from '@metamask/detect-provider';
import ModalView from '../../components/ModalView';
import Footer from '../../components/Footer'
import axios from 'axios'
import Head from 'next/head'
var Contract = require('web3-eth-contract');
const web3 = new Web3();

declare let window: any;

interface IProps {
  product: IProduct
}

const ProductPage = ({ product }: IProps) => {
  const appContext = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [txSuccess, setTxSuccess] = useState(false);
  const [errorUploading, setErrorUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [txHash, setTxHash] = useState('');
  const router = useRouter();
  const { id } = router.query;
  const buyNFTEndpoint = '/api/buyNFT'

  useEffect(() => {
    const initEthereum = async () => {
      if (window.ethereum.selectedAddress) {
        await appContext?.refreshMetamask();
        await window.ethereum.send('eth_requestAccounts');
        // window.web3 = new Web3(window.ethereum);
        const provider = await detectEthereumProvider();
        console.log(`provider checked!. value:`)
        console.log(provider);
        Contract.setProvider(provider);
      }
    }
    
    initEthereum();

    return () => {
    }
  }, [appContext])

  const sendToConnect = () => {
    Router.push('/account');
  }

  const buyNFT = async (tokenID: number, price: string, account: string) => {
    setIsLoading(true);
    setStatusMessage('creating transaction...');  
    const fireChainContract = new Contract(contractABI.abi, CONTRACT_ADDRESS);
    const priceInWei = web3.utils.toWei(price, 'ether');
    console.log('inside buyNFT');

    try {
      const buyEventListener = await fireChainContract.methods.buyItem(tokenID).send({
        to: CONTRACT_ADDRESS,
        from: account, 
        value: web3.utils.toHex(priceInWei),
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
      })
      .then(async (receipt: any) => {
        console.log('****RECEIPT EMITTED | PROMISE****');
        console.log(receipt);
        console.log('****TOKEN ID BELOW | PROMISE****');
        console.log(receipt.events.Transfer.returnValues.tokenId);

        const txHash = receipt.transactionHash;
        const newProduct: IProduct = JSON.parse(JSON.stringify(product));

        newProduct.ownerAddress = appContext?.account as string; 
        newProduct.ownerName = appContext?.name as string;
        newProduct.listedSince = '';
        newProduct.location = '';
        newProduct.forSale = false; 
        newProduct.buyNowPrice = 0;

        console.log({
          buyer: account,
          seller: product.ownerAddress,
          tokenID: tokenID,
          txHash: txHash,
          newProduct: newProduct
        });

        // wait 5 seconds for etherscan to refresh
        await new Promise(r => setTimeout(r, 5000));
        
        // call to buy endpoint
        const updateProduct = await axios.post(`${buyNFTEndpoint}`, {
          buyer: account,
          seller: product.ownerAddress,
          tokenID: tokenID,
          txHash: txHash,
          newProduct: newProduct
        })
        
        if (updateProduct.data.status = 'success') {
          setTxSuccess(true);
          setIsLoading(false);
          exitPage();
        } else if (updateProduct.data.status = 'error') {
          setErrorUploading(true);
          setErrorMessage(`something went wrong, please try again. ${updateProduct.data.error}`)
          setTimeout(() => {
            setErrorUploading(false);
            setIsLoading(false);
          }, 2500)
        }
      })
      
      return {
        sent: true
      }
    } catch (e) {
      console.error(e);
      setIsLoading(false);
      setErrorUploading(true);
      setErrorMessage('something went wrong, please try again')
      setTimeout(() => {
        setErrorUploading(false);
      }, 2500)
      
      return {
        sent: false,
        tokenID: 0
      }
    }
  }

  return (
    <PageLayout>
      <Head>
        <title>{product.title} in {product.location}</title>
      </Head>
      <div className='flex flex-col w-10/12 items-center overflow-hidden mb-10'>
        <div className='sm:w-11/12 md:w-9/12 lg:w-6/12 xl:w-5/12 fadeUp text-center w-full relative overflow-hidden h-full'>
        {isLoading ? 
          <>
            <ModalView>
              <div className='text-white font-extralight text-3xl bg-black z-50 rounded-xl p-6 w-9/12 lg:w-full shadow-2xl min-h-144'>
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
          : txSuccess ?
          <ModalView>
            <div className='text-white font-extralight absolute text-6xl bg-green-600 z-50 rounded-xl p-4 w-9/12 lg:max-w-2xl'>
              <h2 className='pb-4'>🎉</h2>  
              <h2>Transaction confirmed!</h2>
            </div>
          </ModalView>
          : errorUploading ?
          <ModalView>
            <div className='text-white font-extralight absolute text-4xl bg-red-400 z-50 rounded-xl p-6 w-10/12 lg:w-auto lg:max-w-2xl flex justify-center items-center flex-col'>
              <h2>{errorMessage}</h2>
            </div>
          </ModalView>
          :
          <></>
          }
          <div className='lg:px-0 px-4'>
            <h1 className='text-white text-3xl font-semibold text-left mt-4'>{product.title}</h1>
            <p className='text-gray-400 font-light text-left'>{product.location}</p>
          </div>
          <div className='block items-center py-4'>
            <Image 
              src={product.imagePath}
              alt={product.title}
              width={300}
              height={225} 
              layout='responsive'
              objectFit='cover'
              className={styles.image}
            />
          </div>
          <div className='flex flex-col items-center'>
            <div className='w-10/12 md:w-full flex items-center'>
              <h1 className='text-gray-300 font-extralight text-xl'>listed by </h1>
              <Link href={`/people/${product.ownerAddress}`}>
                <a className='text-indigo-400 font-extralight text-xl ml-1 mr-2'>{product.ownerName.toLowerCase()}</a>
              </Link>
              <Image 
                  src='/avi_placeholder.png' 
                  height='25' 
                  width='25' 
                  alt='avatar placeholder'
                  className='rounded-full group-hover:opacity-60 min-w-full min-h-full'
                />
            </div>
            <div className='w-full flex items-center justify-around'>
              <div className='w-10/12 md:w-full'>
                <EthButton 
                  buyNowPrice={product.buyNowPrice} 
                  product={product}
                  onClick={appContext?.account ? buyNFT : sendToConnect}
                />
              </div>
            </div>
            <div className='flex justify-start w-10/12 md:w-full mt-6'>
              <h2 className='text-white font-semibold text-xl'>product details</h2>
            </div>
            <div className='text-white w-10/12 md:w-full'>
              <div className='flex flex-col items-start w-full border-b py-2 text-left border-gray-800 mb-1'>
                  <h2 className='text-gray-200 font-light py-1 w-full'>description</h2>
                  <h1 className='text-gray-400 font-extralight text-left'>{product.description}</h1>
              </div>
              <div className='flex justify-between'>
                <h2 className='text-gray-200 font-light py-1'>listed since</h2>
                <h1 className='text-gray-400 font-extralight'>{product.listedSince}</h1>
              </div>
              <div className='flex justify-between'>
                <h2 className='text-gray-200 font-light py-1'>condition</h2>
                <h1 className='text-gray-400 font-extralight'>{product.condition}</h1>
              </div>
              <div className='flex justify-between'>
                <h2 className='text-gray-200 font-light py-1'>delivery options</h2>
                <h1 className='text-gray-400 font-extralight'>{product.deliveryOpts}</h1>
              </div>
              <div className='flex justify-between'>
                <h2 className='text-gray-200 font-light py-1'>owner address</h2>
                <a 
                  className='text-indigo-400 font-extralight' 
                  href={`https://ropsten.etherscan.io/address/${product.ownerAddress}`} 
                  target="_blank" 
                  rel="noreferrer"
                  >
                  {getMediumAddress(product.ownerAddress)}
                </a>
              </div>
              <div className='flex justify-between'>
                <h2 className='text-gray-200 font-light py-1'>token ID</h2>
                <a 
                  className='text-indigo-400 font-extralight' 
                  href={`https://ropsten.etherscan.io/token/0x652f6b7bdad2e4f59152b3d8e16d74f150e7962c?a=${product.tokenID}`} 
                  target="_blank" 
                  rel="noreferrer"
                  >
                  {product.tokenID}
                </a>
              </div>
              <div className='flex justify-between'>
                <h2 className='text-gray-200 font-light text-left py-1'>token URI (metadata)</h2>
                <a 
                  className='text-indigo-400 font-extralight' 
                  href={product.tokenURI}
                  target="_blank"
                  rel="noreferrer"
                  >
                    {getMdTokenURI(product.tokenURI)}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </PageLayout>
  )
}

export async function getStaticProps({ params }: any) {
  const productRef = doc(db, 'products', `${params.id}`);
  const productRefValue = await getDoc(productRef);
  const product = productRefValue.data() as IProduct;

  return {
    props: {
      product,
    },
    revalidate: 60
  }
}

export async function getStaticPaths() {
  const productsQuery = query(collection(db, 'products'));
  const productsDocs = await getDocs(productsQuery);
  
  const paths = productsDocs.docs.map((doc) => {
    const product = doc.data();

    return { params: 
      { id: product.refString }
    } ;
  });

  return { paths, fallback: 'blocking' }
}

export default ProductPage
