import type { NextApiRequest, NextApiResponse } from 'next';
import admin from 'firebase-admin';
import { collection, doc, getDoc, updateDoc, getFirestore, limit, onSnapshot, query, where } from '@firebase/firestore';
import { Auth, getAuth, signInWithCustomToken } from "firebase/auth";
import { recoverPersonalSignature } from '@metamask/eth-sig-util';
import { toHex, CONTRACT_ADDRESS } from '../../utils/utils'
import axios from 'axios';
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
const ETHERSCAN_ROPSTEN = 'https://api-ropsten.etherscan.io/api';

export default async function buyNFT(req: NextApiRequest, res: NextApiResponse) {
  console.log('********UPDATE FIREBASE DATA AFTER BUY**********')
  
  try {
    if (req.method !== 'POST') {
      res.status(403).json({
        status: 'error',
        error: 'Please use the POST method for this endpoint.'
      });
      return        
    }
    if (!req.body.buyer || !req.body.seller || !req.body.tokenID || !req.body.txHash || !req.body.newProduct ) {
      res.status(400).json({
        status: 'error',
        error: 'Please send the buyer, seller, tokenID, txHash and product info as part of the request body.'
      });
      return 
    }

    const buyer = req.body.buyer;
    const seller = req.body.seller;
    const tokenID = req.body.tokenID;
    const txHash = req.body.txHash;
    const newProduct = req.body.product;
    
    console.log('checking transaction...')
    const etherscanData = await axios.get(`${ETHERSCAN_ROPSTEN}`, { params : {
      module: 'account',
      action: 'tokennfttx',
      contractaddress: CONTRACT_ADDRESS,
      address: buyer,
      page: 1,
      offset: 10,
      startblock: 0,
      endblock: 999999999,
      sort: 'desc',
      apikey: process.env.ETHERSCAN_API_KEY,
    }})

    const txDetails = etherscanData.data.result;
    let infoMatches: boolean = false;

    if (txDetails.length == 0) {
      res.status(400).json({
        status: 'error',
        error: 'address has not interacted with the contract.'
      });
      console.error('address has not interacted with the contract.')
      return
    }
    

    txDetails.forEach( async (tx: any) => {
      if (tx.hash !== txHash) {
        return 
      } else {
        console.log('transaction matches the check...')
      }
      
      if (tx.from === seller && tx.to === buyer && tx.tokenID && tokenID) {
        console.error(`parameters match! buy confirmed!`);
        console.log(`tx from: ${tx.from, seller}`)
        console.log(`tx to: ${tx.to, buyer}`)
        console.log(`tx tokenID: ${tx.tokenID, tokenID}`)
        infoMatches = true;
        return 
      } 
    })

    if (infoMatches) {
      await admin.firestore().collection('products').doc(newProduct.refString).set(newProduct);
      res.status(200).json({
        status: 'success'
      })
      return
    } else {
      res.status(400).json({
        status: 'error',
        error: 'params did not match any transaction in the past 10 for that account.'
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