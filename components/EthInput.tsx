import React from 'react';
import Image from 'next/image';

interface IEthInput {
  changeInput: Function,
  setState: Function,
  currentState: number,
  title: string,
  defaultVal: string,
  className?: string
  ethClassName?: string
}

const EthInput = (props: IEthInput) => {
  return (
    <div className="flex flex-col justify-between">
      <div className="w-full">
        <label htmlFor="company-website" className="block text-md text-left font-medium text-white">
          {props.title}
      </label>
        <div className="mt-1 flex rounded-md shadow-sm w-full">
          <span className={`inline-flex items-center px-3 rounded-l-md border border-r-0 text-gray-50 text-sm ${props.ethClassName? props.ethClassName : 'border-gray-500'} bg-gray-900`}>
            ETH
        <Image src="/eth.svg" height={20} width={30} alt="ethereum" />
          </span>
          <input
            type="number"
            className={`focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border p-2 bg-gray-700 text-white ${props.className? props.className : 'border-gray-500'}`}
            value={props.currentState}
            step="0.0001"
            onChange={e => props.changeInput(e, props.setState)}
            />
        </div>
      </div>
    </div>
  )
}

export default EthInput
