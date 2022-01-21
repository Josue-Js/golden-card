import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Stripe from 'stripe'
import { loadStripe } from '@stripe/stripe-js';
import { BsCheck2Circle } from 'react-icons/bs';
import { MdErrorOutline } from 'react-icons/md';
import Cookies from 'js-cookie';

import { Header } from "../components/Header";

import { stripe } from '../services/stripe';
import { useCart } from '../hooks/useCart';

import styles from '../styles/pages/checkout.module.scss';

type Props = {
  name?: string;
  status: 'success' | 'canceled';
  session_id: string;
}



export default function Checkout({ status, name, session_id }: Props) {

  const router = useRouter();
  const { clearCart } = useCart();


  async function handleBack() {
    if (status === "canceled") {
      await fetch('/api/expire-checkout-session', {
        method: 'post',
        body: JSON.stringify({ session_id: session_id })
      });
    }

    Cookies.remove('session_id');
    clearCart();
    router.replace('/')
  }


  async function handleRedirectCheckout() {

    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
    await stripe.redirectToCheckout({ sessionId: session_id })
  }


  
  return (
    <div>
      <Head>
        <title>golden card</title>
      </Head>
      <Header />
      <div className={styles.content}>
        <main className={styles.box}>

          <h1 className={styles.title}>Checkout</h1>

          <div className={styles.checkoutStatus}>
            <span>
              {status === 'success'
                ? <BsCheck2Circle size={73} fill="#20A926" />
                : <MdErrorOutline size={73} fill="#F50707" />
              }
            </span>

            <h2>
              {status === 'success'
                ? `Thanks you for your purchase, ${name}`
                : 'Sorry, it was not possible to complete your purchase.'}
            </h2>
            <p>
              {status === 'success'
                ? 'sending one email with code please verify your email'
                : "we can't process your payment check data. try again"
              }
            </p>
            <div className={styles.buttons}>

              <button
                type='button'
                className={status === "success" ? styles.backHome : styles.warning}
                onClick={handleBack}
              >
                back home
              </button>
              {status === "canceled" && (
                <button
                  type='button'
                  className={styles.tryAgain}
                  onClick={handleRedirectCheckout}
                >
                  try again
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}


export const getServerSideProps: GetServerSideProps = async (context) => {

  var name: string = null;
  const { status } = context.query;
  const { session_id } = context.req.cookies;

  if (!session_id || !status) {
    return {
      props: {},
      redirect: {
        destination: '/',
      }
    }
  }

  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ['customer']
  });


  if (status === 'success') {
    const customer = session.customer as Stripe.Customer;
    name = customer.name
  }

  return {
    props: {
      name,
      status,
      session_id,
    }
  }
}