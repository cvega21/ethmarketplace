import React, { useEffect, useState } from 'react'
import Product from "../components/Product";
import PageLayout from '../constants/PageLayout';
import NavBar from '../components/NavBar';
import { db } from './api/firebase'
import { collection, doc, getDoc, getDocs, limit, query, where } from '@firebase/firestore';

interface IProduct {
  buyNowPrice: number,
  startingPrice: number,
  title: string,
  location: string,
  description: string,
  imagePath: string,
}

const Buy = ({ productsArr } : any) => {

  return (
  <PageLayout>
    <div className="w-full lg:w-9/12 mt-6">
      <h1 className="text-white text-4xl font-light py-8">
        top picks for you
      </h1>
      <div className="grid grid-cols-3 gap-12">
        {productsArr.map((product: IProduct) => {
          return (
            <Product
              image={product.imagePath}
              title={product.title}
              price={product.buyNowPrice}
              action={'buy'}
              location={product.location}
              uid={123}
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
  const productsQuery = query(collection(db, 'products'), limit(3));
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