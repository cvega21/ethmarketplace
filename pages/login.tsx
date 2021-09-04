import React from 'react'
import styles from '../styles/Home.module.css'

const login = () => {
  return (
    <div className={styles.container}>
      <h1>Connect your wallet to continue.</h1>
      <p>Note: only using testnet until further notice</p>
      <button>sign in with metamask</button>
    </div>
  )
}

export default login
