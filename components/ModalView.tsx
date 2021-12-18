import React from 'react'

const ModalView: React.FC  = ({ children }) => {
  return (
    <>
      <div className='text-white absolute overflow-hidden z-40 h-full opacity-50 bg-gray-900'>
        <div className='w-screen opacity-50'></div>
      </div>
      <div className='absolute top-12 z-50 justify-center'>
        {children}
      </div>
    </>
  )
}

export default ModalView
