import React, { createContext, useContext, useState} from 'react'

interface IAppContext {
  account: string
  addWalletListener: Function,
  connectMetamask: Function,
  navIsOpen: boolean,
  setNavIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
  name: string,
  setName: React.Dispatch<React.SetStateAction<string>>,
  refreshMetamask: Function,
  warningIsOpen: boolean,
  setWarningIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const AppContext = React.createContext<IAppContext | null>(null);

export const AppWrapper: React.FC = ({ children }) => {
  const [navIsOpen, setNavIsOpen] = useState(false);
  const [warningIsOpen, setWarningIsOpen] = useState(true);
  const [account, setAccount] = useState('');
  const [name, setName] = useState('');
  
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
      account: account,
      addWalletListener: addWalletListener,
      connectMetamask: connectMetamask,
      navIsOpen: navIsOpen,
      name: name,
      setName: setName,
      setNavIsOpen: setNavIsOpen,
      refreshMetamask: refreshMetamask,
      warningIsOpen: warningIsOpen,
      setWarningIsOpen: setWarningIsOpen
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
