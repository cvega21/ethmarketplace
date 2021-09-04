import React from 'react'
import styles from '../../styles/Home.module.css'
import ActionButton from './ActionButton'

interface propsInterface {
  title: string;
  price: number;
  image: string;
  action: string;
}

const Product = (props: propsInterface) => {
  return (
    <div className={styles.item}>
      <h2>{props.image}</h2>
      <h3>{props.title}</h3>
      <p>{props.price} eth</p>
      <ActionButton action={props.action} text="buy now"/>
    </div>
  )
}

export default Product
