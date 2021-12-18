import React from 'react'

const ChromeLink = () => {
  return (
    <div className='text-white text-xl font-thin flex'>
      <p className='mr-1'>
        or download on
      <a 
        href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en"
        target="_blank"
        rel="noreferrer"
        className='text-indigo-500 hover:text-indigo-600 transition-all ml-1 break-words'
      >
        chrome store
      </a>
      </p>  
    </div>
  )
}

export default ChromeLink
