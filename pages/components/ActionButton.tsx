import React, { JSXElementConstructor } from 'react';
import Link from 'next/link'

const ActionButton = (props: any) => {
  
  return (
    <div>
      <Link href={`/${props.action}`}>
        <a>
          <button>{props.text}</button>
        </a>
      </Link>
    </div>
  )
}

export default ActionButton
