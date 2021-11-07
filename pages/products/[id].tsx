import React, { useEffect, useState } from 'react'
import PageLayout from '../../constants/PageLayout'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Product from '../../components/Product'
import { db } from '../../constants/firebase'
import { collection, doc, getDoc, getDocs, limit, query, where } from 'firebase/firestore'
import { IProduct } from '../../types/types'
import styles from '../../styles/Product.module.css'
import ActionButton from '../../components/ActionButton'
import EthPrice from '../../components/EthPrice'
import EthButton from '../../components/EthButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faList, faQuoteLeft } from '@fortawesome/free-solid-svg-icons'
import { getShortAddress, getMediumAddress } from '../../utils/utils'
import { useAppContext } from '../../contexts/AppContext';
import contractAbi from '../../build/contracts/MyNFT.json'


interface IProps {
  product: IProduct
}

const ProductPage = ({ product }: IProps) => {
  const appContext = useAppContext();
  const [status, setStatus] = useState("");
  const [url, setURL] = useState("");
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const initEthereum = async () => {
      if (window.ethereum.selectedAddress) {
        await appContext?.connectMetamask();
        console.log(window.ethereum.selectedAddress);
      }
    }
    
    initEthereum();

    // appContext?.refreshMetamask();
    // console.log(appContext?.account)
    // console.log('reeeee')

    return () => {
    }
  }, [appContext])

  const mintNFT = async () => {
    
  }

  return (
    <PageLayout>
      <div className='flex flex-col w-full items-center'>
        <div className='w-full sm:w-11/12 md:w-10/12 lg:w-4/12'>
          <div className='ml-8'>
            <h1 className='text-white text-3xl font-medium text-left mt-4'>{product.title}</h1>
            <p className='text-gray-400 font-light text-left'>{product.location}</p>
          </div>
          <div className='w-full flex flex-col items-center'>
            <div className={styles.imageContainer}>
              <Image 
                src={product.imagePath}
                alt={product.title} 
                layout='fill'
                className={styles.image}
              />
            </div>
          </div>
          <div className='flex flex-col items-center'>
            <div className='w-10/12 flex items-start'>
              <h1 className='text-gray-300 font-extralight text-xl'>listed by </h1>
              <a className='text-indigo-400 font-extralight text-xl ml-1'>@person12341</a>
            </div>
            {/* <div className='w-full flex items-center justify-around mt-2'>
              <div className='w-10/12'>
                <ActionButton theme='light'>
                  <div className='flex w-full items-center justify-between h-9'>
                    <p className='text-2xl font-light'>place bid</p>
                    <div className='flex'>
                      <Image src="/eth.svg" height={28} width={28} alt="ethereum" />
                      <div className='flex items-center'>
                        <h1 className='text-indigo-800 text-xl font-normal ml-1'>{product.startingPrice}</h1>  
                      </div>
                    </div>
                  </div>
                </ActionButton>
              </div>
            </div> */}
            <div className='w-full flex items-center justify-around'>
              <div className='w-10/12'>
                <EthButton buyNowPrice={product.buyNowPrice} product={product}/>
              </div>
            </div>
            <div className='flex justify-start w-10/12 my-4'>
              <h2 className='text-white font-normal text-xl'>product details</h2>
            </div>
            <div className='text-white w-10/12'>
              <div className='flex justify-between'>
                <h2 className='text-gray-200 font-light'>listed since</h2>
                <h1 className='text-gray-400 font-extralight'>Aug. 13, 2021</h1>
              </div>
              <div className='flex justify-between'>
                <h2 className='text-gray-200 font-light'>condition</h2>
                <h1 className='text-gray-400 font-extralight'>like new</h1>
              </div>
              <div className='flex justify-between'>
                <h2 className='text-gray-200 font-light'>delivery options</h2>
                <h1 className='text-gray-400 font-extralight'>pick up only</h1>
              </div>
              <div className='flex justify-between'>
                <h2 className='text-gray-200 font-light'>contract address</h2>
                <h1 className='text-indigo-400 font-extralight'>{getMediumAddress('0x12d0jf3i2od3210dko')}</h1>
              </div>
              <div className='flex flex-col items-start'>
                <h2 className='text-gray-200 font-medium'>product description</h2>
                <h1 className='text-gray-400 font-extralight text-left'>{product.description}</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
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

  return { paths, fallback: false }
}

export default ProductPage
