import React from 'react'

interface IAppContext {
  navIsOpen: boolean,
  setNavIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const AppContext = React.createContext<IAppContext | null>(null);

export default AppContext;
