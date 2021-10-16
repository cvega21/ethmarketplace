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

interface IProps {
  product: IProduct
}

const ProductPage = ({ product }: IProps) => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <PageLayout>
      <div className='flex flex-col w-full items-center'>
        <div className='w-11/12'>
          <h1 className='text-white text-3xl font-medium text-left ml-8 my-4'>{product.title}</h1>
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
            <p className='text-white '>{product.buyNowPrice} eth</p>
            <div className='w-10/12'>
              <ActionButton theme='dark'>
                <p>buy</p>
              </ActionButton>
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
