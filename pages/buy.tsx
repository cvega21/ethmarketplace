import React, { useEffect, useState } from 'react'
import Product from "../components/Product";
import PageLayout from '../constants/PageLayout';
import NavBar from '../components/NavBar';
import { db } from './api/firebase'
import { collection, doc, getDoc, getDocs, limit, onSnapshot, query, where } from '@firebase/firestore';
import { IProduct } from '../types/types'

const Buy = ({ productsArr, queryArr }: any) => {
  console.log(productsArr);
  console.log(queryArr);

  
  return (
  <PageLayout>
    <div className="w-11/12 lg:w-9/12">
      <h1 className="text-white text-4xl font-light py-14">
        top picks for you
      </h1>
      <div className="flex flex-col lg:grid lg:grid-cols-3 lg:gap-12">
        {productsArr.map((product: IProduct) => {
          return (
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
          )
        })}
      </div>
    </div>
  </PageLayout>
  )
}

export async function getStaticProps() {
  const productsArr: Array<IProduct> = [];
  const productsQuery = query(collection(db, 'products'), limit(6));
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