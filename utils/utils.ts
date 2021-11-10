export const getShortAddress = (address: string) => {
  return address.substr(0,5) + '...' + address.substr(-4,4);
}

export const getMediumAddress = (address: string) => {
  return address.substr(0,7) + '...' + address.substr(-4,4);
}

export const getMdTokenURI = (address: string) => {
  return address.substr(8,14) + '...' + address.substr(-6,6);
}