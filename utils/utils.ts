import BN from "bn.js";
import Web3 from "web3";
import contractABI from '../build/contracts/Firechain.json';

const web3 = new Web3;
const contractAddress = '0xf3c1BF852060E0279057Bb485e41120D69Aaf31e';

export const getShortAddress = (address: string) => {
  return address.substr(0,5) + '...' + address.substr(-4,4);
}

export const getMediumAddress = (address: string) => {
  return address.substr(0,7) + '...' + address.substr(-4,4);
}

export const getMdTokenURI = (address: string) => {
  return address.substr(8,14) + '...' + address.substr(-6,6);
}

export const changeInput = (e: React.ChangeEvent<HTMLInputElement>, setState: React.Dispatch<React.SetStateAction<any>>) => {
  let newValue = e.currentTarget.value;
  setState(newValue);
}

export const mintNFT = async (account: string, tokenURI: string) => {
  window.contract = await new web3.eth.Contract(contractABI.abi as any, contractAddress);//loadContract();
  const amountToSend = web3.utils.toWei('0.0001', "ether");
  console.log(amountToSend)

  const transactionParameters = {
    to: contractAddress, // Required except during contract publications.
    from: account, // must match user's active address.,
    value: web3.utils.toHex(amountToSend),
    'data': window.contract.methods.mintNFT(tokenURI).encodeABI() //make call to NFT smart contract 
  };
  
  
  try {
    const txHash = await window.ethereum
        .request({
            method: 'eth_sendTransaction',
            params: [transactionParameters],
        });
    console.log(`success?!?! check out transaction on Etherscan: https://ropsten.etherscan.io/tx/${txHash}`);
    return {
      success: true,
      status: "✅ Check out your transaction on Etherscan: https://ropsten.etherscan.io/tx/" + txHash
    }
  } catch (error) {
    console.log('error', error);
      return {
          success: false,
          status: "😥 Something went wrong: " + error.message
      }
  }
}

export const buyNFT = async (tokenID: number, price: string, account: string) => {
  window.contract = await new web3.eth.Contract(contractABI.abi as any, contractAddress);//loadContract();
  const amountToSend = web3.utils.toWei(price, "ether");

  const transactionParameters = {
    to: contractAddress, // Required except during contract publications.
    from: account, // must match user's active address.,
    value: web3.utils.toHex(amountToSend),
    'data': window.contract.methods.buyItem(tokenID).encodeABI() //make call to NFT smart contract 
  };
  
  
  try {
    const txHash = await window.ethereum
        .request({
            method: 'eth_sendTransaction',
            params: [transactionParameters],
        });
    console.log(`success?!?! check out transaction on Etherscan: https://ropsten.etherscan.io/tx/${txHash}`);
    return {
      success: true,
      status: "✅ Check out your transaction on Etherscan: https://ropsten.etherscan.io/tx/" + txHash
    }
  } catch (error) {
    console.log('error', error);
      return {
          success: false,
          status: "😥 Something went wrong: " + error.message
      }
  }
}

