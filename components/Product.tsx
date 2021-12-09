import React from 'react';
import ActionButton from './ActionButton';
import { collection, doc, setDoc, getDoc, getDocs } from "firebase/firestore";
import EthPrice from './EthPrice'
import Image from 'next/image'
import Link from 'next/link'
import { IProduct } from '../types/types'

const Product = (props: IProduct) => {
  
  return (
    <Link href={`/products/${props.refString}`} passHref>
      <a href={`/products/${props.refString}`}>
        <div className="flex flex-col border border-gray-700 hover:shadow-indigoDark rounded-xl lg:my-0 transform hover:-translate-y-2 transition-all text-white bg-gray-800 hover:cursor-pointer w-full md:w-full">
          <Image src={props.imagePath} alt='' width={60} height={40} layout='responsive' objectFit='cover' placeholder='blur' blurDataURL={props.imagePath} className='rounded-xl'></Image>
          <div className="bg-gray-800 w-full pt-4 pb-4 flex items-center justify-around transform -translate-y-2">
            <div>
              <h3 className="font-normal text-md">{props.title}</h3>
              <h4 className="font-light text-gray-400 text-sm">{props.location}</h4>
            </div>
            <EthPrice price={props.buyNowPrice}/>
          </div>
        </div>
      </a>
    </Link>
  )
}

export default Product
