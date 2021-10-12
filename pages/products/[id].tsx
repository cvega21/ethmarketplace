import React from 'react'
import styles from '../styles/Home.module.css'
import PageLayout from '../../constants/PageLayout'
import { useRouter } from 'next/router'
import Product from '../../components/Product'

const ProductPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <PageLayout>
      <h1>{id}</h1>
    </PageLayout>
  )
}

export default ProductPage
