import React from 'react';
import ActionButton from './ActionButton';
import { collection, doc, setDoc, getDoc, getDocs } from "firebase/firestore";
import { db } from '../api/firebase'
import EthPrice from './EthPrice'
import Image from 'next/image'

interface propsInterface {
  title: string,
  price: number,
  image: string,
  action: string,
  location: string
}

const Product = (props: propsInterface) => {
  // const testFirebase = async () => {
  //   const querySnapshot = await getDocs(collection(db, 'products'));
  //   querySnapshot.forEach(doc => {
  //     console.log(doc.id, ' => ', doc.data());
  //   })
  // }
  
  return (
    <div className="border mt-6 mb-6 transform hover:shadow-xl hover:-translate-y-2 transition-all text-white bg-gray-800">
      {/* <h2 className="text-7xl">{props.image}</h2> */}
      <Image src={`/${props.image}`} alt='' width={60} height={40} layout='responsive' objectFit='cover'></Image>
      <div className="bg-gray-800 w-full pt-4 pb-4 flex items-center justify-around">
        <div>
          <h3 className="font-normal text-md">{props.title}</h3>
          <h4 className="font-light text-gray-400 text-sm">{props.location}</h4>
        </div>
        <EthPrice price={props.price}/>
      </div>
    </div>
  )
}

export default Product
