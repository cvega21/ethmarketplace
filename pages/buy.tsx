import React from 'react'
import Product from "../components/Product";
import PageLayout from '../constants/PageLayout';
import NavBar from '../components/NavBar';

const buy = () => {
  return (
  <PageLayout>
    <div className="w-10/12 mt-6">
      <h1 className="text-white text-4xl font-semibold py-8">
        Explore Real Life NFT&apos;s
      </h1>
      <h2 className="font-light justify-self-start text-center text-gray-50 text-xl ml-4">
        top picks near you
      </h2>
      <div className="flex flex-col">
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
       <Product
        image="jordans.jpeg"
        title="jordan 1's"
        price={0.00004}
        action={'buy'}
        location="round rock, tx"
        uid={123}
        />
      </div>
    </div>
  </PageLayout>
  )
}

export default buy
