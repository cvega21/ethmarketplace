import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import ActionButton from './components/ActionButton';
import Product from './components/Product';
import React, { useState, useEffect, useRef } from 'react';
import Web3 from 'web3';
import abi from './api/sample_abi';

declare global {
  interface Window {
      ethereum: any;
  }
}

const Home: NextPage = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState('')
  const [web3IsEnabled, setWeb3IsEnabled] = useState(false);
  const web3js = useRef<Web3|null>(null);
  let testContract;

  useEffect(() => {
    window.ethereum ? setWeb3IsEnabled(true) : void(0);
    web3js.current = new Web3(window.ethereum.currentProvider);
    console.log(web3js.current);
  }, [])
  
  setTimeout(() => {
    startContract();
  }, 500);

  const startContract = () => {
    // var cryptoZombiesAddress = "YOUR_CONTRACT_ADDRESS";
    let web3 = web3js.current as Web3;
    // testContract = new web3.eth.Contract(abi as any, cryptoZombiesAddress);
    // console.log(testContract);
  }

  

  return (
    <div className="text-center">
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-1 flex-col items-center">
        <nav className="bg-gray-800 text-white p-5 m-0 w-screen flex justify-between">
          <div>
            <h1 className="font-bold text-3xl ml-10">
              Grails on Chain
            </h1>
          </div>
          <div className="flex mr-20 items-center">
            <a className="font-medium mr-12 text-xl">
              Buy
            </a>
            <a className="font-medium ml-12 text-xl">
              Sell
            </a>
          </div>
          <div className="flex mr-20 items-center">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded">
             Connect Wallet
            </button>
            {/* <p className="ml-5">
              or Get Metamask
            </p> */}
          </div>
        </nav>
        
        <div className="text-center flex flex-col justify-center items-center">
          <h1 className="font-bold text-8xl w-9/12 mt-10">
            Buy and Sell Authentic Sneakers 
          </h1>
          <h2 className="font-light text-gray-500 text-4xl mt-8 flex items-center">
            NFTs Powered by Ethereum 
            <Image src="/ethereum.svg" height={30} width={40} alt="ethereum"/>
          </h2>
        </div>

        {/* {loggedIn ? 
          <div>
            <h2>logged in as {user}</h2> 
            <ActionButton action="sell" text="List an Item"/>
          </div>
          : 
          <ActionButton action="sell" text="Start Selling"/>
        } */}

        {/* {
          web3IsEnabled ? 
            <h2>web3 is enabled.</h2> :
            <h2>web3 is not enabled. get metamask today...</h2>
        }  */}

        <div>
          {/* <h1>Products for Sale</h1> */}
          <div className="flex">
            <Product
              image="🍔"
              title="half eaten mcchicken"
              price={0.05}
              action={loggedIn ? "buy" : "login"}
            />
            <Product
              image="👓"
              title="gucci sunglasses"
              price={0.05}
              action={loggedIn ? "buy" : "login"}
            />
            <Product
              image="🧢"
              title="fake supreme hat"
              price={0.05}
              action={loggedIn ? "buy" : "login"}
            />
          </div>
        </div>

      </main>
    </div>
  )
}

export default Home
