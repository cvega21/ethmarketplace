import React from 'react';
import ActionButton from './ActionButton';
import { collection, doc, setDoc, getDoc, getDocs } from "firebase/firestore";
import EthPrice from './EthPrice'
import Image from 'next/image'
import { IProduct } from '../types/types'

interface propsInterface {
  title: string,
  price: number,
  image: string,
  action: string,
  location: string,
  uid: number
}

const Product = (props: IProduct) => {
  
  return (
    <a href={`/products/${props.title}`} className="border my-6 lg:my-0 transform hover:shadow-xl hover:-translate-y-2 transition-all text-white bg-gray-800 hover:cursor-pointer">
      <Image src={props.imagePath} alt='' width={60} height={40} layout='responsive' objectFit='cover' placeholder='blur' blurDataURL={props.imagePath}></Image>
      <div className="bg-gray-800 w-full pt-4 pb-4 flex items-center justify-around">
        <div>
          <h3 className="font-normal text-md">{props.title}</h3>
          <h4 className="font-light text-gray-400 text-sm">{props.location}</h4>
        </div>
        <EthPrice price={props.buyNowPrice}/>
      </div>
    </a>
  )
}

export default Product
