import type { NextApiRequest, NextApiResponse } from 'next';
import admin from 'firebase-admin';
import { collection, doc, getDoc, getDocs, getFirestore, limit, onSnapshot, query, where } from '@firebase/firestore';
import { Auth, getAuth, signInWithCustomToken } from "firebase/auth";
import { recoverPersonalSignature } from '@metamask/eth-sig-util';
require('dotenv').config();

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.PROJECT_ID,
      clientEmail: process.env.CLIENT_EMAIL,  
      privateKey: process.env.PRIVATE_KEY?.replace(/\\n/g, '\n'),
    })
  });
}

const db = getFirestore(); 

export default async function getNonce(req: NextApiRequest, res: NextApiResponse) {
  console.log('********Getting Nonce**********')

  try {
    if (req.method !== 'POST') {
      res.status(403).json({
        error: 'Please use the POST method for this endpoint.'
      });
      return        
    }
    if (!req.body.address) {
      res.status(400).json({
        error: 'Please send the Ethereum address as part of the request body.'
      });
      return 
    }

    console.log('getting user and their nonce...')
    const userRef = doc(db, 'users', req.body.address);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      console.log('user exists...')
      console.log(userDoc.data())
      const existingNonce = userDoc.data()?.nonce;
      
      res.status(200).json({ nonce: existingNonce });
      
    } else {
      console.log('user does not exist...')
      console.log('generating nonce...')
      const generatedNonce = Math.floor(Math.random() * 1000000).toString();
      console.log(`nonce: ${generatedNonce}`)

      const createdUser = await admin.auth().createUser({
        uid: req.body.address,
      });
      console.log(`createdUser: ${createdUser}`);

      await admin.firestore().collection('users').doc(createdUser.uid).set({
        nonce: generatedNonce,
      });

      res.status(200).json({ nonce: generatedNonce });
    }

  } catch (e) {
    console.error(e);
    res.status(500);
  }
}