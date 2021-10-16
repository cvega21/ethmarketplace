import React from 'react'
import PageLayout from '../../constants/PageLayout'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Product from '../../components/Product'
import { db } from '../api/firebase'
import { collection, doc, getDoc, getDocs, limit, query, where } from 'firebase/firestore'
import { IProduct } from '../../types/types'
import styles from '../../styles/Product.module.css'
import ActionButton from '../../components/ActionButton'
import EthPrice from '../../components/EthPrice'

interface IProps {
  product: IProduct
}

const ProductPage = ({ product }: IProps) => {
  const router = useRouter();
  const { id } = router.query;

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
            {/* <div className='w-full flex flex-col items-center justify-around'>
              <div className='flex items-center'>
                <h1 className='text-gray-300 font-extralight text-xl'>current price: </h1>
                <div className='flex'>
                  <Image src="/eth.svg" height={30} width={30} alt="ethereum" />
                  <h1 className='text-white text-3xl font-bold ml-1'>0.00123</h1>
                </div>
              </div>
            </div> */}
            <div className='w-10/12 flex items-start'>
              <h1 className='text-gray-300 font-extralight text-xl'>listed by </h1>
              <a className='text-indigo-400 font-extralight text-xl ml-1'>@person12341</a>
            </div>
            <div className='w-full flex items-center justify-around mt-12'>
              <div className='w-10/12'>
                <ActionButton theme='light'>
                  <div className='flex w-full items-center justify-between h-9'>
                    <p className='text-2xl w-24'>bid</p>
                    <div className='flex'>
                      <Image src="/eth.svg" height={28} width={28} alt="ethereum" />
                      <div className='flex items-center'>
                        <h1 className='text-indigo-800 text-xl font-normal ml-1'>0.0045</h1>  
                      </div>
                    </div>
                  </div>
                </ActionButton>
              </div>
            </div>
            <div className='w-full flex items-center justify-around'>
              <div className='w-10/12'>
                <ActionButton theme='dark'>
                  <div className='flex w-full items-center justify-between h-9'>
                    <p className='text-2xl w-24'>buy now</p>
                    <div className='flex'>
                      <Image src="/eth.svg" height={28} width={28} alt="ethereum" />
                      <div className='flex items-center'>
                        <h1 className='text-xl font-normal ml-1'>0.0045</h1>  
                      </div>
                    </div>
                  </div>
                </ActionButton>
              </div>
            </div>
            {/* <div className='w-full flex border items-center justify-around'>
              <div className='w-10/12'>
                <ActionButton theme='dark'>
                  <div className='flex w-full items-center justify-between'>
                    <p className='text-2xl'>buy now</p>
                    <div>
                      <div className='flex w-32 h-10 pb-1 items-center border-b-2 border-indigo-500 justify-center'>
                        <Image src="/eth.svg" height={30} width={30} alt="ethereum" />
                        <h1 className='text-xl font-normal ml-1'>0.0031</h1>  
                      </div>
                      <p className='text-sm font-extralight ml-4 text-gray-300 mt-1'>$15,673</p>
                    </div>
                  </div>
                </ActionButton>
              </div>
            </div> */}
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
