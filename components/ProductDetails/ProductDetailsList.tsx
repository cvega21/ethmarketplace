import React from 'react'

const ProductDetailsList = (props: any) => {
  return (
    <ul className='text-white w-10/12 md:w-full'>
      {props.children}
    </ul>
  )
}

export default ProductDetailsList