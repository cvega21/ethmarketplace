import React from 'react'
import styles from '../styles/Home.module.css'
import PageLayout from '../../constants/PageLayout'
import { useRouter } from 'next/router'
import Product from '../../components/Product'
import { db } from '../api/firebase'
import { collection, getDocs, limit, query } from 'firebase/firestore'
import { IProduct } from '../../types/types'


const ProductPage = ({ productsArr }: any ) => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <PageLayout>
      <h1>{id}</h1>
      <Product
        buyNowPrice={productsArr[0].buyNowPrice}
        startingPrice={productsArr[0].startingPrice}
        title={productsArr[0].title}
        location={productsArr[0].location}
        description={productsArr[0].description}
        imagePath={productsArr[0].imagePath}
        refString={productsArr[0].refString}
        key={productsArr[0].imagePath}
      />
    </PageLayout>
  )
}

export async function getStaticProps() {
  const productsArr: Array<IProduct> = [];
  const productsQuery = query(collection(db, 'products'), limit(1));
  const productsDocs = await getDocs(productsQuery);
  productsDocs.forEach((doc) => {
    const product = doc.data();
    productsArr.push(product as IProduct);
  });

  return {
    props: {
      productsArr,
    },
  }
}

export async function getStaticPaths() {
  const productsArr: Array<IProduct> = [];
  const productsQuery = query(collection(db, 'products'), limit(6));
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
