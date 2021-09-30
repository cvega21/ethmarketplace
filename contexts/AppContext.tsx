import React, { createContext, useContext, useState} from 'react'

interface IAppContext {
  navIsOpen: boolean,
  setNavIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const AppContext = React.createContext<IAppContext | null>(null);

export const AppWrapper: React.FC = ({ children }) => {
  const [navIsOpen, setNavIsOpen] = useState(false);
  
  let navContext = {
      navIsOpen: navIsOpen,
      setNavIsOpen: setNavIsOpen
  }

  return (
    <AppContext.Provider value={navContext}>
      {children}
    </AppContext.Provider>
  ) 

}

export const useAppContext = () => {
  return useContext(AppContext);
};
