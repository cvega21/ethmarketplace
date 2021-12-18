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
  console.log('hi')

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

      console.log('getting user ref and doc...')
      const userRef = doc(db, 'users', req.body.address);
      const userDoc = await getDoc(userRef);
      console.log(userDoc.data())
      

      if (userDoc.exists()) {
        const existingNonce = userDoc.data()?.nonce;

        res.status(200).json({ nonce: existingNonce });

      } else {
        const generatedNonce = Math.floor(Math.random() * 1000000).toString();

        const createdUser = await admin.auth().createUser({
          uid: req.body.address,
        });

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