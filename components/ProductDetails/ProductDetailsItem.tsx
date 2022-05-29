import React from 'react'
import { getMdTokenURI, getMediumAddress } from '../../utils/utils'

interface IProductDetailsItem {
  // type?: string
  title: string
  detailsText: string
}

const ProductDetailsItem = (props: IProductDetailsItem) => {
  return (
    <div className={`flex justify-between ${props.title === 'description' && 'flex flex-col items-start w-full border-b py-2 text-left border-gray-800 mb-1'}`}>
      <h1 className='text-gray-200 font-light py-1'>
        {props.title}
      </h1>
      {/* Too much conditional logic below... probably best to break this out into different components for the values specifically */}
      {
        props.title === 'owner address' || props.title === 'token ID' || props.title === 'token URI (metadata)' ? 
          <a 
            className='text-indigo-400 font-extralight' 
            href={`${
              props.title === 'token ID' ? 
                `https://ropsten.etherscan.io/token/0x652f6b7bdad2e4f59152b3d8e16d74f150e7962c?a=${props.detailsText}` :
              props.title === 'owner address' ? 
                `https://ropsten.etherscan.io/address/${props.detailsText}` :
              props.title === 'token URI (metadata)' ?
                `${props.detailsText}` :
                ``
              }`
            } 
            target="_blank" 
            rel="noreferrer"
          >
            {
              props.title === 'owner address' ? 
                getMediumAddress(props.detailsText) :
              props.title === 'token URI (metadata)' ?
                getMdTokenURI(props.detailsText) :
              props.detailsText
            }
          </a> 
        : 
        <p className='text-gray-400 font-extralight'>{props.detailsText}</p>
      }
      
    </div>
  )
}

export default ProductDetailsItem