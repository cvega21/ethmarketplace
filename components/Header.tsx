import React from 'react'

const Header: React.FC = ({ children }) => {
  return (
  <h1 className="text-white text-4xl font-light p-12">
    {children}
  </h1>
  )
}

export default Header
