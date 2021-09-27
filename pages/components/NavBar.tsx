import React, { useState, useEffect, useContext } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFireAlt, faStore, faCoins, faGraduationCap, faUserCircle } from '@fortawesome/free-solid-svg-icons'
import NavBarItem from './NavBarItem'
import AppContext from './AppContext'

const NavBar = () => {
  const navContext = useContext(AppContext);
  
  return (
    <>
      <nav className="bg-gray-700 bg-opacity-50 text-white w-full z-20">
        <div className='mobile-top-bar flex justify-between relative drop-shadow-2xl'>
          <div className='flex justify-between w-full'>
            <Link href="/" passHref={true}>
              <a className="font-bold ml-6 text-3xl font-dramatic flex items-center py-3">
                <FontAwesomeIcon icon={faFireAlt} className="text-red-400"/> 
                <h1 className="ml-2 text-4xl">firechain</h1>
              </a>
            </Link>
            <button className="text-4xl text-gray-50 mr-8" onClick={e => navContext?.setNavIsOpen(!navContext?.navIsOpen)}>
            ☰
            </button>
          </div>
        </div> 
      </nav>
      <div className={`bg-gray-800 mobile-side-bar w-full absolute inset-y-0 top-16 left-0 transform-gpu transition duration-200 ease-in-out z-10 ${!navContext?.navIsOpen ? '-translate-x-full' : ''}`}>
        <NavBarItem icon={faStore} title='buy'/>
        <NavBarItem icon={faCoins} title='sell'/>
        <NavBarItem icon={faGraduationCap} title='learn'/>
        <NavBarItem icon={faUserCircle} title='account'/>
      </div>
    </>
  )
}

export default NavBar
