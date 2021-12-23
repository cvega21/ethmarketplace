import React, { useState, useEffect, useContext } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFireAlt, faStore, faCoins, faGraduationCap, faUserCircle, faFileContract, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
import NavBarItemMobile from './NavBarItemMobile';
import NavBarItem from './NavBarItem';
import { useAppContext } from '../contexts/AppContext'

const NavBar = () => {
  const navContext = useAppContext();
  
  return (
      <>
        <nav className="bg-gray-700 bg-opacity-50 text-white w-full z-20 relative">
          <div className='mobile-top-bar flex justify-between relative drop-shadow-2xl'>
            <div className='flex justify-between w-full'>
              <Link href="/" passHref={true}>
                <a className="ml-6 text-3xl font-dramatic flex items-center py-3">
                  <FontAwesomeIcon icon={faFireAlt} className="text-red-400"/> 
                  <h1 className="ml-2 text-4xl hover:text-red-100 transition duration-200 ease-in-out">firechain</h1>
                </a>
              </Link>
              <button className={`text-4xl text-gray-50 transform-gpu ease-in-out md:-translate-y-full absolute md:static right-8 top-3 ${navContext?.navIsOpen ? 'mr-3' : 'mr-0'}`} onClick={e => {
                navContext?.setNavIsOpen(!navContext?.navIsOpen);
              }}>
              {navContext?.navIsOpen ? 'x' : '☰'}
              </button>
              <ul className='flex text-xl transform-gpu transition-all duration-200 ease-in-out -translate-y-full md:translate-y-0 md:absolute md:right-0 h-full'>
                <NavBarItem title='buy' collapse={true}/>
                <NavBarItem title='sell' collapse={true}/>
                <NavBarItem title='account' collapse={true}/>
                <NavBarItem title='contract' collapse={true} icon={faExternalLinkAlt}/>
              </ul>
            </div>
          </div> 
        </nav>
        <div className={`bg-gray-800 mobile-side-bar w-full absolute inset-y-0 top-16 left-0 transform-gpu transition duration-200 ease-in-out z-10 ${!navContext?.navIsOpen ? '-translate-x-full' : ''}`}>
          <NavBarItemMobile icon={faStore} title='buy'/>
          <NavBarItemMobile icon={faCoins} title='sell'/>
          <NavBarItemMobile icon={faUserCircle} title='account'/>
          <NavBarItemMobile icon={faFileContract} title='contract'/>
        </div>
      </>
  )
}

export default NavBar
