import React, { useEffect, useState } from 'react'
import { collection, doc, getDoc, getDocs, limit, query, where } from 'firebase/firestore'
import { db } from '../../constants/firebase';
import { IUser, IProduct } from '../../types/types';
import Product from "../../components/Product";
import PageLayout from '../../constants/PageLayout';
import { AccountBox } from '../../pages/account';
import { useAppContext } from '../../contexts/AppContext'


interface IProps {
  user: IUser,
  productsArr: IProduct
}

const PublicProfile = ({ user, productsArr }: any) => {
  const appContext = useAppContext();
  
  return (
    <PageLayout>
      <AccountBox
        name={user.name}
        twitter={user.twitter}
        address={user.address}
      />
      <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-12 w-6/12 mt-16 items-center fadeDown">
        {productsArr.map((product: IProduct) => {
          return (
            <Product
              buyNowPrice={product.buyNowPrice}
              startingPrice={product.startingPrice}
              title={product.title}
              location={product.location}
              description={product.description}
              imagePath={product.imagePath}
              refString={product.refString}
              tokenURI={product.tokenURI}
              listedSince={product.listedSince}
              key={product.imagePath}
              listedBy={''}
              condition={''}
              deliveryOpts={''}
              ownerAddress={''}
              ownerName={''}
            />
          )
        })}
      </div>
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
