import React from 'react'
import Link from 'next/link'

interface INavBarItem {
  title: string
}

const NavBarItem = (props: any ) => {
  return (
    <Link href={props.title} passHref={true}>
      <a className='px-10 hover:border-indigo-400 hover:text-indigo-400 p-5 border-b-2 border-opacity-0 h-16 transition duration-200 ease-in-out text-gray-300 font-light'>
        {props.title}
      </a>
    </Link>
  )
}

export default NavBarItem
