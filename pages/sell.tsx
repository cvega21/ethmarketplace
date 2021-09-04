import React from 'react'
import styles from '../styles/Home.module.css'

const sell = () => {
  return (
    <div className={styles.container}>
      <h1>List a Product</h1>
      <div>
        <h2>Image</h2>
        <div>
          <button>🐒</button>
          <button>🎁</button>
          <button>🔫</button>
          <button>💰</button>
          <button>📺</button>
        </div>

        <h2>Title</h2>
        <form>
          <input></input>
        </form>

        <h2>Price (ethereum)</h2>
        <form>
          <input></input>
        </form>

        <button>List Product</button>
      </div>


    </div>
  )
}

export default sell
