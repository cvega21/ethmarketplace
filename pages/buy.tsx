import React, { useEffect, useState } from 'react'
import Product from "../components/Product";
import PageLayout from '../constants/PageLayout';
import NavBar from '../components/NavBar';
import { db } from '../constants/firebase'
import { collection, doc, getDoc, getDocs, limit, onSnapshot, query, where } from '@firebase/firestore';
import { IProduct } from '../types/types'
import styles from '../styles/Home.module.css'

const Buy = ({ productsArr, queryArr }: any) => {
  
  return (
  <PageLayout>
    <div className="w-11/12 lg:w-9/12">
      <h1 className="text-white text-4xl font-light py-14">
        top picks for you
      </h1>
      <div className="flex flex-col gap-10 md:grid md:grid-cols-2 md:gap-20 xl:grid-cols-3 fadeDown">
        {productsArr.map((product: IProduct) => {
          return (
            <Product
              buyNowPrice={product.buyNowPrice}
              title={product.title}
              location={product.location}
              description={product.description}
              imagePath={product.imagePath}
              refString={product.refString}
              tokenURI={product.tokenURI}
              listedSince={product.listedSince}
              key={product.imagePath}
              condition={''}
              deliveryOpts={''}
              ownerAddress={''}
              ownerName={''}
            />
          )
        })}
      </div>
    </div>
  </PageLayout>
  )
}

export async function getStaticProps() {
  const productsArr: Array<IProduct> = [];
  const productsQuery = query(collection(db, 'products'));
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

export default Buy