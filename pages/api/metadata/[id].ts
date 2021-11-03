import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../constants/firebase'
import { collection, doc, getDoc, getDocs, limit, onSnapshot, query, where } from '@firebase/firestore';
import { IProduct } from '../../../types/types'


interface INFTMetadataRes {
  title: string,
  description: string,
  imagePath: string
}

const getMetadata = async (req: NextApiRequest, res: NextApiResponse<INFTMetadataRes>) => {
  const refString = req.query.id as string;
  const productRef = doc(db, 'products', refString);
  const product = await getDoc(productRef);
  const productData: IProduct = product.data() as IProduct;
  const {title, description, imagePath} = productData;

  res.status(200).json({
    title: title,
    description: description,
    imagePath: imagePath
  });
}

export default getMetadata