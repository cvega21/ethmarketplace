import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const NavBarItem = (props: any) => {
  return (
    <a href={props.title} className='flex w-full text-gray-50 text-2xl font-light pl-6 h-16 items-center hover:bg-indigo-500 hover:cursor-pointer hover:text-white transition duration-150'>
      <div className='w-10 text-xl'>
        <FontAwesomeIcon icon={props.icon}/> 
      </div>
      <h2 className='pl-4'>{props.title}</h2>
    </a>
  )
}

export default NavBarItem
