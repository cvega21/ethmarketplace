import { StringFormat } from "@firebase/storage";

export interface IProduct {
  buyNowPrice: number,
  condition: string,
  deliveryOpts: string
  description: string,
  forSale: boolean,
  imagePath: string,
  listedSince: string,
  location: string,
  ownerAddress: string,
  ownerName: string,
  refString: string,
  title: string,
  tokenURI: string,
  tokenID: number,
  trending?: boolean
}

export interface INFTMetadata {
  description: string,
  imagePath: string,
  title: string,
}

export interface IUser {
  address: string,
  name: string,
  permissions?: string,
  twitter: string,
}

export interface IAppContext {
  account: string
  addWalletListener: Function,
  connectMetamask: Function,
  navIsOpen: boolean,
  setNavIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
  name: string,
  setName: React.Dispatch<React.SetStateAction<string>>,
  refreshMetamask: Function,
  warningIsOpen: boolean,
  setWarningIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}