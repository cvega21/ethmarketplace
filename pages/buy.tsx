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
  console.log('hi')
  console.log(productsArr)
  const [products, setProducts] = useState<IProduct[]>([]);
  
  useEffect(() => {
    (async () => {
        await getProducts();
    })()
  }, [])

  
  const getProducts = async () => {
    const productsArr: Array<IProduct> = [];
    const productsQuery = query(collection(db, 'products'), limit(3));
    const productsDocs = await getDocs(productsQuery);
    productsDocs.forEach((doc) => {
      const product = doc.data();
      productsArr.push(product as IProduct);
    });

    setProducts(productsArr)
    return productsArr
  }
  
  return (
  <PageLayout>
    <div className="w-10/12 lg:w-4/12 mt-6">
      <h1 className="text-white text-4xl font-semibold py-8">
        Explore Real Life NFT&apos;s
      </h1>
      <h2 className="font-light justify-self-start text-center text-gray-50 text-xl ml-4">
        top picks near you
      </h2>
      <div className="flex flex-col">
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