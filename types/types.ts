export interface IProduct {
  buyNowPrice: number,
  startingPrice?: number,
  title: string,
  location: string,
  description: string,
  imagePath: string,
  refString: string,
  tokenURI: string,
  listedSince: string
  listedBy: string
  ownerAddress: string
  condition: string
  deliveryOpts: string
}

export interface INFTMetadata {
  title: string,
  description: string,
  imagePath: string
}