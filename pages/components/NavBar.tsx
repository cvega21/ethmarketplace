import React from 'react'
import Link from 'next/link'

const NavBar = () => {
  return (
        <nav className="bg-gray-800 text-white p-5 m-0 w-screen flex justify-between">
          <div>
            <Link href="/" passHref={true}>
              <a className="font-bold text-3xl ml-10">
                Grails on Chain
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
            {/* <p className="ml-5">
              or Get Metamask
            </p> */}
          </div>
        </nav>
  )
}

export default NavBar
