import Head from 'next/head'
import { loadStripe } from '@stripe/stripe-js'
import Cookies from 'js-cookie';

import { CartItem } from "../components/CartItem";
import { Header } from "../components/Header";
import { useCart } from "../hooks/useCart";

import styles from '../styles/pages/cart.module.scss';




export default function Cart() {

  const { cart, lenCart } = useCart();


  async function handleCheckout() {

    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

    const items = cart.items.map(item => ({
      price: item.product.price_id,
      quantity: item.quantity,
    }));

    var sessionId = Cookies.get('session_id');
    if (sessionId) {
      await fetch('/api/expire-checkout-session', {
        method: 'post',
        body: JSON.stringify({ session_id: sessionId })
      })
    }

    const response = await fetch('/api/create-checkout-session', {
      method: 'post',
      body: JSON.stringify({ items })
    });

    const { session_id } = await response.json()
    Cookies.set('session_id', session_id);
    stripe.redirectToCheckout({ sessionId: session_id });
  }



  return (
    <div className={styles.container}>
      <Head>
        <title>golden card</title>
      </Head>
      <Header />
      <main className={styles.content}>
        <h1 className={styles.title}>
          cart
        </h1>

        {lenCart !== 0 ? (
          <>
            <div className={styles.listCartItem}>
              {cart.items.map(item => (
                <CartItem
                  key={item.product.product_id}
                  product={item.product}
                  quantity={item.quantity}
                />
              ))}
            </div>

            <footer className={styles.footer}>
              <span className={styles.totalPrice}>
                Total R$ {Number(cart.priceTotal).toFixed(2)}
              </span>
              <button className={styles.buttonCheckout} onClick={handleCheckout}>
                Checkout
              </button>
            </footer>
          </>
        ) : (
          <div className={styles.message}>
            <img src="/illustration.png" alt="illustration" />
            <p>your cart is empty</p>
          </div>
        )}
      </main>
    </div>
  );
}