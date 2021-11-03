import React, { createContext, useContext, useState} from 'react'

interface IAppContext {
  navIsOpen: boolean,
  setNavIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
  addWalletListener: Function,
  connectMetamask: Function,
  refreshMetamask: Function,
  account: string
}

const AppContext = React.createContext<IAppContext | null>(null);

export const AppWrapper: React.FC = ({ children }) => {
  const [navIsOpen, setNavIsOpen] = useState(false);
  const [account, setAccount] = useState('');
  
  const connectMetamask = async () => {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts'});
      const account = accounts[0];
      setAccount(account);
      return account
    } catch (e) {
      return `oops. ${e}`
    }
  }

  const refreshMetamask = async () => {
    try {
      const accountArr = await window.ethereum.request({ method:
      'eth_accounts'})
      setAccount(accountArr[0])
      return accountArr[0]
    } catch (e) {
      return `oops. ${e}`
    }
  }

  const addWalletListener = async () => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: Array<string>) => {
        accounts.length > 0 ? setAccount(accounts[0]) : setAccount('');
      })
    }
  }


  
  let appContext: IAppContext = {
      navIsOpen: navIsOpen,
      setNavIsOpen: setNavIsOpen,
      addWalletListener: addWalletListener,
      connectMetamask: connectMetamask,
      refreshMetamask: refreshMetamask,
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
