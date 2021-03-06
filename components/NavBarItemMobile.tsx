import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { useAppContext } from '../contexts/AppContext'
import { CONTRACT_LINK } from '../utils/utils'

const NavBarItemMobile = (props: any) => {
  const navContext = useAppContext();
  
  return (
    <Link href={props.title === 'contract' ? CONTRACT_LINK : `/${props.title}`} passHref={true}>
      <a 
        className='flex w-full text-gray-50 text-2xl font-light pl-6 h-16 items-center hover:bg-indigo-500 hover:cursor-pointer hover:text-white transition duration-150' 
        onClick={() => navContext?.setNavIsOpen(!navContext.navIsOpen)}
        target={props.title === 'contract' ? '_blank' : ``}
        >
        <div className='w-10 text-xl'>
          <FontAwesomeIcon icon={props.icon}/> 
        </div>
        <h2 className='pl-4'>{props.title}</h2>
      </a>
    </Link>
  )
}

export default NavBarItemMobile