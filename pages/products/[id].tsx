import React from 'react'
import styles from '../styles/Home.module.css'
import PageLayout from '../../constants/PageLayout'
import { useRouter } from 'next/router'
import Product from '../../components/Product'
import { db } from '../api/firebase'
import { collection, doc, getDoc, getDocs, limit, query, where } from 'firebase/firestore'
import { IProduct } from '../../types/types'

interface IProps {
  product: IProduct
}

const ProductPage = ({ product }: IProps) => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <PageLayout>
      <div className='flex flex-col p-16 border w-full h-full'>
        <div className='border border-red-400'>
          <h1 className='text-white text-3xl'>{product.title}</h1>
          <Product
            buyNowPrice={product.buyNowPrice}
            startingPrice={product.startingPrice}
            title={product.title}
            location={product.location}
            description={product.description}
            imagePath={product.imagePath}
            refString={product.refString}
            key={product.imagePath}
          />
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
