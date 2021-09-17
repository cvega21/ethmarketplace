import React from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGgCircle } from '@fortawesome/free-brands-svg-icons'

const NavBar = () => {
  return (
        <nav className="bg-gray-800 text-white p-5 m-0 w-screen flex justify-between">
          <div>
            <Link href="/" passHref={true}>
              <a className="font-bold ml-10 text-4xl font-dramatic flex items-center">
                <FontAwesomeIcon icon={faGgCircle}/> 
                <h1 className="ml-3 mt-2 text-5xl">GRAILS ON CHAIN</h1>
              </a>
            </Link>
          </div>
          <div className="flex mr-20 items-center">
            {/* <a className="font-medium mr-12 text-xl" href="buy">
              Buy
            </a>
            <a className="font-medium ml-12 text-xl">
              Sell
            </a> */}
          </div>
          <div className="flex mr-20 items-center">
            <button className="bg-indigo-600 hover:bg-indigo-800 text-white font-bold py-2 px-4 border border-indigo-700 rounded">
             Connect Wallet
            </button>
          </div>
        </nav>
  )
}

export default NavBar
