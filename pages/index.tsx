import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import ActionButton from '../components/ActionButton';
import Product from '../components/Product';
import React, { useState, useEffect, useRef, useContext } from 'react';
import Web3 from 'web3';
import abi from './api/sample_abi';
import NavBar from '../components/NavBar'
import Typed from 'typed.js';
import { useAppContext } from '../contexts/AppContext'

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
  // const navContext = {
  //   navIsOpen: navIsOpen,
  //   setNavIsOpen: setNavIsOpen
  // }
  const navContext = useAppContext();

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
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`text-center dark flex flex-1 flex-col items-center bg-gray-900 relative ${navContext?.navIsOpen ? 'min-h-screen overflow-hidden' : 'min-h-screen'}`}>
        <NavBar/>
        <div className="text-center flex w-full flex-col lg:flex-1 justify-center items-center h-full">
          <div className="font-bold text-5xl md:text-7xl lg:text-8xl w-10/12 mt-6 lg:mt-0 text-white tracking-tighter">
            <div className='justify-center md:flex'>
              <h1 className='px-1'>the</h1> 
              <h1 className='px-3'>metaverse</h1> 
              <h1 className='px-1'>for</h1> 
            </div>
            <div className="text-indigo-400">
              <span ref={typedElement}></span>
            </div>
          </div>
          <div className="w-11/12  md:w-4/12 lg:w-4/12 flex flex-col">
            <h2 className="font-extralight text-gray-500 text-xl md:text-4xl mt-8">
              buy and sell your real-life stuff as NFT&apos;s.
            </h2>
          </div>
          <div className="flex flex-col w-6/12 min-w-min md:w-3/12 lg:w-2/12 mt-6 lg:mt-32">
            <ActionButton theme='light' link='buy'>
              explore
            </ActionButton>
            <ActionButton theme='dark' link='sell'>
              sell stuff
            </ActionButton>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home
