import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../constants/firebase'
import { collection, doc, getDoc, getDocs, limit, onSnapshot, query, where } from '@firebase/firestore';
import { IProduct, INFTMetadata } from '../../../types/types';
import pinJSONToIPFS from '../../../utils/pinJSONToIPFS';

interface IPinataRes {
  tokenURI: string
}

interface IErrorRes {
  error: string
}

export default async function getMetadata(req: NextApiRequest, res: NextApiResponse<INFTMetadata|IPinataRes|any>) {
  
  if (req.method === 'POST') {
    // IPFS (Decentralized) Implementation
    console.log(req.body)
    const NFTMetadata: INFTMetadata = req.body;
    const pinataResponse = await pinJSONToIPFS(req.body);

    if (!pinataResponse.success) {
      res.status(400).json({error: 'error calling pinata.'});
    } else {
      res.status(200).json({
        tokenURI: pinataResponse.pinataUrl
      });
    }
  } else {
    // Firebase (Centralized) Implementation
    // try {
    //   const refString = req.query.id as string;
    //   const productRef = doc(db, 'products', refString);
    //   const product = await getDoc(productRef);
    //   const productData: IProduct = product.data() as IProduct;
    //   const {title, description, imagePath} = productData;
    
    //   res.status(200).json({
    //     title: title,
    //     description: description,
    //     imagePath: imagePath
    //   });
    // } catch (e) {
      res.status(405).json({
        error: 'use POST method.' 
      })
    // }
  }
}

// export default getMetadata