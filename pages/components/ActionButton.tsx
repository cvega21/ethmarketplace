import React, { JSXElementConstructor } from 'react';
import Link from 'next/link'

const ActionButton = (props: any) => {
  
  return (
    <div>
      <Link href={`/${props.action}`}>
        <a>
          <button className="bg-indigo-200 hover:bg-indigo-600 text-indigo-800 hover:text-white font-medium py-2 px-4 rounded w-24">{props.text}</button>
        </a>
      </Link>
    </div>
  )
}

export default ActionButton
