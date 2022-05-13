The idea for Firechain was born after I noticed a problem with potential scams when I was selling my old furniture on Facebook Marketplace - I realized that smart contracts with built-in escrows and security could give users a safer experience.

The front-end is a SPA built on React, Next.js, TailwindCSS and web3.js. There's pages to explore the marketplace, list a new item, view and buy individual products, as well as custom user profiles showing items for sale. 

They are server-side rendered and CDN cached through Vercel for fast loads, which means we have to check for data updates every ~15 seconds to generate the updated static files.

The true back-end is Ethereum, as the smart contract (written in Solidity) keeps track of all the users, products and prices, as well as transaction execution and actual settlement of funds.
 
The products' metadata is stored in IPFS, a decentralized file storage protocol similar to BitTorrent. We use Pinata's API pinning service to ensure that at least one IPFS node will store this data indefinitely.

We also use a Firebase database caching the blockchain data to minimize loading times, as Ethereum calls can get slow. It has a user profile schema to enable additional functionality, such as custom usernames and profile pictures.

Finally, we leverage Metamask (popular crypto wallet) to enable user authentication without any e-mail or OAuth sign up by essentially implementing asymmetric key encryption with Ethereum.



This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
