import React, { useEffect, useState } from 'react'
import Product from "../components/Product";
import PageLayout from '../constants/PageLayout';
import NavBar from '../components/NavBar';
import { db } from '../constants/firebase'
import { collection, doc, getDoc, getDocs, limit, onSnapshot, query, where } from '@firebase/firestore';
import { IProduct } from '../types/types'
import styles from '../styles/Home.module.css'

const Buy = ({ productsArr, queryArr }: any) => {

  useEffect(() => {
    (async () => {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x3' }], 
      });
    })()

  }, [])
  
  return (
  <PageLayout>
    <div className="w-11/12 lg:w-9/12">
      <h1 className="text-white text-4xl font-medium pt-14 pb-8">
        marketplace
      </h1>
      <h2 className="text-white text-2xl text-left w-full px-6 py-2 my-6 font-thin border-b">
        trending 🔥
      </h2>
      <div className="flex flex-col gap-10 md:grid md:grid-cols-2 md:gap-20 xl:grid-cols-3 fadeDown">
        {productsArr.map((product: IProduct) => {
          // if (product.trending) {
            return (
              <Product
                buyNowPrice={product.buyNowPrice}
                condition={''}
                deliveryOpts={''}
                description={product.description}
                forSale={product.forSale}
                imagePath={product.imagePath}
                key={product.imagePath}
                listedSince={product.listedSince}
                location={product.location}
                ownerAddress={''}
                ownerName={''}
                refString={product.refString}
                title={product.title}
                tokenURI={product.tokenURI}
                tokenID={product.tokenID}
              />
            )
          // }
        })}
      </div>
      <h2 className="text-white text-2xl text-left w-full px-6 py-2 my-6 font-thin border-b">
        all products
      </h2>
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