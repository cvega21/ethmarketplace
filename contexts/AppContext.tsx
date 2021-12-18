import React, { createContext, useContext, useState} from 'react'
import { Auth, getAuth, signInWithCustomToken } from "firebase/auth";
import axios from 'axios';
import { toHex } from '../utils/utils'
import { firebase } from '../constants/firebase'

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
  const [auth, setAuth] = useState<Auth>();
  
  const connectMetamask = async () => {
    const defaultAuth = getAuth(firebase);
    const getNonceURI = 'https://www.google.com'
    const verifyNonceURI = 'https://www.google.com'

    try {
      console.log('requesting ethereum accounts...')
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts'});
      const account = accounts[0];
      setAccount(account);

      console.log('getting nonce...')
      // const authResponse = await axios.post(`${getNonceURI}`, {
      //   address: accounts[0]
      // })
      
      console.log('requesting eth signature...')
      const ethSignature = await window.ethereum.request({
        method: 'personal_sign',
        params: [
          `0x${toHex('3')}`,
          accounts[0]
        ]
      })
      
      console.log('verifying nonce...')
      // const verifyNonce = await axios.post(`${verifyNonceURI}`, {
        //   address: accounts[0],
        //   signature: ethSignature
        // })
        
      console.log('signing in...')
      signInWithCustomToken(defaultAuth, 'test')

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
