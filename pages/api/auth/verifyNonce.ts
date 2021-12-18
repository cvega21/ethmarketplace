import type { NextApiRequest, NextApiResponse } from 'next';
import admin from 'firebase-admin';
import { collection, doc, getDoc, updateDoc, getFirestore, limit, onSnapshot, query, where } from '@firebase/firestore';
import { Auth, getAuth, signInWithCustomToken } from "firebase/auth";
import { recoverPersonalSignature } from '@metamask/eth-sig-util';
import { toHex } from '../../../utils/utils'
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

export default async function verifyNonce(req: NextApiRequest, res: NextApiResponse) {
  
  try {
    if (req.method !== 'POST') {
      res.status(403).json({
        error: 'Please use the POST method for this endpoint.'
      });
      return        
    }
    if (!req.body.address || !req.body.signature) {
      res.status(400).json({
        error: 'Please send the Ethereum address and signature as part of the request body.'
      });
      return 
    }

    const address = req.body.address;
    const sig = req.body.signature;

    console.log('getting the user\'s nonce...')
    const userRef = doc(db, 'users', address);
    const userDoc = await getDoc(userRef);
    

    if (userDoc.exists()) {
      const existingNonce = userDoc.data()?.nonce;

      const recoveredAddress = recoverPersonalSignature({
        data: `0x${toHex(existingNonce)}`,
        signature: sig,
      });

      if (recoveredAddress === address) {
        await updateDoc(userRef, {
          nonce: Math.floor(Math.random() * 1000000).toString(),
        });

        const firebaseToken = await admin.auth().createCustomToken(address);
        
        res.status(200).json({ token: firebaseToken });
        return
      } else {
        res.status(401).json({
          error: 'signature could not be verified'
        })
      }
    } else {
      console.log('user doc does not exist');
      res.status(500).json({
        error: 'user does not exist.'
      });
      return
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({
      status: 'error',
      error: e
    });
  }
}