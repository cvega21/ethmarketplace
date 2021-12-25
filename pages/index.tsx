import React, { useEffect, useRef } from 'react';
import type { NextPage } from 'next'
import Head from 'next/head'
import ActionButton from '../components/ActionButton';
import NavBar from '../components/NavBar'
import { useAppContext } from '../contexts/AppContext'
import Typed from 'typed.js';
import { IProduct } from '../types/types'
import { collection, doc, getDoc, query } from 'firebase/firestore';
import { db } from '../constants/firebase';
import Product from '../components/Product';
import PageLayout from '../constants/PageLayout'

interface IHomeProps {
  featuredProduct: IProduct
}

const Home = ( {featuredProduct}: IHomeProps ) => {
  const navContext = useAppContext();
  const typedElement: any = useRef(null);
  const typed: any = useRef(null);
  
  useEffect(() => {
    const options = {
      strings: ['^300 gucci belts^400', '^300used cars^400', '^300spaceships^400', 'y^100o^100u^100r^100 s^100t^100u^100f^100f^1000'],
      typeSpeed: 38,
      backSpeed: 18,
      loop: false
    };
    
    typed.current = new Typed(typedElement.current as Element, options);
    return () => {
      typed.current.destroy();
    }
  }, [])

  return (
    <PageLayout>
      <Head>
        <title>firechain</title>
        <meta property="og:image" content="https://firebasestorage.googleapis.com/v0/b/ethmarketplace.appspot.com/o/Screen%20Shot%202021-12-23%20at%205.41.55%20PM.png?alt=media&token=3a462c3d-cfb4-4e85-bdee-8dbd64dc924c" />
        <meta property="og:description" content="buy and sell your real-life stuff as NFT's" />
        <meta property="og:url"content="https://firecha.in/" />
        <meta property="og:title" content="firechain | NFT marketplace" />
        <meta property="og:type" content="website" />
      </Head>
      <div className="w-full xl:px-40 lg:px-20 px-4">
        <div className='flex flex-col lg:flex-row items-center lg:pt-16 pt-4'>
          <div className='flex flex-col lg:w-6/12 lg:mr-16 justify-center lg:items-start items-center fadeDown'>
            <div className="font-bold text-5xl md:text-7xl lg:text-7xl lg:mt-0 text-white tracking-tighter w-full flex flex-col lg:items-start items-center">
              <div className='justify-center flex flex-col lg:text-left lg:items-start'>
                <h1 className=''>the</h1> 
                <h1 className=''>metaverse</h1> 
                <h1 className=''>for</h1> 
              </div>
              <div className="text-indigo-400 lg:text-left">
                <span ref={typedElement}></span>
              </div>
            </div>
            <div className="w-full flex flex-col lg:mt-12 md:mt-8 mt-4 lg:text-left">
              <h2 className="font-light text-gray-500 text-xl md:text-4xl">
                buy and sell real-life stuff as NFT&apos;s
              </h2>
              <h3 className='font-thin text-gray-500 text-lg mt-4'>
                powered by <a href='https://ethereum.org/en/what-is-ethereum/' target='_blank' rel='noreferrer' className='text-indigo-400 '>Ethereum ⚡️</a>
              </h3>
            </div>
            <div className="flex w-full min-w-min mt-6 lg:mt-10 justify-between lg:text-lg text-sm lg:w-11/12">
              <div className='w-full xl:mr-10 lg:mr-6 md:mx-4 mx-2'>
                <ActionButton theme='light' link='buy'>
                  explore
                </ActionButton>
              </div>
              <div className='w-full xl:ml-10 lg:ml-6 md:mx-4 mx-2'>
                <ActionButton theme='dark' link='sell'>
                  sell stuff
                </ActionButton>
              </div>
            </div>
          </div>
          <div className='lg:w-5/12 w-11/12 md:w-7/12 sm:w-7/12 justify-center mt-8 lg:mt-6 mb-10'>
            <Product
              buyNowPrice={featuredProduct.buyNowPrice}
              condition={''}
              deliveryOpts={''}
              description={featuredProduct.description}
              forSale={featuredProduct.forSale}
              imagePath={featuredProduct.imagePath}
              key={featuredProduct.imagePath}
              listedSince={featuredProduct.listedSince}
              location={featuredProduct.location}
              ownerAddress={''}
              ownerName={''}
              refString={featuredProduct.refString}
              title={featuredProduct.title}
              tokenURI={featuredProduct.tokenURI}
              tokenID={featuredProduct.tokenID}
            />
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

export async function getStaticProps() {
  const productRef = doc(db, 'products', '1l6gyyng0cwLOySHQCZp');
  const productDoc = await getDoc(productRef);
  let featuredProduct: IProduct = productDoc.data() as IProduct;

  return {
    props: {
      featuredProduct,
    },
  }
}

export default Home
