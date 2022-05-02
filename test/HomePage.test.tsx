import { render, screen } from '@testing-library/react'
import renderer from 'react-test-renderer';
import HomePage from '../pages/index';
import { IProduct } from '../types/types'

describe('Testable Component', () => {
  it('should render the text', () => {
    const featuredProduct: IProduct = {
      buyNowPrice: 10,
      condition: 'new',
      deliveryOpts: '0',
      description: 'test',
      forSale: true,
      listedSince: 'yday',
      imagePath: 'https://firebasestorage.googleapis.com/v0/b/ethmarketplace.appspot.com/o/listed-products%2FFCZPM43JIYU5M58.png?alt=media&token=3b3ffeca-b331-430a-96c8-d7421480e4d9',
      location: 'here',
      ownerAddress: 'here',
      ownerName: 'guy',
      refString: 'abc',
      tokenURI: 'hai',
      tokenID: 1,
      title: 'Tesla'
    }

    render(<HomePage featuredProduct={featuredProduct}/>)

    const searchText = screen.getByText("buy and sell real-life stuff as NFT's")
    expect(searchText).toBeInTheDocument();
  })
})