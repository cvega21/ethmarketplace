import React from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../constants/firebase';
import { IUser, IProduct } from '../../types/types';
import Product from "../../components/Product";
import PageLayout from '../../constants/PageLayout';
import { AccountBox } from '../../pages/account';
import { useAppContext } from '../../contexts/AppContext'
import Footer from '../../components/Footer';
import Head from 'next/head';


interface IProps {
  user: IUser,
  productsArr: Array<IProduct>
}

const PublicProfile = ({ user, productsArr }: IProps) => {
  const appContext = useAppContext();
  
  return (
    <PageLayout>
      <Head>
        <title>@{user.twitter.toLowerCase()} | firechain</title>
      </Head>
      <AccountBox
        name={user.name}
        twitter={user.twitter}
        address={user.address}
      />
      <div className='w-full text-xl flex border-b border-gray-700 justify-center lg:mb-14 h-14'>
        <div className={` border-indigo-400 hover:text-indigo-400 p-4 lg:mx-4 border-b-2 h-14 transition duration-200 ease-in-out text-gray-300 font-thin cursor-pointer`}>
          <h2>Featured</h2>
        </div>
        <div className={` hover:border-indigo-400 hover:text-indigo-400 p-4 lg:mx-4 border-b-2 border-opacity-0 h-14 transition duration-200 ease-in-out text-gray-300 font-thin cursor-pointer`}>
          <h2>Selling</h2>
        </div>
        <div className={` hover:border-indigo-400 hover:text-indigo-400 p-4 lg:mx-4 border-b-2 border-opacity-0 h-14 transition duration-200 ease-in-out text-gray-300 font-thin cursor-pointer`}>
          <h2>All NFTs</h2>
        </div>
      </div>
      <div className="flex-col grid lg:grid-cols-3 md:grid-cols-2 gap-12 w-9/12 lg:w-9/12 my-12 items-center fadeDown">
        {productsArr.map((product: IProduct) => {
          return (
            <Product
              buyNowPrice={product.buyNowPrice}
              condition={''}
              deliveryOpts={''}
              description={product.description}
              forSale={product.forSale}
              imagePath={product.imagePath}
              key={product.imagePath}
              listedSince={product.listedSince}
              location={product.location}
              ownerAddress={''}
              ownerName={''}
              refString={product.refString}
              title={product.title}
              tokenURI={product.tokenURI}
              tokenID={1}
            />
          )
        })}
      </div>
      <Footer/>
    </PageLayout>
  )
}

export async function getStaticProps({ params }: any) {
  let user;

  const q = query(collection(db, 'users'), where('address','==',params.address));
  const queryRef = await getDocs(q);
  const querySnapshot = queryRef.docs;

  let counter = 0;      
  querySnapshot.forEach((doc) => {    
    if (counter === 0) {
      user = doc.data();
    }
  })

  const productsArr: Array<IProduct> = [];
  const productsQuery = query(collection(db, 'products'), where('ownerAddress','==',params.address));
  const productsDocs = await getDocs(productsQuery);

  productsDocs.forEach((doc) => {
    const product = doc.data();
    productsArr.push(product as IProduct);
  });
  
  return {
    props: {
      user,
      productsArr
    },
    revalidate: 30
  }
}

export async function getStaticPaths() {
  const usersQuery = query(collection(db, 'users'));
  const usersDocs = await getDocs(usersQuery);
  
  const paths = usersDocs.docs.map((doc) => {
    const user = doc.data();

    return { params: 
      { address: user.address }
    } ;
  });

  return { paths, fallback: false }
}

export default PublicProfile
