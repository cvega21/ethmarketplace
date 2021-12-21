import React from 'react'
import Link from 'next/link'
import { CONTRACT_LINK } from '../utils/utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'

interface INavBarItem {
  title: string,
  collapse: boolean,
  icon?: IconDefinition
}

const NavBarItem = (props: INavBarItem ) => {
  return (
    <Link href={props.title === 'contract' ? CONTRACT_LINK :`/${props.title}`}>
      <a 
        className={`px-10 hover:border-indigo-400 hover:text-indigo-400 p-5 border-b-2 border-opacity-0 h-16 transition duration-200 ease-in-out text-gray-300 font-light ${props.collapse ? 'hidden md:block' : ''} ${props.title === 'contract' ? 'flex flex-row px-6' : ''}`}
        target={props.title === 'contract' ? '_blank' : ``}
        >
          <div className='flex items-center'>
            <h1>{props.title}</h1>
            {props.title === 'contract' ? 
              <div className='w-8 text-xs'>
                <FontAwesomeIcon icon={props.icon as IconDefinition}/> 
              </div>
              :
              <></>
            } 

          </div>
      </a>
    </Link>
  )
}

export default NavBarItem
