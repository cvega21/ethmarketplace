import React, { createContext, useContext, useState} from 'react'

interface IAppContext {
  navIsOpen: boolean,
  setNavIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
  connectMetamask: Function,
  account: string
}

const AppContext = React.createContext<IAppContext | null>(null);

export const AppWrapper: React.FC = ({ children }) => {
  const [navIsOpen, setNavIsOpen] = useState(false);
  const [account, setAccount] = useState('');
  
  const connectMetamask = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts'});
    const account = accounts[0];
    setAccount(account);
  }
  
  let appContext: IAppContext = {
      navIsOpen: navIsOpen,
      setNavIsOpen: setNavIsOpen,
      connectMetamask: connectMetamask,
      account: account
  }

  return (
    <AppContext.Provider value={appContext}>
      {children}
    </AppContext.Provider>
  ) 

}

export const useAppContext = () => {
  return useContext(AppContext);
};
