import React, { useEffect, useRef } from 'react';
import type { NextPage } from 'next'
import Head from 'next/head'
import ActionButton from '../components/ActionButton';
import NavBar from '../components/NavBar'
import { useAppContext } from '../contexts/AppContext'
import Typed from 'typed.js';

const Home: NextPage = () => {
  const navContext = useAppContext();
  const typedElement: any = useRef(null);
  const typed: any = useRef(null);
  
  useEffect(() => {
    const options = {
      strings: ['^300 gucci belts^400', '^300 yeezys^400', '^300 iPhones^400', 'y^100o^100u^100r^100 s^100t^100u^100f^100f^1000'],
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
        <title>firechain</title>
      </Head>
      <main className={`text-center dark flex flex-1 flex-col items-center bg-gray-900 relative ${navContext?.navIsOpen ? 'min-h-screen overflow-hidden' : 'min-h-screen'}`}>
        <NavBar/>
        <div className="text-center flex w-full flex-col lg:flex-1 justify-center items-center h-full fadeDown mt-16">
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
          <div className="w-11/12  md:w-8/12 lg:w-6/12 flex flex-col lg:mt-12">
            <h2 className="font-light text-gray-500 text-xl md:text-4xl mt-8">
              buy and sell your real-life stuff as NFT&apos;s.
            </h2>
            <h3 className='font-extralight text-gray-500 text-lg mt-4'>
              powered by <a href='https://ethereum.org/en/what-is-ethereum/' target='_blank' rel='noreferrer' className='text-indigo-400 '>Ethereum ⚡️</a>
            </h3>
          </div>
          <div className="flex flex-col w-6/12 min-w-min md:w-3/12 lg:w-3/12 mt-6 lg:mt-20">
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
