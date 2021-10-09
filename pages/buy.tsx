import React, { useEffect, useState } from 'react'
import Product from "../components/Product";
import PageLayout from '../constants/PageLayout';
import NavBar from '../components/NavBar';
import { db } from './api/firebase'
import { collection, doc, getDoc, getDocs, limit, query, where } from '@firebase/firestore';


const Buy = () => {
  const [products, setProducts] = useState<Object[]>([]);
  
  useEffect(() => {
    (async () => {
        await getProducts();
    })()
  }, [])

  
  const getProducts = async () => {
    const productsArr: Array<Object> = [];
    const productsQuery = query(collection(db, 'products'), limit(3));
    const productsDocs = await getDocs(productsQuery);
    productsDocs.forEach((doc) => {
      const product = doc.data();
      productsArr.push(product);
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
      {/* {
        products ? 

        products.forEach((product) => {
          
        }) : 
        <h1 className='text-7xl text-white'></h1>
      } */}
      <Product
        image="jordan1.webp"
        title="jordan 1's"
        price={0.00001}
        action={'buy'}
        location="austin, tx"
        uid={123}
        />
        <Product
        image="coffee_table.jpeg"
        title="modern coffee table"
        price={0.000042}
        action={'buy'}
        location="austin, tx"
        uid={123}
        />
       <Product
        image="iphone.jpeg"
        title="iphone 12"
        price={0.000095}
        action={'buy'}
        location="san marcos, tx"
        uid={123}
        />
        {/* {products ?? products.forE} */}
      </div>
    </div>
  </PageLayout>
  )
}

export default Buy