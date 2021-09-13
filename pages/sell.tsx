import React from 'react'

const sell = () => {
  return (
    <div className="flex flex-col w-screen items-center text-center">
      <h1 >List a Product</h1>
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
