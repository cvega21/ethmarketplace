// require('dotenv').config();
const key = process.env.NEXT_PUBLIC_PINATA_KEY;
const secret = process.env.NEXT_PUBLIC_PINATA_SECRET;

import axios from 'axios'

const pinJSONToIPFS = async(JSONBody: any) => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;

    try {
      const response = await axios.post(url, JSONBody, {
        headers: {
            pinata_api_key: key as string,
            pinata_secret_api_key: secret as string,
        }
      });
      return {
        success: true,
        pinataUrl: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash,
        message: 'Congrats! You just minted an NFT!'
      }

    } catch (e) {
      return {
        success: false,
        pinataUrl: '',
        message: e.message
      }
    }
};

export default pinJSONToIPFS