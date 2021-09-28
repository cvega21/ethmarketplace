import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import ActionButton from './components/ActionButton';
import Product from './components/Product';
import React, { useState, useEffect, useRef, useContext } from 'react';
import Web3 from 'web3';
import abi from './api/sample_abi';
import NavBar from './components/NavBar'
import Typed from 'typed.js';
import AppContext from './components/AppContext'

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
  const [navIsOpen, setNavIsOpen] = useState(false);
  const navContext = {
    navIsOpen: navIsOpen,
    setNavIsOpen: setNavIsOpen
  }

  const changeNav = (e: React.MouseEvent<HTMLButtonElement>) => {
    setNavIsOpen(!navIsOpen);
  }

  useEffect(() => {
    window.ethereum ? setWeb3IsEnabled(true) : void(0);
    web3js.current = new Web3(window.ethereum.currentProvider);
    console.log(web3js.current);
  }, [])
  
  setTimeout(() => {
    startContract();
  }, 500);

  const startContract = () => {
    let web3 = web3js.current as Web3;
  }

  const typedElement: any = useRef(null);
  const typed: any = useRef(null);
  
  useEffect(() => {
    const options = {
      strings: ['^300 gucci belts^400', '^300 yeezys^400', '^300 iPhones^400', '^100a^100n^100y^100t^100h^100i^100n^100g^1000'],
      typeSpeed: 38,
      backSpeed: 18,
      loop: false
    };
    
    typed.current = new Typed(typedElement.current as Element, options);
    return () => {
      typed.current.destroy();
    }
  }, [])

  return (
    <div className="text-center dark">
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppContext.Provider value={navContext}>
        <main className={`flex flex-1 flex-col items-center bg-gray-900 relative ${navIsOpen ? 'max-h-screen overflow-hidden' : ''}`}>
          <NavBar/>
          <div className="text-center flex w-full flex-col justify-center items-center">
            <div className="font-bold text-5xl w-10/12 mt-6 text-white tracking-tighter">
              <h1>the</h1> 
              <h1>metaverse</h1> 
              <h1>for</h1> 
              <div className="text-indigo-400">
                <span ref={typedElement}></span>
              </div>
            </div>
            <div className="w-11/12 flex flex-col">
              <h2 className="font-extralight text-gray-500 text-xl mt-8">
                buy and sell your real life stuff as NFTs, powered by
                <div className="inline">
                  <p className="inline-flex items-center ml-1 font-normal"> Ethereum. 
                  </p>
                </div>
              </h2>
            </div>
            <div className="flex flex-col w-5/12">
              <a href="buy" className="mt-10">
                <button className="bg-indigo-200 hover:bg-indigo-100 text-indigo-800 hover:text-indigo-700 font-medium text-xl py-2 px-8 rounded-lg shadow-indigo w-full">
                explore
                </button>
              </a>
              <a href="sell" className="mt-8 mb-5">
                <button className="bg-indigo-700 rounded-lg hover:bg-indigo-600 text-gray-100 hover:text-white font-medium text-xl py-2 px-8 shadow-indigo w-full">
                  sell stuff
                </button>
              </a>
            </div>
          </div>
          <div className="flex flex-col w-11/12 mt-12">
            <h1 className="font-light justify-self-start text-left text-gray-50 text-2xl ml-4">top picks near you</h1>
            <div className="flex flex-col">
              <Product
                image="coffee_table.jpeg"
                title="modern coffee table"
                price={0.000042}
                action={loggedIn ? "buy" : "login"}
                location="austin, tx"
                />
              <Product
                image="iphone.jpeg"
                title="iphone 12"
                price={0.000095}
                action={loggedIn ? "buy" : "login"}
                location="san marcos, tx"
                />
              <Product
                image="jordans.jpeg"
                title="jordan 1's"
                price={0.00004}
                action={loggedIn ? "buy" : "login"}
                location="round rock, tx"
              />
            </div>
          </div>
        </main>
      </AppContext.Provider>
    </div>
  )
}

export default Home
