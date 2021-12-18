import React, { createContext, useContext, useEffect, useState} from 'react'
import { Auth, getAuth, signInWithCustomToken, User } from "firebase/auth";
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
  const [firebaseAccount, setFirebaseAccount] = useState<any>();
  const [name, setName] = useState('');
  const auth = getAuth(firebase);
  
  const connectMetamask = async () => {
    const defaultAuth = getAuth(firebase);
    const getNonceURI = '/api/auth/getNonce'
    const verifyNonceURI = '/api/auth/verifyNonce'

    try {
      console.log('requesting ethereum accounts...')
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts'});
      console.log(`account: ${accounts[0]}`)
      
      console.log('getting nonce...')
      const nonceResponse = await axios.post(`${getNonceURI}`, {
        address: accounts[0]
      })
      console.log(`nonce: ${nonceResponse.data.nonce}`)
      
      console.log('requesting eth signature...')
      const ethSignature = await window.ethereum.request({
        method: 'personal_sign',
        params: [
          `0x${toHex(nonceResponse.data.nonce)}`,
          accounts[0]
        ],
        message: 'test!'
      })
      console.log(`eth signature: ${ethSignature}`)
      
      console.log('verifying nonce...')
      const verifyResponse = await axios.post(`${verifyNonceURI}`, {
        address: accounts[0],
        signature: ethSignature
      })
      console.log(`nonce response (auth token): ${verifyResponse.data.token}`)
        
      console.log('signing in...')
      signInWithCustomToken(defaultAuth, verifyResponse.data.token);

      const account = accounts[0];
      // setAccount(account);

      return account
    } catch (e) {
      return `oops. ${e}`
    }
  }

  const refreshMetamask = async () => {
    try {
      const accountArr = await window.ethereum.request({ method:
      'eth_accounts'})
      // setAccount(accountArr[0])
      return accountArr[0]
    } catch (e) {
      return `oops. ${e}`
    }
  }

  const addWalletListener = async () => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: Array<string>) => {
        if (accounts && accounts.length > 0) {
          // setAccount(accounts[0]);
        } else {
          // user has signed out
          setAccount('');
          auth.signOut();
        }
      })
    }
  }

  useEffect(() => {
    const unlisten = auth.onAuthStateChanged((authUser) => {
      authUser ? setAccount(authUser.uid) : setAccount('');

      console.log('inside auth state changed !!!')
      console.log(authUser?.uid);
    })

    return () => {
      unlisten();
    }

  }, []);


  
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
