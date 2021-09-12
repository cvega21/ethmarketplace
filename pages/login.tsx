import React from 'react';
import styles from '../styles/Home.module.css';
import Store from './components/StoreUI';

const login = () => {
  return (
    <div className={styles.container}>
      <Store/>
      <h1>Connect your wallet to continue.</h1>
      <p>Note: only using testnet until further notice</p>
      <button>sign in with metamask</button>
    </div>
  )
}

export default login
