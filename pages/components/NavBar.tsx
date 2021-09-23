import React from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFireAlt } from '@fortawesome/free-solid-svg-icons'

const NavBar = () => {
  return (
        <nav className="bg-gray-700 bg-opacity-50 drop-shadow-2xl pt-2 pb-2 text-white m-0 w-full flex justify-between items-center">
          <div className='flex'>
            <Link href="/" passHref={true}>
              <a className="font-bold ml-10 text-3xl font-dramatic flex items-center">
                <FontAwesomeIcon icon={faFireAlt}/> 
                <h1 className="ml-3 mt-2 text-4xl">fire on chain</h1>
              </a>
            </Link>
          </div> 
          <div className="flex mr-10 mb-1 items-center">
            <button className="text-4xl text-white borderrounded">
            ☰
            </button>
          </div>
        </nav>
  )
}

export default NavBar
