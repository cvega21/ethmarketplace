import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { useAppContext } from '../contexts/AppContext';


const WarningBanner = () => {
  const appContext = useAppContext();

  if (appContext?.warningIsOpen) {
  return (
      <div className="w-10/12 border px-2 border-black shadow-xl bg-yellow-300 rounded-xl flex items-center text-black justify-center top-2 transition-all text-sm lg:text-lg mt-8 py-2">
        <div className='flex flex-col items-center justify-center w-11/12 lg:pl-20 md:pl-16 sm:pl-10 pr-2 lg:pr-0'>
          <b className='font-semibold mr-1'>
            WARNING
          </b> 
          <h1 className='font-light'>
            firechain is an experimental beta on the ropsten testnet (read: not real money). do not use on mainnet!
          </h1>
        </div>
        <div className='w-1/12'>
          <FontAwesomeIcon 
            icon={faTimes} 
            className="right-6 text-5xl cursor-pointer"
            onClick={() => appContext.setWarningIsOpen(false)}
          /> 
        </div>
      </div>
    )
  } else {
    return (
      <></>
    )
  }
}

export default WarningBanner
