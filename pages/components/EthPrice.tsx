import React from 'react';
import Image from 'next/image'

interface EthPriceIProps {
  price: number
}

const EthPrice = (props: EthPriceIProps) => {
  return (
    <div className="flex flex-col rounded-md shadow-sm w-5/12">
      <div className="flex">
        <p className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300 border p-2 bg-gray-700 text-white text-xs">
          {props.price}
        </p>
        <span className="inline-flex items-center pl-2 rounded-r-md border border-l-0 border-gray-300 bg-gray-900 text-gray-50 text-xs font-semibold shadow-lg min-w-min">
          ETH
          <Image src="/eth.svg" height={16} width={24} alt="ethereum" />
        </span>
      </div>
  </div>
  )
}

export default EthPrice
