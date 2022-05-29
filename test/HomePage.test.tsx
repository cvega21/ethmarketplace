import { render, screen } from '@testing-library/react'
import renderer from 'react-test-renderer';
import userEvent from '@testing-library/user-event';
import {createMemoryHistory} from 'history';
import HomePage from '../pages/index';
import { IProduct } from '../types/types';
import { RouterContext } from "next/dist/shared/lib/router-context";
import { NextRouter } from "next/dist/shared/lib/router/router";
// import * as td from "testdouble";

jest.mock("next/router", () => ({
  useRouter() {
      return {
          route: "/",
          pathname: "",
          query: "",
          asPath: "",
      };
  },
}));

describe('Home Page', () => {
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
    title: 'SpaceX Falcon 9'
  }

  it('should render the Landing Page static text', () => {
    render(<HomePage featuredProduct={featuredProduct}/>)

    const heroNFT = screen.getByText("buy and sell real-life stuff as NFT's")
    expect(heroNFT).toBeInTheDocument();


    const sellStuff = screen.getByText("sell stuff")
    expect(sellStuff).toBeInTheDocument();
  });


  it('clicking explore button should take you to buy page', async () => {
    const push = jest.fn();

    const history = createMemoryHistory()
    render(<HomePage featuredProduct={featuredProduct}/>)
    const user = userEvent.setup();
    
    const explore = screen.getByText("explore")
    expect(explore).toBeInTheDocument();

    // console.log(explore);
    console.log(user.click)
    await user.click(explore);
    // const buyNow = screen.getByText("buy now")
    // const productDetails = screen.getByText("product details")
    
    // expect(explore).toBeInTheDocument();
    // expect(productDetails).toBeInTheDocument();
  })

  it('clicking sell button should take you to sell page', () => {

  })

  it('clicking product button should take you to product page', () => {

  })
})