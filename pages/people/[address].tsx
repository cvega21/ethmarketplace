import React from 'react'
import { collection, doc, getDoc, getDocs, limit, query, where } from 'firebase/firestore'
import { db } from '../../constants/firebase';
import { IUser } from '../../types/types';
import PageLayout from '../../constants/PageLayout';
import { AccountBox } from '../../pages/account';

interface IProps {
  user: IUser
}

const PublicProfile = ({ user }: IProps) => {
  console.log(user);
  
  return (
    <PageLayout>
      <AccountBox
        name={user.name}
        twitter={user.twitter}
        address={user.address}
      />
    </PageLayout>
  )
}

export async function getStaticProps({ params }: any) {
  // const userRef = doc(db, 'products', `${params.address}`);
  // const userRefValue = await getDoc(userRef);
  // const user = userRefValue.data() as IUser;
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

  return {
    props: {
      user,
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
