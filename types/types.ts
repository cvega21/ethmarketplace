export interface IProduct {
  buyNowPrice: number,
  startingPrice: number,
  title: string,
  location: string,
  description: string,
  imagePath: string,
  refString: string;
}

export interface INFTMetadata {
  title: string,
  description: string,
  imagePath: string
}