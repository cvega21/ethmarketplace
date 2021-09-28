import React, { useContext } from 'react'
import AppContext from '../contexts/AppContext'

const PageLayout = () => {
  const navContext = useContext(AppContext);
  
  return (
    <div className={`text-center dark flex flex-1 flex-col items-center bg-gray-900 relative ${navContext?.navIsOpen ? 'min-h-screen overflow-hidden' : 'min-h-screen'}`}>
      
    </div>
  )
}

export default PageLayout
