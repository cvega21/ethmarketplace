import React, { useState, useEffect, useContext } from 'react'
import NavBar from './components/NavBar'
import Image from 'next/image'
import Typed from 'typed.js';
import { initializeApp } from "firebase/app";
import { collection, getFirestore, doc, setDoc, addDoc  } from "firebase/firestore";
import { db } from './api/firebase'
import { fill } from './api/sample_abi';

interface IProduct {
  title: string;
  description: string;
  startingPrice: number;
  buyNowPrice: number;
  location: string;
}

const Sell = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startingPrice, setStartingPrice] = useState(0.0001);
  const [buyNowPrice, setBuyNowPrice] = useState(0.0001);
  const [image, setImage] = useState('');
  const [location, setLocation] = useState('');
  
  const listItem = async () => {
    const product: IProduct = {
      title: title,
      description: description,
      startingPrice: startingPrice,
      buyNowPrice: buyNowPrice,
      location: location
    }

    try {
      await setDoc(doc(db, 'products', title), {product});
    } catch (e) {
      console.error('error!!!' + e)
    }
  }

  const changeInput = (e: React.ChangeEvent<HTMLInputElement>, setState: React.Dispatch<React.SetStateAction<any>>) => {
    let newValue = e.currentTarget.value;
    setState(newValue);
  }

  const changeTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>, setState: React.Dispatch<React.SetStateAction<any>>) => {
    let newValue = e.currentTarget.value;
    setState(newValue);
  }

  const changeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;
    setImage(URL.createObjectURL(fileList[0]));
  }

  return (
    <div className="flex flex-col w-screen items-center text-center bg-gray-900">
        <NavBar />
        <div className="flex flex-col items-center text-center w-full">
          <h1 className="font-bold text-5xl mt-10 mb-6 text-white">List an item</h1>
          <div className="md:mt-0 md:col-span-2 w-11/12">
            <form action="#" method="POST">
              <div className="shadow sm:rounded-md sm:overflow-hidden">
                <div className="px-4 py-5 space-y-6 sm:p-6">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-3 sm:col-span-3 w-full">
                      <label htmlFor="company-website" className="block text-md text-left font-medium text-white">
                        I'm selling a...
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm w-full">
                        <input
                          type="text"
                          name="company-website"
                          id="company-website"
                          className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300 border p-2 bg-gray-700 text-white"
                          placeholder="e.g. Louis Vuitton Bag"
                          onChange={e => changeInput(e, setTitle)}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="about" className="block text-md text-left font-medium text-white">
                      Description
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="about" 
                        name="about" 
                        rows={3} 
                        className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300 border p-2 bg-gray-700 text-white" 
                        placeholder="e.g. These sneakers are straight drip"
                        onChange={e => changeTextArea(e, setDescription)}
                      />
                    </div>
                  </div>
                  <div className="">
                    <div className="">
                      <div className="flex flex-col justify-between">
                        <div className="w-full mb-5">
                          <label htmlFor="company-website" className="block text-md text-left font-medium text-white">
                            Starting Price
                        </label>
                          <div className="mt-1 flex rounded-md shadow-sm w-full">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-800 text-gray-50 text-sm">
                              ETH
                          <Image src="/eth.svg" height={20} width={30} alt="ethereum" />
                            </span>
                            <input
                              type="number"
                              name="company-website"
                              id="company-website"
                              className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300 border p-2 bg-gray-700 text-white"
                              placeholder="0.0001"
                              defaultValue="0.0001"
                              step="0.0001"
                              onChange={e => changeInput(e, setStartingPrice)}
                            />
                          </div>
                        </div>
                        <div className="w-full">
                          <label htmlFor="company-website" className="block text-md text-left font-medium text-white">
                            Buy Now Price
                        </label>
                          <div className="mt-1 flex rounded-md shadow-sm w-full">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-800 text-gray-50 text-sm">
                              ETH
                          <Image src="/eth.svg" height={20} width={30} alt="ethereum" />
                            </span>
                            <input
                              type="number"
                              name="company-website"
                              id="company-website"
                              className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300 border p-2 bg-gray-700 text-white"
                              placeholder="0.0005"
                              defaultValue="0.0005"
                              step="0.0001"
                              onChange={e => changeInput(e, setBuyNowPrice)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-3 sm:col-span-3 w-full">
                      <label htmlFor="company-website" className="block text-md text-left font-medium text-white">
                        Location
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm w-full">
                        <input
                          type="text"
                          name="company-website"
                          id="company-website"
                          className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300 border p-2 bg-gray-700 text-white"
                          placeholder="e.g. Austin, TX"
                          onChange={e => changeInput(e, setLocation)}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-md text-left font-medium text-white mb-2">
                      Photo
                    </label>
                    <div className="relative min-h-48">
                      {
                        image ?
                        <div className="mt-1 flex flex-col items-center pt-6 h-auto">
                          <div className="relative h-40 w-full">
                            <Image src={image} alt={image} layout='fill' objectFit='cover'></Image>
                          </div>
                        </div>
                            :
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                              <div className="space-y-1 text-center">
                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <div className="relative flex text-sm text-gray-600 justify-center">
                                  <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-indigo-400 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                    <input accept="image/*" id="file-upload" name="file-upload" type="file" className="sr-only" onChange={changeImage}/>
                                    <span>Upload a file</span>
                                    </label>
                                </div>
                                <p className="text-xs text-gray-500">
                                  PNG, JPG, GIF up to 10MB
                                </p>
                              </div>
                            </div>
                      }
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 text-right sm:px-6 mb-10">
                  <button 
                    type='button'
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={listItem}  
                  >
                    List For Sale
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
    </div>
  )
}

export default Sell