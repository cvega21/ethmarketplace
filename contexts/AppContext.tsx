import React, { createContext, useContext, useEffect, useState} from 'react'
import { Auth, getAuth, signInWithCustomToken, User } from "firebase/auth";
import axios from 'axios';
import { toHex } from '../utils/utils'
import { db, firebase } from '../constants/firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore';

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
      
      if (verifyResponse.status !== 200) {
        alert('there was an error verifying your account.');

        return
      }

      console.log(`nonce response (auth token): ${verifyResponse.data.token}`)
      
      console.log('signing in...')
      const firebaseCreds = await signInWithCustomToken(defaultAuth, verifyResponse.data.token);
      console.log(`firebaseCreds.user = ${firebaseCreds.user}`);

      console.log('updating nonce (CLIENT)...')

      // If new user: create a user record with the single field of "nonce" under /{userID}/metadata
      // If existing user: updates nonce in /{userID}/metadata
      const userRef = doc(db, 'users', accounts[0], 'metadata', 'auth');
      const userDoc = await getDoc(userRef);
      console.log(`userRef:`)
      console.log(userRef);
      console.log(userDoc.data());
      
      await updateDoc(userRef, {
        nonce: `Please sign the random nonce to complete sign-in. This is only used to verify your account and does not send any transaction nor incur gas fees. Current nonce: ${Math.floor(Math.random() * 1000000).toString()}`,
      });

      // const account = accounts[0];
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
      const listener = window.ethereum.on('accountsChanged', (accounts: Array<string>) => {
        if (accounts && accounts.length > 0) {
          // setAccount(accounts[0]);
        } else {
          // user has signed out
          console.log('inside wallet listener... user has signed out')
          setAccount('');
          auth.signOut();
        }
      })
    }
  }

  useEffect(() => {
    const unlisten = auth.onAuthStateChanged((authUser) => {
      console.log('inside auth state changed !!!')

      authUser ? setAccount(authUser.uid) : setAccount('');
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
