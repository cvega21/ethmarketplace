import React from 'react'
import Link from 'next/link'
import { CONTRACT_LINK } from '../utils/utils'

interface INavBarItem {
  title: string,
  collapse: boolean
}

const NavBarItem = (props: INavBarItem ) => {
  return (
    <Link href={props.title === 'contract' ? CONTRACT_LINK :`/${props.title}`}>
      <a 
        className={`px-10 hover:border-indigo-400 hover:text-indigo-400 p-5 border-b-2 border-opacity-0 h-16 transition duration-200 ease-in-out text-gray-300 font-light ${props.collapse ? 'hidden md:block' : 'block'}`}
        target={props.title === 'contract' ? '_blank' : ``}
        >
        {props.title}
      </a>
    </Link>
  )
}

export default NavBarItem
