import React from 'react';
import ActionButton from './ActionButton';
import { collection, doc, setDoc } from "firebase/firestore";

interface propsInterface {
  title: string;
  price: number;
  image: string;
  action: string;
}

const Product = (props: propsInterface) => {
  const testFirebase = () => {

  }
  
  return (
    <div className="border m-12 p-10 transform hover:shadow-xl hover:-translate-y-2 transition-all">
      <h2 className="text-7xl">{props.image}</h2>
      <h3 className="font-semibold text-2xl mt-8">{props.title}</h3>
      <p className="font-light mb-8">{props.price} eth</p>
      {/* <ActionButton action={props.action} text="Cop"/> */}
      <button 
        className="bg-indigo-200 hover:bg-indigo-600 text-indigo-800 hover:text-white font-medium py-2 px-4 rounded w-24"
        onClick={(e) => console.log('hi')}  
      >
        Firebase
      </button>
    </div>
  )
}

export default Product
