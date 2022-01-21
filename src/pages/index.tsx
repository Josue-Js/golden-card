import { useState } from 'react';
import Head from 'next/head';
import { GetStaticProps } from 'next';
import Stripe from 'stripe';

import { stripe } from '../services/stripe';

import { Card } from '../components/Card';
import { Header } from '../components/Header';
import { Modal } from '../components/Modal';

import styles from '../styles/pages/home.module.scss';
import { convertPrice } from '../utils/convertPrice';


type IProduct = {
  product_id: string;
  price_id: string;
  title: string;
  description: string;
  price: string;
  image: string;
  rating: number;
}

type Props = {
  products: IProduct[]
}



export default function Home({ products }: Props) {

  const [isVisible, setIsVisible] = useState(false);
  const [indexProduct, setIndexProduct] = useState(0);

  const productSelected = products[indexProduct];

  function openModal(indexProduct: number) {
    setIsVisible(true);
    setIndexProduct(indexProduct)
  }

  function closeModal() {
    setIsVisible(false)
  }


  return (
    <div>
      <Head>
        <title>golden card</title>
      </Head>

      <Header />

      <main className={styles.content}>
        <figure className={styles.banner}>
          <img src="/banner.png" alt="banner" />
        </figure>

        <section className={styles.giftCards}>
          {products.map((data, index) => (
            <Card
              key={data.product_id}
              product={data}
              onClick={() => openModal(index)}
            />
          ))}
        </section>
      </main>
      <Modal
        isVisible={isVisible}
        product={productSelected}
        closeModal={closeModal}
      />
    </div>
  )
}


export const getStaticProps: GetStaticProps = async (context) => {

  const prices = await stripe.prices.list({
    limit: 13,
    expand: ['data.product'],
  });

  const data = prices.data.map(price => {

    const product = price.product as Stripe.Product;

    return {
      product_id: product.id,
      price_id: price.id,
      image: product.images[0],
      title: product.name,
      description: product.metadata.description,
      price: convertPrice(price.unit_amount_decimal),
      rating: product.metadata.rating,
    }
  }).reverse();

  return {
    revalidate: (60 * 60 * 24),
    props: {
      products: data,
    }
  }
}