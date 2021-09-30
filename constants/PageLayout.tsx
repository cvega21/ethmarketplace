import React, { useContext } from 'react';
import { useAppContext } from '../contexts/AppContext'

const PageLayout: React.FC = ({ children }) => {
  const navContext = useAppContext();
  
  return (
    <div className={`text-center dark flex flex-1 flex-col items-center bg-gray-900 relative ${navContext?.navIsOpen ? 'min-h-screen overflow-hidden' : 'min-h-screen'}`}>
      {children}
    </div>
  )
}

export default PageLayout
