import React from 'react'
import ActionButton from './ActionButton'

interface propsInterface {
  title: string;
  price: number;
  image: string;
  action: string;
}

const Product = (props: propsInterface) => {
  return (
    <div className="border m-12 p-10">
      <h2 className="text-7xl">{props.image}</h2>
      <h3 className="font-semibold text-2xl mt-8">{props.title}</h3>
      <p className="font-light mb-8">{props.price} eth</p>
      <ActionButton action={props.action} text="Cop"/>
    </div>
  )
}

export default Product
