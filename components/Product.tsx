import React from 'react';
import EthPrice from './EthPrice'
import Image from 'next/image'
import Link from 'next/link'
import { IProduct } from '../types/types'

const Product = (props: IProduct) => {
  
  return (
    <Link href={`/products/${props.refString}`} passHref>
      <a href={`/products/${props.refString}`}>
        <div className="flex flex-col border border-gray-700 hover:shadow-indigoDark rounded-xl lg:my-0 transform hover:-translate-y-2 transition-all text-white bg-gray-800 hover:cursor-pointer w-full md:w-full">
          <div>
            <Image src={props.imagePath} alt='' width={70} height={55} layout='responsive' objectFit='cover' placeholder='blur' blurDataURL={props.imagePath} className='rounded-xl'></Image>
            <div className="bg-gray-800 w-full py-4 flex flex-col xl:flex-row items-center justify-around transform -translate-y-2">
              <div className='xl:w-7/12 h-14 xl:h-12 px-3'>
                <h3 className="font-normal text-lg truncate">{props.title}</h3>
                <h4 className="font-light text-gray-400 text-sm ">{props.location}</h4>
              </div>
              <div className='w-10/12 xl:pr-3 xl:w-5/12 pt-2'>
                <EthPrice price={props.buyNowPrice}/>
              </div>
            </div>
          </div>
        </div>
      </a>
    </Link>
  )
}

export default Product
