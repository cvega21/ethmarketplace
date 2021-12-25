import React from 'react';
import Link from 'next/link'

interface IProps {
  theme: string,
  link?: string,
  children?: React.ReactNode
}

const ActionButton = (props: IProps) => {
  
  return (
    props.theme === 'light' ?
      <Link href={`/${props.link}`} passHref={true}>
          <button className="bg-indigo-200 hover:bg-indigo-300 text-indigo-800 hover:text-indigo-900 font-medium lg:text-xl md:text-lg text-sm py-2 px-4 my-4 rounded-lg shadow-indigo w-full transition-all duration-200 ease-in-out">
            {props.children}
          </button>
      </Link>
    : props.theme === 'dark' ?
      <Link href={`/${props.link}`} passHref={true}>
          <button className="bg-indigo-700 rounded-lg hover:bg-indigo-800 text-gray-100 hover:text-white font-medium lg:text-xl md:text-lg text-sm py-2 px-4 my-4 shadow-indigo w-full transition-all duration-200 ease-in-out">
            {props.children}
          </button>
      </Link>
    : <></>
  )
}

export default ActionButton
