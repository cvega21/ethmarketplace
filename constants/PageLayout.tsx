import React, { useContext } from 'react';
import { useAppContext } from '../contexts/AppContext';
import NavBar from '../components/NavBar';

const PageLayout: React.FC = ({ children }) => {
  const navContext = useAppContext();
  
  return (
    <div className={`text-center dark flex flex-1 flex-col items-center bg-gray-900 relative ${navContext?.navIsOpen ? 'max-h-screen overflow-hidden' : 'min-h-screen'}`}>
      <NavBar/>
      {children}
    </div>
  )
}

export default PageLayout
